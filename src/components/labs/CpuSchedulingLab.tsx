import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { FaPlay, FaPause, FaStepForward, FaUndo, FaMicrochip, FaClock, FaChartLine, FaHourglassHalf, FaExchangeAlt, FaCheckCircle } from 'react-icons/fa';

export interface ProcessInput {
  id: string;
  arrival: number;
  burst: number;
}

export interface GanttSegment {
  pid: string | null; // null = CPU idle
  start: number;
  end: number;
}

export interface ProcessMetrics {
  id: string;
  arrival: number;
  burst: number;
  completion: number;
  turnaround: number;
  waiting: number;
  response: number;
}

export interface ScheduleEvent {
  time: number;
  text: string;
  kind: 'arrival' | 'dispatch' | 'switch' | 'complete' | 'idle';
}

export interface ScheduleResult {
  segments: GanttSegment[];
  metrics: ProcessMetrics[];
  events: ScheduleEvent[];
  makespan: number;
  totalBurst: number;
  avgWaiting: number;
  avgTurnaround: number;
  avgResponse: number;
  cpuUtil: number;
  /** Number of context-switch overhead segments in the schedule. */
  csCount: number;
  /** Processes that ran to completion. */
  completedCount: number;
}

export type SchedulingAlgorithm = 'fcfs' | 'sjf' | 'rr' | 'srtf';

export type ProcessState = 'NEW' | 'READY' | 'RUNNING' | 'TERMINATED';

/** Segment pid used for context-switch overhead (never counted as burst). */
export const CS_PID = '__cs__';

const MAX_PROCESSES = 8;

function pickNextSjf(ready: { id: string; arrival: number; burst: number }[]): (typeof ready)[number] {
  return [...ready].sort((a, b) => a.burst - b.burst || a.arrival - b.arrival || a.id.localeCompare(b.id))[0];
}

function finalize(
  segments: GanttSegment[],
  firstStart: Map<string, number>,
  completion: Map<string, number>,
  inputs: ProcessInput[]
): ScheduleResult {
  const metrics: ProcessMetrics[] = inputs.map((p) => {
    const ct = completion.get(p.id) ?? p.arrival;
    const tat = ct - p.arrival;
    const wt = tat - p.burst;
    const rt = (firstStart.get(p.id) ?? p.arrival) - p.arrival;
    return { id: p.id, arrival: p.arrival, burst: p.burst, completion: ct, turnaround: tat, waiting: wt, response: rt };
  });
  const makespan = segments.length > 0 ? segments[segments.length - 1].end : 0;
  const totalBurst = inputs.reduce((s, p) => s + p.burst, 0);
  const avg = (f: (m: ProcessMetrics) => number) =>
    metrics.length > 0 ? metrics.reduce((s, m) => s + f(m), 0) / metrics.length : 0;
  return {
    segments,
    metrics,
    events: [],
    makespan,
    totalBurst,
    avgWaiting: avg((m) => m.waiting),
    avgTurnaround: avg((m) => m.turnaround),
    avgResponse: avg((m) => m.response),
    cpuUtil: makespan > 0 ? (totalBurst / makespan) * 100 : 0,
    csCount: segments.filter((s) => s.pid === CS_PID).length,
    completedCount: metrics.length,
  };
}

/**
 * Segment writer shared by all engines. Inserts a context-switch segment
 * whenever the CPU changes from one process to another (never after idle or
 * before the very first dispatch). Returns { runStart, end } so callers can
 * record first-start/completion on the post-overhead timeline.
 */
function makeRunner(segments: GanttSegment[], events: ScheduleEvent[], cs: number) {
  let lastPid: string | null = null;
  return {
    idle(start: number, end: number) {
      segments.push({ pid: null, start, end });
      lastPid = null;
    },
    run(pid: string, start: number, dur: number): { runStart: number; end: number } {
      let t = start;
      if (cs > 0 && lastPid !== null && lastPid !== pid) {
        segments.push({ pid: CS_PID, start: t, end: t + cs });
        events.push({
          time: t,
          text: `Context switch (${cs} tick${cs > 1 ? 's' : ''}): ${lastPid} → ${pid} — scheduler overhead, no process runs`,
          kind: 'switch',
        });
        t += cs;
      }
      segments.push({ pid, start: t, end: t + dur });
      lastPid = pid;
      return { runStart: t, end: t + dur };
    },
  };
}

