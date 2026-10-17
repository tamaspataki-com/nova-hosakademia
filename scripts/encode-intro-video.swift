// Prepares an optional introduction video for the app (macOS, no ffmpeg needed).
//   swiftc -O scripts/encode-intro-video.swift -o /tmp/encode-intro-video
//   /tmp/encode-intro-video <input.mp4> <output.mp4> [maxSeconds=15] [maxLongSide=960] [maxBytes=3000000]
// Result: the original's proportions (even width/height, scaled down only), trimmed to at most maxSeconds, NO audio track,
// H.264 Main profile, yuv420p, moov atom at the front (fast start). The bitrate is chosen so the file stays under maxBytes.
// The original is never modified. Prints the final width, height, duration, frame rate and size.
import AVFoundation
import Foundation

let args = CommandLine.arguments
guard args.count >= 3 else { print("usage: encode-intro-video input output [maxSeconds] [maxLongSide] [maxBytes]"); exit(2) }
let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])
let maxSeconds = args.count > 3 ? Double(args[3])! : 15
let maxLong = args.count > 4 ? Double(args[4])! : 960
let maxBytes = args.count > 5 ? Double(args[5])! : 3_000_000

let asset = AVURLAsset(url: input)
guard let track = asset.tracks(withMediaType: .video).first else { print("no video track"); exit(1) }
let natural = track.naturalSize.applying(track.preferredTransform)
let srcW = abs(natural.width), srcH = abs(natural.height)
let scale = min(1.0, maxLong / max(srcW, srcH))
let evenW = Int((srcW * scale / 2).rounded()) * 2
let evenH = Int((srcH * scale / 2).rounded()) * 2
let duration = min(asset.duration.seconds, maxSeconds)
let fps = track.nominalFrameRate > 0 ? Double(track.nominalFrameRate) : 24
// 5 % headroom for container overhead; never above 6 Mbps.
let bitrate = min(6_000_000.0, (maxBytes * 0.93 * 8) / duration)

try? FileManager.default.removeItem(at: output)
let reader = try AVAssetReader(asset: asset)
reader.timeRange = CMTimeRange(start: .zero, duration: CMTime(seconds: duration, preferredTimescale: 600))
let comp = AVMutableVideoComposition(propertiesOf: asset)
comp.renderSize = CGSize(width: evenW, height: evenH)
comp.frameDuration = CMTime(value: 1, timescale: CMTimeScale(fps.rounded()))
let instr = AVMutableVideoCompositionInstruction()
instr.timeRange = CMTimeRange(start: .zero, duration: asset.duration)
let layer = AVMutableVideoCompositionLayerInstruction(assetTrack: track)
layer.setTransform(track.preferredTransform.concatenating(CGAffineTransform(scaleX: CGFloat(evenW) / srcW, y: CGFloat(evenH) / srcH)), at: .zero)
instr.layerInstructions = [layer]
comp.instructions = [instr]
let out = AVAssetReaderVideoCompositionOutput(videoTracks: [track], videoSettings: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange
])
out.videoComposition = comp
reader.add(out)

let writer = try AVAssetWriter(outputURL: output, fileType: .mp4)
writer.shouldOptimizeForNetworkUse = true // moov before mdat: fast start
let input0 = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264,
  AVVideoWidthKey: evenW,
  AVVideoHeightKey: evenH,
  AVVideoCompressionPropertiesKey: [
    AVVideoProfileLevelKey: AVVideoProfileLevelH264MainAutoLevel,
    AVVideoAverageBitRateKey: Int(bitrate),
    AVVideoMaxKeyFrameIntervalKey: Int(fps.rounded()) * 2,
    AVVideoAllowFrameReorderingKey: false,
  ],
])
input0.expectsMediaDataInRealTime = false
writer.add(input0) // no audio input is added: the file has no audio track
guard reader.startReading(), writer.startWriting() else { print("start failed", reader.error ?? "", writer.error ?? ""); exit(1) }
writer.startSession(atSourceTime: .zero)
let q = DispatchQueue(label: "enc")
let done = DispatchSemaphore(value: 0)
input0.requestMediaDataWhenReady(on: q) {
  while input0.isReadyForMoreMediaData {
    if let buf = out.copyNextSampleBuffer() { if !input0.append(buf) { break } }
    else { input0.markAsFinished(); writer.finishWriting { done.signal() }; return }
  }
}
done.wait()
if writer.status != .completed { print("failed", writer.error ?? ""); exit(1) }
let size = (try FileManager.default.attributesOfItem(atPath: output.path)[.size] as! NSNumber).intValue
let o = AVURLAsset(url: output)
let t = o.tracks(withMediaType: .video).first!
print("OK \(Int(t.naturalSize.width))x\(Int(t.naturalSize.height)) \(String(format: "%.2f", o.duration.seconds)) s \(String(format: "%.1f", t.nominalFrameRate)) fps audio tracks: \(o.tracks(withMediaType: .audio).count) \(size) bytes (source \(Int(srcW))x\(Int(srcH)))")
