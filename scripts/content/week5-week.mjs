// Original Unit 4 lessons, examples and speaking prompts for English Adventure.
import { SCENES, WORDS } from './week5-data.mjs';

export const META = {
  id: 'week-05', schemaVersion: 1, contentVersion: '1.0.0', grammar: 'school-modals',
  wordsTitle: 'Actions at school', title: 'School Rules',
  subtitle: 'Can I …? Can you …? What do we have to do?', published: true,
  cover: 'cover', questionsFile: 'questions.json', examplesDirect: true,
  goals: [
    'I can name actions, places, workers and clothes at school.',
    'I can say what someone can and can’t do.',
    'I can ask for permission, make a request and offer help.',
    'I can say what is required and what is optional.',
    'I can join school rules with and, but and or.',
    'I can encourage a classmate and make a study plan.'
  ],
  teacherGoals: [
    'Teach can + base verb for ability, permission and requests. Practise Can I …?, Can you …? and short answers.',
    'Use have to / has to for a requirement, don’t / doesn’t have to for an option. Compare optional with can’t (not allowed).',
    'Compare fictional schools and draw connections to your own school. Use details from the text to describe characters.',
    'Make a short list of informative rules. Use and for additions, but for contrasts and or for alternatives.',
    'Practise polite requests, accepting or declining help, positive feedback, encouragement and a goal with a date and a plan.'
  ],
  teacherNote: 'Compass Be Language Log 2, Unit 4, pages 62–79. Use this week alongside the green school project (63), Actions at School (64), can (65), school places and character description (66–67), school workers and polite requests (68–70), rules and connectors (71), clothes and obligation (72–73), unusual schools and connections (74–75), trip rules (76), encouragement (77), goals (78), and reflection (79). The digital activities use new sentences, stories and pictures.',
  characters: [
    { id: 'mia', name: 'Mia', pronoun: 'she', image: 'lend' },
    { id: 'sam', name: 'Sam', pronoun: 'he', image: 'stand-up' },
    { id: 'leo', name: 'Leo', pronoun: 'he', image: 'sit-down' },
    { id: 'ana', name: 'Ana', pronoun: 'she', image: 'raise-hand' }
  ],
  dashboard: { tagline: 'Ask politely and help your friends.', bubbleLeft: ['Can I help?'], bubbleRight: ['Yes, please!'] },
  owlTips: [
    'Can comes first in a question. Can you help?',
    'After can or can’t, use the base verb: can read.',
    'He has to wait. Does he have to wait?',
    'Don’t have to means you can choose.',
    'Tell a friend what they did well!'
  ],
  missions: [
    { id: 'learn', text: 'Learn can and have to', check: { section: 'learn', min: 3 } },
    { id: 'words', text: 'Explore words for school', check: { section: 'words', min: 1 } },
    { id: 'practice', text: 'Complete at least 3 activities', check: { section: 'practise', min: 3 } },
    { id: 'challenge', text: 'Try the challenge', check: { section: 'challenge', min: 1 } }
  ]
};

const ex = (text, image) => ({ text, image });
const qa = (q, a, image) => ({ q, a, image });
const change = (subject, verb, to) => ({ image: verb, machine: { subject, verb, to } });
const prompt = (text, image, options, answer, explain) => ({ prompt: text, image, options, answer, explain });
const lesson = (id, title, rule, image, examples, together, tryIt, teacherNote) => ({
  id, title, rule, image, examples,
  practice: [{ mode: 'together', ...together }, { mode: 'try', ...tryIt }], teacherNote
});

