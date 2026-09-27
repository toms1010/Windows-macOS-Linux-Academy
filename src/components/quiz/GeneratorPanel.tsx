import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaSyncAlt, FaCheck, FaTimes, FaWifi, FaBolt } from 'react-icons/fa';
import { BANK_TOPICS } from '@/data/quizBank';
import { COUNT_OPTIONS, MAX_GENERATE, questionService } from '@/features/questions/question.service';
import type { Difficulty, GenerationMode, QuizQuestion } from '@/features/questions/question.types';

interface GeneratorPanelProps {
  defaultTopic: string;
  existingQuestions: QuizQuestion[];
  onAdd: (questions: QuizQuestion[], mode: GenerationMode) => void;
  /** Weak-area practice: opening request from outside the panel. */
  externalRequest?: { topic: string; nonce: number } | null;
}

const TOPIC_OPTIONS = [...BANK_TOPICS, 'Custom Topic'];
const DIFFS: { id: Difficulty | 'mixed'; label: string }[] = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'mixed', label: 'Mixed' },
];
const TYPES = [
  { id: 'multiple_choice', label: 'Multiple Choice' },
  { id: 'true_false', label: 'True / False' },
  { id: 'mixed', label: 'Mixed' },
] as const;

type GenType = (typeof TYPES)[number]['id'];
type PanelPhase = 'idle' | 'loading' | 'preview' | 'error' | 'ai-unavailable' | 'ai-offline';

export const MODE_LABEL: Record<GenerationMode, string> = {
  local: '⚡ Local',
  ai: '✨ AI',
};

