import { useRef, useState } from 'react';
import LearningSource from './LearningSource';
import {useHydrated} from '../lib/use-hydrated';
import { knowledgeQuestions, reflectionQuestions } from '../data/learning';

export default function LearningSurvey() {
  const hydrated=useHydrated();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [missing, setMissing] = useState(false);
  const summary = useRef<HTMLDivElement>(null);
  const error = useRef<HTMLDivElement>(null);
  const unanswered = knowledgeQuestions.filter((question) => answers[question.id] === undefined);
  const showMissing = missing && unanswered.length > 0;
  const score = knowledgeQuestions.filter((question) => answers[question.id] === String(question.correct)).length;
  function update(id: string, value: string) { setAnswers((previous) => ({ ...previous, [id]: value })); setSubmitted(false); }
  function submit() {
    if (unanswered.length > 0) {
      setMissing(true);
      requestAnimationFrame(() => error.current?.focus());
      return;
    }
    setMissing(false); setSubmitted(true);
    requestAnimationFrame(() => summary.current?.focus());
  }
  function reset() { setAnswers({}); setSubmitted(false); setMissing(false); }

  return <form className="learning-survey" onSubmit={(event) => event.preventDefault()} noValidate>
    <div className="survey-introduction"><h2>Your learning notes.</h2><p>Answer the first six questions to check your understanding. The last four are optional reflections, with no right or wrong answer.</p><p className="privacy-note">Your answers stay on this page and are never sent to a server. Clear them or reload to start again.</p><div className="survey-progress"><label htmlFor="knowledge-progress">{6 - unanswered.length} of 6 knowledge questions answered</label><progress id="knowledge-progress" value={6 - unanswered.length} max={6}/></div><nav aria-label="Survey sections"><a href="#q1">Check your understanding</a><a href="#q7">Notice your confidence</a><a href="#q9">Choose your next step</a></nav></div><div className="survey-body">
    {showMissing && <div ref={error} tabIndex={-1} className="form-message" role="alert"><h3>A few answers are still missing.</h3><p>Answer each of the six knowledge questions before checking your understanding.</p><ul>{unanswered.map((q) => <li key={q.id}><a href={`#${q.id}-option-0`}>{q.question}</a></li>)}</ul></div>}
    {knowledgeQuestions.map((question, i) => {
      const invalid = showMissing && answers[question.id] === undefined;
      const description = invalid ? `${question.id}-error` : submitted ? `${question.id}-feedback` : undefined;
      return <fieldset disabled={!hydrated} id={question.id} key={question.id} className="survey-question" aria-invalid={invalid || undefined} aria-describedby={description}>
        <legend><span>{String(i + 1).padStart(2, '0')}</span>{question.question}</legend>
        <div className="survey-options">{question.options.map((option, n) => <label key={option}><input id={`${question.id}-option-${n}`} type="radio" name={question.id} value={n} required aria-invalid={invalid || undefined} aria-describedby={description} checked={answers[question.id] === String(n)} onChange={(event) => update(question.id, event.target.value)} /><span>{option}</span></label>)}</div>
        {invalid && <p id={`${question.id}-error`} className="field-error">Select one answer for this question.</p>}
        {submitted && <div id={`${question.id}-feedback`} className="survey-feedback"><strong>{answers[question.id] === String(question.correct) ? 'That’s right.' : `The recommended answer: ${question.options[question.correct]}.`}</strong><p>{question.explanation} <a href={`/chapters/${question.chapter}/`}>Review the chapter.</a></p><LearningSource question={question.id}/></div>}
      </fieldset>;
    })}
    <div className="survey-divider"><h2>Notice the difference.</h2><p>Learning is also noticing what feels different. These questions are optional.</p></div>
    {reflectionQuestions.map((question, i) => <fieldset disabled={!hydrated} id={question.id} key={question.id} className="survey-question"><legend><span>{String(i + 7).padStart(2, '0')}</span>{question.question}</legend>{question.type === 'confidence' ? <div className="confidence-options">{['Not yet confident', 'A little confident', 'Fairly confident', 'Very confident'].map((label) => <label key={label}><input type="radio" name={question.id} checked={answers[question.id] === label} onChange={() => update(question.id, label)} /><span>{label}</span></label>)}</div> : <label className="reflection-input"><span className="sr-only">{question.question}</span><textarea name={question.id} rows={4} maxLength={2000} value={answers[question.id] ?? ''} onChange={(event) => update(question.id, event.target.value)} placeholder="A thought to take with you…" /><span className="input-hint">Up to 2,000 characters. For your own reflection.</span></label>}</fieldset>)}
    <noscript><p className="context-note">You can read all ten questions without JavaScript. Entering answers and automatic feedback need JavaScript; revisit the linked chapters to check your understanding.</p></noscript>
    <div className="survey-actions"><button disabled={!hydrated} type="button" className="button" onClick={submit}>Check my understanding</button><button disabled={!hydrated} type="button" className="text-button" onClick={reset}>Clear my answers</button></div>
    {submitted && <div ref={summary} tabIndex={-1} className="survey-summary" role="status"><h2>Your next dinner,<br /><em>with a little more confidence.</em></h2><p>You answered <strong>{score} of 6</strong> knowledge questions correctly. Read the explanations above, revisit any chapter you need, and take one practical habit into your next meal.</p><a href="/practice/" className="text-link">Practice with the dinner experience</a></div>}
  </div></form>;
}
