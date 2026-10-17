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
import FillBlank from './FillBlank.jsx';
import Route from './Route.jsx';
import Outcome from './Outcome.jsx';
import StoryChoice from './StoryChoice.jsx';
import Clip from './Clip.jsx';
import TalkChoice from './TalkChoice.jsx';
import SayIt from './SayIt.jsx';
import Constellation from './Constellation.jsx';
import MatchPairs from './MatchPairs.jsx';
import StepTogether from './StepTogether.jsx';

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
  informationCheck: InformationCheck,
  fillBlank: FillBlank,
  route: Route,
  outcome: Outcome,
  storyChoice: StoryChoice, // unscored: the child advises the character, each option has its own consequence
  clip: Clip, // a talking-character video with its words shown as text
  talkChoice: TalkChoice, // unscored decision with authored responses and retry
  sayIt: SayIt, // say your own sentence aloud (nothing typed or recorded)
  constellation: Constellation, // unscored: light the stars of the bridge in story order
  matchPairs: MatchPairs, // unscored: join what one character says with the other's answer
  stepTogether: StepTogether // unscored: the bridge lights only when both characters stepped
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
  'informationCheck',
  'fillBlank',
  'route'
]);
