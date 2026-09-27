import { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { FaBug, FaCheckCircle, FaUndo, FaLightbulb } from 'react-icons/fa';

interface Scenario {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  targetObjective: string;
  initialDirectory: string;
  initialFiles: Record<string, string>;
  solutionCommand: string;
  hint: string;
}

const scenarios: Scenario[] = [
  {
    id: '1',
    title: 'Fix Script Execution Permission',
    difficulty: 'Easy',
    description: 'You tried running deployment_script.sh, but received "Permission Denied". Fix the mode bits to make it executable.',
    targetObjective: 'Make deployment_script.sh executable using chmod 755 or chmod +x.',
    initialDirectory: '/home/developer',
    initialFiles: {
      'deployment_script.sh': '#!/bin/bash\necho "Server deployed successfully!"',
      'readme.txt': 'Run deployment_script.sh to deploy build artifacts.',
    },
    solutionCommand: 'chmod 755 deployment_script.sh',
    hint: 'Use `chmod 755 deployment_script.sh` or `chmod +x deployment_script.sh` to add execution permissions.',
  },
  {
    id: '2',
    title: 'Inspect System Error Logs',
    difficulty: 'Medium',
    description: 'The NGINX web server crashed. Locate the error message in system logs.',
    targetObjective: 'Search for "CRITICAL" or "ERROR" inside app.log using grep.',
    initialDirectory: '/var/log',
    initialFiles: {
      'app.log':
        '[INFO] Server started\n[INFO] Connected to DB\n[CRITICAL] NGINX failed to bind port 80: Address already in use\n[INFO] Worker exited',
    },
    solutionCommand: 'grep "CRITICAL" app.log',
    hint: 'Use `grep "CRITICAL" app.log` or `grep "ERROR" app.log` to search the log file.',
  },
  {
    id: '3',
    title: 'Clean Up Temporary Logs',
    difficulty: 'Easy',
    description: 'The disk space is running low due to old debug logs in /tmp. Delete the debug.log file.',
    targetObjective: 'Remove debug.log safely using rm.',
    initialDirectory: '/tmp',
    initialFiles: {
      'debug.log': 'Dump data 100GB...',
      'cache.json': '{"session": "active"}',
    },
    solutionCommand: 'rm debug.log',
    hint: 'Type `rm debug.log` to delete the temporary log file.',
  },
];

const difficultyStyle: Record<Scenario['difficulty'], string> = {
  Easy: 'bg-green-500/15 text-green-600 dark:text-green-400',
  Medium: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  Hard: 'bg-red-500/15 text-red-600 dark:text-red-400',
};

export default function TerminalDebuggerScenarios() {
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [userCommand, setUserCommand] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'Welcome to Linux Debugger Sandbox.',
    'Type your command below to complete the target objective.',
  ]);
  const [isSolved, setIsSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const scenario = scenarios[activeScenarioIndex];

  const switchScenario = (idx: number) => {
    setActiveScenarioIndex(idx);
    setUserCommand('');
    setIsSolved(false);
    setShowHint(false);
    setTerminalOutput([`Loaded Scenario ${scenarios[idx].id}: ${scenarios[idx].title}`]);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = userCommand.trim();
    if (!cmd) return;

    const newLogs = [...terminalOutput, `$ ${cmd}`];

    // Simulated command resolver — in-memory only, never touches the host.
    if (cmd === 'ls') {
      const files = Object.keys(scenario.initialFiles).join('  ');
      newLogs.push(files);
    } else if (cmd.startsWith('cat ')) {
      const fileName = cmd.replace('cat ', '').trim();
      if (scenario.initialFiles[fileName]) {
        newLogs.push(scenario.initialFiles[fileName]);
      } else {
        newLogs.push(`cat: ${fileName}: No such file or directory`);
      }
    } else if (
      cmd === scenario.solutionCommand ||
      (scenario.id === '1' && cmd === 'chmod +x deployment_script.sh') ||
      (scenario.id === '2' && cmd === 'grep "ERROR" app.log')
    ) {
      newLogs.push('✅ SUCCESS: Objective completed correctly!');
      setIsSolved(true);
    } else {
      newLogs.push('Execution error or objective not met. Try again or check the hint.');
    }

    setTerminalOutput(newLogs);
    setUserCommand('');
  };

  const resetScenario = () => {
    setUserCommand('');
    setTerminalOutput([
      `Switched to Scenario: ${scenario.title}`,
      'Type your command below to complete the target objective.',
    ]);
    setIsSolved(false);
    setShowHint(false);
  };

  return (
    <GlassCard className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaBug className="text-orange-500" aria-hidden="true" />
            <span>
              Scenario {scenario.id}: {scenario.title}
            </span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">{scenario.description}</p>
          <p className="mt-1">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${difficultyStyle[scenario.difficulty]}`}>
              {scenario.difficulty}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2" role="tablist" aria-label="Debugging challenges">
          {scenarios.map((s, idx) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={activeScenarioIndex === idx}
              onClick={() => switchScenario(idx)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                activeScenarioIndex === idx
                  ? 'bg-primary text-white shadow-sm'
                  : 'glass hover:bg-primary/10 text-muted-foreground'
              }`}
            >
              Challenge {s.id}
            </button>
          ))}
        </div>
      </div>

      {/* Target Objective Banner */}
      <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between gap-2 text-xs">
        <div>
          <span className="font-bold text-primary">Target Objective: </span>
          <span className="text-muted-foreground">{scenario.targetObjective}</span>
        </div>
        {isSolved && (
          <span
            className="px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-600 font-bold flex items-center gap-1 shrink-0"
            aria-live="polite"
          >
            <FaCheckCircle aria-hidden="true" /> Solved!
          </span>
        )}
      </div>

      {/* Interactive Terminal Window */}
      <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs sm:text-sm space-y-3 shadow-inner min-h-[220px]">
        <div className="space-y-1 max-h-[200px] overflow-y-auto scrollbar-thin" aria-live="polite">
          {terminalOutput.map((line, idx) => (
            <div key={idx} className={line.startsWith('✅') ? 'text-green-400 font-bold' : 'break-words'}>
              {line}
            </div>
          ))}
        </div>

        <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 border-t border-slate-800 pt-2">
          <span className="text-green-400 font-semibold shrink-0" aria-hidden="true">
            {scenario.initialDirectory}$
          </span>
          <label htmlFor={`debugger-input-${scenario.id}`} className="sr-only">
            Command for scenario {scenario.id} in {scenario.initialDirectory}
          </label>
          <input
            id={`debugger-input-${scenario.id}`}
            type="text"
            value={userCommand}
            onChange={(e) => setUserCommand(e.target.value)}
            placeholder="Type command (e.g. ls, cat, chmod)..."
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="flex-1 min-w-0 bg-transparent focus:outline-none text-slate-100 placeholder-slate-600"
          />
        </form>
      </div>

      {/* Footer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <button
          onClick={() => setShowHint(!showHint)}
          aria-expanded={showHint}
          className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:underline"
        >
          <FaLightbulb aria-hidden="true" /> {showHint ? 'Hide Hint' : 'Need a Hint?'}
        </button>

        <button
          onClick={resetScenario}
          className="px-3 py-1.5 rounded-lg glass text-xs flex items-center gap-1 hover:bg-white/10 transition"
        >
          <FaUndo aria-hidden="true" /> Reset Terminal
        </button>
      </div>

      {showHint && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-600 dark:text-amber-400">
          💡 <strong>Hint:</strong> {scenario.hint}
        </div>
      )}
    </GlassCard>
  );
}
