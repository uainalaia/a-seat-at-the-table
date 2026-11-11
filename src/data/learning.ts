export const chapterOrder = ['before-you-arrive', 'taking-your-seat', 'reading-the-table', 'ordering-with-confidence', 'conversation-and-courtesy', 'closing-the-meal'] as const;
export type ChapterSlug = typeof chapterOrder[number];

export interface TableItem {
  id: string;
  name: string;
  position: string;
  explanation: string;
  tip: string;
}

export const tableItems: TableItem[] = [
  { id: 'plate', name: 'Dinner plate', position: 'At the center', explanation: 'Your place setting is organized around this plate. It gives you a starting point when a busy table feels confusing.', tip: 'Use the plate as your map, then look left for bread and right for water.' },
  { id: 'napkin', name: 'Napkin', position: 'On the plate in this setting', explanation: 'Once seated, take your cue from the host and unfold it on your lap. Use it to gently blot your mouth.', tip: 'When the meal ends, place it loosely to the left of your plate.' },
  { id: 'salad-fork', name: 'Salad fork', position: 'Farthest left in this menu', explanation: 'This teaching menu begins with salad, then fish and a main course. The outer fork is the salad fork.', tip: 'The order follows the menu. A different sequence changes the arrangement.' },
  { id: 'dinner-fork', name: 'Dinner fork', position: 'Left of the plate, inside', explanation: 'The larger, inner fork is for the main course in this setting. Leave it in place until that course arrives.', tip: 'A used fork rests on your plate, rather than back on the linen.' },
  { id: 'knife', name: 'Dinner knife', position: 'Immediately right of the plate', explanation: 'The cutting edge faces the plate. Cut manageable bites as you go, with your movements close to your place setting.', tip: 'American and Continental styles are both acceptable; choose the one you can use comfortably.' },
  { id: 'spoon', name: 'Soup spoon', position: 'Outside the knives, on the right', explanation: 'Use this spoon if soup is served before the main course. This teaching setting includes utensils for both soup and salad.', tip: 'Work inward as courses arrive. You do not need to use every utensil at once.' },
  { id: 'bread', name: 'Bread plate', position: 'Above and to your left', explanation: 'The small plate on your left is for your bread. Break off a bite-size piece before buttering it.', tip: 'Bread on the left, drinks on the right: a useful orientation cue.' },
  { id: 'water', name: 'Water glass', position: 'Above and to your right', explanation: 'Your water glass sits above the knife. It is completely fine to choose water throughout a professional meal.', tip: 'If you are unsure which glass is yours, orient yourself from your plate first.' },
  { id: 'fish-fork', name: 'Fish fork', position: 'Between the salad and dinner forks', explanation: 'Use this fork with the fish knife when a separate fish course follows the salad. Its shape helps separate delicate pieces.', tip: 'Only a menu with a fish course needs this pair. Follow the course, rather than memorizing a fixed number of forks.' },
  { id: 'fish-knife', name: 'Fish knife', position: 'Between the dinner knife and soup spoon', explanation: 'The broad, shaped blade helps separate cooked fish from skin and bones. It is not intended for sawing like a steak knife.', tip: 'Use it with the fish fork. Ask the server quietly if a utensil is unfamiliar.' },
  { id: 'butter-knife', name: 'Butter spreader', position: 'Across your bread plate', explanation: 'Use this small, blunt spreader to butter an individual bite of bread. The bread plate and spreader belong to your setting.', tip: 'Break off a small piece first. A communal butter dish may have its own serving utensil.' },
  { id: 'dessert-fork', name: 'Dessert fork', position: 'Horizontally above the plate, tines right', explanation: 'A smaller fork for cake, pastry or another plated dessert. It is shown here below the dessert spoon for comparison.', tip: 'A restaurant may bring it with dessert instead of setting it out at the start.' },
  { id: 'dessert-spoon', name: 'Dessert spoon', position: 'Above the dessert fork, bowl left', explanation: 'Use the smaller spoon for soft desserts such as custard. Use the fork, spoon or both according to the dessert.', tip: 'Dessert utensils may arrive later. Their presence does not mean you must use both.' },
  { id: 'red-wine', name: 'Red-wine glass', position: 'To the right of the water glass', explanation: 'The larger bowl is commonly used for red wine. This is a recognition exercise; drinking alcohol is never required.', tip: 'Glassware follows the drinks being served. Choosing water or a nonalcoholic option is appropriate.' },
  { id: 'white-wine', name: 'White-wine glass', position: 'Outside the red-wine glass', explanation: 'The smaller bowl is commonly used for white wine. Glass shapes and arrangements vary by restaurant.', tip: 'Ask the server which glass is intended for a drink. You do not have to accept an alcoholic beverage.' },
  { id: 'teaspoon', name: 'Teaspoon', position: 'Beside the cup and saucer', explanation: 'Use this small spoon to stir tea or coffee gently. Place it on the saucer before drinking.', tip: 'Coffee service usually arrives after the meal. It is shown here as part of the expanded reference setting.' },
  { id: 'cup', name: 'Cup & saucer', position: 'To your right, for coffee service', explanation: 'The cup and saucer are for tea or coffee, usually served with or after dessert. Keep the spoon on the saucer while drinking.', tip: 'The expanded scene shows several courses together so you can compare the pieces. A real table will often have fewer.' },
];

