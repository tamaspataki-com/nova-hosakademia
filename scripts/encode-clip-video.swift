// Prepares a talking-character clip for the app (macOS, no ffmpeg needed). Like encode-intro-video.swift, but KEEPS the sound.
//   swiftc -O scripts/encode-clip-video.swift -o /tmp/encode-clip-video
//   /tmp/encode-clip-video <input.mp4> <output.mp4> [maxLongSide=960] [videoKbps=900] [audioKbps=96]
// Result: the original's proportions (even width/height, scaled down only), H.264 Main + AAC (stereo kept), moov atom at the
// front (fast start). The whole clip is kept (no trimming). The original is never modified.
import AVFoundation
import Foundation

let args = CommandLine.arguments
guard args.count >= 3 else { print("usage: encode-clip-video input output [maxLongSide] [videoKbps] [audioKbps]"); exit(2) }
let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])
let maxLong = args.count > 3 ? Double(args[3])! : 960
let vKbps = args.count > 4 ? Double(args[4])! : 900
let aKbps = args.count > 5 ? Double(args[5])! : 96

let asset = AVURLAsset(url: input)
guard let track = asset.tracks(withMediaType: .video).first else { print("no video track"); exit(1) }
let aTrack = asset.tracks(withMediaType: .audio).first
let natural = track.naturalSize.applying(track.preferredTransform)
let srcW = abs(natural.width), srcH = abs(natural.height)
let scale = min(1.0, maxLong / max(srcW, srcH))
let evenW = Int((srcW * scale / 2).rounded()) * 2
let evenH = Int((srcH * scale / 2).rounded()) * 2
let fps = track.nominalFrameRate > 0 ? Double(track.nominalFrameRate) : 24

try? FileManager.default.removeItem(at: output)
let reader = try AVAssetReader(asset: asset)
let comp = AVMutableVideoComposition(propertiesOf: asset)
comp.renderSize = CGSize(width: evenW, height: evenH)
comp.frameDuration = CMTime(value: 1, timescale: CMTimeScale(fps.rounded()))
let instr = AVMutableVideoCompositionInstruction()
instr.timeRange = CMTimeRange(start: .zero, duration: asset.duration)
let layer = AVMutableVideoCompositionLayerInstruction(assetTrack: track)
layer.setTransform(track.preferredTransform.concatenating(CGAffineTransform(scaleX: CGFloat(evenW) / srcW, y: CGFloat(evenH) / srcH)), at: .zero)
instr.layerInstructions = [layer]
comp.instructions = [instr]
let vOut = AVAssetReaderVideoCompositionOutput(videoTracks: [track], videoSettings: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange
])
vOut.videoComposition = comp
reader.add(vOut)
var aOut: AVAssetReaderTrackOutput? = nil
if let a = aTrack {
  aOut = AVAssetReaderTrackOutput(track: a, outputSettings: [AVFormatIDKey: kAudioFormatLinearPCM, AVLinearPCMBitDepthKey: 16, AVLinearPCMIsFloatKey: false, AVLinearPCMIsBigEndianKey: false, AVLinearPCMIsNonInterleaved: false])
  reader.add(aOut!)
}

let writer = try AVAssetWriter(outputURL: output, fileType: .mp4)
writer.shouldOptimizeForNetworkUse = true
let vIn = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264,
  AVVideoWidthKey: evenW,
  AVVideoHeightKey: evenH,
  AVVideoCompressionPropertiesKey: [
    AVVideoProfileLevelKey: AVVideoProfileLevelH264MainAutoLevel,
    AVVideoAverageBitRateKey: Int(vKbps * 1000),
    AVVideoMaxKeyFrameIntervalKey: Int(fps.rounded()) * 2,
    AVVideoAllowFrameReorderingKey: false,
  ],
])
vIn.expectsMediaDataInRealTime = false
writer.add(vIn)
var aIn: AVAssetWriterInput? = nil
if aTrack != nil {
  let ch = 2
  aIn = AVAssetWriterInput(mediaType: .audio, outputSettings: [
    AVFormatIDKey: kAudioFormatMPEG4AAC, AVNumberOfChannelsKey: ch, AVSampleRateKey: 44100, AVEncoderBitRateKey: Int(aKbps * 1000),
  ])
  aIn!.expectsMediaDataInRealTime = false
  writer.add(aIn!)
}
guard reader.startReading(), writer.startWriting() else { print("start failed", reader.error ?? "", writer.error ?? ""); exit(1) }
writer.startSession(atSourceTime: .zero)
let group = DispatchGroup()
func pump(_ inp: AVAssetWriterInput, _ out: AVAssetReaderOutput, _ label: String) {
  group.enter()
  let q = DispatchQueue(label: label)
  inp.requestMediaDataWhenReady(on: q) {
    while inp.isReadyForMoreMediaData {
      if let buf = out.copyNextSampleBuffer() { if !inp.append(buf) { inp.markAsFinished(); group.leave(); return } }
      else { inp.markAsFinished(); group.leave(); return }
    }
  }
}
pump(vIn, vOut, "v")
if let ai = aIn, let ao = aOut { pump(ai, ao, "a") }
group.wait()
let fin = DispatchSemaphore(value: 0)
writer.finishWriting { fin.signal() }
fin.wait()
if writer.status != .completed { print("failed", writer.error ?? ""); exit(1) }
let size = (try FileManager.default.attributesOfItem(atPath: output.path)[.size] as! NSNumber).intValue
let o = AVURLAsset(url: output)
let t = o.tracks(withMediaType: .video).first!
print("OK \(Int(t.naturalSize.width))x\(Int(t.naturalSize.height)) \(String(format: "%.2f", o.duration.seconds)) s \(String(format: "%.1f", t.nominalFrameRate)) fps audio tracks: \(o.tracks(withMediaType: .audio).count) \(size) bytes (source \(Int(srcW))x\(Int(srcH)), \(String(format: "%.2f", asset.duration.seconds)) s)")
