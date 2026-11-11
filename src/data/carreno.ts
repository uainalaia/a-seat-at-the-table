import type { ChapterSlug } from './learning';

export const carreno = {
  url: 'https://siise.bibliotecanacional.gov.co/BBCC/Documents/View/212',
  title: 'Compendio del manual de urbanidad y buenas maneras',
  edition: 'In Nociones de urbanidad y buenas maneras. Biblioteca Nacional de Colombia / Ministerio de Cultura, 2016. ISBN 978-958-8959-32-0.',
};
export const carrenoDiningLocators:Record<string,string> = {
  napkin:'§ V',bread:'§§ XII–XV',water:'§ XII',knife:'§ X',spoon:'§ XI',
};
// Locators refer to Carreño's Compendio in the 2016 digital edition, not the
// separate work by Rufino Cuervo that follows it. No edition-dependent pages.
export const chapterFoundations: Record<ChapterSlug, { locator: string; principle: string; application: string }> = {
  'before-you-arrive': { locator: 'Urbanidad, ch. I, §§ II–IV; ch. II, art. I, § X', principle: 'Consideration begins with everyday conduct and personal cleanliness.', application: 'For a recruiting dinner, prepare your introduction, confirm details and wash your hands before eating.' },
  'taking-your-seat': { locator: 'Urbanidad, ch. V, art. III, section I, §§ III–V', principle: 'Carreño discusses when to sit, a comfortable distance from the table and unfolding the napkin onto the lap.', application: 'Follow the host’s seating cue. Today, courtesy applies equally to everyone at the table.' },
  'reading-the-table': { locator: 'Urbanidad, ch. V, art. III, section I, §§ XII–XV', principle: 'Bread belongs on the left, drinks on the right; break bread into small portions.', application: 'Use those landmarks to orient yourself. The modern utensil layout shown here follows Emily Post and the order of courses.' },
  'ordering-with-confidence': { locator: 'Urbanidad, ch. V, art. I, § XXV; art. III, section I, § XXXII', principle: 'Make requests courteously and speak respectfully to the people serving the meal.', application: 'Explain dietary needs clearly. Modern dietary guidance comes from career-service sources; it is not a claim from Carreño.' },
  'conversation-and-courtesy': { locator: 'Urbanidad, ch. V, art. I, §§ II, V, XXXIV–XXXV', principle: 'Include the group, avoid monopolizing the conversation and give the speaker your attention.', application: 'Ask a short question, listen and invite quieter guests into the discussion.' },
  'closing-the-meal': { locator: 'Urbanidad, ch. V, art. I, § XXV; art. II, § XXX', principle: 'Express gratitude and take leave of your hosts thoughtfully.', application: 'Thank the host. The company’s payment arrangement and a professional follow-up are contemporary applications.' },
};

export const questionReferences: Record<string, { locator?: string; note: string; modern: string }> = {
  q1: { note: 'Outside-in utensil order follows the menu in the contemporary setting.', modern: 'formal' },
  q2: { locator: 'Ch. V, art. III, section I, § XII', note: 'Carreño identifies bread on the left and drinks on the right.', modern: 'table' },
  q3: { locator: 'Ch. V, art. I, § XXV', note: 'Carreño supports courteous requests; dietary communication is a contemporary application.', modern: 'tcu' },
  q4: { locator: 'Ch. V, art. I, §§ II, V, XXXIV–XXXV', note: 'Carreño supports consideration, group conversation and attentive listening.', modern: 'manners' },
  q5: { note: 'The resting place for a used utensil follows contemporary dining guidance.', modern: 'vt' },
  q6: { locator: 'Ch. V, art. I, § XXV', note: 'Carreño supports gratitude. The explicitly hosted payment arrangement is contemporary guidance.', modern: 'tcu' },
};
