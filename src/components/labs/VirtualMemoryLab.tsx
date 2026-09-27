import { useEffect, useMemo, useRef, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { FaPlay, FaPause, FaStepForward, FaUndo, FaMemory } from 'react-icons/fa';

export type ReplacementPolicy = 'fifo' | 'lru' | 'opt';

export interface MemoryAccess {
  page: number;
  tlbHit: boolean;
  pageFault: boolean;
  evictedPage: number | null;
  framesAfter: (number | null)[];
  tlbAfter: number[];
  note: string;
}

export interface MemorySimResult {
  accesses: MemoryAccess[];
  tlbHits: number;
  pageFaults: number;
}

const MAX_REFS = 24;

function simulateMemory(refs: number[], frames: number, tlbSize: number, policy: ReplacementPolicy): MemorySimResult {
  const framesState: (number | null)[] = Array(frames).fill(null);
  // For FIFO: insertion order of resident pages. For LRU: recency order (oldest first).
  let order: number[] = [];
  let tlb: number[] = [];
  const accesses: MemoryAccess[] = [];
  let tlbHits = 0;
  let pageFaults = 0;

  for (let stepIdx = 0; stepIdx < refs.length; stepIdx += 1) {
    const page = refs[stepIdx];
    const tlbHit = tlb.includes(page);
    let pageFault = false;
    let evictedPage: number | null = null;
    let note: string;

    if (tlbHit) {
      tlbHits += 1;
      // Simplification: a TLB hit implies the page is resident.
      if (policy === 'lru') {
        order = [...order.filter((p) => p !== page), page];
      }
      note = `TLB HIT for page ${page} — translated instantly, no page-table walk.`;
    } else {
      const frameIdx = framesState.indexOf(page);
      if (frameIdx !== -1) {
        // TLB miss but page resident (page hit).
        if (policy === 'lru') {
          order = [...order.filter((p) => p !== page), page];
        }
        tlb = [...tlb, page].slice(-tlbSize);
        note = `TLB miss, PAGE HIT for page ${page} — found in frame ${frameIdx}, cached into TLB.`;
      } else {
        // Page fault.
        pageFault = true;
        pageFaults += 1;
        const emptyIdx = framesState.indexOf(null);
        if (emptyIdx !== -1) {
          framesState[emptyIdx] = page;
          order.push(page);
          note = `PAGE FAULT for page ${page} — loaded from disk into free frame ${emptyIdx}.`;
        } else {
          // Optimal: evict the resident page used farthest in the future
          // (or never again). Needs future knowledge — theoretical baseline.
          let victim = order[0];
          let farthest = -1;
          for (const candidate of order) {
            const nextUse = refs.indexOf(candidate, stepIdx + 1);
            const distance = nextUse === -1 ? Number.MAX_SAFE_INTEGER : nextUse;
            if (distance > farthest) {
              farthest = distance;
              victim = candidate;
            }
          }
          evictedPage = victim;
          const victimIdx = framesState.indexOf(victim);
          framesState[victimIdx] = page;
          order = [...order.filter((p) => p !== victim), page];
          tlb = tlb.filter((p) => p !== victim);
          note = `PAGE FAULT for page ${page} — no free frame, ${policy.toUpperCase()} evicts page ${victim} from frame ${victimIdx}.`;
        }
        tlb = [...tlb, page].slice(-tlbSize);
      }
    }

    accesses.push({
      page,
      tlbHit,
      pageFault,
      evictedPage,
      framesAfter: [...framesState],
      tlbAfter: [...tlb],
      note,
    });
  }

  return { accesses, tlbHits, pageFaults };
}

const POLICIES: { id: ReplacementPolicy; label: string; desc: string }[] = [
  { id: 'fifo', label: 'FIFO', desc: 'Evict the page that has been in memory longest.' },
  { id: 'lru', label: 'LRU', desc: 'Evict the page used least recently.' },
  { id: 'opt', label: 'Optimal', desc: 'Evict the page needed farthest in the future. Requires knowing the future — a theoretical baseline real systems can only approximate.' },
];

const PRESETS: { label: string; refs: string }[] = [
  { label: 'Classic 7 0 1…', refs: '7 0 1 2 0 3 0 4 2 3 0 3 2' },
  { label: 'Scan 1 2 3 4 5…', refs: '1 2 3 4 1 2 5 1 2 3 4 5' },
  { label: 'Belady demo string', refs: '1 2 3 4 1 2 5 1 2 3 4 5' },
];

const PATH_STAGES = ['Virtual Address', 'Page #', 'TLB', 'Page Table', 'Frame', 'Physical Memory'];

export default function VirtualMemoryLab() {
  const [refInput, setRefInput] = useState('7 0 1 2 0 3 0 4');
  const [frames, setFrames] = useState(3);
  const [tlbSize, setTlbSize] = useState(2);
  const [policy, setPolicy] = useState<ReplacementPolicy>('fifo');
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [inputError, setInputError] = useState('');
  const timer = useRef<NodeJS.Timeout | null>(null);

  const parseRefs = (raw: string): { refs: number[] } | { error: string } => {
    const tokens = raw.trim().split(/[\s,]+/).filter(Boolean);
    if (tokens.length === 0) return { error: 'Enter at least one page number.' };
    if (tokens.length > MAX_REFS) return { error: `Keep it to ${MAX_REFS} references so every step stays readable.` };
    const refs: number[] = [];
    for (const t of tokens) {
      if (!/^\d+$/.test(t)) return { error: `"${t}" is not a page number. Use digits 0–9 separated by spaces.` };
      const n = parseInt(t, 10);
      if (n > 9) return { error: `Page ${n} is out of range. Use pages 0–9.` };
      refs.push(n);
    }
    return { refs };
  };

  const parsed = useMemo(() => parseRefs(refInput), [refInput]);
  const refs = 'refs' in parsed ? parsed.refs : [];

  const result = useMemo(
    () => simulateMemory(refs, frames, tlbSize, policy),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refs.join(','), frames, tlbSize, policy]
  );

  useEffect(() => {
    setStep(0);
    setPlaying(false);
  }, [refInput, frames, tlbSize, policy]);

  useEffect(() => {
    if (!playing) return;
    if (step >= result.accesses.length) {
      setPlaying(false);
      return;
    }
    timer.current = setTimeout(() => setStep((s) => Math.min(s + 1, result.accesses.length)), 900 / speed);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [playing, step, speed, result.accesses.length]);

  useEffect(() => {
    setInputError('error' in parsed ? parsed.error : '');
  }, [parsed]);

  // Belady anomaly check: FIFO faults with 3 vs 4 frames on the same string.
  // (TLB size does not affect fault counts — only hit statistics.)
  const belady = useMemo(() => {
    if (refs.length === 0) return null;
    const f3 = simulateMemory(refs, 3, tlbSize, 'fifo').pageFaults;
    const f4 = simulateMemory(refs, 4, tlbSize, 'fifo').pageFaults;
    return { f3, f4, anomaly: f4 > f3 };
  }, [refs.join(','), tlbSize]); // eslint-disable-line react-hooks/exhaustive-deps

  const current: MemoryAccess | null = step < result.accesses.length ? result.accesses[step] : null;
  const lastDone: MemoryAccess | null = step > 0 ? result.accesses[step - 1] : null;
  const shownFrames = lastDone ? lastDone.framesAfter : Array(frames).fill(null);
  const shownTlb = lastDone ? lastDone.tlbAfter : [];

  const doneCount = Math.min(step, result.accesses.length);
  const tlbHitsSoFar = result.accesses.slice(0, doneCount).filter((a) => a.tlbHit).length;
  const faultsSoFar = result.accesses.slice(0, doneCount).filter((a) => a.pageFault).length;

  // Page table: every page referenced so far → resident frame or invalid.
  const seenPages = useMemo(() => {
    const set = new Set<number>();
    result.accesses.slice(0, doneCount).forEach((a) => set.add(a.page));
    return Array.from(set).sort((a, b) => a - b);
  }, [result, doneCount]);

  const frameOf = (page: number): number | null => {
    const idx = shownFrames.indexOf(page);
    return idx === -1 ? null : idx;
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <GlassCard>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ref-string" className="block text-sm font-medium mb-1">
              Reference string (pages 0–9)
            </label>
            <input
              id="ref-string"
              type="text"
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              placeholder="e.g. 7 0 1 2 0 3 0 4"
              spellCheck={false}
              autoCapitalize="off"
              className="w-full px-4 py-2 rounded-xl glass font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              aria-describedby={inputError ? 'ref-error' : undefined}
              aria-invalid={!!inputError}
            />
            {inputError ? (
              <p id="ref-error" className="text-sm text-red-500 mt-1" role="alert">
                {inputError}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">
                {refs.length} references · separate with spaces or commas
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setRefInput(p.refs)}
                  className="px-3 py-1.5 glass rounded-full text-xs hover:bg-primary/10 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Replacement policy">
              {POLICIES.map((p) => (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={policy === p.id}
                  onClick={() => setPolicy(p.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    policy === p.id ? 'bg-primary text-white' : 'glass hover:bg-primary/10'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{POLICIES.find((p) => p.id === policy)?.desc}</p>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                Frames
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={frames}
                  onChange={(e) => setFrames(Math.max(1, Math.min(6, parseInt(e.target.value, 10) || 1)))}
                  className="w-16 px-2 py-1 rounded-lg glass text-center font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Number of frames, 1 to 6"
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                TLB entries
                <input
                  type="number"
                  min={1}
                  max={4}
                  value={tlbSize}
                  onChange={(e) => setTlbSize(Math.max(1, Math.min(4, parseInt(e.target.value, 10) || 1)))}
                  className="w-16 px-2 py-1 rounded-lg glass text-center font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Number of TLB entries, 1 to 4"
                />
              </label>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Playback */}
      <GlassCard>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() =>
              step >= result.accesses.length ? (setStep(0), setPlaying(true)) : setPlaying(!playing)
            }
            disabled={result.accesses.length === 0}
            className="px-5 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition flex items-center gap-2 disabled:opacity-50"
            aria-label={playing ? 'Pause simulation' : 'Play simulation'}
          >
            {playing ? <FaPause aria-hidden="true" /> : <FaPlay aria-hidden="true" />}
            {playing ? 'Pause' : step >= result.accesses.length && result.accesses.length > 0 ? 'Replay' : 'Play'}
          </button>
          <button
            onClick={() => {
              setPlaying(false);
              setStep((s) => Math.min(s + 1, result.accesses.length));
            }}
            disabled={step >= result.accesses.length}
            className="px-4 py-2 glass rounded-full text-sm hover:bg-primary/10 transition disabled:opacity-50 flex items-center gap-2"
          >
            <FaStepForward aria-hidden="true" /> Step
          </button>
          <button
            onClick={() => {
              setPlaying(false);
              setStep(0);
            }}
            className="px-4 py-2 glass rounded-full text-sm hover:bg-primary/10 transition flex items-center gap-2"
          >
            <FaUndo aria-hidden="true" /> Reset
          </button>
          <label className="flex items-center gap-2 text-sm ml-auto">
            Speed
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="px-2 py-1.5 rounded-lg glass text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
              aria-label="Playback speed"
            >
              <option value={0.5}>0.5×</option>
              <option value={1}>1×</option>
              <option value={2}>2×</option>
            </select>
          </label>
        </div>
        <p className="mt-2 text-sm" aria-live="polite">
          Access <strong className="font-mono">{doneCount} / {result.accesses.length}</strong>
          {current && (
            <>
              {' '}— next: page <strong className="font-mono">{current.page}</strong>
            </>
          )}
          {step >= result.accesses.length && result.accesses.length > 0 && (
            <span className="text-green-600 font-semibold"> — trace complete.</span>
          )}
        </p>
      </GlassCard>

      {/* Translation path */}
      <GlassCard>
        <h2 className="font-bold mb-1 flex items-center gap-2">
          <FaMemory className="text-primary" aria-hidden="true" /> Address translation path
        </h2>
        <p className="text-xs text-muted-foreground mb-3">
          A TLB hit ends the walk early. A TLB miss still needs the page table — and only a missing page triggers a
          fault. They are three different outcomes.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch gap-1" aria-hidden="true">
          {PATH_STAGES.map((stage, i) => {
            const active =
              lastDone !== null &&
              ((stage === 'TLB') ||
                (stage === 'Page Table' && !lastDone.tlbHit) ||
                (stage === 'Frame' && !lastDone.pageFault) ||
                (stage === 'Physical Memory' && !lastDone.pageFault) ||
                ((stage === 'Virtual Address' || stage === 'Page #') && true));
            return (
              <div key={stage} className="flex-1 flex sm:items-center flex-col sm:flex-row gap-1">
                <div
                  className={`flex-1 text-center text-xs font-semibold px-2 py-2 rounded-lg border transition ${
                    active ? 'border-primary bg-primary/10 text-primary' : 'glass text-muted-foreground'
                  }`}
                >
                  {stage}
                </div>
                {i < PATH_STAGES.length - 1 && (
                  <span className="text-center text-muted-foreground text-xs px-0.5 rotate-90 sm:rotate-0">→</span>
                )}
              </div>
            );
          })}
        </div>
        {lastDone && (
          <p className="mt-3 text-sm p-2 rounded-lg bg-primary/5" aria-live="polite">
            <span className="font-semibold">What just happened: </span>
            {lastDone.note}
          </p>
        )}
      </GlassCard>

      {/* Frames + TLB + page table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard>
          <h3 className="font-bold text-sm mb-2">Physical frames ({frames})</h3>
          <div className="space-y-1.5">
            {shownFrames.map((f, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg font-mono text-sm flex justify-between border ${
                  f === null ? 'glass text-muted-foreground border-dashed' : 'bg-blue-500/10 border-blue-500/40 text-blue-700 dark:text-blue-300'
                }`}
              >
                <span>Frame {i}</span>
                <span className="font-bold">{f === null ? 'empty' : `page ${f}`}</span>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="font-bold text-sm mb-2">TLB ({tlbSize} entries)</h3>
          <div className="space-y-1.5">
            {Array.from({ length: tlbSize }).map((_, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg font-mono text-sm flex justify-between border ${
                  shownTlb[i] !== undefined
                    ? 'bg-purple-500/10 border-purple-500/40 text-purple-700 dark:text-purple-300'
                    : 'glass text-muted-foreground border-dashed'
                }`}
              >
                <span>Entry {i}</span>
                <span className="font-bold">{shownTlb[i] !== undefined ? `page ${shownTlb[i]}` : '—'}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Simplified FIFO replacement, newest last.</p>
        </GlassCard>
        <GlassCard>
          <h3 className="font-bold text-sm mb-2">Page table</h3>
          {seenPages.length === 0 ? (
            <p className="text-xs text-muted-foreground">No pages referenced yet — press Play or Step.</p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {seenPages.map((p) => {
                const fr = frameOf(p);
                return (
                  <div key={p} className="px-3 py-1.5 rounded-lg font-mono text-xs flex justify-between glass">
                    <span>page {p}</span>
                    <span className={fr === null ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>
                      {fr === null ? 'invalid (on disk)' : `→ frame ${fr}`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Access log + stats */}
      <GlassCard>
        <h2 className="font-bold mb-2">Access log</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-center text-sm">
          <div className="p-2 glass rounded-xl">
            <p className="font-mono font-bold">{doneCount}</p>
            <p className="text-xs text-muted-foreground">Accesses</p>
          </div>
          <div className="p-2 glass rounded-xl">
            <p className="font-mono font-bold text-purple-600">{tlbHitsSoFar}</p>
            <p className="text-xs text-muted-foreground">
              TLB hits{doneCount > 0 ? ` (${Math.round((tlbHitsSoFar / doneCount) * 100)}%)` : ''}
            </p>
          </div>
          <div className="p-2 glass rounded-xl">
            <p className="font-mono font-bold text-red-500">{faultsSoFar}</p>
            <p className="text-xs text-muted-foreground">Page faults</p>
          </div>
          <div className="p-2 glass rounded-xl">
            <p className="font-mono font-bold text-green-600">{doneCount - faultsSoFar}</p>
            <p className="text-xs text-muted-foreground">Page hits</p>
          </div>
        </div>
        <ul className="space-y-1 max-h-64 overflow-y-auto pr-1">
          {result.accesses.map((a, i) => {
            const future = i >= doneCount;
            const label = a.tlbHit ? 'TLB HIT' : a.pageFault ? 'PAGE FAULT' : 'TLB miss · page hit';
            const style = a.tlbHit
              ? 'bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300'
              : a.pageFault
                ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
                : 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400';
            return (
              <li
                key={i}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs flex flex-wrap gap-2 items-center ${
                  future ? 'glass text-muted-foreground opacity-60' : style
                }`}
              >
                <span className="font-bold">
                  #{i + 1} page {a.page}
                </span>
                <span className="px-2 py-0.5 rounded-full border border-current text-[10px] font-bold">{label}</span>
                {a.evictedPage !== null && <span>evicts {a.evictedPage}</span>}
              </li>
            );
          })}
        </ul>
      </GlassCard>
      {/* Belady anomaly check */}
      <GlassCard className="border-2 border-primary/20">
        <h2 className="font-bold mb-1">Belady anomaly check (FIFO)</h2>
        <p className="text-xs text-muted-foreground mb-3">
          More frames should mean fewer faults — but FIFO can paradoxically fault{' '}
          <em>more</em> with extra memory. This panel replays your current reference string with 3 vs 4 frames.
          Try the “Belady demo string” preset: 1 2 3 4 1 2 5 1 2 3 4 5.
        </p>
        {belady ? (
          <div className="grid grid-cols-2 gap-2 text-center text-sm" aria-live="polite">
            <div className="p-3 glass rounded-xl">
              <p className="font-mono text-xl font-bold">{belady.f3}</p>
              <p className="text-xs text-muted-foreground">FIFO faults · 3 frames</p>
            </div>
            <div className="p-3 glass rounded-xl">
              <p className="font-mono text-xl font-bold">{belady.f4}</p>
              <p className="text-xs text-muted-foreground">FIFO faults · 4 frames</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Enter a reference string above to run the check.</p>
        )}
        {belady && (
          <p
            className={`mt-2 text-sm p-2 rounded-lg ${
              belady.anomaly
                ? 'bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300'
                : 'bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400'
            }`}
            role="status"
          >
            {belady.anomaly
              ? `Anomaly present: 4 frames fault more (${belady.f4}) than 3 frames (${belady.f3}). FIFO does not have the stack property — LRU and Optimal never behave this way.`
              : `No anomaly here: 4 frames fault ${belady.f4} vs ${belady.f3} with 3 frames. Load the Belady demo string to see the anomaly appear.`}
          </p>
        )}
      </GlassCard>
    </div>
  );
}
