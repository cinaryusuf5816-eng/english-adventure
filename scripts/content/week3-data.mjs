// Week 3 data tables: people, verbs (with the part each question word asks about), pictures.
// Compass Unit 2, pages 36–43: Sports and Activities · Wh- Questions · body reading · prepositions of movement · bouncing back.
import { IMAGES as W2 } from './week2-data.mjs';

export const SUBJECTS = [
  { id: 'I', text: 'I', person: 'plural', poss: 'my', short: 'I' },
  { id: 'you', text: 'You', person: 'plural', poss: 'your', short: 'you' },
  { id: 'we', text: 'We', person: 'plural', poss: 'our', short: 'we' },
  { id: 'they', text: 'They', person: 'plural', poss: 'their', short: 'they' },
  { id: 'he', text: 'He', person: 'single', poss: 'his', short: 'he' },
  { id: 'she', text: 'She', person: 'single', poss: 'her', short: 'she' },
  { id: 'sam', text: 'Sam', person: 'single', poss: 'his', short: 'he' },
  { id: 'mia', text: 'Mia', person: 'single', poss: 'her', short: 'she' },
  { id: 'leo', text: 'Leo', person: 'single', poss: 'his', short: 'he' },
  { id: 'ana', text: 'Ana', person: 'single', poss: 'her', short: 'she' }
];

// where / thing = the part of "rest" the question asks about. why / how = a ready answer.
export const VERBS = [
  { id: 'run-around', base: 'run', ing: 'running', rest: 'around the cone', where: 'around the cone', how: 'Fast!' },
  { id: 'climb-through', base: 'climb', ing: 'climbing', rest: 'through the hoop', where: 'through the hoop', how: 'Carefully.' },
  { id: 'jump-over', base: 'jump', ing: 'jumping', rest: 'over the hurdles', where: 'over the hurdles', how: 'High!' },
  { id: 'climb-up', base: 'climb', ing: 'climbing', rest: 'up the ladder', where: 'up the ladder', how: 'Slowly.' },
  { id: 'slide-down', base: 'slide', ing: 'sliding', rest: 'down the slide', where: 'down the slide', how: 'Fast!' },
  { id: 'walk-across', base: 'walk', ing: 'walking', rest: 'across the bridge', where: 'across the bridge', how: 'Slowly.' },
  { id: 'crawl-under', base: 'crawl', ing: 'crawling', rest: 'under the bench', where: 'under the bench', how: 'On hands and knees.' },
  { id: 'jump-into', base: 'jump', ing: 'jumping', rest: 'into the sandbox', where: 'into the sandbox' },
  { id: 'step-out', base: 'step', ing: 'stepping', rest: 'out of the sandbox', where: 'out of the sandbox' },
  { id: 'run-past', base: 'run', ing: 'running', rest: 'past the goal', where: 'past the goal', how: 'Fast!' },
  { id: 'run-between', base: 'run', ing: 'running', rest: 'between the trees', where: 'between the trees', how: 'Fast!' },
  { id: 'three-legged', base: 'run', ing: 'running', rest: 'a three-legged race on the grass', thing: 'a three-legged race', where: 'on the grass', how: 'Together!', why: 'Because it is fun.' },
  { id: 'pass-baton', base: 'pass', ing: 'passing', rest: 'the baton on the track', thing: 'the baton', where: 'on the track', why: 'Because the next runner is waiting.' },
  { id: 'run-track', base: 'run', ing: 'running', rest: 'on the track', where: 'on the track', how: 'Fast!' },
  { id: 'swim-race', base: 'swim', ing: 'swimming', rest: 'in the pool', where: 'in the pool', how: 'Fast!', why: 'Because it is a race.' },
  { id: 'tie-legs', base: 'tie', ing: 'tying', rest: '{poss} legs together', how: 'With a scarf.', why: 'Because it is a three-legged race.' },
  { id: 'cheer', base: 'cheer', ing: 'cheering', rest: 'for the team', why: 'Because the game is exciting.' },
  { id: 'do-gymnastics', base: 'do', ing: 'doing', rest: 'gymnastics in the gym', thing: 'gymnastics', where: 'in the gym' },
  { id: 'play-baseball', base: 'play', ing: 'playing', rest: 'baseball on the field', thing: 'baseball', where: 'on the field' },
  { id: 'bounce-ball', base: 'bounce', ing: 'bouncing', rest: 'a ball in the playground', thing: 'a ball', where: 'in the playground' },
  { id: 'do-karate', base: 'do', ing: 'doing', rest: 'karate in the hall', thing: 'karate', where: 'in the hall' },
  { id: 'jump-rope', base: 'jump', ing: 'jumping', rest: 'rope in the park', where: 'in the park' },
  { id: 'go-skating', base: 'go', ing: 'going', rest: 'skating in the park', where: 'in the park', how: 'Carefully.' },
  { id: 'ride-bike', base: 'ride', ing: 'riding', rest: 'a bike in the park', thing: 'a bike', where: 'in the park' },
  { id: 'play-tag', base: 'play', ing: 'playing', rest: 'tag in the playground', thing: 'tag', where: 'in the playground', why: 'Because it is fun.' },
  { id: 'go-bowling', base: 'go', ing: 'going', rest: 'bowling with friends', how: 'With friends.' },
  { id: 'do-yoga', base: 'do', ing: 'doing', rest: 'yoga in the garden', thing: 'yoga', where: 'in the garden', how: 'Slowly.', why: 'Because it is relaxing.' },
  { id: 'play-tennis', base: 'play', ing: 'playing', rest: 'tennis on the court', thing: 'tennis', where: 'on the court' },
  { id: 'stretch', base: 'stretch', ing: 'stretching', rest: '{poss} muscles on the field', where: 'on the field', why: 'Because it is good for the body.' },
  { id: 'breathe', base: 'breathe', ing: 'breathing', rest: 'hard in the park', where: 'in the park', why: 'Because running is hard work.' },
  { id: 'push-ball', base: 'push', ing: 'pushing', rest: 'a big ball across the playground', thing: 'a big ball', where: 'across the playground' },
  { id: 'pull-wagon', base: 'pull', ing: 'pulling', rest: 'a wagon in the park', thing: 'a wagon', where: 'in the park', how: 'With a rope.' },
  { id: 'write-plan', base: 'write', ing: 'writing', rest: 'an exercise plan on the calendar', thing: 'an exercise plan', where: 'on the calendar', why: 'Because a plan helps.' },
  { id: 'short-break', base: 'have', ing: 'having', rest: 'a short break under a tree', thing: 'a short break', where: 'under a tree', why: 'Because everyone is tired.' },
  { id: 'take-stairs', base: 'take', ing: 'taking', rest: 'the stairs at school', where: 'at school', why: 'Because it is good exercise.' },
  { id: 'follow-video', base: 'follow', ing: 'following', rest: 'an exercise video at home', thing: 'an exercise video', where: 'at home' },
  { id: 'video-games', base: 'play', ing: 'playing', rest: 'video games on the sofa', thing: 'video games', where: 'on the sofa' },
  { id: 'walk-school', base: 'walk', ing: 'walking', rest: 'to school', where: 'to school', why: 'Because it is good exercise.' },
  { id: 'try-again', base: 'try', ing: 'trying', rest: 'again in the park', where: 'in the park', why: 'Because skating is difficult.' },
  { id: 'help-friend', base: 'help', ing: 'helping', rest: 'a friend on the court', where: 'on the court', why: 'Because friends are kind.' },
  { id: 'ask-coach', base: 'ask', ing: 'asking', rest: 'the coach for help', why: 'Because the game is difficult.' }
];

