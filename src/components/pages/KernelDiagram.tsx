import { motion } from 'framer-motion';
import { FaWindowMaximize, FaCode, FaExchangeAlt, FaMicrochip, FaCog, FaHdd } from 'react-icons/fa';

const layers = [
  { label: 'Applications', icon: FaWindowMaximize, hint: 'Word, games, browser — unprivileged Ring 3' },
  { label: 'System APIs', icon: FaCode, hint: 'Win32, POSIX libc — friendly wrappers' },
  { label: 'System Calls', icon: FaExchangeAlt, hint: 'syscall trap — the Ring 3 → Ring 0 gate' },
  { label: 'Kernel', icon: FaMicrochip, hint: 'Scheduler, memory, VFS — fully privileged' },
  { label: 'Drivers', icon: FaCog, hint: 'Translate kernel requests for hardware' },
  { label: 'Hardware', icon: FaHdd, hint: 'CPU, RAM, disk, NIC — silicon' },
];

export default function KernelDiagram() {
  return (
    <div className="relative flex flex-col items-center gap-2 py-8" role="img" aria-label="Kernel architecture stack: applications, system APIs, system calls, kernel, drivers, hardware">
      {/* Subtle travelling pulse showing request flow (disabled by reduced-motion CSS) */}
      <motion.span
        aria-hidden="true"
        className="absolute left-1/2 w-2 h-2 -ml-1 rounded-full bg-primary shadow-[0_0_12px_2px_rgba(37,99,235,0.6)]"
        style={{ top: '4%' }}
        animate={{ top: ['4%', '94%'], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {layers.map((layer, i) => (
        <motion.div
          key={layer.label}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.12, duration: 0.25 }}
          className="glass px-6 py-3 rounded-2xl w-full max-w-md text-center border border-primary/20 hover:bg-primary/5 transition"
        >
          <p className="text-lg font-medium flex items-center justify-center gap-2">
            <layer.icon className="text-primary" aria-hidden="true" />
            {layer.label}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{layer.hint}</p>
          {i < layers.length - 1 && (
            <div className="text-xl my-0.5 text-primary/60" aria-hidden="true">
              ↓
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