export interface ScenarioOption {
  text: string;
  consequence: string;
  recommended: boolean;
}
export interface ScenarioStep {
  title: string;
  scene: string;
  question: string;
  options: ScenarioOption[];
  explanation: string;
  chapter: ChapterSlug;
  resourceId: string;
}

export const scenario: ScenarioStep[] = [
  {
    title: 'The first hello',
    scene: 'You are meeting a recruiter and two students for dinner. You arrive a few minutes early. The recruiter greets you beside the table.',
    question: 'How do you settle in?',
    options: [
      { text: 'Greet everyone, silence my phone, and follow the host’s seating cue.', consequence: 'You learn everyone’s name and let the host guide the seating. The evening starts calmly.', recommended: true },
      { text: 'Take the nearest seat and start looking at my phone.', consequence: 'You miss introductions while the group is getting acquainted.', recommended: false },
      { text: 'Wait silently until someone starts interviewing me.', consequence: 'You leave an easy opportunity to introduce yourself unused.', recommended: false },
    ],
    explanation: 'A professional meal begins with attention to people. A simple introduction and a seating cue are enough; you do not need a rehearsed performance.',
    chapter: 'taking-your-seat', resourceId: 'tcu',
  },
  {
    title: 'A table full of possibilities',
    scene: 'Salad is the first course. There are two forks to the left of your plate, a bread plate on the left, and a water glass on the right.',
    question: 'Which fork do you reach for?',
    options: [
      { text: 'The fork nearest my plate, because it is the largest.', consequence: 'That fork is reserved for the main course in this setting. There is no need to panic; a small correction is enough.', recommended: false },
      { text: 'The outer fork on my left, following the order of courses.', consequence: 'You choose the fork set for this course and can return your attention to the conversation.', recommended: true },
      { text: 'A fork from the unused setting next to me.', consequence: 'You have borrowed from another setting when yours already contains what you need.', recommended: false },
    ],
    explanation: 'For this salad-first menu, work from the outside inward. Place settings vary, so the menu and the host provide context.',
    chapter: 'reading-the-table', resourceId: 'table',
  },
  {
    title: 'Ordering with ease',
    scene: 'The host suggests entrées in the middle of the menu’s price range. You need a dish without an ingredient you cannot eat.',
    question: 'What is your next move?',
    options: [
      { text: 'Stay silent about my needs so I do not inconvenience anyone.', consequence: 'The server cannot help with a need they do not know about.', recommended: false },
      { text: 'Order the most elaborate dish to show that I know fine dining.', consequence: 'The meal becomes a performance instead of an opportunity to connect.', recommended: false },
      { text: 'Choose a manageable dish and discreetly explain my dietary need to the server.', consequence: 'You communicate clearly and give the server a chance to help you make an appropriate choice.', recommended: true },
    ],
    explanation: 'Professional courtesy includes stating your needs respectfully. Follow the host’s price cues and choose something you can eat comfortably.',
    chapter: 'ordering-with-confidence', resourceId: 'tcu',
  },
  {
    title: 'More than small talk',
    scene: 'The recruiter asks what you have enjoyed studying. Another student has not had a chance to speak, and your phone lights up.',
    question: 'How do you keep the conversation welcoming?',
    options: [
      { text: 'Share a short example, ask about their work, and invite the other student in.', consequence: 'Your example gives the recruiter something to ask about, and the conversation includes the whole table.', recommended: true },
      { text: 'Give my full résumé before anyone else takes a turn.', consequence: 'Your enthusiasm crowds out other voices and makes a relaxed conversation feel like a monologue.', recommended: false },
      { text: 'Check the notification while the recruiter is speaking.', consequence: 'Your attention shifts away from the person who has just asked about you.', recommended: false },
    ],
    explanation: 'A professional dinner is a conversation, not a speech. Show curiosity, listen, and make room for other people.',
    chapter: 'conversation-and-courtesy', resourceId: 'manners',
  },
  {
    title: 'A small spill',
    scene: 'As you reach for your water, you spill a little onto the tablecloth. No one is hurt. The server is nearby.',
    question: 'What is the most considerate recovery?',
    options: [
      { text: 'Ignore it and let someone else deal with the water.', consequence: 'The spill stays in the way of the people around you.', recommended: false },
      { text: 'Apologize briefly, contain it with my napkin, and discreetly ask the server for help.', consequence: 'The problem is handled without turning a small accident into the focus of the meal.', recommended: true },
      { text: 'Keep apologizing and explain in detail why the glass was badly placed.', consequence: 'Blame and repeated explanations give the accident more attention than it needs.', recommended: false },
    ],
    explanation: 'A calm response matters more than appearing flawless. Acknowledge the accident, help where you can, and be gracious to the staff.',
    chapter: 'conversation-and-courtesy', resourceId: 'manners',
  },
  {
    title: 'The last impression',
    scene: 'The recruiter invited the group as the company’s guests and has told the server that the company is hosting. The check arrives.',
    question: 'How do you close this hosted dinner?',
    options: [
      { text: 'Argue publicly that I must pay the entire bill.', consequence: 'An unnecessary contest interrupts the host’s arrangements.', recommended: false },
      { text: 'Leave as soon as the plates are cleared.', consequence: 'You miss the chance to thank the people who spent the evening with you.', recommended: false },
      { text: 'Let the host handle the agreed bill, thank them, and send a brief follow-up.', consequence: 'You respect the arrangement and close the evening with appreciation.', recommended: true },
    ],
    explanation: 'This is an explicitly hosted recruiting meal. Other meals may use different payment arrangements; clarify those in advance rather than assuming.',
    chapter: 'closing-the-meal', resourceId: 'tcu',
  },
];