const P = (name, alt, w = 1400, h = 1050) => ({ src: `assets/images/week-03/${name}`, w, h, alt });
export const IMAGES = {
  cover: P('week-03-cover', 'A big obstacle course: Sam, Mia, Leo and Ana are moving along the path.', 1400, 788),
  'prep-around': P('around', 'Sam is running around an orange cone.'),
  'prep-through': P('through', 'Mia is climbing through a big colourful hoop.'),
  'prep-over': P('over', 'Leo is jumping over the hurdles.'),
  'prep-up': P('up', 'Ana is climbing up a wooden ladder.'),
  'prep-down': P('down', 'Sam is sliding down a red slide.'),
  'prep-across': P('across', 'Mia is walking across a small bridge.'),
  'prep-under': P('under', 'Leo is crawling under a wooden bench.'),
  'prep-into': P('into', 'Ana is jumping into the sandbox.'),
  'prep-out': P('out-of', 'Sam is stepping out of the sandbox.'),
  'prep-past': P('past', 'Leo is running past the goal.'),
  'prep-between': P('between', 'Mia is running between two big trees.'),
  'r-three': P('three-legged', 'Sam and Leo are running a three-legged race. Their legs are tied together.'),
  'r-tie': P('tie', 'Mia and Ana are tying their legs together with a yellow scarf.'),
  'r-relay': P('relay', 'Mia is passing a red baton to Sam on the track.'),
  'r-track': P('track', 'Leo is running on a red running track.'),
  'r-swim': P('swim-race', 'Children are racing in the pool. Mia is cheering.'),
  'b-heart': P('heart', 'Sam is pointing to his chest. A happy red heart is next to him.'),
  'b-lungs': P('lungs', 'Mia is taking a big breath. Her pink lungs are next to her.'),
  'b-brain': P('brain', 'Ana is pointing to her head. A happy pink brain is above her.'),
  'b-bones': P('bones', 'Leo is pointing to the bones of a friendly skeleton.'),
  'b-muscles': P('muscles', 'Sam is showing the muscles in his arm and leg.'),
  'w-energy': P('energy', 'Mia is jumping high in the park. She is full of energy.'),
  'w-relaxed': P('relaxed', 'Ana is lying on the grass under a tree. She is relaxed.'),
  'w-tired': P('tired', 'Leo is sitting on a bench. He is very tired.'),
  'w-stretch': P('stretch', 'Sam is stretching his arms up on the field.'),
  'w-breathe': P('breathe', 'Mia has hands on her knees. She is breathing hard after a run.'),
  'w-push': P('push', 'Leo is pushing a very big blue ball.'),
  'w-pull': P('pull', 'Ana is pulling a red wagon with a rope.'),
  'w-plan': P('plan', 'Mia is writing an exercise plan on a big calendar.'),
  'w-break': P('short-break', 'Sam, Leo, Mia and Ana are having a short break and drinking water.'),
  'w-strong': P('strong', 'Ana is standing on a hill. She looks strong and proud.'),
  'a-bowling': P('bowling', 'Sam is bowling. A blue ball is rolling towards the pins.'),
  'a-yoga': P('yoga', 'Ana is doing yoga on a purple mat in a garden.'),
  'a-stairs': P('stairs', 'Leo is walking up the colourful stairs at school.'),
  'a-video': P('exercise-video', 'Mia is following an exercise video on the TV at home.'),
  'a-games': P('video-games', 'Sam is sitting on the sofa and playing video games.'),
  's-sad': P('disappointed', 'Ana is standing by the net. She looks disappointed.'),
  's-help': P('help-friend', 'Mia is helping Ana to hold the volleyball.'),
  's-miss': P('miss-ball', 'Leo is trying to catch a baseball, but he misses it.'),
  's-try': P('keep-trying', 'Sam has skates and a helmet. He is getting up to try again.'),
  's-coach': P('coach', 'Leo is talking to his coach and asking for help.')
};
// Pictures from Weeks 1 and 2 (built by the same site).
for (const k of ['act-gymnastics', 'act-bounce', 'act-karate', 'act-skating', 'act-tag', 'sp-bat', 'sp-racket', 'sp-pool', 'sp-field', 'sp-net', 'v-jump', 'v-sleep', 'ride-a-bike', 'walk-to-school', 'eat-apples', 'dance', 'st-cheer', 'st-highfive', 'teacher-class', 'sp-goal']) IMAGES[k] = W2[k];

