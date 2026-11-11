export interface Resource {
  id: string;
  organization: string;
  title: string;
  url: string;
  note: string;
}

export const accessed = 'October 31, 2026';
// IDs checked against embeds on the publisher's own pages, November 4–5, 2026.
export const videoLessons = [
  {title:'Where does the napkin go?',icon:'napkin',videoId:'FitRDb6yTXY',sourceUrl:'https://emilypost.com/advice/table-manners-video-the-napkin',note:'See the publisher’s guidance on placing your napkin when you leave the table. The accompanying notes explain why conventions can differ.',chapter:'taking-your-seat'},
  {title:'Bread left. Drinks right.',icon:'bread',videoId:'ohk5ZDRgNY0',sourceUrl:'https://emilypost.com/advice/table-manners-video-b-and-d-for-bread-and-drink',note:'Learn a visual memory cue for finding your bread plate and drink in a crowded place setting.',chapter:'reading-the-table'},
  {title:'Start with the outside utensils.',icon:'salad-fork',videoId:'0wXijEcIlak',sourceUrl:'https://emilypost.com/advice/table-manners-video-using-utensils-from-the-outside-in',note:'Follow the courses from the outer utensils toward the plate.',chapter:'reading-the-table'},
  {title:'Find your seat.',icon:'plate',videoId:'LR5Q_pk9aRA',sourceUrl:'https://emilypost.com/advice/table-manners-video-where-to-sit-guests-at-the-table',note:'Read place cards and take your cue from the host before sitting.',chapter:'taking-your-seat'},
  {title:'A comfortable grip.',icon:'knife',videoId:'Y0uZYnoWq8Y',sourceUrl:'https://emilypost.com/table-manners-continental-style-dining',note:'See Continental technique and how it differs from American-style dining.',chapter:'reading-the-table'},
  {title:'Build the place setting.',icon:'dinner-fork',videoId:'V52nGn-coKo',sourceUrl:'https://emilypost.com/advice/video-how-to-set-the-family-dinner-table',note:'Lizzie Post demonstrates a family setting. Compare its essentials with a professional meal.',chapter:'reading-the-table'},
];
export const resources: Resource[] = [
  { id: 'carreno', organization: 'Manuel Antonio Carreño · Biblioteca Nacional de Colombia', title: 'Compendio del manual de urbanidad y buenas maneras', url: 'https://siise.bibliotecanacional.gov.co/BBCC/Documents/View/212', note: 'Principal historical reference. In Nociones de urbanidad y buenas maneras (Ministerio de Cultura / Biblioteca Nacional de Colombia, 2016), ISBN 978-958-8959-32-0. See Urbanidad, chapter V, article III, section I (dining), and article I (conversation). Consulted November 7, 2026. Section and paragraph numbers are used because pagination varies by edition.' },
  { id: 'formal', organization: 'The Emily Post Institute', title: 'The Formal Place Setting', url: 'https://emilypost.com/advice/formal-place-setting', note: 'Contemporary reference for a multi-course setting, fish utensils, butter spreader, glassware and dessert service. The menu determines the pieces; dessert utensils may arrive with dessert. Consulted November 7, 2026.' },
  { id: 'table', organization: 'The Emily Post Institute', title: 'Proper Table Setting 101', url: 'https://emilypost.com/advice/table-setting-guides', note: 'Basic, informal, and formal place settings. A reference for the original interactive diagram.' },
  { id: 'manners', organization: 'The Emily Post Institute', title: 'Top Table Manners Tips', url: 'https://emilypost.com/advice/top-table-manners-tips', note: 'Consideration, pacing, phone use, and conversation at the table.' },
  { id: 'tcu', organization: 'Texas Christian University · Career & Professional Development', title: 'Dining Etiquette', url: 'https://careers.tcu.edu/students/career-tools/dining-etiquette/', note: 'Practical guidance for meals in professional and recruiting settings.' },
  { id: 'vt', organization: 'Virginia Tech · Career and Professional Development', title: 'Career Planning Guide 2024–2025', url: 'https://www.vt.edu/content/dam/career_vt_edu/assets/docs/career-planning-guide/2024-2025-career-planning-guide.pdf', note: 'See “Dining Etiquette” on page 18 for passing food, using utensils, and following the host. PDF, 13.4 MB.' },
  { id: 'wmu', organization: 'Western Michigan University · Career and Student Employment Services', title: 'Professional Etiquette', url: 'https://wmich.edu/career/etiquette', note: 'Introductions, appropriate preparation, host cues, phone use, and pacing at professional meals.' },
];

export function getResource(id: string): Resource {
  const resource = resources.find((item) => item.id === id);
  if (!resource) throw new Error(`Unknown educational reference: ${id}`);
  return resource;
}