export interface KnowledgeQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  chapter: ChapterSlug;
}
export const knowledgeQuestions: KnowledgeQuestion[] = [
  { id: 'q1', question: 'At a salad-first meal with two forks, which fork do you use first?', options: ['The inner fork', 'The outer fork', 'Either fork from any setting'], correct: 1, explanation: 'Utensils are arranged for the menu. At this salad-first meal, begin with the outer fork.', chapter: 'reading-the-table' },
  { id: 'q2', question: 'Where do you usually find your bread plate and water glass?', options: ['Bread left, water right', 'Bread right, water left', 'Both directly in front of the next guest'], correct: 0, explanation: 'Orient yourself from your plate: bread on the left and drinks on the right.', chapter: 'reading-the-table' },
  { id: 'q3', question: 'What should you do about an important dietary need?', options: ['Ignore it', 'Discuss it loudly across the table', 'Tell the host in advance and confirm discreetly with the server'], correct: 2, explanation: 'Clear, considerate communication allows the people hosting and serving to help you.', chapter: 'ordering-with-confidence' },
  { id: 'q4', question: 'What helps a professional dining conversation?', options: ['Talking through the whole meal', 'Listening, asking questions, and including others', 'Reading messages while someone answers'], correct: 1, explanation: 'Give and take makes conversation easier for everyone and shows genuine attention.', chapter: 'conversation-and-courtesy' },
  { id: 'q5', question: 'A used fork should rest where during the meal?', options: ['On the tablecloth', 'In your pocket', 'On your plate'], correct: 2, explanation: 'Keep used utensils on the plate rather than returning them to the tablecloth.', chapter: 'reading-the-table' },
  { id: 'q6', question: 'The company has explicitly invited you as its guest. What is a good way to end the meal?', options: ['Respect the host’s arrangements and say thank you', 'Demand that the group split the check', 'Leave without saying goodbye'], correct: 0, explanation: 'In a hosted meal, respect the agreed arrangements and express appreciation. Clarify other payment situations beforehand.', chapter: 'closing-the-meal' },
];

export const reflectionQuestions = [
  { id: 'q7', type: 'confidence', question: 'After exploring this site, how confident do you feel finding your way around a place setting?' },
  { id: 'q8', type: 'confidence', question: 'After practicing, how confident do you feel joining a professional dining conversation?' },
  { id: 'q9', type: 'reflection', question: 'What is one thing you learned that you will use at your next professional meal?' },
  { id: 'q10', type: 'reflection', question: 'What dining situation would you still like to learn more about?' },
] as const;
