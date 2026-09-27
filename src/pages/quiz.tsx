import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes, FaArrowRight, FaRedo, FaLightbulb } from 'react-icons/fa';
import { INITIAL_QUESTIONS, QUIZ_TOPIC } from '@/data/quizBank';
import { questionService } from '@/features/questions/question.service';
import { calculateScore, deriveGenerationMode, percentageOf } from '@/features/quiz/quiz.service';
import { useResults } from '@/features/results/useResults';
import GeneratorPanel from '@/components/quiz/GeneratorPanel';
import type { QuizAnswerRecord } from '@/features/quiz/quiz.types';
import type { QuizPhase } from '@/features/quiz/quiz.types';
import type { QuizQuestion } from '@/features/questions/question.types';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function Quiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>(INITIAL_QUESTIONS);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<QuizPhase>('answering');
  const [answers, setAnswers] = useState<Record<string, QuizAnswerRecord>>({});
  const [notice, setNotice] = useState('');
  const [showReview, setShowReview] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [practiceRequest, setPracticeRequest] = useState<{ topic: string; nonce: number } | null>(null);
  const { saveStatus, save, reset: resetSave } = useResults();

  const total = questions.length;
  const q = questions[Math.min(idx, total - 1)];
  const record: QuizAnswerRecord | undefined = q ? answers[q.id] : undefined;
  const answeredCount = Object.keys(answers).length;
  const score = useMemo(() => calculateScore(questions, Object.values(answers)), [questions, answers]);
  const progress = total === 0 ? 0 : Math.round((answeredCount / total) * 100);

  const checkAnswer = () => {
    if (!q || selected === null || phase !== 'answering') return;
    if (answers[q.id]) return; // already checked — no duplicate submissions
    const correct = selected === q.correctAnswer;
    setAnswers((prev) => ({ ...prev, [q.id]: { questionId: q.id, selected, correct } }));
    setNotice('');
    setPhase('feedback');
  };

  const next = () => {
    if (phase !== 'feedback') return;
    if (idx + 1 >= total) {
      setPhase('results');
      setShowReview(false);
    } else {
      setIdx(idx + 1);
      setSelected(null);
      setShowHint(false);
      setPhase('answering');
    }
  };

  const retry = () => {
    setIdx(0);
    setSelected(null);
    setAnswers({});
    setNotice('');
    setShowReview(false);
    setShowHint(false);
    resetSave();
    setPhase('answering');
  };

  const addGenerated = (fresh: QuizQuestion[]) => {
    setQuestions((prev) => {
      const withShuffled = fresh.map((item) => questionService.shuffleOptions(item));
      // Continue learning at the first new question.
      setIdx(prev.length);
      setSelected(null);
      setShowHint(false);
      setShowReview(false);
      resetSave();
      setPhase('answering');
      return [...prev, ...withShuffled];
    });
  };

  const weakTopics = useMemo(() => {
    const topics: string[] = [];
    for (const qid of Object.keys(answers)) {
      const rec = answers[qid];
      if (!rec.correct) {
        const qq = questions.find((x) => x.id === qid);
        if (qq && !topics.includes(qq.topic)) topics.push(qq.topic);
      }
    }
    return topics;
  }, [answers, questions]);

  const percentage = percentageOf(score, total);
  const incorrect = answeredCount - score;

  // Persist the attempt once per completed run via the results hook.
  useEffect(() => {
    if (phase !== 'results' || total === 0) return;
    const key = `${Object.keys(answers).sort().join(',')}|${total}`;
    void save(
      {
        score,
        totalQuestions: total,
        percentage: percentageOf(score, total),
        generationMode: deriveGenerationMode(questions),
        answers: Object.values(answers),
      },
      key
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const sourceCounts = useMemo(() => {
    const counts = { local: 0, ai: 0, author: 0 };
    for (const qq of questions) counts[qq.source] += 1;
    return counts;
  }, [questions]);
  const sourceLabels: { key: 'local' | 'ai' | 'author'; label: string }[] = [
    { key: 'author', label: '📝 Author-created' },
    { key: 'local', label: '⚡ Local' },
    { key: 'ai', label: '✨ AI Generated' },
  ];

  const resultMessage =
    percentage === 100
      ? 'Perfect score — outstanding!'
      : percentage >= 67
        ? 'Great work! Review the questions below to strengthen your understanding.'
        : percentage >= 34
          ? 'Good effort — review the explanations and try again.'
          : 'Keep learning and try again — every expert started here.';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-1">Interactive Quiz</h1>
      <p className="text-muted-foreground mb-5">Test your knowledge of Operating Systems</p>

      {phase !== 'results' && q && (
        <>
          {/* Header: counter + progress */}
          <div className="mb-4">
            <div className="flex items-baseline justify-between text-sm mb-1">
              <span className="font-semibold" aria-live="polite">
                Question {idx + 1} of {total}
              </span>
              <span className="text-muted-foreground" aria-live="polite">
                {answeredCount} of {total} answered · Score {score}
              </span>
            </div>
            <div
              className="h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Quiz progress"
            >
              <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.2 }}
              className="glass p-5 sm:p-6 rounded-2xl border border-white/20"
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                  Question {idx + 1}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full glass text-muted-foreground">
                  {q.topic} · {q.difficulty}
                </span>
                {q.type === 'true_false' && (
                  <span className="text-xs px-2.5 py-1 rounded-full glass text-muted-foreground">True / False</span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-semibold">{q.question}</h2>

              <div className="mt-4 space-y-2" role="group" aria-label={`Answers for question ${idx + 1}`}>
                {q.options.map((opt, i) => {
                  const isSelected = selected === opt;
                  const record = answers[q.id];
                  const locked = phase === 'feedback';
                  const isCorrectOpt = opt === q.correctAnswer;
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        if (locked) return;
                        setSelected(opt);
                        setNotice('');
                      }}
                      disabled={locked}
                      aria-pressed={isSelected}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition flex items-center gap-3 min-h-[48px] ${
                        locked && isCorrectOpt
                          ? 'bg-green-600/10 border-green-600 text-current'
                          : locked && isSelected && !isCorrectOpt
                            ? 'bg-red-600/10 border-red-600 text-current'
                            : isSelected
                              ? 'bg-primary text-white border-primary'
                              : 'glass border-white/20 hover:border-primary/60 hover:bg-primary/5'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 shrink-0 rounded-full border flex items-center justify-center text-xs font-bold ${
                          (locked && isCorrectOpt) || (!locked && isSelected)
                            ? 'border-current'
                            : 'border-white/30 text-muted-foreground'
                        }`}
                        aria-hidden="true"
                      >
                        {locked && isCorrectOpt ? <FaCheck /> : locked && isSelected ? <FaTimes /> : LETTERS[i] ?? i + 1}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {locked && isCorrectOpt && (
                        <span className="text-xs font-bold text-green-600 dark:text-green-400">✓ Correct</span>
                      )}
                      {locked && isSelected && !isCorrectOpt && (
                        <span className="text-xs font-bold text-red-500">✗ Yours</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Hint */}
              {!record && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  aria-expanded={showHint}
                  className="mt-3 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:underline"
                >
                  <FaLightbulb aria-hidden="true" /> {showHint ? 'Hide hint' : 'Need a hint?'}
                </button>
              )}
              {showHint && !record && (
                <p className="mt-1 text-xs p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300">
                  💡 {q.hint}
                </p>
              )}

              {notice && (
                <p className="mt-3 text-sm text-amber-600 dark:text-amber-400" role="alert">
                  {notice}
                </p>
              )}

              {/* Feedback */}
              <AnimatePresence>
                {phase === 'feedback' && record && (
                  <motion.div
                    key={`fb-${q.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-4 p-4 rounded-xl border text-sm ${
                      record.correct
                        ? 'bg-green-500/10 border-green-500/40'
                        : 'bg-red-500/10 border-red-500/40'
                    }`}
                    aria-live="polite"
                  >
                    <p className={`font-bold flex items-center gap-2 ${record.correct ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                      {record.correct ? (
                        <>
                          <FaCheck aria-hidden="true" /> Correct!
                        </>
                      ) : (
                        <>
                          <FaTimes aria-hidden="true" /> Not quite.
                        </>
                      )}
                    </p>
                    {!record.correct && (
                      <p className="mt-1">
                        The correct answer is <strong>{q.correctAnswer}</strong>.
                      </p>
                    )}
                    <p className="mt-2 text-muted-foreground">
                      <strong>Why?</strong> {q.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-4 flex flex-wrap gap-2">
                {phase === 'answering' ? (
                  <button
                    onClick={() => {
                      if (selected === null) {
                        setNotice('Please select an answer first.');
                        return;
                      }
                      checkAnswer();
                    }}
                    className="px-6 py-2.5 bg-primary text-white rounded-full hover:bg-primary-dark transition font-medium min-h-[44px]"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={next}
                    className="px-6 py-2.5 bg-primary text-white rounded-full hover:bg-primary-dark transition font-medium flex items-center gap-2 min-h-[44px]"
                  >
                    {idx + 1 >= total ? 'See Results' : 'Next Question'} <FaArrowRight aria-hidden="true" />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {/* Results */}
      {phase === 'results' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass p-6 rounded-2xl border border-white/20 text-center">
            <h2 className="text-2xl font-bold">Quiz Complete!</h2>
            <p className="text-muted-foreground text-sm mt-1">You scored</p>
            <p className="text-4xl font-extrabold text-primary mt-1" aria-live="polite">
              {score} / {total}
            </p>
            <p className="text-xl font-bold mt-1">{percentage}%</p>
            <div className="mt-3 flex justify-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 font-semibold text-green-600 dark:text-green-400">
                <FaCheck aria-hidden="true" /> {score} Correct
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-red-500">
                <FaTimes aria-hidden="true" /> {incorrect} Incorrect
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-3">{resultMessage}</p>
            {(saveStatus === 'saving' || saveStatus === 'saved' || saveStatus === 'failed') && (
              <p
                className={`text-xs mt-2 ${
                  saveStatus === 'saved'
                    ? 'text-green-600 dark:text-green-400'
                    : saveStatus === 'failed'
                      ? 'text-red-500'
                      : 'text-muted-foreground'
                }`}
                aria-live="polite"
              >
                {saveStatus === 'saving' && 'Saving progress…'}
                {saveStatus === 'saved' && 'Progress saved ✓'}
                {saveStatus === 'failed' && 'Could not save progress — your score above is still correct.'}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2" aria-label="Question sources">
              Question Sources:{' '}
              {sourceLabels
                .filter((s) => sourceCounts[s.key] > 0)
                .map((s) => `${s.label} ${sourceCounts[s.key]}`)
                .join(' · ')}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setShowReview(!showReview)}
                aria-expanded={showReview}
                className="px-6 py-2.5 glass rounded-full hover:bg-primary/10 transition text-sm font-medium min-h-[44px]"
              >
                {showReview ? 'Hide Review' : 'Review Answers'}
              </button>
              <button
                onClick={retry}
                className="px-6 py-2.5 glass rounded-full hover:bg-primary/10 transition text-sm font-medium flex items-center gap-2 min-h-[44px]"
              >
                <FaRedo aria-hidden="true" /> Try Again
              </button>
            </div>
          </div>

          {/* Weak-area practice */}
          {weakTopics.length > 0 && (
            <div className="glass p-5 rounded-2xl border border-white/20">
              <h3 className="font-bold">Want more practice?</h3>
              <p className="text-sm text-muted-foreground mt-1">You missed questions about:</p>
              <ul className="mt-1 space-y-0.5">
                {weakTopics.map((t) => (
                  <li key={t} className="text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setPracticeRequest({ topic: weakTopics[0], nonce: Date.now() })}
                className="mt-3 px-6 py-2.5 bg-primary text-white rounded-full hover:bg-primary-dark transition text-sm font-medium min-h-[44px]"
              >
                Generate Practice Questions ({weakTopics[0]})
              </button>
            </div>
          )}

          {/* Review */}
          {showReview && (
            <div className="space-y-3">
              <h3 className="font-bold text-lg">Review Your Answers</h3>
              {questions.map((qq, i) => {
                const rec = answers[qq.id];
                return (
                  <div key={qq.id} className="glass p-4 rounded-2xl border border-white/20 text-sm">
                    <p className="font-semibold">
                      {i + 1}. {qq.question}
                    </p>
                    <p className="mt-1">
                      Your answer: <span className="font-medium">{rec?.selected ?? '—'}</span>{' '}
                      {rec &&
                        (rec.correct ? (
                          <span className="font-bold text-green-600 dark:text-green-400">✓ Correct</span>
                        ) : (
                          <span className="font-bold text-red-500">✗ Incorrect</span>
                        ))}
                    </p>
                    {rec && !rec.correct && (
                      <p className="mt-0.5">
                        Correct answer: <strong className="text-green-600 dark:text-green-400">{qq.correctAnswer}</strong>
                      </p>
                    )}
                    <p className="mt-1 text-muted-foreground">
                      <strong>Explanation:</strong> {qq.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* Generator (below quiz + on results) */}
      <GeneratorPanel
        defaultTopic={QUIZ_TOPIC}
        existingQuestions={questions}
        onAdd={addGenerated}
        externalRequest={practiceRequest}
      />
    </motion.div>
  );
}
