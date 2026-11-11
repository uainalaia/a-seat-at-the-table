import { chapterFoundations, questionReferences } from '../data/carreno';
import type { ChapterSlug } from '../data/learning';

export default function LearningSource({chapter,question}:{chapter?:ChapterSlug;question?:string}) {
  if(question) {
    const ref=questionReferences[question];
    return <p className="learning-source">{ref.locator&&<><a href="/resources/#carreno">Carreño · {ref.locator}</a><br/></>}{ref.note} <a href={`/resources/#${ref.modern}`}>Contemporary reference</a></p>;
  }
  const ref=chapterFoundations[chapter!];
  return <p className="learning-source"><a href="/resources/#carreno">Carreño · {ref.locator}</a><br/>{ref.principle} <a href={`/chapters/${chapter}/#historical-foundation`}>Context and modern application</a></p>;
}
