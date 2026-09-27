import { motion } from 'framer-motion';

const events = [
  { year: 1985, title: 'Windows 1.0' },
  { year: 1991, title: 'Linux Kernel released' },
  { year: 1993, title: 'Debian' },
  { year: 1994, title: 'Linux 1.0' },
  { year: 1995, title: 'Windows 95' },
  { year: 2001, title: 'Windows XP' },
  { year: 2003, title: 'Windows Server' },
  { year: 2016, title: 'Windows Subsystem for Linux' },
  { year: 2026, title: 'Linux dominates cloud' },
];

export default function Timeline() {
  return (
    <section className="my-16">
      <h2 className="text-3xl font-bold mb-8">History Timeline</h2>
      <div className="relative flex flex-col gap-6 before:absolute before:left-4 before:top-0 before:h-full before:w-1 before:bg-primary/30">
        {events.map((event, i) => (
          <motion.div
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-6 ml-12 relative"
          >
            <div className="absolute -left-10 w-6 h-6 rounded-full bg-primary border-4 border-white dark:border-slate-800"></div>
            <span className="text-xl font-mono font-bold text-primary min-w-[60px]">{event.year}</span>
            <span className="text-lg">{event.title}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
