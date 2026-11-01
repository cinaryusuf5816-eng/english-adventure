// Which grammar a week teaches. A week file says  "grammar": "present-continuous";
// weeks without it are Present Simple. Views ask this module instead of importing one grammar.
import * as simpleSentence from './grammar.js';
import * as simpleMachine from './machine.js';
import * as continuous from './continuous.js';
import * as wh from './wh.js';

const SIMPLE = {
  id: 'present-simple',
  buildSentence: simpleSentence.buildSentence,
  machineSteps: simpleMachine.machineSteps,
  stepText: simpleMachine.stepText,
  formula: simpleMachine.formula,
  legend: [['subject', 'who'], ['helper', 'do / does / don’t / doesn’t'], ['verb', 'verb'], ['end', '-s / -es']],
  switchLegend: [['part-helper', "helper: do / does / don't / doesn't"], ['part-verb', 'verb (base): play'], ['part-verb-s', 'verb + s: plays']],
  modes: [
    { id: 'negative', label: '+ → −', name: 'Make it negative' },
    { id: 'question', label: '+ → ?', name: 'Make a question' },
    { id: 'positive-s', label: 'I → he', name: 'I play → He plays', singleOnly: true },
    { id: 'all', label: '+ − ?', name: 'All three' }
  ],
  verbLabel: (v) => `${v.base} ${v.rest.replace('{poss}', '…')}`
};

const CONTINUOUS = {
  id: 'present-continuous',
  buildSentence: continuous.buildSentence,
  machineSteps: continuous.machineSteps,
  stepText: continuous.stepText,
  formula: continuous.formula,
  legend: [['subject', 'who'], ['helper', 'am / is / are / not'], ['verb', 'verb'], ['end', '-ing']],
  switchLegend: [['part-helper', "helper: am / is / are · isn't / aren't"], ['part-verb-s', 'verb + ing: playing']],
  modes: [
    { id: 'positive-ing', label: 'play → playing', name: 'It is happening now' },
    { id: 'negative', label: '+ → −', name: 'Make it negative' },
    { id: 'question', label: '+ → ?', name: 'Make a question' },
    { id: 'all', label: '+ − ?', name: 'All three' }
  ],
  verbLabel: (v) => `${v.base} ${v.rest.replace('{poss}', '…')}`
};

const WH = {
  id: 'wh-questions',
  buildSentence: wh.buildSentence,
  machineSteps: wh.machineSteps,
  stepText: wh.stepText,
  formula: wh.formula,
  legend: [['wh', 'question word'], ['helper', 'am / is / are'], ['subject', 'who'], ['verb', 'verb'], ['end', '-ing']],
  switchLegend: [['part-wh', 'question word: Who, What, Where …'], ['part-helper', 'helper: am / is / are'], ['part-verb-s', 'verb + ing: running']],
  examplesLead: 'Choose a picture. Watch the sentence turn into a question: Who? What? Where?',
  forms: [
    { id: 'positive', label: '+ Sentence', name: 'sentence' },
    { id: 'who', label: 'Who?', name: 'Who question' },
    { id: 'what', label: 'What?', name: 'What question' },
    { id: 'where', label: 'Where?', name: 'Where question' }
  ],
  modes: [
    { id: 'who', label: 'Who?', name: 'A person' },
    { id: 'what', label: 'What?', name: 'A thing or action' },
    { id: 'where', label: 'Where?', name: 'A place', needs: 'where' },
    { id: 'why', label: 'Why?', name: 'A reason', needs: 'why' },
    { id: 'how', label: 'How?', name: 'A way', needs: 'how' }
  ],
  verbLabel: (v) => `${v.base} ${v.rest.replace('{poss}', '…')}`
};

const GRAMMARS = { 'present-continuous': CONTINUOUS, 'wh-questions': WH };

export function grammarOf(week) {
  return (week && GRAMMARS[week.grammar]) || SIMPLE;
}
