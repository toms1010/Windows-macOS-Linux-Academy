import { motion } from 'framer-motion';
import KernelDiagram from '@/components/pages/KernelDiagram';

export default function Kernel() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-4xl font-bold mb-4">What is a Kernel?</h1>
      <p className="text-lg text-muted-foreground mb-6">
        The kernel is the core of an operating system, managing hardware, resources, and system calls.
      </p>
      <div className="glass p-6 rounded-2xl mb-8">
        <h2 className="text-2xl font-semibold">Key Responsibilities</h2>
        <ul className="list-disc list-inside grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
          <li>CPU Scheduling</li>
          <li>Memory Management</li>
          <li>Device Drivers</li>
          <li>Networking</li>
          <li>File Systems</li>
          <li>Security & Interrupts</li>
        </ul>
      </div>
      <KernelDiagram />
    </motion.div>
  );
}
