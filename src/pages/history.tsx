import Timeline from '@/components/pages/Timeline';
import { motion } from 'framer-motion';

export default function History() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-4xl font-bold mb-4">History Timeline</h1>
      <Timeline />
    </motion.div>
  );
}
