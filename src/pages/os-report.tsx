import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import {
  FaWindows, FaApple, FaLinux,
  FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';
import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement
} from 'chart.js';
import { Bar, Radar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement
);

export default function OSReport() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: '📋 Overview' },
    { id: 'history', label: '📜 History' },
    { id: 'windows', label: '🪟 Windows' },
    { id: 'macos', label: '🍎 macOS' },
    { id: 'linux', label: '🐧 Linux' },
    { id: 'comparison', label: '📊 Comparison' },
    { id: 'programming', label: '💻 Programming' },
    { id: 'cybersecurity', label: '🔐 Cybersecurity' },
    { id: 'summary', label: '📌 Summary' },
  ];

  // Data for charts
  const featureData = {
    labels: ['Performance', 'Security', 'Ease of Use', 'Gaming', 'Programming', 'Customization', 'Software Compatibility', 'Cloud & Servers'],
    datasets: [
      {
        label: 'Windows',
        data: [8, 8, 9, 10, 8, 8, 10, 7],
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 2,
      },
      {
        label: 'macOS',
        data: [9, 9, 10, 5, 9, 6, 8, 6],
        backgroundColor: 'rgba(107, 114, 128, 0.7)',
        borderColor: 'rgba(107, 114, 128, 1)',
        borderWidth: 2,
      },
      {
        label: 'Linux',
        data: [10, 10, 7, 7, 10, 10, 7, 10],
        backgroundColor: 'rgba(234, 88, 12, 0.7)',
        borderColor: 'rgba(234, 88, 12, 1)',
        borderWidth: 2,
      },
    ],
  };

  const memoryData = {
    labels: ['Linux', 'macOS', 'Windows'],
    datasets: [
      {
        label: 'RAM Usage (Idle - GB)',
        data: [1.2, 2.5, 3.5],
        backgroundColor: ['rgba(234, 88, 12, 0.7)', 'rgba(107, 114, 128, 0.7)', 'rgba(37, 99, 235, 0.7)'],
        borderColor: ['rgba(234, 88, 12, 1)', 'rgba(107, 114, 128, 1)', 'rgba(37, 99, 235, 1)'],
        borderWidth: 2,
      },
    ],
  };

  const marketShareData = {
    labels: ['Windows', 'macOS', 'Linux', 'ChromeOS', 'Others'],
    datasets: [
      {
        data: [72, 16, 4, 3, 5],
        backgroundColor: ['rgba(37, 99, 235, 0.8)', 'rgba(107, 114, 128, 0.8)', 'rgba(234, 88, 12, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.8)'],
        borderColor: ['#2563eb', '#6b7280', '#ea580c', '#10b981', '#f59e0b'],
        borderWidth: 2,
      },
    ],
  };

  const radarData = {
    labels: ['Performance', 'Security', 'Gaming', 'Development', 'Customization', 'Ease of Use'],
    datasets: [
      {
        label: 'Windows',
        data: [8, 8, 10, 8, 8, 9],
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: 'rgba(37, 99, 235, 1)',
        pointBackgroundColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 2,
      },
      {
        label: 'macOS',
        data: [9, 9, 5, 9, 6, 10],
        backgroundColor: 'rgba(107, 114, 128, 0.2)',
        borderColor: 'rgba(107, 114, 128, 1)',
        pointBackgroundColor: 'rgba(107, 114, 128, 1)',
        borderWidth: 2,
      },
      {
        label: 'Linux',
        data: [10, 10, 7, 10, 10, 7],
        backgroundColor: 'rgba(234, 88, 12, 0.2)',
        borderColor: 'rgba(234, 88, 12, 1)',
        pointBackgroundColor: 'rgba(234, 88, 12, 1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, max: 10 },
    },
  };

  const memoryOptions = {
    responsive: true,
    indexAxis: 'y' as const,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { beginAtZero: true },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const },
      title: { display: false },
    },
  };

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false },
    },
    scales: {
      r: { beginAtZero: true, max: 10, ticks: { stepSize: 2 } },
    },
  };

  const windowsVersions = [
    { year: 1985, name: 'Windows 1.0', desc: 'First GUI version' },
    { year: 1990, name: 'Windows 3.0', desc: 'First successful version' },
    { year: 1995, name: 'Windows 95', desc: 'Start menu introduced' },
    { year: 2001, name: 'Windows XP', desc: 'Most popular version' },
    { year: 2007, name: 'Windows Vista', desc: 'Aero interface' },
    { year: 2009, name: 'Windows 7', desc: 'Stable and popular' },
    { year: 2012, name: 'Windows 8', desc: 'Touch interface' },
    { year: 2014, name: 'Windows 10', desc: 'Universal apps' },
    { year: 2021, name: 'Windows 11', desc: 'Centered Start menu' },
  ];

  const macVersions = [
    { year: 1984, name: 'System 1', desc: 'First Mac OS' },
    { year: 1997, name: 'Mac OS 8', desc: 'Modernized interface' },
    { year: 2001, name: 'Mac OS X 10.0', desc: 'Unix-based redesign' },
    { year: 2012, name: 'OS X Mountain Lion', desc: 'iCloud integration' },
    { year: 2016, name: 'macOS Sierra', desc: 'Siri integration' },
    { year: 2020, name: 'macOS Big Sur', desc: 'Apple Silicon support' },
    { year: 2023, name: 'macOS Sonoma', desc: 'New features' },
  ];

  const linuxVersions = [
    { year: 1991, name: 'Linux Kernel 0.01', desc: 'First release' },
    { year: 1993, name: 'Debian', desc: 'Stable distribution' },
    { year: 1994, name: 'Linux 1.0', desc: 'First stable kernel' },
    { year: 2004, name: 'Ubuntu', desc: 'User-friendly Linux' },
    { year: 2008, name: 'Android', desc: 'Linux-based mobile OS' },
  ];

  const linuxDistros = [
    { name: 'Ubuntu', based: 'Debian', difficulty: 'Easy', stability: 'High', bestFor: 'Beginners, Desktop', package: 'APT', desktop: 'GNOME' },
    { name: 'Debian', based: 'Independent', difficulty: 'Medium', stability: 'Very High', bestFor: 'Servers, Advanced', package: 'APT', desktop: 'GNOME/KDE' },
    { name: 'Fedora', based: 'RHEL', difficulty: 'Medium', stability: 'Good', bestFor: 'Developers', package: 'DNF', desktop: 'GNOME' },
    { name: 'Linux Mint', based: 'Ubuntu', difficulty: 'Easy', stability: 'High', bestFor: 'Windows Switchers', package: 'APT', desktop: 'Cinnamon' },
    { name: 'Arch Linux', based: 'Independent', difficulty: 'Hard', stability: 'Rolling', bestFor: 'Advanced Users', package: 'Pacman', desktop: 'Custom' },
    { name: 'Kali Linux', based: 'Debian', difficulty: 'Medium', stability: 'Good', bestFor: 'Cybersecurity', package: 'APT', desktop: 'XFCE' },
    { name: 'Pop!_OS', based: 'Ubuntu', difficulty: 'Easy', stability: 'High', bestFor: 'Developers, Gamers', package: 'APT', desktop: 'GNOME' },
    { name: 'Rocky Linux', based: 'RHEL', difficulty: 'Medium', stability: 'Very High', bestFor: 'Enterprise', package: 'DNF', desktop: 'GNOME' },
  ];

  const programmingRecommendations = [
    { field: 'Web Development', recommended: 'Linux', reason: 'Best tooling and package management' },
    { field: 'Backend Development', recommended: 'Linux', reason: 'Server environment match' },
    { field: 'Full Stack Development', recommended: 'Linux', reason: 'Versatile and powerful' },
    { field: 'Mobile (Android)', recommended: 'Windows / Linux', reason: 'Android Studio runs well' },
    { field: 'Mobile (iOS)', recommended: 'macOS', reason: 'Xcode only on macOS' },
    { field: 'AI & Machine Learning', recommended: 'Linux', reason: 'GPU support and tools' },
    { field: 'Data Science', recommended: 'Linux', reason: 'Python and data tools' },
    { field: 'Game Development', recommended: 'Windows', reason: 'Unreal, Unity best on Windows' },
    { field: 'Desktop Applications', recommended: 'Windows', reason: 'Widest user base' },
    { field: 'Cloud Computing', recommended: 'Linux', reason: 'Cloud servers run Linux' },
    { field: 'DevOps', recommended: 'Linux', reason: 'Docker, Kubernetes, CI/CD' },
    { field: 'Embedded Systems', recommended: 'Linux', reason: 'Yocto, Buildroot support' },
  ];

  const cybersecurityRecommendations = [
    { area: 'Ethical Hacking', recommended: 'Linux', tool: 'Kali Linux, Parrot OS' },
    { area: 'Penetration Testing', recommended: 'Linux', tool: 'Metasploit, Nmap, Burp Suite' },
    { area: 'Digital Forensics', recommended: 'Linux', tool: 'Autopsy, Sleuth Kit' },
    { area: 'Malware Analysis', recommended: 'Linux', tool: 'Ghidra, Radare2' },
    { area: 'Reverse Engineering', recommended: 'Linux / Windows', tool: 'IDA Pro, Ghidra' },
    { area: 'Security Operations', recommended: 'Windows & Linux', tool: 'SIEM tools' },
    { area: 'Network Security', recommended: 'Linux', tool: 'Wireshark, tcpdump' },
    { area: 'Server Security', recommended: 'Linux', tool: 'SELinux, AppArmor' },
    { area: 'Cloud Security', recommended: 'Linux', tool: 'Cloud security tools' },
    { area: 'Active Directory', recommended: 'Windows Server', tool: 'AD, Group Policy' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Cover Page */}
      <div className="glass p-8 rounded-3xl text-center border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-900/50">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Windows vs. macOS vs. Linux
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground mb-6">
          Operating System Comparison
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Features, Performance, Security, and Use Cases
        </p>
        <div className="flex justify-center gap-8 text-6xl">
          <FaWindows className="text-blue-600" />
          <FaApple className="text-gray-600 dark:text-gray-300" />
          <FaLinux className="text-orange-500" />
        </div>
        <p className="mt-6 text-sm text-muted-foreground">Research Report | 2026</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/20 pb-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-full transition text-sm ${
              activeSection === section.id ? 'bg-primary text-white' : 'glass hover:bg-primary/10'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="space-y-8">
        {/* Introduction */}
        {activeSection === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-3xl font-bold">Introduction</h2>
            <div className="glass p-6 rounded-2xl space-y-4">
              <h3 className="text-xl font-semibold">What is an Operating System?</h3>
              <p className="text-muted-foreground">
                An <strong>Operating System (OS)</strong> is system software that manages computer hardware, 
                software resources, and provides common services for computer programs. It acts as an intermediary 
                between users and the computer hardware.
              </p>
              <h3 className="text-xl font-semibold">Importance of an Operating System</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Manages hardware resources (CPU, memory, storage)</li>
                <li>Provides user interface (GUI or CLI)</li>
                <li>Runs and manages applications</li>
                <li>Handles security and access control</li>
                <li>Enables communication between software and hardware</li>
              </ul>
              <h3 className="text-xl font-semibold">Brief History</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Windows:</strong> 1985 - Present (Microsoft)</li>
                <li><strong>macOS:</strong> 1984 - Present (Apple)</li>
                <li><strong>Linux:</strong> 1991 - Present (Open Source)</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* History Timeline */}
        {activeSection === 'history' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-3xl font-bold">History of Operating Systems</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Windows Timeline */}
              <GlassCard className="border-t-4 border-blue-500">
                <h3 className="text-xl font-bold text-blue-600 mb-4">🪟 Windows</h3>
                <div className="space-y-3">
                  {windowsVersions.map((v, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <span className="font-mono font-bold text-blue-500 min-w-[50px]">{v.year}</span>
                      <div>
                        <span className="font-semibold">{v.name}</span>
                        <p className="text-muted-foreground text-xs">{v.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* macOS Timeline */}
              <GlassCard className="border-t-4 border-gray-500">
                <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-4">🍎 macOS</h3>
                <div className="space-y-3">
                  {macVersions.map((v, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <span className="font-mono font-bold text-gray-500 min-w-[50px]">{v.year}</span>
                      <div>
                        <span className="font-semibold">{v.name}</span>
                        <p className="text-muted-foreground text-xs">{v.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Linux Timeline */}
              <GlassCard className="border-t-4 border-orange-500">
                <h3 className="text-xl font-bold text-orange-600 mb-4">🐧 Linux</h3>
                <div className="space-y-3">
                  {linuxVersions.map((v, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <span className="font-mono font-bold text-orange-500 min-w-[50px]">{v.year}</span>
                      <div>
                        <span className="font-semibold">{v.name}</span>
                        <p className="text-muted-foreground text-xs">{v.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {/* Windows Overview */}
        {activeSection === 'windows' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-3xl font-bold text-blue-600">🪟 Windows Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard>
                <h3 className="text-xl font-semibold mb-3">Features</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Graphical User Interface (GUI)</li>
                  <li>Start Menu and Taskbar</li>
                  <li>Windows Subsystem for Linux (WSL)</li>
                  <li>DirectX for gaming</li>
                  <li>Microsoft Store</li>
                  <li>Cortana voice assistant</li>
                  <li>Windows Hello biometric login</li>
                  <li>Virtual desktops</li>
                </ul>
              </GlassCard>
              <GlassCard>
                <h3 className="text-xl font-semibold mb-3">Advantages</h3>
                <ul className="list-disc list-inside text-green-600 space-y-1">
                  <li>Largest software library</li>
                  <li>Best gaming platform</li>
                  <li>Wide hardware support</li>
                  <li>Easy to use</li>
                  <li>Strong enterprise tools</li>
                </ul>
                <h3 className="text-xl font-semibold mt-4 mb-3">Disadvantages</h3>
                <ul className="list-disc list-inside text-red-500 space-y-1">
                  <li>Higher hardware requirements</li>
                  <li>Frequent updates</li>
                  <li>Paid license</li>
                  <li>More malware targets</li>
                </ul>
                <h3 className="text-xl font-semibold mt-4 mb-3">Best Use Cases</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Gaming</li>
                  <li>Business and enterprise</li>
                  <li>Office productivity</li>
                  <li>Software development (.NET, C#)</li>
                  <li>General use</li>
                </ul>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {/* macOS Overview */}
        {activeSection === 'macos' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-600 dark:text-gray-300">🍎 macOS Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard>
                <h3 className="text-xl font-semibold mb-3">Features</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Clean, minimalist interface</li>
                  <li>Dock and Finder</li>
                  <li>Spotlight search</li>
                  <li>Mission Control</li>
                  <li>iCloud integration</li>
                  <li>Time Machine backup</li>
                  <li>Continuity with iPhone/iPad</li>
                  <li>Apple Silicon optimization</li>
                </ul>
              </GlassCard>
              <GlassCard>
                <h3 className="text-xl font-semibold mb-3">Advantages</h3>
                <ul className="list-disc list-inside text-green-600 space-y-1">
                  <li>Excellent security</li>
                  <li>Optimized performance</li>
                  <li>Great creative software</li>
                  <li>Seamless Apple ecosystem</li>
                  <li>High build quality</li>
                </ul>
                <h3 className="text-xl font-semibold mt-4 mb-3">Disadvantages</h3>
                <ul className="list-disc list-inside text-red-500 space-y-1">
                  <li>Expensive hardware</li>
                  <li>Limited gaming</li>
                  <li>Apple-only hardware</li>
                  <li>Limited customization</li>
                </ul>
                <h3 className="text-xl font-semibold mt-4 mb-3">Best Use Cases</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Creative design (Final Cut Pro, Logic Pro)</li>
                  <li>iOS/macOS development</li>
                  <li>Photography and video editing</li>
                  <li>Music production</li>
                  <li>Web development</li>
                </ul>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {/* Linux Overview */}
        {activeSection === 'linux' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-3xl font-bold text-orange-600">🐧 Linux Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard>
                <h3 className="text-xl font-semibold mb-3">Features</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Open source</li>
                  <li>Highly customizable</li>
                  <li>Lightweight</li>
                  <li>Powerful command line</li>
                  <li>Package managers (APT, DNF, Pacman)</li>
                  <li>Multiple desktop environments</li>
                  <li>Excellent server support</li>
                  <li>Strong security</li>
                </ul>
              </GlassCard>
              <GlassCard>
                <h3 className="text-xl font-semibold mb-3">Advantages</h3>
                <ul className="list-disc list-inside text-green-600 space-y-1">
                  <li>Free and open source</li>
                  <li>Very secure</li>
                  <li>Lightweight</li>
                  <li>Highly customizable</li>
                  <li>Best for development</li>
                </ul>
                <h3 className="text-xl font-semibold mt-4 mb-3">Disadvantages</h3>
                <ul className="list-disc list-inside text-red-500 space-y-1">
                  <li>Learning curve</li>
                  <li>Limited commercial software</li>
                  <li>Driver issues sometimes</li>
                  <li>Limited gaming</li>
                </ul>
                <h3 className="text-xl font-semibold mt-4 mb-3">Best Use Cases</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Web development</li>
                  <li>Server administration</li>
                  <li>Cybersecurity</li>
                  <li>Cloud computing</li>
                  <li>DevOps</li>
                </ul>
              </GlassCard>
            </div>

            <h3 className="text-2xl font-semibold mt-6">Popular Linux Distributions</h3>
            <div className="overflow-x-auto glass rounded-2xl p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="p-3 text-left font-semibold">Distribution</th>
                    <th className="p-3 text-left">Based On</th>
                    <th className="p-3 text-left">Difficulty</th>
                    <th className="p-3 text-left">Stability</th>
                    <th className="p-3 text-left">Best For</th>
                    <th className="p-3 text-left">Package Manager</th>
                    <th className="p-3 text-left">Desktop</th>
                  </tr>
                </thead>
                <tbody>
                  {linuxDistros.map((distro, i) => (
                    <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                      <td className="p-3 font-medium">{distro.name}</td>
                      <td className="p-3">{distro.based}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          distro.difficulty === 'Easy' ? 'bg-green-500/20 text-green-600' :
                          distro.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-600' :
                          'bg-red-500/20 text-red-600'
                        }`}>
                          {distro.difficulty}
                        </span>
                      </td>
                      <td className="p-3">{distro.stability}</td>
                      <td className="p-3 text-xs">{distro.bestFor}</td>
                      <td className="p-3">{distro.package}</td>
                      <td className="p-3">{distro.desktop}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Comparison Charts */}
        {activeSection === 'comparison' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-3xl font-bold">Data Visualizations</h2>
            
            {/* Feature Rating Chart */}
            <GlassCard>
              <h3 className="text-xl font-semibold mb-4">📊 Feature Ratings (1-10)</h3>
              <div className="h-[400px]">
                <Bar data={featureData} options={chartOptions} />
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Memory Usage */}
              <GlassCard>
                <h3 className="text-xl font-semibold mb-4">💾 RAM Usage (Idle)</h3>
                <div className="h-[300px]">
                  <Bar data={memoryData} options={memoryOptions} />
                </div>
              </GlassCard>

              {/* Market Share */}
              <GlassCard>
                <h3 className="text-xl font-semibold mb-4">📈 Market Share</h3>
                <div className="h-[300px]">
                  <Pie data={marketShareData} options={pieOptions} />
                </div>
              </GlassCard>
            </div>

            {/* Radar Chart */}
            <GlassCard>
              <h3 className="text-xl font-semibold mb-4">🕸️ Radar Comparison</h3>
              <div className="h-[400px]">
                <Radar data={radarData} options={radarOptions} />
              </div>
            </GlassCard>

            {/* Detailed Comparison Table */}
            <GlassCard>
              <h3 className="text-xl font-semibold mb-4">📋 Detailed Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="p-3 text-left font-semibold">Category</th>
                      <th className="p-3 text-left text-blue-600">Windows</th>
                      <th className="p-3 text-left text-gray-600">macOS</th>
                      <th className="p-3 text-left text-orange-600">Linux</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Performance', '8/10', '9/10', '10/10'],
                      ['Security', '8/10', '9/10', '10/10'],
                      ['User Interface', '9/10', '10/10', '7/10'],
                      ['Memory Usage', '3.5 GB', '2.5 GB', '1.2 GB'],
                      ['Gaming', '10/10', '5/10', '7/10'],
                      ['Programming', '8/10', '9/10', '10/10'],
                      ['Cloud Computing', '7/10', '6/10', '10/10'],
                      ['Servers', '7/10', '5/10', '10/10'],
                      ['Software Compatibility', '10/10', '8/10', '7/10'],
                      ['Customization', '8/10', '6/10', '10/10'],
                      ['Hardware Compatibility', '9/10', '4/10', '10/10'],
                      ['Updates', '8/10', '9/10', '8/10'],
                      ['Cost', 'Paid', 'Paid', 'Free'],
                      ['Open Source', 'No', 'No', 'Yes'],
                      ['Ease of Use', '9/10', '10/10', '7/10'],
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                        <td className="p-3 font-medium">{row[0]}</td>
                        <td className="p-3">{row[1]}</td>
                        <td className="p-3">{row[2]}</td>
                        <td className="p-3">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Programming Section */}
        {activeSection === 'programming' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-3xl font-bold">💻 Programming & Development</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard className="border-t-4 border-blue-500">
                <h3 className="text-xl font-bold text-blue-600 mb-4">🪟 Windows</h3>
                <p className="font-semibold">Languages:</p>
                <p className="text-sm text-muted-foreground mb-3">C, C++, C#, Java, Python, JavaScript, PHP, Go, Rust, Dart</p>
                <p className="font-semibold">Tools:</p>
                <p className="text-sm text-muted-foreground mb-3">Visual Studio, VS Code, WSL, Docker Desktop, Git</p>
                <p className="font-semibold">Package Management:</p>
                <p className="text-sm text-muted-foreground">Winget, Chocolatey, Scoop</p>
              </GlassCard>

              <GlassCard className="border-t-4 border-gray-500">
                <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-4">🍎 macOS</h3>
                <p className="font-semibold">Languages:</p>
                <p className="text-sm text-muted-foreground mb-3">Swift, Objective-C, C, C++, Java, Python, JavaScript, PHP, Go</p>
                <p className="font-semibold">Tools:</p>
                <p className="text-sm text-muted-foreground mb-3">Xcode, VS Code, Terminal, Homebrew, Docker, Git</p>
                <p className="font-semibold">Package Management:</p>
                <p className="text-sm text-muted-foreground">Homebrew, MacPorts</p>
              </GlassCard>

              <GlassCard className="border-t-4 border-orange-500">
                <h3 className="text-xl font-bold text-orange-600 mb-4">🐧 Linux</h3>
                <p className="font-semibold">Languages:</p>
                <p className="text-sm text-muted-foreground mb-3">C/C++, Python, Go, Rust, Java, Node.js, PHP, Bash, Ruby</p>
                <p className="font-semibold">Tools:</p>
                <p className="text-sm text-muted-foreground mb-3">VS Code, Vim, Emacs, Docker, Git, GCC, Clang, Kubernetes</p>
                <p className="font-semibold">Package Management:</p>
                <p className="text-sm text-muted-foreground">APT, DNF, Pacman, Snap, Flatpak</p>
              </GlassCard>
            </div>

            <h3 className="text-2xl font-semibold mt-6">📊 Programming Recommendations</h3>
            <div className="overflow-x-auto glass rounded-2xl p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="p-3 text-left font-semibold">Programming Field</th>
                    <th className="p-3 text-left font-semibold">Recommended OS</th>
                    <th className="p-3 text-left font-semibold">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {programmingRecommendations.map((item, i) => (
                    <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                      <td className="p-3 font-medium">{item.field}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.recommended.includes('Linux') ? 'bg-orange-500/20 text-orange-600' :
                          item.recommended.includes('macOS') ? 'bg-gray-500/20 text-gray-600' :
                          'bg-blue-500/20 text-blue-600'
                        }`}>
                          {item.recommended}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground text-xs">{item.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Cybersecurity Section */}
        {activeSection === 'cybersecurity' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-3xl font-bold">🔐 Cybersecurity Comparison</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard className="border-t-4 border-blue-500">
                <h3 className="text-xl font-bold text-blue-600 mb-4">🪟 Windows</h3>
                <ul className="space-y-2 text-sm">
                  <li><span className="font-semibold">Tools:</span> Defender, Sysinternals, Wireshark</li>
                  <li><span className="font-semibold">Firewall:</span> Windows Defender Firewall</li>
                  <li><span className="font-semibold">Malware Risk:</span> High (most targeted)</li>
                  <li><span className="font-semibold">Best For:</span> Blue Team, Enterprise, AD</li>
                </ul>
              </GlassCard>

              <GlassCard className="border-t-4 border-gray-500">
                <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-4">🍎 macOS</h3>
                <ul className="space-y-2 text-sm">
                  <li><span className="font-semibold">Tools:</span> Wireshark, Burp Suite, Terminal</li>
                  <li><span className="font-semibold">Firewall:</span> Application Firewall (PF)</li>
                  <li><span className="font-semibold">Malware Risk:</span> Low (controlled ecosystem)</li>
                  <li><span className="font-semibold">Best For:</span> Secure development</li>
                </ul>
              </GlassCard>

              <GlassCard className="border-t-4 border-orange-500">
                <h3 className="text-xl font-bold text-orange-600 mb-4">🐧 Linux</h3>
                <ul className="space-y-2 text-sm">
                  <li><span className="font-semibold">Tools:</span> Kali tools, Nmap, Metasploit, Aircrack-ng</li>
                  <li><span className="font-semibold">Firewall:</span> iptables, UFW, Firewalld</li>
                  <li><span className="font-semibold">Malware Risk:</span> Lowest (strong permissions)</li>
                  <li><span className="font-semibold">Best For:</span> Pentesting, Forensics, Security</li>
                </ul>
              </GlassCard>
            </div>

            <h3 className="text-2xl font-semibold mt-6">🔐 Cybersecurity Recommendations</h3>
            <div className="overflow-x-auto glass rounded-2xl p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="p-3 text-left font-semibold">Cybersecurity Area</th>
                    <th className="p-3 text-left font-semibold">Recommended OS</th>
                    <th className="p-3 text-left font-semibold">Recommended Tools</th>
                  </tr>
                </thead>
                <tbody>
                  {cybersecurityRecommendations.map((item, i) => (
                    <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                      <td className="p-3 font-medium">{item.area}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.recommended.includes('Linux') ? 'bg-orange-500/20 text-orange-600' :
                          item.recommended.includes('macOS') ? 'bg-gray-500/20 text-gray-600' :
                          'bg-blue-500/20 text-blue-600'
                        }`}>
                          {item.recommended}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground text-xs">{item.tool}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Summary */}
        {activeSection === 'summary' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-3xl font-bold">📌 Summary & Recommendations</h2>
            
            <GlassCard className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-900/50">
              <h3 className="text-2xl font-bold mb-4">Which Operating System Should You Choose?</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-2xl border-2 border-blue-500">
                  <div className="text-4xl mb-3"><FaWindows className="text-blue-600" /></div>
                  <h4 className="text-xl font-bold text-blue-600">🪟 Windows</h4>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex items-start gap-2"><FaCheckCircle className="text-green-500 mt-1" /> Best for gaming</li>
                    <li className="flex items-start gap-2"><FaCheckCircle className="text-green-500 mt-1" /> Widest software compatibility</li>
                    <li className="flex items-start gap-2"><FaCheckCircle className="text-green-500 mt-1" /> Great for business</li>
                    <li className="flex items-start gap-2"><FaCheckCircle className="text-green-500 mt-1" /> Enterprise tools</li>
                    <li className="flex items-start gap-2"><FaTimesCircle className="text-red-500 mt-1" /> Most malware targets</li>
                  </ul>
                  <p className="mt-4 font-semibold text-sm">Best for: Students, Gamers, Office Workers, Engineers</p>
                </div>

                <div className="bg-gray-100 dark:bg-gray-800/30 p-6 rounded-2xl border-2 border-gray-500">
                  <div className="text-4xl mb-3"><FaApple className="text-gray-600 dark:text-gray-300" /></div>
                  <h4 className="text-xl font-bold text-gray-600 dark:text-gray-300">🍎 macOS</h4>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex items-start gap-2"><FaCheckCircle className="text-green-500 mt-1" /> Best for creative professionals</li>
                    <li className="flex items-start gap-2"><FaCheckCircle className="text-green-500 mt-1" /> Excellent security</li>
                    <li className="flex items-start gap-2"><FaCheckCircle className="text-green-500 mt-1" /> Optimized performance</li>
                    <li className="flex items-start gap-2"><FaCheckCircle className="text-green-500 mt-1" /> Apple ecosystem integration</li>
                    <li className="flex items-start gap-2"><FaTimesCircle className="text-red-500 mt-1" /> Limited gaming</li>
                  </ul>
                  <p className="mt-4 font-semibold text-sm">Best for: Designers, Creatives, Apple Developers</p>
                </div>

                <div className="bg-orange-100 dark:bg-orange-900/30 p-6 rounded-2xl border-2 border-orange-500">
                  <div className="text-4xl mb-3"><FaLinux className="text-orange-500" /></div>
                  <h4 className="text-xl font-bold text-orange-600">🐧 Linux</h4>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex items-start gap-2"><FaCheckCircle className="text-green-500 mt-1" /> Best for development</li>
                    <li className="flex items-start gap-2"><FaCheckCircle className="text-green-500 mt-1" /> Most secure</li>
                    <li className="flex items-start gap-2"><FaCheckCircle className="text-green-500 mt-1" /> Free and open source</li>
                    <li className="flex items-start gap-2"><FaCheckCircle className="text-green-500 mt-1" /> Server dominant</li>
                    <li className="flex items-start gap-2"><FaTimesCircle className="text-red-500 mt-1" /> Steep learning curve</li>
                  </ul>
                  <p className="mt-4 font-semibold text-sm">Best for: Developers, Security, Servers, DevOps</p>
                </div>
              </div>
            </GlassCard>

            {/* Final Recommendations Table */}
            <GlassCard>
              <h3 className="text-xl font-semibold mb-4">📋 Quick Reference</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="p-3 text-left font-semibold">Category</th>
                      <th className="p-3 text-left text-blue-600">Windows</th>
                      <th className="p-3 text-left text-gray-600">macOS</th>
                      <th className="p-3 text-left text-orange-600">Linux</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Gaming', '✅ Best', '❌ Limited', '⚠️ Good (Proton)'],
                      ['Programming', '✅ Good', '✅ Excellent', '✅ Best'],
                      ['Security', '✅ Good', '✅ Excellent', '✅ Best'],
                      ['Creativity', '✅ Good', '✅ Best', '⚠️ Good'],
                      ['Business', '✅ Best', '✅ Good', '⚠️ Good'],
                      ['Servers', '✅ Good', '❌ Rare', '✅ Best'],
                      ['Mobile Development', '✅ Android', '✅ iOS', '✅ Android'],
                      ['Engineering', '✅ Best', '✅ Good', '✅ Good'],
                      ['Cost', '❌ Paid', '❌ Premium', '✅ Free'],
                      ['Ease of Use', '✅ Best', '✅ Best', '⚠️ Moderate'],
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                        <td className="p-3 font-medium">{row[0]}</td>
                        <td className="p-3 text-center">{row[1]}</td>
                        <td className="p-3 text-center">{row[2]}</td>
                        <td className="p-3 text-center">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
