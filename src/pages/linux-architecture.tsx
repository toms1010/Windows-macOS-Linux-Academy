import { motion } from 'framer-motion';

const layers = ['Applications', 'Shell', 'Libraries', 'Linux Kernel', 'Hardware'];

export default function LinuxArchitecture() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-4xl font-bold mb-4">Linux Architecture</h1>
      <div className="flex flex-col items-center gap-4 py-8">
        {layers.map((layer, i) => (
          <div key={i} className="glass px-8 py-4 rounded-2xl w-full max-w-md text-center text-lg font-medium border border-primary/20 hover:bg-primary/5 transition cursor-pointer">
            {layer}
            {i < layers.length - 1 && <div className="text-2xl my-1">↓</div>}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
