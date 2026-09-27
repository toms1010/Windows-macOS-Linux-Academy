import { motion } from 'framer-motion';

export default function KernelTypes() {
  const types = [
    { name: 'Monolithic', desc: 'Single large kernel (Linux)', example: 'Linux' },
    { name: 'Microkernel', desc: 'Minimal kernel, services in user space', example: 'Minix' },
    { name: 'Hybrid', desc: 'Combination of monolithic and microkernel', example: 'Windows NT' },
    { name: 'Exokernel', desc: 'Extremely minimal, applications manage hardware', example: 'MIT Exokernel' },
    { name: 'Nanokernel', desc: 'Very small, hardware abstraction layer', example: 'L4' },
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-4xl font-bold mb-4">Kernel Types</h1>
      <div className="grid gap-4">
        {types.map((t, i) => (
          <div key={i} className="glass p-4 rounded-2xl">
            <h3 className="text-xl font-bold">{t.name}</h3>
            <p>{t.desc}</p>
            <span className="text-sm text-muted-foreground">Example: {t.example}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
