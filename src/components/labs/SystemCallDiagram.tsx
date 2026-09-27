import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { FaShieldAlt, FaTerminal, FaMicrochip, FaExchangeAlt, FaCheck, FaLock } from 'react-icons/fa';

interface SystemCallOption {
  id: string;
  name: string;
  sysCallNumber: number;
  userAction: string;
  kernelRoutine: string;
  hardwareEffect: string;
  description: string;
}

const systemCalls: SystemCallOption[] = [
  {
    id: 'read',
    name: 'sys_read()',
    sysCallNumber: 0,
    userAction: 'app reads input from /var/log/syslog',
    kernelRoutine: 'VFS Layer -> ext4 driver reads disk blocks',
    hardwareEffect: 'Storage Controller transfers blocks into Kernel Buffer',
    description: 'Requests file bytes from storage into user buffer space via Ring 0 CPU trap.',
  },
  {
    id: 'write',
    name: 'sys_write()',
    sysCallNumber: 1,
    userAction: 'echo "hello" > output.txt',
    kernelRoutine: 'Buffer Cache flush -> Write blocks to disk filesystem',
    hardwareEffect: 'SSD/HDD controller executes physical write operations',
    description: 'Transfers data from user memory buffers down to physical output streams.',
  },
  {
    id: 'fork',
    name: 'sys_fork() / clone()',
    sysCallNumber: 57,
    userAction: 'Parent process launches child worker process',
    kernelRoutine: 'Copy PCB (Process Control Block), allocate PID & virtual memory page tables',
    hardwareEffect: 'MMU re-maps virtual memory page frames (Copy-On-Write)',
    description: 'Creates a duplicate execution process context in kernel scheduler.',
  },
  {
    id: 'chmod',
    name: 'sys_chmod()',
    sysCallNumber: 90,
    userAction: 'chmod 755 deployment_script.sh',
    kernelRoutine: 'Security check -> inode permission bit manipulation',
    hardwareEffect: 'FileSystem metadata update committed to NVMe/SATA storage',
    description: 'Modifies file mode bits in file system inode tables after checking user UID.',
  },
];

export default function SystemCallDiagram() {
  const [selectedCall, setSelectedCall] = useState<SystemCallOption>(systemCalls[0]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const timers = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((t) => clearTimeout(t));
    };
  }, []);

  const triggerSyscallAnimation = () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setActiveStep(1);

    timers.current = [
      setTimeout(() => setActiveStep(2), 1200),
      setTimeout(() => setActiveStep(3), 2400),
      setTimeout(() => setActiveStep(4), 3600),
      setTimeout(() => {
        setIsExecuting(false);
        setActiveStep(0);
      }, 4800),
    ];
  };

  return (
    <GlassCard className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-extrabold flex items-center justify-center gap-2">
          <FaExchangeAlt className="text-primary" aria-hidden="true" />
          <span>System Call: User Mode to Kernel Mode Transition</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Explore how CPU privilege mode shifts between <strong>Ring 3 (User Space)</strong> and{' '}
          <strong>Ring 0 (Kernel Space)</strong> when executing file operations or process creation.
        </p>
        <p className="text-xs text-muted-foreground mt-1">{selectedCall.description}</p>
      </div>

      {/* Select System Call */}
      <div className="flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="System call">
        {systemCalls.map((sc) => (
          <button
            key={sc.id}
            role="tab"
            aria-selected={selectedCall.id === sc.id}
            onClick={() => {
              setSelectedCall(sc);
              setActiveStep(0);
            }}
            disabled={isExecuting}
            className={`px-3 py-1.5 rounded-full font-mono text-xs font-semibold transition disabled:opacity-50 ${
              selectedCall.id === sc.id
                ? 'bg-primary text-white shadow-md'
                : 'glass hover:bg-primary/10 text-muted-foreground'
            }`}
          >
            {sc.name}
          </button>
        ))}
      </div>

      {/* Action Trigger */}
      <div className="text-center">
        <button
          onClick={triggerSyscallAnimation}
          disabled={isExecuting}
          className="px-6 py-2.5 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition text-xs sm:text-sm shadow-lg disabled:opacity-50"
        >
          {isExecuting ? 'Executing CPU Privilege Transition...' : `Simulate ${selectedCall.name} Execution`}
        </button>
      </div>

      {/* Visual Architectural Stack */}
      <div className="space-y-3 relative pt-2" aria-live="polite">
        {/* Ring 3: User Space */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            activeStep === 1 ? 'border-blue-500 bg-blue-500/10 shadow-lg' : 'border-blue-500/30 glass'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <FaTerminal aria-hidden="true" /> USER SPACE (Ring 3 - Unprivileged)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600">User Mode</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Application requests operation:{' '}
            <code className="font-semibold">{selectedCall.userAction}</code>
          </p>
        </div>

        {/* System Call Gate / Trap Boundary */}
        <div
          className={`p-3 rounded-xl border text-center relative overflow-hidden transition-all ${
            activeStep === 2 ? 'border-amber-500 bg-amber-500/20 scale-[1.02]' : 'border-amber-500/30 glass'
          }`}
        >
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
            <FaLock aria-hidden="true" /> SYSTEM CALL GATE / TRAP (CPU Exception: <code>syscall</code> /{' '}
            <code>INT 0x80</code>)
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Syscall Register EAX ={' '}
            <span className="font-mono font-bold text-primary">{selectedCall.sysCallNumber}</span> | Switches CPU
            Privilege from Ring 3 to Ring 0
          </p>

          {activeStep === 2 && (
            <motion.div
              layoutId="trapPulse"
              className="absolute inset-0 bg-amber-500/10 animate-pulse pointer-events-none"
            />
          )}
        </div>

        {/* Ring 0: Kernel Space */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            activeStep === 3 ? 'border-orange-500 bg-orange-500/10 shadow-lg' : 'border-orange-500/30 glass'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
              <FaShieldAlt aria-hidden="true" /> KERNEL SPACE (Ring 0 - Fully Privileged)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-600">
              Supervisor Mode
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Kernel Handler Execution: <code className="font-semibold">{selectedCall.kernelRoutine}</code>
          </p>
        </div>

        {/* Hardware Abstraction */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            activeStep === 4 ? 'border-green-500 bg-green-500/10 shadow-lg' : 'border-green-500/30 glass'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1.5">
              <FaMicrochip aria-hidden="true" /> HARDWARE / DEVICE CONTROLLERS
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-500/10 text-green-600">
              Direct Memory Access (DMA)
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Hardware Response: <code className="font-semibold">{selectedCall.hardwareEffect}</code>
          </p>
        </div>
      </div>

      {/* Execution Summary Box */}
      <AnimatePresence>
        {activeStep === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-2 text-xs text-green-600 dark:text-green-400"
          >
            <FaCheck className="shrink-0" aria-hidden="true" />
            <span>
              <strong>System Call Complete!</strong> Control and return status passed back to Application in User Space.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