function simulateNonPreemptive(inputs: ProcessInput[], algo: 'fcfs' | 'sjf', cs: number): ScheduleResult {
  const sorted = [...inputs].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  const segments: GanttSegment[] = [];
  const events: ScheduleEvent[] = [];
  const firstStart = new Map<string, number>();
  const completion = new Map<string, number>();
  const done = new Set<string>();
  const run = makeRunner(segments, events, cs);
  let time = 0;

  for (const p of sorted) {
    events.push({ time: p.arrival, text: `${p.id} arrives (burst ${p.burst})`, kind: 'arrival' });
  }
  events.sort((a, b) => a.time - b.time);

  while (done.size < sorted.length) {
    const ready = sorted.filter((p) => !done.has(p.id) && p.arrival <= time);
    if (ready.length === 0) {
      const nextArrival = Math.min(...sorted.filter((p) => !done.has(p.id)).map((p) => p.arrival));
      run.idle(time, nextArrival);
      events.push({ time, text: `CPU idles until t=${nextArrival} — no process has arrived`, kind: 'idle' });
      time = nextArrival;
      continue;
    }
    const next = algo === 'fcfs' ? ready[0] : pickNextSjf(ready);
    if (algo === 'sjf' && ready.length > 1) {
      const opts = ready.map((p) => `${p.id}(${p.burst})`).join(', ');
      events.push({ time, text: `SJF picks ${next.id}: shortest among ready [${opts}]`, kind: 'dispatch' });
    } else {
      events.push({ time, text: `${next.id} dispatched (runs ${next.burst} units)`, kind: segments.length > 0 ? 'switch' : 'dispatch' });
    }
    const slot = run.run(next.id, time, next.burst);
    firstStart.set(next.id, slot.runStart);
    time = slot.end;
    completion.set(next.id, time);
    done.add(next.id);
    events.push({ time, text: `${next.id} completes at t=${time}`, kind: 'complete' });
  }

  const result = finalize(segments, firstStart, completion, inputs);
  result.events = events;
  return result;
}

function simulateRR(inputs: ProcessInput[], quantum: number, cs: number): ScheduleResult {
  const sorted = [...inputs].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  const segments: GanttSegment[] = [];
  const events: ScheduleEvent[] = [];
  const firstStart = new Map<string, number>();
  const completion = new Map<string, number>();
  const remaining = new Map<string, number>(sorted.map((p) => [p.id, p.burst]));
  const inQueue = new Set<string>();
  const queue: string[] = [];
  const run = makeRunner(segments, events, cs);
  let time = 0;
  let dispatched = 0;

  const enqueueArrivals = (upto: number, excludeJustFinished?: string) => {
    for (const p of sorted) {
      if (p.id === excludeJustFinished) continue;
      if (p.arrival <= upto && remaining.get(p.id)! > 0 && !inQueue.has(p.id) && !queue.includes(p.id)) {
        queue.push(p.id);
        inQueue.add(p.id);
        events.push({ time: p.arrival, text: `${p.id} arrives and joins the ready queue`, kind: 'arrival' });
      }
    }
  };

  enqueueArrivals(0);
  while (completion.size < sorted.length) {
    if (queue.length === 0) {
      const pending = sorted.filter((p) => remaining.get(p.id)! > 0);
      const nextArrival = Math.min(...pending.map((p) => p.arrival));
      if (nextArrival > time) {
        run.idle(time, nextArrival);
        events.push({ time, text: `CPU idles until t=${nextArrival}`, kind: 'idle' });
        time = nextArrival;
      }
      enqueueArrivals(time);
      continue;
    }
    const pid = queue.shift()!;
    inQueue.delete(pid);
    const rem = remaining.get(pid)!;
    const runLen = Math.min(quantum, rem);
    dispatched += 1;
    events.push({
      time,
      text: `${pid} runs ${runLen} unit${runLen > 1 ? 's' : ''} (quantum ${quantum}, ${rem - runLen} left afterwards)`,
      kind: dispatched === 1 ? 'dispatch' : 'switch',
    });
    const slot = run.run(pid, time, runLen);
    if (!firstStart.has(pid)) firstStart.set(pid, slot.runStart);
    time = slot.end;
    remaining.set(pid, rem - runLen);
    enqueueArrivals(time, pid);
    if (rem - runLen <= 0) {
      completion.set(pid, time);
      events.push({ time, text: `${pid} completes at t=${time}`, kind: 'complete' });
    } else {
      queue.push(pid);
      inQueue.add(pid);
      events.push({ time, text: `Quantum expires — ${pid} preempted back to the queue (context switch)`, kind: 'switch' });
    }
  }

  const result = finalize(segments, firstStart, completion, inputs);
  result.events = events;
  return result;
}

export function simulate(inputs: ProcessInput[], algo: SchedulingAlgorithm, quantum: number, csCost = 0): ScheduleResult {
  if (algo === 'rr') return simulateRR(inputs, quantum, csCost);
  if (algo === 'srtf') return simulateSRTF(inputs, csCost);
  return simulateNonPreemptive(inputs, algo, csCost);
}