export default function GeneratorPanel({ defaultTopic, existingQuestions, onAdd, externalRequest }: GeneratorPanelProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<GenerationMode>('local');
  const [topic, setTopic] = useState(defaultTopic);
  const [customTopic, setCustomTopic] = useState('');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState<Difficulty | 'mixed'>('beginner');
  const [qtype, setQtype] = useState<GenType>('multiple_choice');
  const [avoidAsked, setAvoidAsked] = useState(true);
  const [phase, setPhase] = useState<PanelPhase>('idle');
  const [preview, setPreview] = useState<QuizQuestion[]>([]);
  const [previewMode, setPreviewMode] = useState<GenerationMode>('local');
  const [note, setNote] = useState('');
  const [rotation, setRotation] = useState(0);

  const effectiveTopic = topic === 'Custom Topic' ? customTopic.trim() : topic;

  const filters = useMemo(
    () => ({
      topic: effectiveTopic,
      difficulty,
      questionType: qtype,
      existingQuestions: avoidAsked ? existingQuestions : [],
    }),
    [effectiveTopic, difficulty, qtype, avoidAsked, existingQuestions]
  );
  const available = useMemo(() => questionService.countAvailable(filters), [filters]);

  // Weak-area practice entry point: an outside request opens the panel
  // prefilled with the requested topic.
  useEffect(() => {
    if (!externalRequest || externalRequest.nonce === 0) return;
    if (TOPIC_OPTIONS.includes(externalRequest.topic)) {
      setTopic(externalRequest.topic);
    } else {
      setTopic('Custom Topic');
      setCustomTopic(externalRequest.topic);
    }
    setPhase('idle');
    setPreview([]);
    setNote('');
    setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalRequest?.nonce]);

  const runLocal = (rot: number) => {
    if (!effectiveTopic) {
      setPhase('error');
      setNote('Please choose or type a topic first.');
      return;
    }
    setPhase('loading');
    setNote('');
    window.setTimeout(() => {
      const res = questionService.generateLocal({
        ...filters,
        count,
        rotation: rot,
      });
      if (res.questions.length === 0) {
        setPhase('error');
        setNote(res.note || 'Unable to generate questions. Please try again.');
        return;
      }
      setPreview(res.questions);
      setPreviewMode('local');
      setNote(res.note);
      setPhase('preview');
    }, 450);
  };

  const runAI = async () => {
    if (!effectiveTopic) {
      setPhase('error');
      setNote('Please choose or type a topic first.');
      return;
    }
    setPhase('loading');
    setNote('');
    const res = await questionService.requestAI({
      ...filters,
      count,
      rotation,
    });
    if (res.reason === 'offline') {
      setPhase('ai-offline');
      return;
    }
    if (!res.ok || res.questions.length === 0) {
      // No silent fallback: the user explicitly chooses what happens next.
      setPhase('ai-unavailable');
      return;
    }
    setPreview(res.questions);
    setPreviewMode('ai');
    setPhase('preview');
  };

  const start = () => {
    if (phase === 'loading') return;
    if (mode === 'local') runLocal(rotation);
    else void runAI();
  };

  const regenerate = () => {
    const next = rotation + 1;
    setRotation(next);
    setPhase('idle');
    window.setTimeout(() => runLocal(next), 0);
  };

  const switchToAI = () => {
    setMode('ai');
    setPhase('idle');
    setPreview([]);
    setNote('');
  };

  const useLocalInstead = () => {
    setMode('local');
    setPhase('idle');
    setPreview([]);
    setNote('');
  };

  const close = () => {
    setOpen(false);
    setPhase('idle');
    setPreview([]);
    setNote('');
  };

  const selectClass = 'w-full glass px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-transparent';

  return (
    <div className="mt-6">
      {!open ? (
        <button
          onClick={() => {
            setTopic(defaultTopic);
            setOpen(true);
          }}
          className="w-full sm:w-auto px-6 py-3 glass rounded-full hover:bg-primary/10 transition font-medium flex items-center justify-center gap-2 min-h-[48px]"
        >
          <FaPlus aria-hidden="true" /> Generate More Questions
        </button>
      ) : (
        <div className="glass rounded-2xl p-5 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">Generate More Questions</h2>
            <button onClick={close} aria-label="Close generator" className="p-2 hover:bg-primary/10 rounded-full transition min-w-[40px] min-h-[40px]">
              <FaTimes aria-hidden="true" />
            </button>
          </div>

          {/* Mode selector */}
          <div role="radiogroup" aria-label="Generation mode" className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            <button
              role="radio"
              aria-checked={mode === 'local'}
              onClick={() => {
                setMode('local');
                setPhase('idle');
                setPreview([]);
                setNote('');
              }}
              className={`text-left p-3 rounded-xl border transition ${
                mode === 'local' ? 'border-primary bg-primary/10' : 'glass border-white/20 hover:border-primary/50'
              }`}
            >
              <span className="font-bold text-sm flex items-center gap-2">
                <FaBolt aria-hidden="true" className="text-primary" /> Local Generation
              </span>
              <span className="block text-xs text-muted-foreground mt-0.5">Fast · Offline · No AI API — uses the built-in question bank</span>
            </button>
            <button
              role="radio"
              aria-checked={mode === 'ai'}
              onClick={() => {
                setMode('ai');
                setPhase('idle');
                setPreview([]);
                setNote('');
              }}
              className={`text-left p-3 rounded-xl border transition ${
                mode === 'ai' ? 'border-primary bg-primary/10' : 'glass border-white/20 hover:border-primary/50'
              }`}
            >
              <span className="font-bold text-sm">✨ AI Generation</span>
              <span className="block text-xs text-muted-foreground mt-0.5">Dynamic · Custom · AI-powered — requires a configured AI service</span>
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-3" aria-live="polite">
            Generation Mode: {mode === 'local' ? '⚡ Local' : '✨ AI'}
          </p>

          <details className="mb-4 text-xs">
            <summary className="cursor-pointer text-primary hover:underline">Local vs AI — what&apos;s the difference?</summary>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-xs min-w-[420px]">
                <thead>
                  <tr className="border-b border-white/20 text-left">
                    <th className="p-1.5">Feature</th>
                    <th className="p-1.5">⚡ Local</th>
                    <th className="p-1.5">✨ AI</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ['Internet', 'Not required', 'Required'],
                    ['AI API', 'No', 'Yes'],
                    ['Speed', 'Very fast', 'Depends on service'],
                    ['Source', 'Built-in bank', 'Dynamically generated'],
                    ['Wording', 'Limited', 'Dynamic'],
                    ['API cost', 'None', 'May apply'],
                    ['Offline use', 'Yes', 'No'],
                    ['Quality control', 'Predefined', 'Requires validation'],
                  ].map(([f, l, a]) => (
                    <tr key={f} className="border-b border-white/10">
                      <td className="p-1.5 font-medium text-current">{f}</td>
                      <td className="p-1.5">{l}</td>
                      <td className="p-1.5">{a}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

          {/* Settings */}
          {phase !== 'preview' && phase !== 'ai-unavailable' && phase !== 'ai-offline' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="gen-topic" className="block text-sm font-medium mb-1">
                  Topic
                </label>
                <select id="gen-topic" value={topic} onChange={(e) => setTopic(e.target.value)} className={selectClass}>
                  {TOPIC_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {topic === 'Custom Topic' && (
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="e.g. CPU Scheduling"
                    aria-label="Custom topic"
                    className="mt-2 w-full glass px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                )}
              </div>
              <div>
                <label htmlFor="gen-count" className="block text-sm font-medium mb-1">
                  Number of Questions
                </label>
                <select id="gen-count" value={count} onChange={(e) => setCount(parseInt(e.target.value, 10))} className={selectClass}>
                  {COUNT_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">Up to {MAX_GENERATE} per generation.</p>
              </div>
              <div>
                <label htmlFor="gen-diff" className="block text-sm font-medium mb-1">
                  Difficulty
                </label>
                <select id="gen-diff" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty | 'mixed')} className={selectClass}>
                  {DIFFS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="gen-type" className="block text-sm font-medium mb-1">
                  Question Type
                </label>
                <select id="gen-type" value={qtype} onChange={(e) => setQtype(e.target.value as GenType)} className={selectClass}>
                  {TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {mode === 'local' && phase !== 'preview' && (
            <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
              ⚡ Local — fast generation using the built-in question bank. Works offline.
              {effectiveTopic ? ` Available fresh questions: ${available}.` : ''}
            </p>
          )}
          {mode === 'ai' && phase !== 'preview' && phase !== 'ai-unavailable' && phase !== 'ai-offline' && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                ✨ AI — generate new questions dynamically using an AI service. Requires an internet connection and a configured AI provider.
              </p>
              <label className="mt-2 flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={avoidAsked}
                  onChange={(e) => setAvoidAsked(e.target.checked)}
                  className="w-4 h-4 accent-blue-600"
                />
                Avoid Previously Asked Questions
              </label>
            </div>
          )}

          <AnimatePresence mode="wait">
            {phase === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-6 text-center" aria-live="polite">
                <div className="mx-auto w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" aria-hidden="true" />
                <p className="mt-3 font-medium">{mode === 'ai' ? 'Generating with AI...' : 'Generating questions...'}</p>
                <p className="text-xs text-muted-foreground">Analyzing topic · Creating questions · Checking duplicates · Validating answers</p>
              </motion.div>
            )}

            {phase === 'error' && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-4 text-center">
                <p className="font-medium">Unable to generate questions.</p>
                <p className="text-sm text-muted-foreground">{note || 'Please try again.'}</p>
                {available > 0 && available < count && mode === 'local' && (
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => {
                        setCount(available);
                        window.setTimeout(() => runLocal(rotation), 0);
                      }}
                      className="px-5 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary-dark transition"
                    >
                      Generate {available} Question{available === 1 ? '' : 's'}
                    </button>
                    <button
                      onClick={switchToAI}
                      className="px-5 py-2 glass rounded-full text-sm hover:bg-primary/10 transition"
                    >
                      Switch to AI
                    </button>
                  </div>
                )}
                {(available === 0 || available >= count || mode === 'ai') && (
                  <div className="mt-3 flex justify-center gap-2">
                    <button onClick={start} className="px-5 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary-dark transition">
                      Try Again
                    </button>
                    <button onClick={close} className="px-5 py-2 glass rounded-full text-sm hover:bg-primary/10 transition">
                      Cancel
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {phase === 'ai-offline' && (
              <motion.div key="ai-offline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-4 text-center">
                <FaWifi className="mx-auto text-2xl text-muted-foreground" aria-hidden="true" />
                <p className="font-medium mt-2">AI Generation requires an internet connection.</p>
                <p className="text-sm text-muted-foreground">You can use Local Generation instead — it works offline.</p>
                <div className="mt-3 flex justify-center gap-2">
                  <button onClick={useLocalInstead} className="px-5 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary-dark transition">
                    Use Local Generation
                  </button>
                  <button onClick={close} className="px-5 py-2 glass rounded-full text-sm hover:bg-primary/10 transition">
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {phase === 'ai-unavailable' && (
              <motion.div key="ai-unavailable" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-4 text-center">
                <p className="font-medium">AI generation failed.</p>
                <p className="text-sm text-muted-foreground">
                  No AI service is configured in this build. Would you like to use the local question bank instead?
                  (Local questions are always labelled ⚡ Local — never as AI.)
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <button onClick={useLocalInstead} className="px-5 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary-dark transition">
                    Use Local Questions
                  </button>
                  <button onClick={() => void runAI()} className="px-5 py-2 glass rounded-full text-sm hover:bg-primary/10 transition">
                    Try AI Again
                  </button>
                  <button onClick={close} className="px-5 py-2 glass rounded-full text-sm hover:bg-primary/10 transition">
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {phase === 'preview' && (
              <motion.div key="preview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p className="font-medium mb-1" aria-live="polite">
                  {previewMode === 'ai'
                    ? `Generated ${preview.length} question${preview.length === 1 ? '' : 's'} using AI`
                    : `Selected ${preview.length} question${preview.length === 1 ? '' : 's'} from the local question bank`}{' '}
                  <span className="text-xs font-normal text-muted-foreground">
                    ({previewMode === 'ai' ? '✨ AI' : '⚡ Local'})
                  </span>
                </p>
                {note && <p className="text-xs text-muted-foreground mb-2">{note}</p>}
                <ul className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {preview.map((qq, i) => (
                    <li key={qq.id} className="flex items-start gap-2 text-sm p-2 glass rounded-xl">
                      <FaCheck className="text-green-500 mt-1 shrink-0" aria-hidden="true" />
                      <span>
                        <span className="text-muted-foreground">Question {i + 1}: </span>
                        {qq.question}
                        <span className="block text-xs text-muted-foreground">
                          {qq.topic} · {qq.difficulty} · {qq.type === 'true_false' ? 'True/False' : 'Multiple choice'}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      onAdd(preview, previewMode);
                      close();
                    }}
                    className="px-6 py-2.5 bg-primary text-white rounded-full text-sm hover:bg-primary-dark transition font-medium min-h-[44px]"
                  >
                    Add to Quiz
                  </button>
                  {previewMode === 'local' && (
                    <button
                      onClick={regenerate}
                      className="px-6 py-2.5 glass rounded-full text-sm hover:bg-primary/10 transition flex items-center gap-2 min-h-[44px]"
                    >
                      <FaSyncAlt aria-hidden="true" /> Regenerate
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {(phase === 'idle' || phase === 'error') && (
            <div className="mt-4">
              <button
                onClick={start}
                className="px-6 py-2.5 bg-primary text-white rounded-full text-sm hover:bg-primary-dark transition font-medium min-h-[44px]"
              >
                {mode === 'ai' ? 'Generate with AI' : 'Generate Locally'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
