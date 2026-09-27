import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { FaLinux, FaWindows, FaApple, FaServer, FaGamepad, FaCode, FaCloud, FaLock, FaMemory, FaCogs, FaCheck, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

export default function TripleComparison() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Features' },
    { id: 'advantages', label: 'Advantages' },
    { id: 'distros', label: 'Linux Distros' },
    { id: 'comparison', label: 'Detailed Comparison' },
  ];

  const osData = {
    windows: {
      name: 'Windows',
      icon: <FaWindows className="text-5xl text-blue-600" />,
      color: 'blue',
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      border: 'border-blue-500',
      advantages: ['Largest software compatibility', 'Best gaming platform', 'Excellent hardware support', 'Easy to learn and widely used', 'Strong business and enterprise support'],
      disadvantages: ['Higher hardware requirements', 'More vulnerable to malware', 'Paid license', 'Frequent system updates may interrupt users'],
      bestFor: 'Students, office workers, gamers, engineers, businesses, architects',
    },
    macos: {
      name: 'macOS',
      icon: <FaApple className="text-5xl text-gray-600 dark:text-gray-300" />,
      color: 'gray',
      bg: 'bg-gray-50 dark:bg-gray-900/20',
      border: 'border-gray-500',
      advantages: ['Excellent security', 'Smooth performance and battery life', 'Optimized for Apple hardware', 'Excellent creative software', 'Strong integration with Apple devices'],
      disadvantages: ['Expensive hardware', 'Limited gaming support', 'Runs only on Apple computers', 'Limited customization'],
      bestFor: 'Creative professionals, photographers, musicians, video editors, Apple ecosystem users',
    },
    linux: {
      name: 'Linux',
      icon: <FaLinux className="text-5xl text-orange-500" />,
      color: 'orange',
      bg: 'bg-orange-50 dark:bg-orange-950/20',
      border: 'border-orange-500',
      advantages: ['Free and open source', 'Very secure and stable', 'Lightweight and fast', 'Highly customizable', 'Best for servers and programming'],
      disadvantages: ['Some commercial software unavailable', 'Learning curve for beginners', 'Some hardware drivers require manual installation', 'Certain games need compatibility tools'],
      bestFor: 'Programmers, cybersecurity professionals, cloud engineers, DevOps engineers, researchers',
    }
  };

  const featureComparison = [
    { 
      feature: 'Performance', 
      windows: 'Good performance depends on hardware. High-end PCs provide excellent speed for gaming, engineering, and multitasking.',
      macos: 'Excellent performance. Apple Silicon (M1, M2, M3) provides high speed, efficiency, and long battery life.',
      linux: 'Excellent due to lightweight design. Runs efficiently on older computers with fewer system resources.'
    },
    { 
      feature: 'Security', 
      windows: 'Microsoft Defender, BitLocker, Windows Hello, Secure Boot, SmartScreen. Most frequently targeted by malware due to largest user base.',
      macos: 'Gatekeeper, XProtect, FileVault, Secure Enclave, application sandboxing. Controlled ecosystem reduces malware infections.',
      linux: 'Very secure due to open-source development, strong user permissions, SELinux/AppArmor, and rapid security updates.'
    },
    { 
      feature: 'Memory Usage', 
      windows: 'Uses more RAM due to background services. Recommends at least 8 GB RAM for smooth performance.',
      macos: 'Efficient memory usage optimized specifically for Apple hardware.',
      linux: 'Uses the least memory. Can run smoothly with 2–4 GB of RAM.'
    },
    { 
      feature: 'Gaming', 
      windows: 'Best for gaming with DirectX support, NVIDIA/AMD graphics, Xbox integration, and largest game library.',
      macos: 'Limited gaming support. Apple improving with Metal technology, but game availability remains limited.',
      linux: 'Gaming improved with Steam Proton, Wine, and native Linux games. Some anti-cheat systems still have issues.'
    },
    { 
      feature: 'Programming & Development', 
      windows: 'Excellent with Visual Studio, VS Code, .NET, Java, Python, Android Studio, and WSL.',
      macos: 'Excellent for iOS/macOS development with Xcode. Unix-based, ideal for web development and scripting.',
      linux: 'Preferred for developers, DevOps, cybersecurity. Supports nearly all programming languages and tools.'
    },
    { 
      feature: 'Cloud & Servers', 
      windows: 'Windows Server widely used in businesses, integrates with Microsoft Azure.',
      macos: 'Rarely used as server OS. Used by developers to access cloud platforms.',
      linux: 'Dominant in cloud computing, web servers, supercomputers, Kubernetes, Docker, and data centers.'
    },
    { 
      feature: 'Software Compatibility', 
      windows: 'Widest variety including Microsoft Office, Adobe Creative Cloud, AutoCAD, SolidWorks, MATLAB, Visual Studio.',
      macos: 'Excellent for Apple-exclusive apps (Final Cut Pro, Logic Pro, Xcode). Supports Office and Adobe CC.',
      linux: 'Thousands of open-source apps and dev tools. Some commercial software may require alternatives or Wine.'
    },
    { 
      feature: 'Customization', 
      windows: 'Highly customizable with themes, wallpapers, taskbars, icons, registry settings, and third-party tools.',
      macos: 'Limited customization to maintain consistent, stable user experience.',
      linux: 'Highest level of customization with different desktop environments (GNOME, KDE, XFCE, Cinnamon).'
    },
    { 
      feature: 'Hardware Compatibility', 
      windows: 'Compatible with Dell, HP, Lenovo, ASUS, Acer, MSI, Samsung, and custom-built PCs.',
      macos: 'Runs only on Apple hardware (MacBook, iMac, Mac Studio, Mac Pro).',
      linux: 'Compatible with almost all hardware, from old laptops to servers, Raspberry Pi, and embedded systems.'
    },
    { 
      feature: 'Price', 
      windows: 'Generally paid, though usually included with new computers.',
      macos: 'Included with Apple devices. Apple hardware is generally more expensive.',
      linux: 'Completely free and open source. No licensing fees.'
    },
    { 
      feature: 'Best For', 
      windows: 'Students, office workers, gamers, engineers, businesses, architects.',
      macos: 'Creative professionals, photographers, musicians, video editors, Apple ecosystem users.',
      linux: 'Programmers, cybersecurity, cloud engineers, DevOps, researchers, server admins.'
    },
  ];

  const linuxDistros = [
    { name: 'Ubuntu', purpose: 'Best for beginners and general desktop use' },
    { name: 'Linux Mint', purpose: 'Familiar interface for users switching from Windows' },
    { name: 'Debian', purpose: 'Stable operating system for servers and development' },
    { name: 'Fedora', purpose: 'Latest Linux technologies and software development' },
    { name: 'Arch Linux', purpose: 'Advanced users who want complete control' },
    { name: 'Manjaro', purpose: 'Beginner-friendly version of Arch Linux' },
    { name: 'Kali Linux', purpose: 'Cybersecurity and penetration testing' },
    { name: 'Parrot OS', purpose: 'Ethical hacking and digital forensics' },
    { name: 'Rocky Linux', purpose: 'Enterprise server operating system' },
    { name: 'AlmaLinux', purpose: 'Free enterprise Linux compatible with RHEL' },
    { name: 'Pop!_OS', purpose: 'Developers, engineers, and gamers' },
    { name: 'Elementary OS', purpose: 'macOS-like appearance and user experience' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Windows vs macOS vs Linux</h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive comparison of the three major operating systems
        </p>
      </div>

      {/* OS Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(osData).map(([key, os]) => (
          <GlassCard key={key} className={`${os.bg} border-t-4 ${os.border} hover:scale-105 transition-transform`}>
            <div className="flex items-center gap-4 mb-3">
              {os.icon}
              <h2 className="text-2xl font-bold">{os.name}</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-green-600 flex items-center gap-1"><FaCheck /> Advantages:</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  {os.advantages.slice(0, 3).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-red-500 flex items-center gap-1"><FaTimes /> Disadvantages:</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  {os.disadvantages.slice(0, 3).map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
              <p className="text-sm mt-2 bg-primary/10 p-2 rounded-lg">
                <span className="font-semibold">Best for:</span> {os.bestFor}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/20 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full transition ${
              activeTab === tab.id ? 'bg-primary text-white' : 'glass hover:bg-primary/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-2xl font-semibold">Feature Comparison Overview</h2>
          <div className="overflow-x-auto glass rounded-2xl p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-3 text-left font-semibold">Feature</th>
                  <th className="p-3 text-left text-blue-600">Windows</th>
                  <th className="p-3 text-left text-gray-600">macOS</th>
                  <th className="p-3 text-left text-orange-600">Linux</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Performance', windows: 'Good (hardware dependent)', macos: 'Excellent (Apple Silicon)', linux: 'Excellent (lightweight)' },
                  { feature: 'Security', windows: 'Very good (largest target)', macos: 'Excellent (controlled ecosystem)', linux: 'Excellent (open source)' },
                  { feature: 'Memory Usage', windows: 'Heavy (8GB+ recommended)', macos: 'Efficient', linux: 'Light (2-4GB works)' },
                  { feature: 'Gaming', windows: 'Best (DirectX, largest library)', macos: 'Limited', linux: 'Good (Proton, Wine)' },
                  { feature: 'Programming', windows: 'Excellent (VS, WSL)', macos: 'Excellent (Xcode, Unix)', linux: 'Excellent (all tools)' },
                  { feature: 'Cloud & Servers', windows: 'Good (Azure)', macos: 'Limited', linux: 'Dominant' },
                  { feature: 'Software Compatibility', windows: 'Widest selection', macos: 'Creative apps', linux: 'Open source' },
                  { feature: 'Customization', windows: 'High', macos: 'Limited', linux: 'Very High' },
                  { feature: 'Hardware', windows: 'Many brands', macos: 'Apple only', linux: 'Any hardware' },
                  { feature: 'Cost', windows: 'Paid (OEM)', macos: 'Premium (Apple)', linux: 'Free' },
                ].map((item, i) => (
                  <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 font-medium">{item.feature}</td>
                    <td className="p-3">{item.windows}</td>
                    <td className="p-3">{item.macos}</td>
                    <td className="p-3">{item.linux}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === 'features' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-2xl font-semibold">Detailed Feature Comparison</h2>
          <div className="space-y-4">
            {featureComparison.map((item, i) => (
              <GlassCard key={i} className="hover:shadow-lg transition">
                <h3 className="font-semibold text-lg mb-3 text-primary">{item.feature}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                    <span className="font-medium text-blue-600">🪟 Windows:</span>
                    <p className="text-sm text-muted-foreground mt-1">{item.windows}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/30 p-3 rounded-lg">
                    <span className="font-medium text-gray-600 dark:text-gray-300">🍎 macOS:</span>
                    <p className="text-sm text-muted-foreground mt-1">{item.macos}</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-950/30 p-3 rounded-lg">
                    <span className="font-medium text-orange-600">🐧 Linux:</span>
                    <p className="text-sm text-muted-foreground mt-1">{item.linux}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'advantages' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-2xl font-semibold">Advantages and Disadvantages</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Windows */}
            <GlassCard className="border-t-4 border-blue-500">
              <h3 className="text-xl font-bold text-blue-600 mb-4">🪟 Windows</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-green-600 flex items-center gap-2"><FaCheck /> Advantages</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Largest software compatibility</li>
                    <li>Best gaming platform</li>
                    <li>Excellent hardware support</li>
                    <li>Easy to learn and widely used</li>
                    <li>Strong business and enterprise support</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-red-500 flex items-center gap-2"><FaTimes /> Disadvantages</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Higher hardware requirements</li>
                    <li>More vulnerable to malware</li>
                    <li>Paid license</li>
                    <li>Frequent system updates may interrupt users</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            {/* macOS */}
            <GlassCard className="border-t-4 border-gray-500">
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-4">🍎 macOS</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-green-600 flex items-center gap-2"><FaCheck /> Advantages</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Excellent security</li>
                    <li>Smooth performance and battery life</li>
                    <li>Optimized for Apple hardware</li>
                    <li>Excellent creative software</li>
                    <li>Strong integration with Apple devices</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-red-500 flex items-center gap-2"><FaTimes /> Disadvantages</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Expensive hardware</li>
                    <li>Limited gaming support</li>
                    <li>Runs only on Apple computers</li>
                    <li>Limited customization</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            {/* Linux */}
            <GlassCard className="border-t-4 border-orange-500">
              <h3 className="text-xl font-bold text-orange-600 mb-4">🐧 Linux</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-green-600 flex items-center gap-2"><FaCheck /> Advantages</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Free and open source</li>
                    <li>Very secure and stable</li>
                    <li>Lightweight and fast</li>
                    <li>Highly customizable</li>
                    <li>Best for servers and programming</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-red-500 flex items-center gap-2"><FaTimes /> Disadvantages</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Some commercial software unavailable</li>
                    <li>Learning curve for beginners</li>
                    <li>Some hardware drivers require manual installation</li>
                    <li>Certain games may need compatibility tools</li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Summary Table */}
          <div className="overflow-x-auto glass rounded-2xl p-4">
            <h3 className="text-xl font-semibold mb-4">Overall Rating (1-5)</h3>
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
                  { category: 'Ease of Use', windows: '⭐⭐⭐⭐⭐', macos: '⭐⭐⭐⭐⭐', linux: '⭐⭐⭐⭐☆' },
                  { category: 'Security', windows: '⭐⭐⭐⭐☆', macos: '⭐⭐⭐⭐⭐', linux: '⭐⭐⭐⭐⭐' },
                  { category: 'Performance', windows: '⭐⭐⭐⭐☆', macos: '⭐⭐⭐⭐⭐', linux: '⭐⭐⭐⭐⭐' },
                  { category: 'Gaming', windows: '⭐⭐⭐⭐⭐', macos: '⭐⭐⭐☆☆', linux: '⭐⭐⭐☆☆' },
                  { category: 'Programming', windows: '⭐⭐⭐⭐☆', macos: '⭐⭐⭐⭐☆', linux: '⭐⭐⭐⭐⭐' },
                  { category: 'Software Availability', windows: '⭐⭐⭐⭐⭐', macos: '⭐⭐⭐⭐☆', linux: '⭐⭐⭐⭐☆' },
                  { category: 'Customization', windows: '⭐⭐⭐⭐☆', macos: '⭐⭐⭐☆☆', linux: '⭐⭐⭐⭐⭐' },
                  { category: 'Hardware Compatibility', windows: '⭐⭐⭐⭐⭐', macos: '⭐⭐☆☆☆', linux: '⭐⭐⭐⭐⭐' },
                  { category: 'Value for Money', windows: '⭐⭐⭐☆☆', macos: '⭐⭐⭐☆☆', linux: '⭐⭐⭐⭐⭐' },
                ].map((item, i) => (
                  <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 font-medium">{item.category}</td>
                    <td className="p-3">{item.windows}</td>
                    <td className="p-3">{item.macos}</td>
                    <td className="p-3">{item.linux}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === 'distros' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-2xl font-semibold">Popular Linux Distributions</h2>
          <p className="text-muted-foreground">
            Unlike Windows and macOS, Linux has many distributions designed for different users and purposes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {linuxDistros.map((distro, i) => (
              <GlassCard key={i} className="hover:scale-105 transition-transform">
                <h3 className="text-lg font-bold text-primary">{distro.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{distro.purpose}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'comparison' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-2xl font-semibold">Comprehensive Comparison</h2>
          <div className="overflow-x-auto glass rounded-2xl p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-3 text-left font-semibold">Aspect</th>
                  <th className="p-3 text-left text-blue-600">🪟 Windows</th>
                  <th className="p-3 text-left text-gray-600">🍎 macOS</th>
                  <th className="p-3 text-left text-orange-600">🐧 Linux</th>
                  <th className="p-3 text-left font-semibold">Best Choice</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { aspect: 'Ease of Use', windows: 'Very easy, widely familiar', macos: 'Very easy, intuitive', linux: 'Moderate (distro dependent)', best: 'Windows/macOS for beginners' },
                  { aspect: 'Security', windows: 'Very good (largest target)', macos: 'Excellent', linux: 'Excellent', best: 'Linux for servers' },
                  { aspect: 'Performance', windows: 'Hardware dependent', macos: 'Optimized for Apple', linux: 'Fast and lightweight', best: 'Linux for older PCs' },
                  { aspect: 'Gaming', windows: 'Best platform', macos: 'Limited', linux: 'Good (Proton)', best: 'Windows' },
                  { aspect: 'Software', windows: 'Widest selection', macos: 'Creative focus', linux: 'Open source', best: 'Windows' },
                  { aspect: 'Customization', windows: 'High', macos: 'Limited', linux: 'Extremely high', best: 'Linux' },
                  { aspect: 'Hardware', windows: 'Many brands', macos: 'Apple only', linux: 'Any hardware', best: 'Linux' },
                  { aspect: 'Cost', windows: 'Paid', macos: 'Premium', linux: 'Free', best: 'Linux' },
                  { aspect: 'Updates', windows: 'Regular, sometimes disruptive', macos: 'Controlled and consistent', linux: 'User controlled', best: 'Linux for control' },
                  { aspect: 'Best For', windows: 'Business, Gaming, General', macos: 'Creative, Apple ecosystem', linux: 'Development, Servers', best: 'Depends on needs' },
                ].map((item, i) => (
                  <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 font-medium">{item.aspect}</td>
                    <td className="p-3 text-xs">{item.windows}</td>
                    <td className="p-3 text-xs">{item.macos}</td>
                    <td className="p-3 text-xs">{item.linux}</td>
                    <td className="p-3 text-xs text-muted-foreground">{item.best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <GlassCard className="bg-primary/5 border-2 border-primary/20">
            <h3 className="text-xl font-semibold mb-3">📊 Summary: Which OS Should You Choose?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl">
                <h4 className="font-bold text-blue-600 text-lg">🪟 Windows</h4>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>If you play games</li>
                  <li>If you need broad software compatibility</li>
                  <li>If you&apos;re a student or office worker</li>
                  <li>If you prefer familiar interface</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-xl">
                <h4 className="font-bold text-gray-600 dark:text-gray-300 text-lg">🍎 macOS</h4>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>If you&apos;re a creative professional</li>
                  <li>If you use iPhone/iPad</li>
                  <li>If you value design and simplicity</li>
                  <li>If you develop for Apple platforms</li>
                </ul>
              </div>
              <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-xl">
                <h4 className="font-bold text-orange-600 text-lg">🐧 Linux</h4>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>If you&apos;re a developer or programmer</li>
                  <li>If you value security and privacy</li>
                  <li>If you want free and open source</li>
                  <li>If you run servers or cloud infrastructure</li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </motion.div>
  );
}
