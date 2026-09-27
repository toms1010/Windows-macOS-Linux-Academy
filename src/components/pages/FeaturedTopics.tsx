import GlassCard from '../ui/GlassCard';
import { FaLinux, FaWindows, FaServer, FaCode } from 'react-icons/fa';

const topics = [
  { icon: FaWindows, title: 'Windows', desc: 'NT Kernel, UI, and development' },
  { icon: FaLinux, title: 'Linux', desc: 'Open source, kernel, distros' },
  { icon: FaServer, title: 'Backend', desc: 'Node.js, Docker, NGINX' },
  { icon: FaCode, title: 'Kernels', desc: 'Monolithic, Micro, Hybrid' },
];

export default function FeaturedTopics() {
  return (
    <section className="my-16">
      <h2 className="text-3xl font-bold mb-6">Featured Topics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topics.map((t, i) => (
          <GlassCard key={i} className="text-center">
            <t.icon className="text-4xl text-primary mx-auto mb-3" />
            <h3 className="text-xl font-semibold">{t.title}</h3>
            <p className="text-muted-foreground text-sm">{t.desc}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