/** Shortest Remaining Time First — preemptive. Re-evaluates every time unit. */
function simulateSRTF(inputs: ProcessInput[], cs: number): ScheduleResult {
  const sorted = [...inputs].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  const segments: GanttSegment[] = [];
  const events: ScheduleEvent[] = [];
  const firstStart = new Map<string, number>();
  const completion = new Map<string, number>();
  const remaining = new Map<string, number>(sorted.map((p) => [p.id, p.burst]));
  const run = makeRunner(segments, events, cs);
  let time = 0;
  let running: string | null = null;

  for (const p of sorted) {
    events.push({ time: p.arrival, text: `${p.id} arrives (burst ${p.burst})`, kind: 'arrival' });
  }
  events.sort((a, b) => a.time - b.time);

  const unfinished = () => sorted.filter((p) => remaining.get(p.id)! > 0);

  while (unfinished().length > 0) {
    const ready = unfinished().filter((p) => p.arrival <= time);
    if (ready.length === 0) {
      const nextArrival = Math.min(...unfinished().map((p) => p.arrival));
      run.idle(time, nextArrival);
      events.push({ time, text: `CPU idles until t=${nextArrival} — no process has arrived`, kind: 'idle' });
      time = nextArrival;
      running = null;
      continue;
    }
    const next = [...ready].sort(
      (a, b) => remaining.get(a.id)! - remaining.get(b.id)! || a.arrival - b.arrival || a.id.localeCompare(b.id)
    )[0];
    if (running !== next.id) {
      if (running !== null && remaining.get(running)! > 0) {
        events.push({
          time,
          text: `${next.id} preempts ${running} (remaining ${remaining.get(running)} > ${remaining.get(next.id)}) — context switch`,
          kind: 'switch',
        });
      } else {
        events.push({ time, text: `${next.id} dispatched (remaining ${remaining.get(next.id)})`, kind: 'dispatch' });
      }
      running = next.id;
    }
    // Run one unit. The runner inserts a CS segment on pid change, which
    // breaks contiguity so same-pid runs still merge, switched runs don't.
    const slot = run.run(next.id, time, 1);
    if (!firstStart.has(next.id)) firstStart.set(next.id, slot.runStart);
    // Merge display: runner already appended; collapse is unnecessary because
    // a CS segment (or a gap) separates different runs. Same-pid consecutive
    // unit runs each append — merge them back into one segment:
    const n = segments.length;
    if (n >= 2) {
      const a = segments[n - 2];
      const b = segments[n - 1];
      if (a.pid === b.pid && a.pid === next.id && a.end === b.start) {
        a.end = b.end;
        segments.pop();
      }
    }
    remaining.set(next.id, remaining.get(next.id)! - 1);
    time = slot.end;
    if (remaining.get(next.id) === 0) {
      completion.set(next.id, time);
      events.push({ time, text: `${next.id} completes at t=${time}`, kind: 'complete' });
      running = null;
    }
  }

  const result = finalize(segments, firstStart, completion, inputs);
  result.events = events;
  return result;
}

const ALGORITHMS: { id: SchedulingAlgorithm; label: string; desc: string }[] = [
  { id: 'fcfs', label: 'FCFS', desc: 'First-Come, First-Served — run in arrival order, no preemption.' },
  { id: 'sjf', label: 'SJF', desc: 'Shortest Job First — among arrived processes, run the shortest burst.' },
  { id: 'srtf', label: 'SRTF', desc: 'Shortest Remaining Time First — preemptive SJF: a new arrival with a shorter remaining time interrupts the runner.' },
  { id: 'rr', label: 'Round Robin', desc: 'Each process runs up to one time quantum, then rejoins the queue.' },
];

const PRESETS: { label: string; procs: ProcessInput[] }[] = [
  {
    label: 'Classic trio',
    procs: [
      { id: 'P1', arrival: 0, burst: 5 },
      { id: 'P2', arrival: 1, burst: 3 },
      { id: 'P3', arrival: 2, burst: 8 },
    ],
  },
  {
    label: 'Convoy effect',
    procs: [
      { id: 'P1', arrival: 0, burst: 9 },
      { id: 'P2', arrival: 1, burst: 2 },
      { id: 'P3', arrival: 2, burst: 2 },
    ],
  },
  {
    label: 'SRTF preemptions',
    procs: [
      { id: 'P1', arrival: 0, burst: 8 },
      { id: 'P2', arrival: 1, burst: 4 },
      { id: 'P3', arrival: 2, burst: 2 },
      { id: 'P4', arrival: 3, burst: 1 },
    ],
  },
  {
    label: 'RR stress test',
    procs: [
      { id: 'P1', arrival: 0, burst: 6 },
      { id: 'P2', arrival: 1, burst: 5 },
      { id: 'P3', arrival: 2, burst: 4 },
      { id: 'P4', arrival: 3, burst: 3 },
    ],
  },
];