export const LEARN = [
  lesson('school-actions', 'Actions at school', 'What do we do at school? **Lend**, **share**, **clean up** and more.', 'school-day', [
    ex('Mia **lends** Sam a pencil.', 'lend'), ex('Sam **throws away** the paper.', 'throw-away'),
    ex('Ana **takes a quiz** by herself.', 'quiz'), ex('Mia and Leo **share** one book.', 'share'),
    ex('Ana **cleans up** her desk.', 'clean-up'), ex('The children **wait in line** for the bus.', 'wait-line')
  ], prompt('Two friends use the same book. They ___ it.', 'share', ['share', 'throw away'], 'a', 'When you share a book, you use it together.'),
  prompt('Put the old paper in the bin. ___ the paper.', 'throw-away', ['Check out', 'Throw away'], 'b', 'Throw away = put something you no longer need in a bin.'),
  'Mime sit down, stand up and raise your hand. Let a pupil give each instruction.'),

  lesson('ability', 'Can for ability', 'Use **can + base verb** to say what someone is able to do.', 'run', [
    ex('Leo **can run** around the track.', 'run'), ex('They **can swim** in the pool.', 'swim'),
    ex('Mia **can read** a picture book.', 'read'), ex('Ana **can dance** on the stage.', 'encourage'),
    ex('Mia **can give** a short speech.', 'auditorium'), ex('I **can make** a study plan.', 'plan')
  ], prompt('Leo is a good runner. He can ___ fast.', 'run', ['runs', 'run'], 'b', 'Can + run. The verb keeps its base form.'),
  prompt('Choose the sentence about ability.', 'read', ['Mia can read a book.', 'Can I take this book home?'], 'a', 'Mia is able to read the book.'),
  'Ask pupils to share one ability. A partner says the same sentence using he or she.'),

  lesson('can-not', 'Can’t and the base verb', 'Use **can’t + base verb** for something you are unable or not allowed to do.', 'hall', [
    change('leo', 'swim', 'negative'), change('sam', 'stand-up', 'negative'), change('they', 'run', 'negative'),
    ex('The bus is moving. You **can’t stand up** now.', 'wait-line'),
    ex('We **can’t run** in the hall.', 'hall'), ex('Leo **can’t take** a library book home without checking it out.', 'check-out')
  ], prompt('The sign says “Walk.” We ___ run in the hall.', 'hall', ['can', 'can’t'], 'b', 'The rule does not allow running.'),
  prompt('Leo can’t ___ today.', 'swim', ['swim', 'swims'], 'a', 'Use the base verb swim after can’t.'),
  'Explain that a person may be able to stand up but still not be allowed to do it on a moving bus.'),

  lesson('ability-question', 'Can …? Short answers', 'Ask **Can + who + base verb?** Answer **Yes, … can.** or **No, … can’t.**', 'swim', [
    change('leo', 'swim', 'question'), change('ana', 'encourage', 'question'), change('mia', 'read', 'question'),
    qa('Can you run fast?', 'Yes, I can.', 'run'), qa('Can they sing?', 'Yes, they can.', 'sing'),
    qa('Can Sam dance this new step?', 'No, he can’t.', 'encourage')
  ], prompt('___ Mia read this book?', 'read', ['Does', 'Can'], 'b', 'Can asks about Mia’s ability.'),
  prompt('Can you swim? Choose a possible short answer.', 'swim', ['Yes, I can.', 'Yes, you can.'], 'a', 'Use I when you answer about yourself.'),
  'Use both short answers in a class survey. A learner can say “No, I can’t yet.”'),

  lesson('permission', 'Can I …? Permission', 'When you want to do something, ask **Can I …, please?** Ask **Can we …?** for your group.', 'check-out', [
    qa('Can I check out this book, please?', 'Yes, you can.', 'check-out'),
    qa('Can we sit here, please?', 'Of course.', 'sit-down'),
    qa('Can I ask a question?', 'Yes, you can.', 'raise-hand'),
    qa('Can we go into the gym now?', 'Sorry, you can’t. It is closed.', 'gym'),
    qa('Can I have some rice, please?', 'Sure.', 'cafeteria'),
    qa('Can we stand up now?', 'Yes, you can.', 'stand-up')
  ], prompt('You want to borrow a library book. Ask the librarian.', 'check-out', ['Can I check out this book, please?', 'Can you read fast?'], 'a', 'You are asking if you may do it.'),
  prompt('Mia and Sam want to use the gym. They ask: Can ___ use the gym?', 'gym', ['you', 'we'], 'b', 'Use we when speaking for yourself and a friend.'),
  'Give the learner a place and a goal. Ask whom they should speak to before they ask.'),

  lesson('requests', 'Can you …? Requests', 'To ask someone to do something for you, say **Can you …, please?**', 'lend', [
    qa('Can you lend me a pencil, please?', 'Of course!', 'lend'),
    qa('Can you help me carry these books?', 'Sure!', 'help-books'),
    qa('Can you please help me clean the desk?', 'No problem.', 'clean-up'),
    qa('Can you show me where the hall is?', 'Yes. Come with me.', 'hall'),
    qa('Can you share your book with me?', 'Sure. Sit here.', 'share'),
    qa('Can you give me a spoon, please?', 'Of course.', 'cafeteria')
  ], prompt('You need another person’s help. Which one is a request?', 'help-books', ['Can I carry these books?', 'Can you help me carry these books, please?'], 'b', 'Can you …? asks the other person to do something.'),
  prompt('Can you ___ me a pencil, please?', 'lend', ['lend', 'lends'], 'a', 'Use lend after Can you.'),
  'Model the request as a question, at a clear pace. Partners swap roles.'),

  lesson('offer-help', 'Offer help and reply', 'Offer with **Can I help you?** or **Let me help you.** Say **Yes, please** or **No, thank you**.', 'help-books', [
    qa('Can I help you carry that book?', 'Yes, please.', 'help-books'),
    qa('Let me help you find the story.', 'Thank you!', 'check-out'),
    qa('Can I help you clean up?', 'No, thank you. I’m fine.', 'clean-up'),
    qa('Let me help you with the ball.', 'OK, thank you.', 'help-friend'),
    qa('Can I help you practise your dance?', 'Yes, please.', 'encourage'),
    qa('Can you lend me your only pencil?', 'Sorry, I can’t. I’m using it.', 'lend')
  ], prompt('A friend needs help. Make an offer.', 'help-books', ['Can I help you?', 'Can you carry my book?'], 'a', 'With this offer, you are the person who can help.'),
  prompt('You are fine on your own. Answer “Can I help you?”', 'clean-up', ['Yes, please.', 'No, thank you.'], 'b', 'No, thank you is a polite way to say no.'),
  'Show that either accepting or declining help can be polite when it fits the situation.'),

  lesson('places-and-people', 'Places and people', 'A **library** has books. A **librarian** helps you find them. What can you do in each place?', 'check-out', [
    ex('Read or borrow books in the **library**. Ask the **librarian** for help.', 'check-out'),
    ex('Play basketball in the **gym**. The **janitor** cleans the floor.', 'janitor'),
    ex('A **cafeteria worker** serves lunch in the **cafeteria**.', 'cafeteria'),
    ex('We watch the talent show in the **auditorium**.', 'auditorium'),
    ex('We walk through the **hall** to our next class.', 'hall'),
    ex('Ana talks to the **principal** in her office.', 'principal-office')
  ], prompt('Where do we go to see a show on a stage?', 'auditorium', ['the hall', 'the auditorium'], 'b', 'An auditorium has a stage and seats for an audience.'),
  prompt('Who helps Mia check out a book?', 'check-out', ['the librarian', 'the janitor'], 'a', 'A librarian works in a library.'),
  'Name the adults who help at your school. Have children use Can you …, please? to ask one of them for help.'),

  lesson('describe-character', 'What is the character like?', 'Use details from a story. **I think … is … because …**', 'share', [
    ex('Mia gives Sam a pencil. She is **helpful**.', 'lend'),
    ex('Leo shares a book. He is **kind**.', 'share'),
    ex('Leo holds his books with both hands. He is **careful** with them.', 'help-books'),
    ex('Ana puts up her hand and waits. She is **patient**.', 'raise-hand'),
    ex('Leo runs quickly. He is **fast**.', 'run'),
    ex('Mia stands in front of a big room and speaks. She is **brave**.', 'auditorium')
  ], prompt('Mia helps Leo carry a book. What is she like?', 'help-books', ['helpful', 'slow'], 'a', 'Her action shows she likes to help.'),
  prompt('Read: “Leo finishes the race first.” What is he like?', 'run', ['hungry', 'fast'], 'b', 'Finishing first in the race is a clue that Leo is fast.'),
  'Ask which action or words support each description. Different adjectives can work if students explain their evidence.'),

  lesson('connectors', 'And, but, or', 'Use **and** to add, **but** to contrast, and **or** for a choice.', 'hall', [
    ex('We read **and** write in class.', 'school-day'),
    ex('You can walk in the hall, **but** you can’t run there.', 'hall'),
    ex('You can read a story **or** a comic. Pick one.', 'check-out'),
    ex('I have to bring my bag **and** a pencil.', 'cover'),
    ex('Leo can sing, **but** he can’t dance this step yet.', 'encourage'),
    ex('On the moving bus, don’t run **or** stand up.', 'wait-line')
  ], prompt('We can borrow a comic ___ a story. Pick one.', 'check-out', ['and', 'or'], 'b', 'Or shows a choice.'),
  prompt('We can talk in the hall, ___ we have to be quiet in the library.', 'hall', ['but', 'and'], 'a', 'But links two different rules.'),
  'Let pairs write three rules for a place. Ask them to join two of the ideas using the correct connector.'),

  lesson('clothes', 'Clothes and uniforms', 'Name what someone wears. **A shirt**, **a jacket** and **socks** can be part of a **uniform**.', 'uniform', [
    ex('Leo wears a white shirt and a blue **tie**.', 'uniform'),
    ex('Ana wears a blue **skirt** and black **shoes**.', 'uniform'),
    ex('Sam wears a **T-shirt**, **jeans** and **sneakers**.', 'casual-clothes'),
    ex('Mia wears a yellow **jacket** and blue **shorts**.', 'casual-clothes'),
    ex('I pull my **socks** on before my sneakers.', 'clothes-socks'),
    ex('These long navy **pants** are part of a uniform.', 'clothes-pants')
  ], prompt('Which do you wear around your neck with a school shirt?', 'clothes-tie', ['a skirt', 'a tie'], 'b', 'A tie goes around the collar.'),
  prompt('What do you put on your feet before your shoes?', 'clothes-socks', ['socks', 'shorts'], 'a', 'Socks go inside your shoes.'),
  'Compare the school outfit and the casual outfit. Let pupils use pants or trousers and sneakers or trainers in speaking.'),

  lesson('have-to', 'Have to and has to', 'A rule tells us what we **have to** do. With **he / she / it**, say **has to**.', 'uniform', [
    change('leo', 'uniform', 'have-positive'), change('they', 'wait-line', 'have-positive'), change('ana', 'raise-hand', 'have-positive'),
    ex('I **have to** bring a pencil for the quiz.', 'quiz'),
    ex('Mia **has to** show her card at this library.', 'check-out'),
    ex('We **have to** stay with the group at the zoo.', 'field-trip')
  ], prompt('The school rule says so. Leo ___ wear a uniform.', 'uniform', ['have to', 'has to'], 'b', 'Leo = he. Use has to.'),
  prompt('We ___ wait in line for the bus.', 'wait-line', ['have to', 'has to'], 'a', 'We + have to.'),
  'Name the rule as a fact about the school in the example. Invite pupils to compare it to their own rules.'),

  lesson('optional', 'Don’t have to or can’t?', '**Don’t have to** means you can choose. **Can’t** means the rule says no, or you are unable.', 'casual-clothes', [
    change('sam', 'uniform', 'have-negative'), change('we', 'wait-line', 'have-negative'),
    ex('A uniform is optional. You **don’t have to** wear one.', 'casual-clothes'),
    ex('Ana **doesn’t have to** wear a tie. It is her choice.', 'clothes-tie'),
    ex('You **can’t** run in the hall. The rule says walk.', 'hall'),
    ex('You **don’t have to** sing in the show. You can read a poem instead.', 'auditorium')
  ], prompt('Sam may wear a uniform, but he can choose. He ___ wear one.', 'casual-clothes', ['doesn’t have to', 'can’t'], 'a', 'Optional means it is allowed, but not required.'),
  prompt('The rule says “No running here.” We ___ run here.', 'hall', ['don’t have to', 'can’t'], 'b', 'Can’t means it is not allowed.'),
  'Ask “Can I do it if I want?” after each example to check the difference between optional and not allowed.'),

  lesson('do-we-have-to', 'Do we have to …?', 'Ask **Do / Does + who + have to + base verb?** After **Does**, use **have to**.', 'uniform', [
    change('leo', 'uniform', 'have-question'), change('they', 'wait-line', 'have-question'), change('ana', 'quiz', 'have-question'),
    qa('Do I have to show my library card?', 'Yes, you do.', 'check-out'),
    qa('Do we have to wear ties?', 'No, we don’t.', 'clothes-tie'),
    qa('Does Mia have to stay with the group?', 'Yes, she does.', 'field-trip')
  ], prompt('Does Leo ___ wear a tie?', 'clothes-tie', ['has to', 'have to'], 'b', 'Does + Leo + have to.'),
  prompt('Do I have to bring a form? The form is required.', 'form', ['Yes, you do.', 'Yes, you can.'], 'a', 'Answer Do I …? with Yes, you do.'),
  'Have pupils ask three questions about real or invented field trip rules and respond with short answers.'),

  lesson('different-schools', 'Different schools', 'Ask **How is this like my school? How is it different?** Use a detail from the reading.', 'boat-school', [
    ex('At one school, the classroom is on a **boat**.', 'boat-school'),
    ex('At a forest school, pupils learn outside under the **trees**.', 'forest-school'),
    ex('After rain, the ground is wet and there is **mud**.', 'mud'),
    ex('At this school, a tree grows through the **roof**.', 'tree-school'),
    ex('We have desks too. That is one thing that is **the same**.', 'school-day'),
    ex('Our school is on land, but the boat school is on water. That is **different**.', 'boat-school')
  ], prompt('Which school moves on water?', 'boat-school', ['the forest school', 'the boat school'], 'b', 'A boat floats and can move on water.'),
  prompt('Both schools have desks. Is this a similarity or a difference?', 'school-day', ['a similarity', 'a difference'], 'a', 'Both schools share that feature.'),
  'Use original Mini reading passages and invite pupils to connect one detail to a place or an experience they know.'),

  lesson('trip-rules', 'Bus and field trip rules', 'A trip rule can say **what is required**, **what is optional** or **what is not allowed**.', 'field-trip', [
    ex('You **have to** bring your signed form.', 'form'),
    ex('You **have to** wait in line before you get on the bus.', 'wait-line'),
    ex('You **can’t** stand up while the bus is moving.', 'wait-line'),
    ex('You **have to** stay with the group at the zoo.', 'field-trip'),
    ex('You **don’t have to** bring a notebook. We have extras.', 'quiz'),
    ex('You **can** ask the guide a question.', 'raise-hand')
  ], prompt('The teacher has extra notebooks. Bringing one is optional. You ___ bring one.', 'quiz', ['can’t', 'don’t have to'], 'b', 'Don’t have to explains that bringing one is a choice.'),
  prompt('The trip form is required. We ___ bring it.', 'form', ['have to', 'don’t have to'], 'a', 'Have to means it is required.'),
  'Read an original list of trip rules aloud. Ask pupils to retell one required, one optional and one forbidden action.'),

  lesson('encouragement', 'Give feedback and encouragement', 'Say what went well. If a friend is still trying, **encourage** them.', 'encourage', [
    ex('“**Great job!** Your next pass was excellent.”', 'well-done'),
    ex('“**I like your speech!** You speak clearly.”', 'auditorium'),
    ex('“**Keep trying!** The first step is hard.”', 'try-again'),
    ex('“**You’re almost there!** Try the dance step again.”', 'encourage'),
    ex('“**I like your singing.** You kept the beat.”', 'sing'),
    ex('“**Don’t give up.** We can read it together.”', 'share')
  ], prompt('A friend missed a dance step. Encourage them.', 'encourage', ['Keep trying!', 'Stop practising!'], 'a', 'Keep trying is a helpful thing to say when a friend finds something hard.'),
  prompt('A friend gave a clear speech. Give positive feedback.', 'auditorium', ['Are you still looking for your book?', 'Great job! I heard every word.'], 'b', 'Say what the friend did well.'),
  'Practise a short performance or reading in pairs. Each pupil gives one specific piece of positive feedback.'),

  lesson('study-goals', 'Make a study goal', 'Choose **what** you will do, set a **date**, and make a **plan**.', 'plan', [
    ex('Goal: I want to **finish my classwork** on time.', 'quiz'),
    ex('Date: I want to do this **by Friday**.', 'plan'),
    ex('Plan: I will **write three lines before I talk** to my friends.', 'school-day'),
    ex('Goal: I want to **read a page** without help.', 'read'),
    ex('Date: I want to do it **by next Monday**.', 'plan'),
    ex('Plan: I will **read with a partner** for five minutes each day.', 'share')
  ], prompt('Which goal is easier to check?', 'plan', ['Get better.', 'Read one page by Friday.'], 'b', 'It names the action and a date.'),
  prompt('Which plan gives you an action to do?', 'quiz', ['Write the first three lines before talking.', 'Try to be good.'], 'a', 'It gives a clear action you can practise.'),
  'Give learners time to choose a small study goal, a date and one action. End by asking what they can do at school now.')
];

