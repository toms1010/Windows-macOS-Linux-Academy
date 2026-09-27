import { motion } from 'framer-motion';

const links = [
  { name: 'Linux Documentation', url: 'https://www.kernel.org/doc/' },
  { name: 'Ubuntu', url: 'https://ubuntu.com/' },
  { name: 'Node.js', url: 'https://nodejs.org/' },
  { name: 'PostgreSQL', url: 'https://www.postgresql.org/' },
  { name: 'Docker', url: 'https://www.docker.com/' },
  { name: 'Git', url: 'https://git-scm.com/' },
];

export default function Resources() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-4xl font-bold mb-6">Resources</h1>
      <ul className="space-y-3">
        {links.map((link, i) => (
          <li key={i}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