const PALETTE = ['#2563eb', '#ea580c', '#16a34a', '#9333ea', '#e11d48', '#0891b2', '#ca8a04', '#4f46e5'];

function colorFor(pid: string, inputs: ProcessInput[]): string {
  const idx = inputs.findIndex((p) => p.id === pid);
  return PALETTE[(idx < 0 ? 0 : idx) % PALETTE.length];
}

export default function CpuSchedulingLab() {
  const [processes, setProcesses] = useState<ProcessInput[]>(PRESETS[0].procs);
  const [algo, setAlgo] = useState<SchedulingAlgorithm>('fcfs');
  const [quantum, setQuantum] = useState(2);
  const [csCost, setCsCost] = useState(0);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showWhy, setShowWhy] = useState(true);
  const [formError, setFormError] = useState('');
  const timer = useRef<NodeJS.Timeout | null>(null);

  const result = useMemo(() => simulate(processes, algo, quantum, csCost), [processes, algo, quantum, csCost]);

  // Reset playback whenever the scenario changes
  useEffect(() => {
    setTime(0);
    setPlaying(false);
  }, [processes, algo, quantum, csCost]);

  useEffect(() => {
    if (!playing) return;
    if (time >= result.makespan) {
      setPlaying(false);
      return;
    }
    timer.current = setTimeout(() => setTime((t) => Math.min(t + 1, result.makespan)), 800 / speed);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [playing, time, speed, result.makespan]);

  const currentSeg = result.segments.find((s) => time >= s.start && time < s.end) ?? null;
  const pastEvents = result.events.filter((e) => e.time <= time);
  const lastEvent = pastEvents.length > 0 ? pastEvents[pastEvents.length - 1] : null;
  const upcoming = result.events.find((e) => e.time > time) ?? null;
  const finished = time >= result.makespan && result.makespan > 0;

  /** CPU burst already executed by pid strictly before time t. */
  const executedBefore = (pid: string, t: number): number =>
    result.segments.reduce(
      (s, seg) => (seg.pid === pid ? s + Math.max(0, Math.min(t, seg.end) - seg.start) : s),
      0
    );

  const stateOf = (p: ProcessInput): ProcessState => {
    const m = result.metrics.find((x) => x.id === p.id);
    if (m && time >= m.completion) return 'TERMINATED';
    if (currentSeg && currentSeg.pid === p.id) return 'RUNNING';
    if (time >= p.arrival) return 'READY';
    return 'NEW';
  };

  /** Ready queue at current time, ordered the way the algorithm would see it. */
  const readyQueue: string[] = useMemo(() => {
    const runningId = currentSeg && currentSeg.pid !== null && currentSeg.pid !== CS_PID ? currentSeg.pid : null;
    const waiting = processes.filter((p) => {
      const m = result.metrics.find((x) => x.id === p.id);
      return p.id !== runningId && time >= p.arrival && (!m || time < m.completion);
    });
    const byArrival = [...waiting].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
    if (algo === 'sjf') return byArrival.sort((a, b) => a.burst - b.burst).map((p) => p.id);
    if (algo === 'srtf') {
      const rem = (p: ProcessInput) => p.burst - executedBefore(p.id, time);
      return byArrival.sort((a, b) => rem(a) - rem(b)).map((p) => p.id);
    }
    return byArrival.map((p) => p.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processes, result, time, currentSeg, algo]);

  const updateProcess = (index: number, field: 'arrival' | 'burst', value: number) => {
    if (!Number.isInteger(value) || value < 0 || value > 20 || (field === 'burst' && value < 1)) {
      setFormError('Arrival must be 0–20 and burst 1–20 (whole numbers).');
      return;
    }
    setFormError('');
    setProcesses((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const addProcess = () => {
    if (processes.length >= MAX_PROCESSES) {
      setFormError(`At most ${MAX_PROCESSES} processes to keep the chart readable.`);
      return;
    }
    setFormError('');
    // IDs are system-generated (first free Pn) so duplicates are impossible.
    const taken = new Set(processes.map((p) => p.id));
    let n = processes.length + 1;
    while (taken.has(`P${n}`)) n += 1;
    setProcesses((prev) => [...prev, { id: `P${n}`, arrival: 0, burst: 4 }]);
  };

  const removeProcess = (index: number) => {
    setFormError('');
    setProcesses((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFormError('');
    setProcesses([]);
  };

  const loadExample = () => {
    setFormError('');
    setProcesses(PRESETS[0].procs);
  };

  return (
    <div className="space-y-6">
      {/* Algorithm + quantum */}
      <GlassCard>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Scheduling algorithm">
          {ALGORITHMS.map((a) => (
            <button
              key={a.id}
              role="tab"
              aria-selected={algo === a.id}
              onClick={() => setAlgo(a.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                algo === a.id ? 'bg-primary text-white' : 'glass hover:bg-primary/10'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">{ALGORITHMS.find((a) => a.id === algo)?.desc}</p>
        {algo === 'rr' && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label htmlFor="quantum" className="text-sm font-medium">
              Time quantum: <span className="font-mono font-bold text-primary">{quantum}</span>
            </label>
            <input
              id="quantum"
              type="range"
              min={1}
              max={8}
              value={quantum}
              onChange={(e) => setQuantum(parseInt(e.target.value, 10))}
              className="w-48 accent-blue-600"
              aria-valuetext={`${quantum} time units`}
            />
            <div className="flex gap-1">
              {[1, 2, 4, 8].map((q) => (
                <button
                  key={q}
                  onClick={() => setQuantum(q)}
                  className={`px-2.5 py-1 rounded-full font-mono text-xs transition ${
                    quantum === q ? 'bg-primary text-white' : 'glass hover:bg-primary/10'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center">Presets:</span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setProcesses(p.procs)}
              className="px-3 py-1.5 glass rounded-full text-xs hover:bg-primary/10 transition"
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label htmlFor="cs-cost" className="text-sm font-medium">
            Context-switch cost: <span className="font-mono font-bold text-primary">{csCost} tick{csCost === 1 ? '' : 's'}</span>
          </label>
          <input
            id="cs-cost"
            type="range"
            min={0}
            max={2}
            step={1}
            value={csCost}
            onChange={(e) => setCsCost(parseInt(e.target.value, 10))}
            className="w-32 accent-blue-600"
            aria-valuetext={`${csCost} ticks`}
          />
          <div className="flex gap-1">
            {[0, 1, 2].map((c) => (
              <button
                key={c}
                onClick={() => setCsCost(c)}
                aria-pressed={csCost === c}
                className={`px-2.5 py-1 rounded-full font-mono text-xs transition ${
                  csCost === c ? 'bg-primary text-white' : 'glass hover:bg-primary/10'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Overhead ticks appear in the Gantt chart but never count as burst execution — watch CPU utilization drop as
          cost rises.
        </p>
      </GlassCard>

      {/* Process input */}
      <GlassCard>
        <h2 className="font-bold mb-2">Processes</h2>
        {processes.length === 0 ? (
          <div className="p-6 text-center glass rounded-xl">
            <p className="text-muted-foreground text-sm">No processes yet. Load the example or add your own to begin.</p>
            <button
              onClick={loadExample}
              className="mt-3 px-5 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary-dark transition"
            >
              Load example
            </button>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[420px]">
            <thead>
              <tr className="border-b border-white/20 text-left">
                <th className="p-2 font-semibold">Process</th>
                <th className="p-2 font-semibold">Arrival time</th>
                <th className="p-2 font-semibold">Burst time</th>
                <th className="p-2 font-semibold">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {processes.map((p, i) => (
                <tr key={`${p.id}-${i}`} className="border-b border-white/10">
                  <td className="p-2 font-mono font-bold" style={{ color: colorFor(p.id, processes) }}>
                    {p.id}
                  </td>
                  <td className="p-2">
                    <label className="sr-only" htmlFor={`arrival-${i}`}>
                      {p.id} arrival time
                    </label>
                    <input
                      id={`arrival-${i}`}
                      type="number"
                      min={0}
                      max={20}
                      value={p.arrival}
                      onChange={(e) => updateProcess(i, 'arrival', parseInt(e.target.value, 10))}
                      className="w-20 px-2 py-1 rounded-lg glass text-center font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </td>
                  <td className="p-2">
                    <label className="sr-only" htmlFor={`burst-${i}`}>
                      {p.id} burst time
                    </label>
                    <input
                      id={`burst-${i}`}
                      type="number"
                      min={1}
                      max={20}
                      value={p.burst}
                      onChange={(e) => updateProcess(i, 'burst', parseInt(e.target.value, 10))}
                      className="w-20 px-2 py-1 rounded-lg glass text-center font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => removeProcess(i)}
                      aria-label={`Remove ${p.id}`}
                      className="px-2 py-1 text-xs glass rounded-full hover:bg-red-500/20 hover:text-red-500 transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
        {formError && (
          <p className="text-sm text-red-500 mt-2" role="alert">
            {formError}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={addProcess}
            className="px-4 py-2 glass rounded-full text-sm hover:bg-primary/10 transition"
          >
            + Add process
          </button>
          <button
            onClick={loadExample}
            className="px-4 py-2 glass rounded-full text-sm hover:bg-primary/10 transition"
          >
            Load example
          </button>
          {processes.length > 0 && (
            <button
              onClick={clearAll}
              className="px-4 py-2 glass rounded-full text-sm hover:bg-red-500/10 hover:text-red-500 transition"
            >
              Clear all
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          IDs are generated (P1, P2, …) so duplicates can&apos;t happen. Arrival 0–20, burst 1–20, whole numbers.
        </p>
      </GlassCard>

      {/* Playback controls */}
      <GlassCard>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => (time >= result.makespan ? (setTime(0), setPlaying(true)) : setPlaying(!playing))}
            className="px-5 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition flex items-center gap-2"
            aria-label={playing ? 'Pause simulation' : time >= result.makespan ? 'Replay simulation' : 'Play simulation'}
          >
            {playing ? <FaPause aria-hidden="true" /> : <FaPlay aria-hidden="true" />}
            {playing ? 'Pause' : time >= result.makespan ? 'Replay' : 'Play'}
          </button>
          <button
            onClick={() => {
              setPlaying(false);
              setTime((t) => Math.min(t + 1, result.makespan));
            }}
            disabled={time >= result.makespan}
            className="px-4 py-2 glass rounded-full text-sm hover:bg-primary/10 transition disabled:opacity-50 flex items-center gap-2"
          >
            <FaStepForward aria-hidden="true" /> Step
          </button>
          <button
            onClick={() => {
              setPlaying(false);
              setTime(0);
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
              <option value={4}>4×</option>
            </select>
          </label>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <label htmlFor="sim-time" className="text-sm font-medium whitespace-nowrap">
            Time <span className="font-mono font-bold text-primary">{time}</span>
            <span className="text-muted-foreground"> / {result.makespan}</span>
          </label>
          <input
            id="sim-time"
            type="range"
            min={0}
            max={result.makespan}
            value={time}
            onChange={(e) => {
              setPlaying(false);
              setTime(parseInt(e.target.value, 10));
            }}
            className="flex-1 accent-blue-600"
          />
        </div>
        <p className="mt-2 text-sm" aria-live="polite">
          {finished ? (
            <span className="font-semibold text-green-600">Finished — all processes completed.</span>
          ) : currentSeg?.pid === CS_PID ? (
            <span className="font-semibold text-amber-600">
              Context switch — scheduler overhead ({currentSeg.start} → {currentSeg.end}), no process runs.
            </span>
          ) : currentSeg?.pid ? (
            <>
              CPU: <strong style={{ color: colorFor(currentSeg.pid, processes) }}>{currentSeg.pid}</strong>
              <span className="text-muted-foreground"> (running {currentSeg.start} → {currentSeg.end})</span>
            </>
          ) : processes.length === 0 ? (
            <span className="text-muted-foreground">No processes — load the example or add one.</span>
          ) : (
            <span className="text-muted-foreground">CPU idle — no process has arrived yet.</span>
          )}
        </p>
      </GlassCard>

      {/* CPU + Gantt | PCB + Ready queue (side-by-side on desktop, stacked on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Animated CPU */}
          <GlassCard>
            <h2 className="font-bold mb-2 flex items-center gap-2">
              <FaMicrochip className="text-primary" aria-hidden="true" /> CPU
            </h2>
            <div
              className="rounded-2xl border-2 border-primary/20 bg-slate-950 text-slate-100 p-4 min-h-[120px] flex items-center justify-center"
              aria-live="polite"
            >
              <AnimatePresence mode="wait">
                {finished || processes.length === 0 ? (
                  <motion.p
                    key="done"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-slate-400"
                  >
                    {processes.length === 0 ? 'CPU waiting for processes…' : 'Halted — all processes terminated ✓'}
                  </motion.p>
                ) : currentSeg?.pid === CS_PID ? (
                  <motion.div
                    key={`cs-${currentSeg.start}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="text-center"
                  >
                    <p className="font-mono font-bold text-amber-400 text-sm">⇄ CONTEXT SWITCH</p>
                    <p className="text-xs text-slate-400">saving state · loading next process</p>
                  </motion.div>
                ) : currentSeg?.pid ? (
                  <motion.div
                    key={currentSeg.pid}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="text-center w-full"
                  >
                    <p className="font-mono font-extrabold text-2xl" style={{ color: colorFor(currentSeg.pid, processes) }}>
                      {currentSeg.pid}
                    </p>
                    <div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, Math.max(0, ((time - currentSeg.start) / Math.max(1, currentSeg.end - currentSeg.start)) * 100))}%`,
                          backgroundColor: colorFor(currentSeg.pid, processes),
                        }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      {currentSeg.start} → {currentSeg.end}
                    </p>
                  </motion.div>
                ) : (
                  <motion.p
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-slate-400 font-mono"
                  >
                    IDLE — awaiting arrivals
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>

          {/* Gantt chart */}
          <GlassCard>
            <h2 className="font-bold mb-2">Gantt chart</h2>
            {result.segments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing to chart yet.</p>
            ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[520px]">
                <div className="flex rounded-xl overflow-hidden border border-white/20" role="img" aria-label={`Gantt chart at time ${time} of ${result.makespan}`}>
                  {result.segments.map((s, i) => {
                    const donePortion = Math.max(0, Math.min(1, (time - s.start) / Math.max(1, s.end - s.start)));
                    const isCs = s.pid === CS_PID;
                    return (
                      <div
                        key={i}
                        style={{ flexGrow: s.end - s.start, flexBasis: 0 }}
                        className={`relative h-14 border-r border-white/20 last:border-r-0 ${
                          s.pid === null ? 'bg-gray-400/20' : ''
                        } ${isCs ? 'bg-amber-500/30' : ''}`}
                        title={
                          s.pid === null
                            ? `Idle ${s.start}–${s.end}`
                            : isCs
                              ? `Context switch ${s.start}–${s.end} (overhead)`
                              : `${s.pid}: ${s.start}–${s.end}`
                        }
                      >
                        {s.pid !== null && !isCs && (
                          <div
                            className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: colorFor(s.pid, processes), opacity: 0.35 + 0.65 * donePortion }}
                          >
                            {s.end - s.start >= 2 ? s.pid : ''}
                          </div>
                        )}
                        {isCs && (
                          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300">
                            CS
                          </div>
                        )}
                        {s.pid === null && (
                          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                            idle
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex mt-1">
                  {result.segments.map((s, i) => (
                    <div
                      key={i}
                      style={{ flexGrow: s.end - s.start, flexBasis: 0 }}
                      className="text-[10px] font-mono text-muted-foreground border-r border-white/10 last:border-r-0 pr-1"
                    >
                      {s.start}
                      {i === result.segments.length - 1 && <span className="float-right">{s.end}</span>}
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-primary inline-block" aria-hidden="true" /> execution
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-amber-500/50 inline-block" aria-hidden="true" /> context switch
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-gray-400/30 inline-block" aria-hidden="true" /> idle
                  </span>
                </div>
              </div>
            </div>
            )}
          </GlassCard>
        </div>

        {/* PCB + Ready queue */}
        <div className="lg:col-span-2">
          <GlassCard className="lg:sticky lg:top-20">
            <h2 className="font-bold mb-2">Ready queue</h2>
            {readyQueue.length === 0 ? (
              <p className="text-xs text-muted-foreground mb-3">
                {finished ? 'Queue empty — everything terminated.' : 'Queue empty.'}
              </p>
            ) : (
              <div className="flex flex-wrap items-center gap-1 mb-3" aria-live="polite" aria-label="Ready queue">
                {readyQueue.map((pid, i) => (
                  <span key={`${pid}-${i}`} className="flex items-center gap-1">
                    <span
                      className="px-2.5 py-1 rounded-lg font-mono text-xs font-bold text-white"
                      style={{ backgroundColor: colorFor(pid, processes) }}
                    >
                      {pid}
                    </span>
                    {i < readyQueue.length - 1 && (
                      <span className="text-muted-foreground" aria-hidden="true">→</span>
                    )}
                  </span>
                ))}
              </div>
            )}
            <h2 className="font-bold mb-2">Process control blocks</h2>
            {processes.length === 0 ? (
              <p className="text-xs text-muted-foreground">No PCBs — add a process.</p>
            ) : (
              <ul className="space-y-2">
                {processes.map((p) => {
                  const st = stateOf(p);
                  const rem = Math.max(0, p.burst - executedBefore(p.id, time));
                  const badge =
                    st === 'RUNNING'
                      ? 'bg-green-500/15 text-green-600 dark:text-green-400'
                      : st === 'READY'
                        ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                        : st === 'TERMINATED'
                          ? 'bg-gray-500/15 text-gray-500'
                          : 'bg-purple-500/15 text-purple-600 dark:text-purple-400';
                  return (
                    <li key={p.id} className="p-2.5 glass rounded-xl text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-bold" style={{ color: colorFor(p.id, processes) }}>
                          {p.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${badge}`}>{st}</span>
                      </div>
                      <dl className="mt-1 grid grid-cols-3 gap-1 font-mono text-muted-foreground">
                        <div><dt className="sr-only">Arrival</dt><dd>arr {p.arrival}</dd></div>
                        <div><dt className="sr-only">Burst</dt><dd>burst {p.burst}</dd></div>
                        <div><dt className="sr-only">Remaining</dt><dd>left {rem}</dd></div>
                      </dl>
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="text-[11px] text-muted-foreground mt-2">
              States derive from the schedule: NEW (not arrived), READY (waiting), RUNNING (on CPU), TERMINATED
              (completed). This model has no I/O, so no WAITING state occurs.
            </p>
          </GlassCard>
        </div>
      </div>

      {/* Why panel */}
      <GlassCard className="border-2 border-primary/20">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold">Why did the CPU do that?</h2>
          <button
            onClick={() => setShowWhy(!showWhy)}
            aria-expanded={showWhy}
            className="text-xs px-3 py-1.5 glass rounded-full hover:bg-primary/10 transition"
          >
            {showWhy ? 'Hide explanations' : 'Show explanations'}
          </button>
        </div>
        {showWhy && (
          <div className="space-y-2 text-sm">
            <p className="p-2 rounded-lg bg-primary/5" aria-live="polite">
              <span className="font-semibold">Last event (t={lastEvent?.time ?? 0}): </span>
              {lastEvent ? lastEvent.text : 'Press Play to start the simulation.'}
            </p>
            {upcoming && (
              <p className="text-muted-foreground">
                <span className="font-semibold">What happens next (t={upcoming.time}): </span>
                {upcoming.text}
              </p>
            )}
            <details className="text-sm">
              <summary className="cursor-pointer text-primary hover:underline">Full event log ({result.events.length} events)</summary>
              <ul className="mt-2 space-y-1 max-h-48 overflow-y-auto pr-1">
                {result.events.map((e, i) => (
                  <li key={i} className={`font-mono text-xs ${e.time <= time ? '' : 'text-muted-foreground'}`}>
                    [t={e.time}] {e.text}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        )}
      </GlassCard>

      {/* Metrics */}
      <GlassCard>
        <h2 className="font-bold mb-2">Results</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-white/20 text-left">
                <th className="p-2 font-semibold">Process</th>
                <th className="p-2 font-semibold">Completion</th>
                <th className="p-2 font-semibold">Turnaround</th>
                <th className="p-2 font-semibold">Waiting</th>
                <th className="p-2 font-semibold">Response</th>
              </tr>
            </thead>
            <tbody>
              {result.metrics.map((m) => (
                <tr key={m.id} className="border-b border-white/10">
                  <td className="p-2 font-mono font-bold">{m.id}</td>
                  <td className="p-2 font-mono">{m.completion}</td>
                  <td className="p-2 font-mono">{m.turnaround}</td>
                  <td className="p-2 font-mono">{m.waiting}</td>
                  <td className="p-2 font-mono">{m.response}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mt-3 text-sm">
          {[
            { icon: <FaClock aria-hidden="true" />, value: result.avgWaiting.toFixed(2), label: 'Average waiting time' },
            { icon: <FaChartLine aria-hidden="true" />, value: result.avgTurnaround.toFixed(2), label: 'Average turnaround time' },
            { icon: <FaHourglassHalf aria-hidden="true" />, value: result.avgResponse.toFixed(2), label: 'Average response time' },
            { icon: <FaMicrochip aria-hidden="true" />, value: `${result.cpuUtil.toFixed(1)}%`, label: 'CPU utilization' },
            { icon: <FaExchangeAlt aria-hidden="true" />, value: String(result.csCount), label: 'Context switches' },
            { icon: <FaCheckCircle aria-hidden="true" />, value: `${result.completedCount}/${processes.length}`, label: 'Completed processes' },
          ].map((card) => (
            <div key={card.label} className="p-3 glass rounded-xl text-center">
              <span className="text-primary text-lg" aria-hidden="true">{card.icon}</span>
              <p className="font-mono text-xl font-bold text-primary">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </div>
          ))}
        </div>
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-primary hover:underline">Formulas (beginner-friendly)</summary>
          <ul className="mt-2 space-y-1 text-muted-foreground text-xs font-mono">
            <li>Turnaround = Completion − Arrival (total time in system)</li>
            <li>Waiting = Turnaround − Burst (time spent not running)</li>
            <li>Response = First start − Arrival (time until first run)</li>
            <li>CPU utilization = Busy time ÷ Makespan × 100</li>
          </ul>
        </details>
      </GlassCard>
    </div>
  );
}
