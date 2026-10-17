import ClipPlayer from '../app/ClipPlayer.jsx';
import { Btn } from '../app/ui.jsx';

// A short talking-character video with its spoken words always shown as text (for children who cannot or do not want to
// use sound, and as the fallback when a video cannot be played). Nothing is asked or scored; the child starts the video.
// Content: step.clip { src, width, height }, step.speaker, step.say (exactly what the clip says), optional step.screenText
// (shown above the video), step.after (shown after it), optional step.image (a closing picture, only on the step that
// authors it) and step.nextLabel (the continue button).
export default function Clip({ api }) {
  const { step, st, patch, log, next } = api;
  return (
    <div className="stack">
      <h2 className="h2">{step.heading || step.title}</h2>
      {step.screenText ? <p className="lead">{step.screenText}</p> : null}
      <ClipPlayer
        clip={step.clip}
        label={step.videoLabel || `${step.speaker} videója`}
        onPlayed={() => {
          if (!st.played) {
            patch({ played: true });
            log('clip_played', { activity: step.id });
          }
        }}
      />
      <figure className="card stack tight clip-say" aria-label="Amit a videó mond">
        <span className="eyebrow">{step.speaker} mondja</span>
        <blockquote className="read-text">{step.say}</blockquote>
      </figure>
      {step.after ? <p className="lead">{step.after}</p> : null}
      {step.image ? (
        <img
          className="cover clip-image"
          src={step.image.src}
          srcSet={step.image.srcSet}
          sizes="(min-width: 700px) 700px, 100vw"
          width={step.image.width}
          height={step.image.height}
          alt={step.image.alt}
        />
      ) : null}
      <Btn iconAfter="arrow_forward" onClick={next}>
        {step.nextLabel || 'Tovább'}
      </Btn>
    </div>
  );
}
