import { motion } from 'framer-motion';
import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';
import { 
  FaWindows, FaApple, FaLinux, FaChartBar, FaBrain, FaTerminal,
  FaCode, FaFile, FaCalendarAlt, FaFolderOpen, FaShieldAlt,
  FaCloud, FaLaptop, FaRoad, FaBook, FaFilePdf, FaDownload,
  FaPrint, FaCheck, FaArrowRight, FaServer, FaDatabase,
  FaNetworkWired, FaMemory, FaMicrochip, FaCogs
} from 'react-icons/fa';

export default function LearningHub() {
  // Static classes only — Tailwind JIT cannot generate `border-${color}-500`
  // template strings, so map every color explicitly.
  const borderFor: Record<string, string> = {
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    green: 'border-green-500',
    cyan: 'border-cyan-500',
    orange: 'border-orange-500',
    pink: 'border-pink-500',
    yellow: 'border-yellow-500',
    red: 'border-red-500',
    gray: 'border-gray-500',
    indigo: 'border-indigo-500',
  };
  const features = [
    {
      icon: <FaChartBar className="text-blue-500" />,
      title: 'Interactive Comparison Charts',
      desc: 'Visual comparisons of Windows, macOS, and Linux performance, security, and features',
      href: '/triple-comparison',
      color: 'blue'
    },
    {
      icon: <FaBrain className="text-purple-500" />,
      title: 'Quiz & Practice Tests',
      desc: 'Test your knowledge with interactive quizzes and practice exercises',
      href: '/quiz',
      color: 'purple'
    },
    {
      icon: <FaTerminal className="text-green-500" />,
      title: 'Linux Terminal Simulator',
      desc: 'Practice Linux commands in an interactive terminal environment',
      href: '/commands',
      color: 'green'
    },
    {
      icon: <FaCode className="text-cyan-500" />,
      title: 'Windows CMD & PowerShell Guide',
      desc: 'Learn Windows command line and PowerShell scripting',
      href: '/commands',
      color: 'cyan'
    },
    {
      icon: <FaFile className="text-orange-500" />,
      title: 'Ubuntu Command Cheat Sheet',
      desc: 'Quick reference for essential Ubuntu commands and syntax',
      href: '/ubuntu-guide',
      color: 'orange'
    },
    {
      icon: <FaCalendarAlt className="text-pink-500" />,
      title: 'Timeline of Operating Systems',
      desc: 'Interactive timeline showing OS evolution from 1984 to present',
      href: '/evolution',
      color: 'pink'
    },
    {
      icon: <FaFolderOpen className="text-yellow-500" />,
      title: 'File System Explorer',
      desc: 'Compare NTFS, APFS, and ext4 file systems',
      href: '/os-overview',
      color: 'yellow'
    },
    {
      icon: <FaShieldAlt className="text-red-500" />,
      title: 'Security Comparison',
      desc: 'Compare security features of Windows, macOS, and Linux',
      href: '/triple-comparison',
      color: 'red'
    },
    {
      icon: <FaCloud className="text-cyan-500" />,
      title: 'Cloud & Server Overview',
      desc: 'Learn about cloud computing, servers, and deployment',
      href: '/ubuntu-guide',
      color: 'cyan'
    },
    {
      icon: <FaLaptop className="text-indigo-500" />,
      title: 'Programming Environment Comparison',
      desc: 'Compare development tools and languages across OS platforms',
      href: '/triple-comparison',
      color: 'indigo'
    },
    {
      icon: <FaRoad className="text-green-500" />,
      title: 'Learning Roadmap',
      desc: 'Step-by-step path from beginner to expert in OS and backend development',
      href: '/roadmap',
      color: 'green'
    },
    {
      icon: <FaBook className="text-orange-500" />,
      title: 'Resources & References',
      desc: 'Curated list of documentation, tools, and learning materials',
      href: '/resources',
      color: 'orange'
    },
  ];

  const quickTools = [
    { icon: <FaFilePdf />, label: 'Export Notes as PDF', color: 'red' },
    { icon: <FaDownload />, label: 'Download Cheat Sheets', color: 'blue' },
    { icon: <FaPrint />, label: 'Print Study Materials', color: 'gray' },
    { icon: <FaCheck />, label: 'Track Progress', color: 'green' },
  ];

  const osIcons = [
    { icon: <FaWindows className="text-blue-500" />, label: 'Windows', color: 'blue' },
    { icon: <FaApple className="text-gray-600 dark:text-gray-300" />, label: 'macOS', color: 'gray' },
    { icon: <FaLinux className="text-orange-500" />, label: 'Linux', color: 'orange' },
  ];

  const categories = [
    {
      title: '📊 Comparison Tools',
      items: ['Interactive Comparison Charts', 'Security Comparison', 'Programming Environment Comparison'],
      icon: <FaChartBar />
    },
    {
      title: '💻 Command Line',
      items: ['Linux Terminal Simulator', 'Windows CMD & PowerShell Guide', 'Ubuntu Command Cheat Sheet'],
      icon: <FaTerminal />
    },
    {
      title: '📖 Learning Resources',
      items: ['Timeline of Operating Systems', 'File System Explorer', 'Cloud & Server Overview'],
      icon: <FaBook />
    },
    {
      title: '🎯 Study Tools',
      items: ['Quiz & Practice Tests', 'Learning Roadmap', 'Resources & References'],
      icon: <FaBrain />
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          🎓 Learning <span className="text-primary">Hub</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your complete resource for mastering operating systems, command line, and backend development
        </p>
      </div>

      {/* OS Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {osIcons.map((os, i) => (
            <GlassCard key={i} className={`text-center border-t-4 ${borderFor[os.color]} hover:scale-105 transition`}>
            <div className="text-5xl flex justify-center mb-2">{os.icon}</div>
            <h3 className="text-xl font-bold">{os.label}</h3>
            <p className="text-xs text-muted-foreground">Click to explore {os.label} resources</p>
          </GlassCard>
        ))}
      </div>

      {/* Features Grid */}
      <h2 className="text-2xl font-bold mt-8 flex items-center gap-2">
        <FaCogs className="text-primary" /> Interactive Features
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, i) => (
          <Link key={i} href={feature.href}>
            <GlassCard className={`hover:scale-105 transition border-l-4 ${borderFor[feature.color]} hover:shadow-lg cursor-pointer`}>
              <div className="flex items-start gap-3">
                <div className="text-3xl mt-1">{feature.icon}</div>
                <div>
                  <h3 className="font-bold text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                    <span>Explore</span>
                    <FaArrowRight className="text-xs" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      {/* Quick Tools */}
      <h2 className="text-2xl font-bold mt-8 flex items-center gap-2">
        <FaCogs className="text-primary" /> Quick Tools
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickTools.map((tool, i) => (
          <button key={i} className={`p-4 glass rounded-2xl text-center hover:scale-105 transition border-t-4 ${borderFor[tool.color]}`}>
            <div className="text-3xl flex justify-center mb-1">{tool.icon}</div>
            <p className="text-xs font-medium">{tool.label}</p>
          </button>
        ))}
      </div>

      {/* Categories */}
      <h2 className="text-2xl font-bold mt-8 flex items-center gap-2">
        <FaBook className="text-primary" /> Categories
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category, i) => (
          <GlassCard key={i} className="hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{category.icon}</span>
              <h3 className="font-bold">{category.title}</h3>
            </div>
            <ul className="space-y-1">
              {category.items.map((item, j) => (
                <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  {item}
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>

      {/* Progress Tracking */}
      <GlassCard className="bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-950/20 dark:to-orange-950/20 border-2 border-primary/20">
        <h2 className="text-2xl font-bold mb-4 text-center">📊 Your Learning Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">0%</p>
            <p className="text-xs text-muted-foreground">Overall Progress</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-500">0</p>
            <p className="text-xs text-muted-foreground">Lessons Completed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-500">0</p>
            <p className="text-xs text-muted-foreground">Quizzes Taken</p>
          </div>
        </div>
        <div className="mt-4 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: '0%' }} />
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">Start learning to track your progress!</p>
      </GlassCard>

      {/* Call to Action */}
      <GlassCard className="text-center">
        <h2 className="text-xl font-bold mb-2">🚀 Ready to Start Learning?</h2>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Explore our comprehensive resources and become an expert in operating systems and backend development.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link href="/os" className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition text-sm">
            Start Learning
          </Link>
          <Link href="/quiz" className="px-6 py-2 glass rounded-full hover:bg-white/30 dark:hover:bg-white/10 transition text-sm">
            Take a Quiz
          </Link>
          <button className="px-6 py-2 glass rounded-full hover:bg-white/30 dark:hover:bg-white/10 transition text-sm flex items-center gap-2">
            <FaFilePdf /> Export Notes
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
