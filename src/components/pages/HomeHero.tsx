import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl glass p-8 md:p-12 mb-12">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Windows <span className="text-primary">vs</span> Linux
          <br />
          <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Academy
          </span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Master operating systems, kernels, and backend engineering with interactive lessons, diagrams, and quizzes.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/os" className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition shadow-lg hover:shadow-xl">
            Start Learning
          </Link>
          <Link href="/comparison" className="px-6 py-3 glass rounded-full font-medium hover:bg-white/30 dark:hover:bg-white/10 transition">
            Compare OS
          </Link>
        </div>
      </motion.div>
      <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl pointer-events-none"></div>
    </section>
  );
}
