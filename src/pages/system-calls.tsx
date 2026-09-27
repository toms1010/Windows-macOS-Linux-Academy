import Head from 'next/head';
import { motion } from 'framer-motion';
import LabHeader from '@/components/labs/LabHeader';
import SyscallTracer from '@/components/labs/SyscallTracer';
import SystemCallDiagram from '@/components/labs/SystemCallDiagram';
import { FaExchangeAlt } from 'react-icons/fa';

export default function SystemCallsPage() {
  return (
    <>
      <Head>
        <title>System Calls & strace Simulator | Win vs Linux Academy</title>
        <meta
          name="description"
          content="Trace cat, echo and ls step by step, then animate the Ring 3 to Ring 0 privilege transition."
        />
      </Head>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <LabHeader
          icon={<FaExchangeAlt className="text-cyan-500" />}
          title="System Calls & strace Simulator"
          description="See what the kernel really does for cat, echo and ls — then animate the CPU privilege switch behind every syscall."
          badge="Educational simulation — no real syscalls are executed"
          topic="Kernels & Syscalls"
          difficulty="Intermediate"
          timeEstimate="10 min"
          tryList={[
            'Play the cat trace and click each syscall to read its purpose.',
            'Compare echo (one write, no files) with ls (directory reads).',
            'Run the Ring 3 → Ring 0 animation for sys_fork() below.',
          ]}
        />
        <SyscallTracer />
        <SystemCallDiagram />
      </motion.div>
    </>
  );
}
