import Head from 'next/head';
import { motion } from 'framer-motion';
import LabHeader from '@/components/labs/LabHeader';
import CpuSchedulingLab from '@/components/labs/CpuSchedulingLab';
import { FaMicrochip } from 'react-icons/fa';

export default function CpuSchedulingPage() {
  return (
    <>
      <Head>
        <title>CPU Scheduling Simulator | Win vs Linux Academy</title>
        <meta
          name="description"
          content="Simulate FCFS, SJF and Round Robin scheduling with an animated Gantt chart, metrics and step-by-step explanations."
        />
      </Head>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <LabHeader
          icon={<FaMicrochip className="text-blue-500" />}
          title="CPU Scheduling Simulator"
          description="Decide which process runs next. Compare FCFS, SJF, SRTF and Round Robin on the same workload and see why averages differ."
          badge="Deterministic simulation — same input always gives the same schedule"
          topic="CPU Scheduling"
          difficulty="Intermediate"
          timeEstimate="10–15 min"
          tryList={[
            'Press Play on the Classic trio, then switch to SJF and replay it.',
            'Try the Convoy effect preset: which algorithm suffers most, and why?',
            'Load SRTF preemptions and watch short arrivals interrupt the runner.',
            'Set Round Robin quantum to 1, then to 8 — count the context switches.',
          ]}
        />
        <CpuSchedulingLab />
      </motion.div>
    </>
  );
}
