// Which grammar a week teaches. A week file says  "grammar": "present-continuous";
// weeks without it are Present Simple. Views ask this module instead of importing one grammar.
import * as simpleSentence from './grammar.js';
import * as simpleMachine from './machine.js';
import * as continuous from './continuous.js';
import * as wh from './wh.js';
import * as should from './should.js';
import * as school from './school.js';

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

const SHOULD = {
  id: 'should-advice',
  buildSentence: should.buildSentence,
  machineSteps: should.machineSteps,
  stepText: should.stepText,
  formula: should.formula,
  legend: [['subject', 'who'], ['helper', "should / shouldn't"], ['verb', 'verb (no -s)'], ['end', '-s goes'], ['often', 'always … never']],
  switchLegend: [['part-helper', "helper: should / shouldn't"], ['part-verb', 'verb (no -s): rest']],
  examplesLead: 'Choose a picture. Is it a good idea or a bad idea? Watch: should, shouldn’t, Should …?, How often …?',
  modes: [
    { id: 'should', label: '+ should', name: 'A good idea', needs: 'good' },
    { id: 'shouldnt', label: "− shouldn't", name: 'A bad idea', needs: 'bad' },
    { id: 'question', label: '? Should …?', name: 'Ask for advice' },
    { id: 'often', label: 'How often?', name: 'always … never', needs: 'often' }
  ],
  verbLabel: (v) => `${v.base} ${v.rest.replace('{poss}', '…')}${v.bad ? ' ✗' : ''}`
};

const SCHOOL = {
  id: 'school-modals',
  buildSentence: school.buildSentence,
  machineSteps: school.machineSteps,
  stepText: school.stepText,
  formula: school.formula,
  legend: [['subject', 'who'], ['helper', 'can / can’t / have to / has to'], ['verb', 'base verb']],
  switchLegend: [['part-helper', 'can / can’t · have to / has to'], ['part-verb', 'base verb: wear']],
  switchLead: 'Choose who and what. Use can for ability or permission, and have to for a rule.',
  examplesLead: 'Choose a picture. Watch how can and have to change in statements and questions.',
  forms: [
    { id: 'positive', label: '+ can', name: 'can statement' },
    { id: 'negative', label: '− can’t', name: 'can’t statement' },
    { id: 'question', label: '? Can …?', name: 'can question' },
    { id: 'have-positive', label: '+ have to', name: 'rule' },
    { id: 'have-negative', label: '− don’t have to', name: 'optional' },
    { id: 'have-question', label: '? Do … have to?', name: 'rule question' }
  ],
  modes: [
    { id: 'negative', label: 'can → can’t', name: 'Unable or not allowed' },
    { id: 'question', label: 'Can …?', name: 'Ask with can' },
    { id: 'have-positive', label: 'have to / has to', name: 'Say what is required' },
    { id: 'have-negative', label: 'don’t have to', name: 'Say what is optional' },
    { id: 'have-question', label: 'Do / Does …?', name: 'Ask about a rule' }
  ],
  verbLabel: SIMPLE.verbLabel
};

const GRAMMARS = { 'present-continuous': CONTINUOUS, 'wh-questions': WH, 'should-advice': SHOULD, 'school-modals': SCHOOL };

export function grammarOf(week) {
  return (week && GRAMMARS[week.grammar]) || SIMPLE;
}
