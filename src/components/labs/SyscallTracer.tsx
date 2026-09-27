import { useEffect, useRef, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import CodeBlock from '@/components/ui/CodeBlock';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaUndo } from 'react-icons/fa';

export interface SyscallStep {
  id: string;
  name: string;
  args: string;
  returnValue: string;
  /** Layer that performs this step */
  layer: 'program' | 'clib' | 'syscall' | 'kernel' | 'subsystem' | 'hardware';
  subsystem: string;
  explanation: string;
}

export interface SyscallTrace {
  id: string;
  command: string;
  summary: string;
  steps: SyscallStep[];
}

const LAYERS: { id: SyscallStep['layer']; label: string }[] = [
  { id: 'program', label: 'User Program' },
  { id: 'clib', label: 'C Library / Runtime' },
  { id: 'syscall', label: 'System Call' },
  { id: 'kernel', label: 'Kernel' },
  { id: 'subsystem', label: 'Subsystem' },
  { id: 'hardware', label: 'Hardware / Resource' },
];

export const SYSCALL_TRACES: SyscallTrace[] = [
  {
    id: 'cat',
    command: 'cat /etc/passwd',
    summary: 'Read a file and print it to the terminal.',
    steps: [
      {
        id: 'cat-1', name: 'openat', args: '(AT_FDCWD, "/etc/passwd", O_RDONLY)', returnValue: '= 3',
        layer: 'syscall', subsystem: 'Kernel · VFS',
        explanation: 'Requests that the kernel open the file relative to the current directory. The kernel checks permissions and hands back file descriptor 3.',
      },
      {
        id: 'cat-2', name: 'read', args: '(3, buf, 1024)', returnValue: '= 512',
        layer: 'subsystem', subsystem: 'ext4 filesystem · disk driver',
        explanation: 'Copies up to 1024 bytes from the file into the program\u2019s buffer. Returns the 512 bytes actually read.',
      },
      {
        id: 'cat-3', name: 'read', args: '(3, buf, 1024)', returnValue: '= 0',
        layer: 'subsystem', subsystem: 'ext4 filesystem · disk driver',
        explanation: 'Reads again and gets 0 — the agreed signal for end of file.',
      },
      {
        id: 'cat-4', name: 'write', args: '(1, buf, 512)', returnValue: '= 512',
        layer: 'syscall', subsystem: 'Kernel · terminal driver',
        explanation: 'Writes the buffered bytes to stdout (file descriptor 1), which is the terminal.',
      },
      {
        id: 'cat-5', name: 'close', args: '(3)', returnValue: '= 0',
        layer: 'kernel', subsystem: 'Kernel · file table',
        explanation: 'Releases file descriptor 3 so the kernel can reuse it.',
      },
    ],
  },
  {
    id: 'echo',
    command: 'echo "Hello"',
    summary: 'Print a short string — conceptually a single write.',
    steps: [
      {
        id: 'echo-1', name: 'write', args: '(1, "Hello\\n", 6)', returnValue: '= 6',
        layer: 'syscall', subsystem: 'Kernel · terminal driver',
        explanation: 'The shell\u2019s builtin hands 6 bytes to the kernel, which delivers them to stdout. No file is opened at all.',
      },
    ],
  },
  {
    id: 'ls',
    command: 'ls',
    summary: 'List a directory by asking the kernel to enumerate entries.',
    steps: [
      {
        id: 'ls-1', name: 'openat', args: '(AT_FDCWD, ".", O_RDONLY | O_DIRECTORY)', returnValue: '= 3',
        layer: 'syscall', subsystem: 'Kernel · VFS',
        explanation: 'Opens the current directory itself (not a file) for reading.',
      },
      {
        id: 'ls-2', name: 'getdents64', args: '(3, entries, 32768)', returnValue: '= 248',
        layer: 'subsystem', subsystem: 'ext4 filesystem · disk driver',
        explanation: 'Reads raw directory entries (names + inode numbers) into a buffer. ls then sorts and formats them — that part is pure user space.',
      },
      {
        id: 'ls-3', name: 'close', args: '(3)', returnValue: '= 0',
        layer: 'kernel', subsystem: 'Kernel · file table',
        explanation: 'Releases the directory descriptor.',
      },
    ],
  },
];

