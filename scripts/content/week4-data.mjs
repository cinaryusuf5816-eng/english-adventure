// Week 4 data tables: people, verbs (good or bad idea, How often …?), pictures.
// Compass Unit 3, pages 44–61: Why do we get sick? Health problems · should / shouldn't · hygiene habits ·
// adverbs of frequency · clean water · germs · talking to a doctor · values.
import { IMAGES as W2 } from './week2-data.mjs';
import { IMAGES as W3 } from './week3-data.mjs';
import { SUBJECTS } from './week3-data.mjs';

export { SUBJECTS };

// good = a good idea (should) · bad = a bad idea (shouldn't) · often = the answer to How often …?
export const VERBS = [
  { id: 'rest', base: 'rest', s: 'rests', rest: 'in bed', good: true },
  { id: 'drink-water', base: 'drink', s: 'drinks', rest: 'lots of water', good: true },
  { id: 'see-doctor', base: 'go', s: 'goes', rest: 'to the doctor', good: true },
  { id: 'see-dentist', base: 'go', s: 'goes', rest: 'to the dentist', good: true },
  { id: 'see-nurse', base: 'go', s: 'goes', rest: 'to the school nurse', good: true },
  { id: 'take-medicine', base: 'take', s: 'takes', rest: 'some medicine', good: true },
  { id: 'use-tissue', base: 'use', s: 'uses', rest: 'a tissue', good: true },
  { id: 'cover-mouth', base: 'cover', s: 'covers', rest: '{poss} mouth', good: true },
  { id: 'temperature', base: 'take', s: 'takes', rest: '{poss} temperature', good: true },
  { id: 'bandage', base: 'put', s: 'puts', rest: 'on a bandage', good: true },
  { id: 'stay-home', base: 'stay', s: 'stays', rest: 'at home', good: true },
  { id: 'wash-hands', base: 'wash', s: 'washes', rest: '{poss} hands', good: true, often: 'always' },
  { id: 'brush-teeth', base: 'brush', s: 'brushes', rest: '{poss} teeth', good: true, often: 'always' },
  { id: 'comb-hair', base: 'comb', s: 'combs', rest: '{poss} hair', good: true, often: 'usually' },
  { id: 'wash-face', base: 'wash', s: 'washes', rest: '{poss} face', good: true, often: 'usually' },
  { id: 'hand-gel', base: 'use', s: 'uses', rest: 'hand gel', good: true, often: 'sometimes' },
  { id: 'cut-nails', base: 'cut', s: 'cuts', rest: '{poss} nails', good: true, often: 'sometimes' },
  { id: 'shower', base: 'take', s: 'takes', rest: 'a shower', good: true, often: 'usually' },
  { id: 'wipe-mouth', base: 'wipe', s: 'wipes', rest: '{poss} mouth', good: true, often: 'always' },
  { id: 'throw-tissues', base: 'throw', s: 'throws', rest: 'used tissues away', good: true, often: 'always' },
  { id: 'share-drink', base: 'share', s: 'shares', rest: 'a drink', bad: true },
  { id: 'school-fever', base: 'go', s: 'goes', rest: 'to school with a fever', bad: true },
  { id: 'play-football', base: 'play', s: 'plays', rest: 'football today', bad: true },
  { id: 'eat-candy', base: 'eat', s: 'eats', rest: 'lots of candy', bad: true },
  { id: 'sneeze-on', base: 'sneeze', s: 'sneezes', rest: 'on people', bad: true },
  { id: 'dirty-hands', base: 'eat', s: 'eats', rest: 'with dirty hands', bad: true, often: 'never' },
  { id: 'touch-tissues', base: 'touch', s: 'touches', rest: 'used tissues', bad: true, often: 'never' },
  { id: 'bite-nails', base: 'bite', s: 'bites', rest: '{poss} nails', bad: true, often: 'never' }
];

