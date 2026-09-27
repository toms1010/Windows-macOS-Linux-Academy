import Head from 'next/head';
import { motion } from 'framer-motion';
import LabHeader from '@/components/labs/LabHeader';
import VirtualMemoryLab from '@/components/labs/VirtualMemoryLab';
import { FaMemory } from 'react-icons/fa';

export default function VirtualMemoryPage() {
  return (
    <>
      <Head>
        <title>Virtual Memory Simulator | Win vs Linux Academy</title>
        <meta
          name="description"
          content="Visualize pages, frames, TLB, page tables and page faults with FIFO and LRU replacement."
        />
      </Head>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <LabHeader
          icon={<FaMemory className="text-purple-500" />}
          title="Virtual Memory Simulator"
          description="Follow every memory access from virtual address to physical frame. Learn why a TLB hit, a page hit and a page fault are three different things."
          badge="Deterministic simulation — same input always gives the same trace"
          topic="Memory Management"
          difficulty="Intermediate"
          timeEstimate="10–15 min"
          tryList={[
            'Step through the classic reference string and watch the first fault happen.',
            'Switch between FIFO and LRU on the scan preset — which faults less?',
            'Compare against the Optimal baseline, then hunt the Belady anomaly at the bottom.',
            'Reduce frames to 1, then raise to 5, and compare total faults.',
          ]}
        />
        <VirtualMemoryLab />
      </motion.div>
    </>
  );
}
