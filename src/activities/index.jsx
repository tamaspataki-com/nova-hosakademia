import Passage from './Passage.jsx';
import Choice from './Choice.jsx';
import Sequence from './Sequence.jsx';
import Evidence from './Evidence.jsx';
import Vocabulary from './Vocabulary.jsx';
import Retell from './Retell.jsx';
import Reflection from './Reflection.jsx';
import Sort from './Sort.jsx';
import Instruction from './Instruction.jsx';
import CorrectPlacement from './CorrectPlacement.jsx';
import SelectClues from './SelectClues.jsx';
import Prediction from './Prediction.jsx';
import InformationCheck from './InformationCheck.jsx';

// One component per activity type. Content decides which steps an adventure has; nothing in these components
// knows about any particular story.
export const ACTIVITIES = {
  passage: Passage,
  choice: Choice,
  sequence: Sequence,
  evidence: Evidence,
  vocabulary: Vocabulary,
  retell: Retell,
  delayedRecall: (props) => <Choice {...props} variant="delayedRecall" />,
  reflection: Reflection,
  sort: Sort,
  instruction: Instruction,
  correctPlacement: CorrectPlacement,
  selectClues: SelectClues,
  prediction: Prediction,
  informationCheck: InformationCheck
};

// Which step types score answers (and therefore take hints, guided help and a solution reveal).
export const SCORED = new Set([
  'choice',
  'sequence',
  'evidence',
  'vocabulary',
  'delayedRecall',
  'sort',
  'instruction',
  'correctPlacement',
  'selectClues',
  'informationCheck'
]);