// Who is doing what in which picture.
export const SCENES = [
  ['sam', 'run-around', 'prep-around'], ['mia', 'climb-through', 'prep-through'], ['leo', 'jump-over', 'prep-over'],
  ['ana', 'climb-up', 'prep-up'], ['sam', 'slide-down', 'prep-down'], ['mia', 'walk-across', 'prep-across'],
  ['leo', 'crawl-under', 'prep-under'], ['ana', 'jump-into', 'prep-into'], ['sam', 'step-out', 'prep-out'],
  ['leo', 'run-past', 'prep-past'], ['mia', 'run-between', 'prep-between'],
  ['mia', 'pass-baton', 'r-relay'], ['leo', 'run-track', 'r-track'], ['sam', 'stretch', 'w-stretch'],
  ['mia', 'breathe', 'w-breathe'], ['leo', 'push-ball', 'w-push'], ['ana', 'pull-wagon', 'w-pull'],
  ['mia', 'write-plan', 'w-plan'], ['ana', 'do-yoga', 'a-yoga'], ['leo', 'take-stairs', 'a-stairs'],
  ['mia', 'follow-video', 'a-video'], ['sam', 'video-games', 'a-games'], ['mia', 'help-friend', 's-help'],
  ['sam', 'try-again', 's-try'], ['leo', 'ask-coach', 's-coach'], ['ana', 'bounce-ball', 'act-bounce'],
  ['ana', 'ride-bike', 'ride-a-bike'], ['mia', 'play-tennis', 'sp-racket'], ['leo', 'walk-school', 'walk-to-school'],
  ['they', 'three-legged', 'r-three'], ['they', 'tie-legs', 'r-tie'], ['they', 'short-break', 'w-break'], ['they', 'play-tag', 'act-tag']
].map(([who, verb, image]) => ({ who, verb, image }));
