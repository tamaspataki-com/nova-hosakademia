import Choice from './Choice.jsx';

// Explore a word, then answer an authored question about it. The words come from the step (or the adventure's
// glossary); the question is a normal choice.
export default function Vocabulary({ api }) {
  const { adv, step } = api;
  const words = step.words || (adv.glossary || []).filter((g) => !step.wordKeys || step.wordKeys.includes(g.key));
  return (
    <div className="stack">
      <div className="stack tight">
        {words.map((w) => (
          <div key={w.key} className="card stack tight">
            <strong className="h3">{w.word}</strong>
            <span>{w.def}</span>
          </div>
        ))}
      </div>
      <Choice api={api} variant="vocabulary" />
    </div>
  );
}