const P = (name, alt, w = 1400, h = 1050) => ({ src: `assets/images/week-04/${name}`, w, h, alt });
export const IMAGES = {
  cover: P('week-04-cover', 'A school nurse\'s room: Ana is sneezing, Sam is washing his hands, Leo has a thermometer and Mia has a get-well card.', 1400, 788),
  'h-sore-throat': P('h-sore-throat', 'Mia is holding her throat. She has a sore throat.'),
  'h-cough': P('h-cough', 'Sam is coughing into his elbow.'),
  'h-stomachache': P('h-stomachache', 'Leo is holding his tummy. He has a stomachache.'),
  'h-fever': P('h-fever', 'Ana is in bed with a thermometer in her mouth. She has a fever.'),
  'h-leg': P('h-leg', 'Sam is sitting on the path and holding his leg. His leg hurts.'),
  'h-sneeze': P('h-sneeze', 'Ana is sneezing into a tissue.'),
  'h-toothache': P('h-toothache', 'Leo is holding his cheek. He has a toothache.'),
  'h-earache': P('h-earache', 'Mia is holding her ear. She has an earache.'),
  'h-headache': P('h-headache', 'Sam is holding his head at his desk. He has a headache.'),
  'h-cold': P('h-cold', 'Mia is on the sofa with a blanket and tissues. She has a cold.'),
  'a-doctor': P('a-doctor', 'A doctor is listening to Leo\'s chest.'),
  'a-tissue': P('a-tissue', 'Mia is using a tissue.'),
  'a-medicine': P('a-medicine', 'Ana is taking a spoon of medicine.'),
  'a-temperature': P('a-temperature', 'Sam\'s dad is taking Sam\'s temperature.'),
  'a-bandage': P('a-bandage', 'The school nurse is putting a bandage on Leo\'s knee.'),
  'a-cover': P('a-cover', 'Ana is covering her mouth with her elbow.'),
  'a-water': P('a-water', 'Sam is drinking a big glass of water.'),
  'a-dentist': P('a-dentist', 'Leo is at the dentist. He is opening his mouth.'),
  'a-nurse': P('a-nurse', 'Mia is talking to the school nurse.'),
  'a-rest': P('a-rest', 'Ana is resting in bed with a teddy bear and a book.'),
  'y-teeth': P('y-teeth', 'Mia is brushing her teeth.'),
  'y-hair': P('y-hair', 'Sam is combing his hair.'),
  'y-face': P('y-face', 'Leo is washing his face.'),
  'y-gel': P('y-gel', 'Ana is using hand gel.'),
  'y-nails': P('y-nails', 'Leo is cutting his nails.'),
  'y-shower': P('y-shower', 'Sam is taking a shower.'),
  'y-wipe': P('y-wipe', 'Mia is wiping her mouth with a napkin.'),
  'y-hands': P('y-hands', 'Ana is washing her hands with soap.'),
  's-hug': P('s-hug', 'Mia\'s grandma is giving Mia a big hug.'),
  's-remote': P('s-remote', 'Sam is on the sofa with the TV remote.'),
  's-share': P('s-share', 'Leo is sharing his crayons with Ana.'),
  's-card': P('s-card', 'Leo and Ana are making a get-well card with a big heart.'),
  's-better': P('s-better', 'Mia is jumping out of bed. She feels better.'),
  'c-well': P('c-well', 'An old well with a bucket in a sunny village.'),
  'c-village': P('c-village', 'A small village with round houses and trees.'),
  'c-carry': P('c-carry', 'A girl is carrying a big, heavy bottle of water.'),
  'c-river': P('c-river', 'Two children are filling bottles at the river.'),
  'c-tap': P('c-tap', 'Two children are washing their hands at a new tap. There is a water tank and a solar panel.'),
  'g-germs': P('g-germs', 'A magnifying glass shows tiny germs on a hand.'),
  'g-dirty': P('g-dirty', 'Sam is looking at his very dirty hands.'),
  'g-bin': P('g-bin', 'Ana is throwing a tissue into the bin.'),
  'g-everywhere': P('g-everywhere', 'Tiny germs on a door handle, a desk and a pencil.'),
  'd-talk': P('d-talk', 'Mia is telling the doctor how she feels.'),
  'd-sorry': P('d-sorry', 'Leo is sad. Ana is sitting with him and being kind.'),
  'v-honest': P('v-honest', 'Sam is telling his mom that he feels sick.'),
  'v-grateful': P('v-grateful', 'Mia is helping Leo up after he falls off his bike.'),
  'v-responsible': P('v-responsible', 'Ana is washing the dishes after lunch.'),
  'v-kind': P('v-kind', 'Mia is giving Sam a get-well card.')
};
// Pictures from earlier weeks (built by the same site).
for (const k of ['v-sleep']) IMAGES[k] = W2[k] || W3[k];

// Who is doing what in which picture.
export const SCENES = [
  ['ana', 'rest', 'a-rest'], ['sam', 'drink-water', 'a-water'], ['leo', 'see-doctor', 'a-doctor'], ['leo', 'see-dentist', 'a-dentist'],
  ['mia', 'see-nurse', 'a-nurse'], ['ana', 'take-medicine', 'a-medicine'], ['mia', 'use-tissue', 'a-tissue'], ['ana', 'cover-mouth', 'a-cover'],
  ['sam', 'temperature', 'a-temperature'], ['leo', 'bandage', 'a-bandage'], ['mia', 'stay-home', 'h-cold'],
  ['ana', 'wash-hands', 'y-hands'], ['mia', 'brush-teeth', 'y-teeth'], ['sam', 'comb-hair', 'y-hair'], ['leo', 'wash-face', 'y-face'],
  ['ana', 'hand-gel', 'y-gel'], ['leo', 'cut-nails', 'y-nails'], ['sam', 'shower', 'y-shower'], ['mia', 'wipe-mouth', 'y-wipe'],
  ['ana', 'throw-tissues', 'g-bin'], ['leo', 'share-drink', 's-share'], ['ana', 'school-fever', 'h-fever'], ['sam', 'play-football', 'h-leg'],
  ['leo', 'eat-candy', 'h-toothache'], ['ana', 'sneeze-on', 'h-sneeze'], ['sam', 'dirty-hands', 'g-dirty'], ['ana', 'touch-tissues', 'g-everywhere'],
  ['leo', 'bite-nails', 'y-nails']
].map(([who, verb, image]) => ({ who, verb, image }));
