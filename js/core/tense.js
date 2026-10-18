// Which grammar a week teaches. A week file says  "grammar": "present-continuous";
// weeks without it are Present Simple. Views ask this module instead of importing one grammar.
import * as simpleSentence from './grammar.js';
import * as simpleMachine from './machine.js';
import * as continuous from './continuous.js';

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

export function grammarOf(week) {
  return week && week.grammar === 'present-continuous' ? CONTINUOUS : SIMPLE;
}