export const SPEAKING = [
  ['What can you do well? Tell a partner two things.', 'run', ['I can …', 'I can also …'], 'I can run and I can read a story.', true],
  ['Ask your partner about an ability. Then swap roles.', 'swim', ['Can you …?', 'Yes, I can.'], 'Can you swim? Yes, I can.', true],
  ['Name something you can’t do yet.', 'encourage', ['I can’t … yet.'], 'I can’t do this dance step yet.', true],
  ['You want to borrow a book. Ask the librarian.', 'check-out', ['Can I …, please?'], 'Can I check out this book, please?'],
  ['You and your friend want to sit down. Ask permission.', 'sit-down', ['Can we …?'], 'Can we sit here, please?'],
  ['Ask a friend to lend you a pencil.', 'lend', ['Can you …, please?'], 'Can you lend me a pencil, please?'],
  ['Your friend has several books. Offer help.', 'help-books', ['Let me help you …'], 'Let me help you carry your books.'],
  ['How can we make our school greener? Suggest two things to do.', 'throw-away', ['We can …', 'We can also …'], 'We can use both sides of our paper. We can also put used paper in a recycling bin.', true],
  ['A friend offers help, and you want it. Reply politely.', 'help-friend', ['Yes, please.', 'Thank you.'], 'Yes, please. Thank you!'],
  ['A friend offers help, but you are fine. Reply politely.', 'share', ['No, thank you.', 'I’m fine.'], 'No, thank you. I’m fine.'],
  ['What can you do in a library? What can’t you do there?', 'check-out', ['We can …, but …', 'We can’t …'], 'We can borrow books, but we can’t shout.'],
  ['Choose a person who helps at school. What do they do?', 'cafeteria', ['A … works in …', 'They help us …'], 'A cafeteria worker serves our lunch.', true],
  ['Describe Mia using something she does in the picture.', 'help-books', ['I think Mia is …', 'because …'], 'I think Mia is helpful because she carries a book for Leo.'],
  ['Describe your school clothes.', 'uniform', ['I wear …', 'My … is …'], 'I wear a white shirt and blue pants.', true],
  ['Ask your partner whether their school requires a uniform.', 'uniform', ['Do you have to …?'], 'Do you have to wear a uniform?', true],
  ['Say one thing you have to do in class and one thing you don’t have to do.', 'school-day', ['I have to …', 'I don’t have to …'], 'I have to listen. I don’t have to write with a blue pen.', true],
  ['Tell a new pupil two rules about the school bus.', 'wait-line', ['You have to …', 'You can’t …'], 'You have to wait in line, and you can’t stand up while the bus is moving.'],
  ['Say one way the boat school is different from your school.', 'boat-school', ['At the boat school …', 'but …'], 'The boat school is on water, but my school is on land.', true],
  ['What can you do at a forest school? Name two things.', 'forest-school', ['You can … and …'], 'You can look at leaves and draw trees.'],
  ['A friend is learning a dance step. Encourage them.', 'encourage', ['Keep trying!', 'You’re almost there.'], 'Keep trying! You’re almost there.'],
  ['Your friend gives a good speech. Say what went well.', 'auditorium', ['Great job!', 'I like …'], 'Great job! Your voice was clear.'],
  ['Make a study goal. What will you do, by when, and how?', 'plan', ['I want to … by …', 'I will … every day.'], 'I want to read a page by Friday. I will practise for five minutes every day.', true]
].map(([question, image, help, sample, personal = false], i) => ({ id: `w5-sp-${i + 1}`, question, image, help, sample, personal }));

