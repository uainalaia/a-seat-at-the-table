import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import LearningSource from './LearningSource';
import {useHydrated} from '../lib/use-hydrated';
import { scenario } from '../data/learning';
gsap.registerPlugin(useGSAP);

export default function DinnerSimulator() {
  const hydrated=useHydrated();
  const [answers, setAnswers] = useState<number[]>([]);
  const [choice, setChoice] = useState<number | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const result = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const index = answers.length;
  const done = index === scenario.length;
  const step = scenario[Math.min(index, scenario.length - 1)];
  const score = answers.reduce((sum, answer, i) => sum + Number(scenario[i].options[answer].recommended), 0);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [index]);
  useGSAP(() => {
    if (choice !== null && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(result.current, { opacity: 0.65, y: 5 }, { opacity: 1, y: 0, duration: 0.25, clearProps: 'all' });
    }
  }, { dependencies: [choice, index], scope: result, revertOnUpdate: true });

  function advance() {
    if (choice === null) return;
    setAnswers((previous) => [...previous, choice]);
    setChoice(null);
  }
  function reset() { setAnswers([]); setChoice(null); }

  return <div className="dinner-simulator">
    <aside className="dinner-itinerary"><div className="dinner-scene-still"><img src={`/images/study-${done?'thanks':['invitation','table','menu','conversation','napkin','thanks'][index]}.svg`} width="600" height="600" alt="" /></div><h2>Your evening</h2><ol>{scenario.map((item, i) => <li key={item.title} className={`${i === index ? 'current' : ''} ${i < index ? 'completed' : ''}`} aria-current={i === index ? 'step' : undefined}><span>{i + 1}</span>{item.title}</li>)}</ol><p>A fictional recruiting dinner.<br />Real skills to take with you.</p></aside>
    <section className="dinner-scene" aria-label="Dinner simulation">
      {done ? <><p className="scene-position">The evening, reflected.</p><h2 ref={heading} tabIndex={-1}>A little more ready<br /><em>for the real thing.</em></h2><p className="dinner-score">{score} of {scenario.length} recommended choices</p><p>There is something to learn from every choice. Here is what you can carry into your next professional dinner.</p><ul className="dinner-review">{scenario.map((item, i) => <li key={item.title}><h3>{item.title}</h3><p>{item.options[answers[i]].recommended ? 'You chose a considerate approach.' : 'A moment worth revisiting.'} {item.explanation}</p><a href={`/chapters/${item.chapter}/`}>Revisit the chapter</a></li>)}</ul><div className="button-row"><button type="button" className="button" onClick={reset}>Try the evening again</button><a className="text-link" href="/reflection/">Reflect on what you learned</a></div></> : <>
        <p className="scene-position">Decision {index + 1} of {scenario.length}</p><h2 ref={heading} tabIndex={-1}>{step.title}</h2><p className="scene-story">{step.scene}</p><h3 className="scene-question">{step.question}</h3>
        <div className="dinner-options">{step.options.map((option, i) => <button type="button" key={`${index}-${i}`} className={`dinner-option ${choice === i ? 'chosen' : ''}`} aria-pressed={choice === i} disabled={!hydrated || choice !== null} onClick={() => setChoice(i)}><span>{String.fromCharCode(65 + i)}</span><span>{option.text}</span></button>)}</div>
        <div ref={result} className="dinner-feedback" role="status" aria-live="polite" aria-atomic="true">{choice !== null && <><h3>{step.options[choice].recommended ? 'A thoughtful choice.' : 'A useful moment to learn.'}</h3><p>{step.options[choice].consequence}</p><p>{step.explanation}</p>{!step.options[choice].recommended && <p><strong>A more considerate approach:</strong> {step.options.find((option) => option.recommended)?.text}</p>}<LearningSource chapter={step.chapter}/><a href={`/chapters/${step.chapter}/`}>Read the related chapter</a></>}</div>
        {choice !== null && <button type="button" className="button continue-button" onClick={advance}>{index === scenario.length - 1 ? 'Reflect on the evening' : 'Continue the evening'}<svg width="22" height="18" viewBox="0 0 22 18" fill="none" aria-hidden="true"><path d="M2 9h17M13 3l6 6-6 6" stroke="currentColor" strokeWidth="1.4"/></svg></button>}
      </>}
    </section>
  </div>;
}