export default function SyscallTracer() {
  const [traceId, setTraceId] = useState('cat');
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const trace = SYSCALL_TRACES.find((t) => t.id === traceId) ?? SYSCALL_TRACES[0];

  useEffect(() => {
    setStep(0);
    setPlaying(false);
  }, [traceId]);

  useEffect(() => {
    if (!playing) return;
    if (step >= trace.steps.length) {
      setPlaying(false);
      return;
    }
    timer.current = setTimeout(() => setStep((s) => Math.min(s + 1, trace.steps.length)), 1400 / speed);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [playing, step, speed, trace.steps.length]);

  const current: SyscallStep | null = step < trace.steps.length ? trace.steps[step] : null;
  const lastDone: SyscallStep | null = step > 0 ? trace.steps[step - 1] : null;
  const activeLayer = (lastDone ?? current)?.layer ?? null;

  const gotoStep = (n: number) => {
    setPlaying(false);
    setStep(Math.max(0, Math.min(n, trace.steps.length)));
  };

  return (
    <GlassCard className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">System-call trace visualizer</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Educational simulation — predefined traces. Real sequences vary with libc, kernel version, architecture and
          caching; the goal is the concept, not a byte-exact replay.
        </p>
      </div>

      {/* Command selector */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Traced command">
        {SYSCALL_TRACES.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={t.id === traceId}
            onClick={() => setTraceId(t.id)}
            className={`px-4 py-2 rounded-full font-mono text-xs transition ${
              t.id === traceId ? 'bg-primary text-white' : 'glass hover:bg-primary/10'
            }`}
          >
            $ {t.command}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground -mt-2">{trace.summary}</p>

      {/* Layer diagram */}
      <div className="flex flex-col sm:flex-row items-stretch gap-1" aria-label="System layers">
        {LAYERS.map((l, i) => (
          <div key={l.id} className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1">
            <div
              className={`flex-1 text-center text-[11px] font-bold px-2 py-2 rounded-lg border transition ${
                activeLayer === l.id
                  ? 'border-primary bg-primary/15 text-primary'
                  : 'glass text-muted-foreground'
              }`}
              aria-current={activeLayer === l.id ? 'step' : undefined}
            >
              {l.label}
            </div>
            {i < LAYERS.length - 1 && (
              <span className="text-center text-muted-foreground text-xs px-0.5 rotate-90 sm:rotate-0" aria-hidden="true">
                →
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Trace steps */}
      <ol className="space-y-1.5">
        {trace.steps.map((s, i) => {
          const done = i < step;
          const isCurrent = i === step && step < trace.steps.length;
          return (
            <li key={s.id}>
              <button
                onClick={() => gotoStep(i)}
                aria-label={`Inspect step ${i + 1}: ${s.name}`}
                className={`w-full text-left px-3 py-2 rounded-xl border font-mono text-xs flex flex-wrap gap-x-2 items-baseline transition ${
                  isCurrent
                    ? 'border-primary bg-primary/10'
                    : done
                      ? 'glass border-green-500/30'
                      : 'glass text-muted-foreground hover:bg-primary/5'
                }`}
              >
                <span className="text-muted-foreground">{i + 1}.</span>
                <span className="font-bold text-primary">{s.name}</span>
                <span className="break-all">{s.args}</span>
                <span className="font-bold">{done || isCurrent ? s.returnValue : ''}</span>
                {done && <span className="ml-auto text-green-600 text-[10px] font-sans font-bold">done ✓</span>}
                {isCurrent && <span className="ml-auto text-primary text-[10px] font-sans font-bold">current</span>}
              </button>
            </li>
          );
        })}
      </ol>

      {/* Detail */}
      <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-sm min-h-[76px]" aria-live="polite">
        {current || lastDone ? (
          <>
            <p className="font-mono font-bold">
              {(current ?? lastDone)!.name}
              <span className="font-normal text-muted-foreground">{(current ?? lastDone)!.args}</span>{' '}
              <span className="text-green-600">{(current ?? lastDone)!.returnValue}</span>
            </p>
            <p className="text-xs mt-1">
              <span className="font-semibold">Layer:</span> {LAYERS.find((l) => l.id === (current ?? lastDone)!.layer)?.label}
              {' · '}
              <span className="font-semibold">Subsystem:</span> {(current ?? lastDone)!.subsystem}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{(current ?? lastDone)!.explanation}</p>
            <p className="text-xs mt-1 text-amber-600 dark:text-amber-400">
              User → kernel transition happens at the <code className="font-mono">syscall</code> CPU instruction; control
              and the return value come back the same way.
            </p>
          </>
        ) : (
          <p className="text-muted-foreground text-xs">Press Play or click a step to inspect it.</p>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            if (step >= trace.steps.length) {
              gotoStep(0);
              setPlaying(true);
            } else {
              setPlaying(!playing);
            }
          }}
          className="px-5 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition flex items-center gap-2"
          aria-label={playing ? 'Pause trace' : 'Play trace'}
        >
          {playing ? <FaPause aria-hidden="true" /> : <FaPlay aria-hidden="true" />}
          {playing ? 'Pause' : step >= trace.steps.length ? 'Replay' : 'Play'}
        </button>
        <button
          onClick={() => gotoStep(step - 1)}
          disabled={step <= 0}
          className="px-3 py-2 glass rounded-full text-sm hover:bg-primary/10 transition disabled:opacity-50 flex items-center gap-1"
          aria-label="Previous step"
        >
          <FaStepBackward aria-hidden="true" /> Prev
        </button>
        <button
          onClick={() => gotoStep(step + 1)}
          disabled={step >= trace.steps.length}
          className="px-3 py-2 glass rounded-full text-sm hover:bg-primary/10 transition disabled:opacity-50 flex items-center gap-1"
          aria-label="Next step"
        >
          Next <FaStepForward aria-hidden="true" />
        </button>
        <button
          onClick={() => gotoStep(0)}
          className="px-3 py-2 glass rounded-full text-sm hover:bg-primary/10 transition flex items-center gap-1"
          aria-label="Restart trace"
        >
          <FaUndo aria-hidden="true" /> Restart
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

      <div aria-live="polite" className="sr-only">
        Step {Math.min(step + 1, trace.steps.length)} of {trace.steps.length}
      </div>

      <CodeBlock
        code={`$ strace -c ${trace.command}\n# simplified educational trace — ${trace.steps.length} syscalls shown above`}
        language="bash"
      />
    </GlassCard>
  );
}