export const EXAMPLES = SCENES.map(({ who, verb, image }, i) => ({ id: `ex-${i + 1}`, subject: who, verb: verb.id, image }));

const revealSentences = [
  ['Mia', 'Mia can lend Sam a pencil.'], ['Sam', 'Sam can throw away the paper.'],
  ['Ana', 'Ana can take a quiz.'], ['They', 'They can share a picture book.'],
  ['Ana', 'Ana can clean up the desk.'], ['Leo', 'Leo can sit down.'],
  ['Sam', 'Sam can stand up.'], ['Mia', 'Mia can check out a book.'],
  ['Ana', 'Ana can raise her hand.'], ['They', 'They have to wait in line.'],
  ['Mia', 'Mia can help Leo carry his books.'], ['Leo and Ana', 'They have to carry their books to school.']
];
export const PICTURE_REVEAL = WORDS.map(({ phrase, image }, i) => ({ image, word: phrase, subject: revealSentences[i][0], sentence: revealSentences[i][1] }));

export const QUESTION_DOOR = [
  ['Mia', 'check-out', 'You want to borrow a book. Talk to the librarian.', ['Can I check out this book, please?', 'Can she checks out this book?', 'Do I can read it?'], 'Yes, you can.', 'Can I asks for permission.'],
  ['Sam', 'lend', 'You forgot your pencil. Ask a friend to lend you one.', ['Can you lend me a pencil, please?', 'Can I lend you a pencil?', 'You can lends me a pencil?'], 'Of course!', 'Can you asks a friend to do something.'],
  ['Mia', 'help-books', 'Your classmate has too many books to carry. Offer help.', ['Can I help you carry your books?', 'Can you carry my books?', 'Can I helps you?'], 'Yes, please!', 'Start your offer with Can I help you.'],
  ['you', 'swim', 'Ask a friend if they are able to swim.', ['Can you swim?', 'Do you can swim?', 'Can you swims?'], 'Yes, I can.', 'Can + you + swim.'],
  ['Leo', 'uniform', 'Ask a classmate if a uniform is required at their school.', ['Do you have to wear a uniform?', 'Do you has to wear a uniform?', 'You does have to wear a uniform?'], 'Yes, I do.', 'Do + you + have to.'],
  ['Ana', 'quiz', 'Ask if the quiz is required for Ana.', ['Does Ana have to take the quiz?', 'Does Ana has to take the quiz?', 'Do Ana have to take the quiz?'], 'Yes, she does.', 'Does + Ana + have to.'],
  ['we', 'wait-line', 'Your group wants to sit at the front of the bus. Ask first.', ['Can we sit at the front, please?', 'We can sits at the front?', 'Does we sit at the front?'], 'Yes, you can. The bus isn’t moving yet.', 'Use Can we to ask for your group.'],
  ['you', 'field-trip', 'Ask the teacher if the class needs to bring a form.', ['Do we have to bring a form?', 'Do we has to bring a form?', 'Has we to bring a form?'], 'Yes, you do.', 'Do + we + have to.'],
  ['Ana', 'raise-hand', 'You would like to ask something in class. Ask your teacher first.', ['Can I ask a question, please?', 'Can you ask me a question?', 'Can I asks a question?'], 'Of course. Go ahead.', 'Can I …? asks for permission.'],
  ['Leo', 'cafeteria', 'You want some rice. Ask the cafeteria worker politely.', ['Can I have some rice, please?', 'Can they has some rice?', 'Have I rice?'], 'Sure. Here you go.', 'Start with Can I have …?'],
  ['Sam', 'clean-up', 'Ask a friend to help clean a spill.', ['Can you help me clean up, please?', 'Can I clean up your desk?', 'Does you clean up?'], 'Sure. I have a cloth.', 'Make a request with Can you …?'],
  ['Mia', 'auditorium', 'Ask if Mia is able to give a speech.', ['Can Mia give a speech?', 'Can Mia gives a speech?', 'Does Mia can give a speech?'], 'Yes, she can.', 'Use the base form give.']
].map(([who, image, clue, options, reveal, hint], i) => ({ id: `door-${i + 1}`, who, image, clue, options, answer: 'a', reveal, hint }));

