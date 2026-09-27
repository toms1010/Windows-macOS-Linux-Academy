import Link from 'next/link';

const steps = [
  { label: 'Programming Fundamentals', href: '/roadmap' },
  { label: 'JavaScript & Node.js', href: '/roadmap' },
  { label: 'Express & REST API', href: '/roadmap' },
  { label: 'PostgreSQL & JWT', href: '/roadmap' },
  { label: 'Linux & Docker', href: '/roadmap' },
  { label: 'NGINX & Cloud', href: '/roadmap' },
];

export default function LearningRoadmap() {
  return (
    <section className="my-16">
      <h2 className="text-3xl font-bold mb-6">Learning Roadmap</h2>
      <div className="glass p-6 rounded-2xl">
        <div className="flex flex-wrap gap-3">
          {steps.map((s, i) => (
            <Link key={i} href={s.href} className="px-4 py-2 bg-primary/10 rounded-full hover:bg-primary/20 transition">
              {i+1}. {s.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
