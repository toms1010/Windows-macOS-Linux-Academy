import { motion } from 'framer-motion';

export default function Linux() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-4xl font-bold mb-4">Linux Overview</h1>
      <div className="glass p-6 rounded-2xl">
        <h2 className="text-2xl font-semibold">Open Source Kernel</h2>
        <p className="mt-2">Linux is a monolithic kernel that powers most servers, supercomputers, and Android devices.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/40 rounded-full">Distributions: Ubuntu, Debian, Fedora</span>
          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/40 rounded-full">Package Managers: apt, yum, pacman</span>
          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/40 rounded-full">Shell: Bash, Zsh</span>
        </div>
      </div>
    </motion.div>
  );
}