export const YES_NO = [
  ['lend', 'Mia has a spare pencil and offers it to Sam.', 'Can Mia lend Sam a pencil?', 'Yes, she can.', 'No, she can’t.', true],
  ['check-out', 'The librarian says that the library is closed today.', 'Can Sam check out a book now?', 'Yes, he can.', 'No, he can’t.', false],
  ['swim', 'Leo is on the school swim team.', 'Can Leo swim?', 'Yes, he can.', 'No, he can’t.', true],
  ['hall', 'The rule says “Walk in the hall.”', 'Can the children run in the hall?', 'Yes, they can.', 'No, they can’t.', false],
  ['uniform', 'A uniform is required at Leo’s school.', 'Does Leo have to wear a uniform?', 'Yes, he does.', 'No, he doesn’t.', true],
  ['casual-clothes', 'A tie is optional at Sam’s school.', 'Does Sam have to wear a tie?', 'Yes, he does.', 'No, he doesn’t.', false],
  ['wait-line', 'The class rule is to wait in line for the bus.', 'Do the children have to wait in line?', 'Yes, they do.', 'No, they don’t.', true],
  ['form', 'The trip letter says “You must bring a signed form.”', 'Do you have to bring a form?', 'Yes, I do.', 'No, I don’t.', true],
  ['wait-line', 'The bus is moving. Everyone must stay seated.', 'Can Leo stand up now?', 'Yes, he can.', 'No, he can’t.', false],
  ['field-trip', 'The teacher says “Bring a notebook if you want.”', 'Do we have to bring a notebook?', 'Yes, we do.', 'No, we don’t.', false],
  ['boat-school', 'The boat comes to the students every morning.', 'Do the students have to take a bus?', 'Yes, they do.', 'No, they don’t.', false],
  ['forest-school', 'Ana’s forest class draws leaves outside.', 'Can Ana draw leaves outside at her school?', 'Yes, she can.', 'No, she can’t.', true]
].map(([image, clue, question, yes, no, correct], i) => ({ id: `yn-${i + 1}`, image, clue, question, options: [yes, no], answer: correct ? 'a' : 'b', hint: 'Read the rule or clue again.' }));
