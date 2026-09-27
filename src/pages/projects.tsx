import { motion } from 'framer-motion';

const projects = [
  { name: 'Personal File Backup', difficulty: 'Easy', tech: 'rsync, cron' },
  { name: 'System Monitor', difficulty: 'Medium', tech: 'Python, Flask' },
  { name: 'Log Analyzer', difficulty: 'Medium', tech: 'awk, sed' },
  { name: 'Git Server', difficulty: 'Hard', tech: 'Git, SSH' },
  { name: 'Docker Server', difficulty: 'Hard', tech: 'Docker, Compose' },
];

export default function Projects() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-4xl font-bold mb-4">Ubuntu Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p, i) => (
          <div key={i} className="glass p-4 rounded-2xl hover:shadow-lg transition">
            <h3 className="text-xl font-semibold">{p.name}</h3>
            <p className="text-sm">Difficulty: {p.difficulty}</p>
            <p className="text-sm text-muted-foreground">{p.tech}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
