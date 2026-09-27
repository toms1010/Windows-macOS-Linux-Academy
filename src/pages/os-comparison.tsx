import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { 
  FaWindows, FaApple, FaLinux, FaServer, FaGamepad, FaCode, 
  FaCloud, FaLock, FaMemory, FaCogs, FaShieldAlt, FaCheck, FaTimes,
  FaStar, FaStarHalfAlt, FaMobile, FaTablet, FaLaptop
} from 'react-icons/fa';
import { useState } from 'react';

export default function OSComparison() {
  const [activeTab, setActiveTab] = useState('dual');

  const tabs = [
    { id: 'dual', label: '🪟 Windows vs 🐧 Linux' },
    { id: 'triple', label: '🪟 vs 🍎 vs 🐧' },
    { id: 'features', label: '📊 Features' },
    { id: 'summary', label: '📌 Summary' },
  ];

  // Windows vs Linux Data
  const dualData = [
    { feature: 'Performance', windows: 'Good', linux: 'Excellent' },
    { feature: 'Security', windows: 'Moderate', linux: 'High' },
    { feature: 'Memory Usage', windows: 'Heavy', linux: 'Light' },
    { feature: 'Gaming', windows: 'Best', linux: 'Good (Proton)' },
    { feature: 'Programming', windows: 'Good', linux: 'Excellent' },
    { feature: 'Cloud & Servers', windows: 'Good', linux: 'Dominant' },
    { feature: 'Software Support', windows: 'Excellent', linux: 'Good' },
    { feature: 'Driver Support', windows: 'Excellent', linux: 'Moderate' },
    { feature: 'Development', windows: 'Good', linux: 'Excellent' },
    { feature: 'Customization', windows: 'Moderate', linux: 'Excellent' },
    { feature: 'Cost', windows: 'Paid', linux: 'Free' },
    { feature: 'Stability', windows: 'Good', linux: 'Excellent' },
  ];

  // Triple OS Comparison Data
  const tripleData = [
    { feature: 'Performance', windows: '8/10', macos: '9/10', linux: '10/10' },
    { feature: 'Security', windows: '8/10', macos: '9/10', linux: '10/10' },
    { feature: 'Ease of Use', windows: '9/10', macos: '10/10', linux: '7/10' },
    { feature: 'Gaming', windows: '10/10', macos: '5/10', linux: '7/10' },
    { feature: 'Programming', windows: '8/10', macos: '9/10', linux: '10/10' },
    { feature: 'Customization', windows: '8/10', macos: '6/10', linux: '10/10' },
    { feature: 'Software Compatibility', windows: '10/10', macos: '8/10', linux: '7/10' },
    { feature: 'Cloud & Servers', windows: '7/10', macos: '6/10', linux: '10/10' },
    { feature: 'Memory Usage', windows: '3.5 GB', macos: '2.5 GB', linux: '1.2 GB' },
    { feature: 'Cost', windows: 'Paid', macos: 'Premium', linux: 'Free' },
    { feature: 'Open Source', windows: '❌', macos: '❌', linux: '✅' },
    { feature: 'Hardware Compatibility', windows: 'Many', macos: 'Apple Only', linux: 'Any' },
  ];

  const advantages = {
    windows: [
      'Largest software compatibility',
      'Best gaming platform',
      'Excellent hardware support',
      'Easy to learn and widely used',
      'Strong business and enterprise support',
    ],
    macos: [
      'Excellent security',
      'Smooth performance and battery life',
      'Optimized for Apple hardware',
      'Excellent creative software',
      'Strong integration with Apple devices',
    ],
    linux: [
      'Free and open source',
      'Very secure and stable',
      'Lightweight and fast',
      'Highly customizable',
      'Best for servers and programming',
    ],
  };

  const disadvantages = {
    windows: [
      'Higher hardware requirements',
      'More vulnerable to malware',
      'Paid license',
      'Frequent system updates may interrupt users',
    ],
    macos: [
      'Expensive hardware',
      'Limited gaming support',
      'Runs only on Apple computers',
      'Limited customization',
    ],
    linux: [
      'Some commercial software unavailable',
      'Learning curve for beginners',
      'Some hardware drivers require manual installation',
      'Certain games may need compatibility tools',
    ],
  };

  const recommendations = {
    windows: [
      'Gaming and entertainment',
      'Office productivity',
      'Business and enterprise',
      'Software development (.NET, C#)',
      'Engineering and design',
    ],
    macos: [
      'Creative design (Final Cut Pro, Logic Pro)',
      'iOS/macOS development',
      'Photography and video editing',
      'Music production',
      'Web development',
    ],
    linux: [
      'Web development and programming',
      'Server administration',
      'Cybersecurity and penetration testing',
      'Cloud computing and DevOps',
      'Scientific research and academia',
    ],
  };

  const categoryWinners = [
    { category: 'Gaming', winner: 'Windows' },
    { category: 'Security', winner: 'Linux' },
    { category: 'Programming', winner: 'Linux' },
    { category: 'Creativity', winner: 'macOS' },
    { category: 'Business', winner: 'Windows' },
    { category: 'Servers', winner: 'Linux' },
    { category: 'Mobile Development', winner: 'macOS' },
    { category: 'Engineering', winner: 'Windows' },
  ];

  const ratingData = [
    { category: 'Performance', windows: 8, macos: 9, linux: 10 },
    { category: 'Security', windows: 8, macos: 9, linux: 10 },
    { category: 'Ease of Use', windows: 9, macos: 10, linux: 7 },
    { category: 'Gaming', windows: 10, macos: 5, linux: 7 },
    { category: 'Programming', windows: 8, macos: 9, linux: 10 },
    { category: 'Customization', windows: 8, macos: 6, linux: 10 },
    { category: 'Software', windows: 10, macos: 8, linux: 7 },
    { category: 'Cloud/Servers', windows: 7, macos: 6, linux: 10 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Operating System <span className="text-primary">Comparison</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive comparison of Windows, macOS, and Linux operating systems
        </p>
      </div>

      {/* Tab Navigation */}
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

      {/* ===== TAB 1: Windows vs Linux ===== */}
      {activeTab === 'dual' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard className="border-t-4 border-blue-500 text-center">
              <FaWindows className="text-5xl text-blue-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-blue-600">Windows</h3>
              <p className="text-sm text-muted-foreground">72% Market Share</p>
              <div className="flex justify-center gap-4 mt-3">
                <span className="text-green-500">✓ Best Gaming</span>
                <span className="text-red-500">✗ Malware Risk</span>
              </div>
            </GlassCard>
            <GlassCard className="border-t-4 border-orange-500 text-center">
              <FaLinux className="text-5xl text-orange-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-orange-600">Linux</h3>
              <p className="text-sm text-muted-foreground">4% Market Share</p>
              <div className="flex justify-center gap-4 mt-3">
                <span className="text-green-500">✓ Free & Secure</span>
                <span className="text-red-500">✗ Learning Curve</span>
              </div>
            </GlassCard>
          </div>

          <GlassCard>
            <h2 className="text-2xl font-bold mb-4">📊 Windows vs Linux Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="p-3 text-left font-semibold">Feature</th>
                    <th className="p-3 text-left text-blue-600">Windows</th>
                    <th className="p-3 text-left text-orange-600">Linux</th>
                  </tr>
                </thead>
                <tbody>
                  {dualData.map((row, i) => (
                    <tr key={i} className={`border-b border-white/10 hover:bg-white/5 ${i % 2 === 0 ? 'bg-white/5 dark:bg-white/5' : ''}`}>
                      <td className="p-3 font-medium">{row.feature}</td>
                      <td className="p-3 text-blue-600">{row.windows}</td>
                      <td className="p-3 text-orange-600">{row.linux}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-blue-600 mb-3">🪟 Windows</h3>
              <div className="mb-3">
                <p className="font-semibold text-green-600">✅ Advantages</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {advantages.windows.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-red-500">❌ Disadvantages</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {disadvantages.windows.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <p className="font-semibold text-sm">🎯 Best for: Gaming, Business, General Use</p>
              </div>
            </GlassCard>

            <GlassCard className="border-l-4 border-orange-500">
              <h3 className="text-xl font-bold text-orange-600 mb-3">🐧 Linux</h3>
              <div className="mb-3">
                <p className="font-semibold text-green-600">✅ Advantages</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {advantages.linux.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-red-500">❌ Disadvantages</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {disadvantages.linux.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                <p className="font-semibold text-sm">🎯 Best for: Development, Servers, Security</p>
              </div>
            </GlassCard>
          </div>
        </motion.div>
      )}

      {/* ===== TAB 2: Triple Comparison ===== */}
      {activeTab === 'triple' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard className="border-t-4 border-blue-500 text-center">
              <FaWindows className="text-5xl text-blue-600 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-blue-600">Windows</h3>
              <p className="text-sm text-muted-foreground">🪟 72% Market Share</p>
            </GlassCard>
            <GlassCard className="border-t-4 border-gray-500 text-center">
              <FaApple className="text-5xl text-gray-600 dark:text-gray-300 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300">macOS</h3>
              <p className="text-sm text-muted-foreground">🍎 16% Market Share</p>
            </GlassCard>
            <GlassCard className="border-t-4 border-orange-500 text-center">
              <FaLinux className="text-5xl text-orange-500 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-orange-600">Linux</h3>
              <p className="text-sm text-muted-foreground">🐧 4% Market Share</p>
            </GlassCard>
          </div>

          <GlassCard>
            <h2 className="text-2xl font-bold mb-4">📊 Windows vs macOS vs Linux</h2>
            <div className="overflow-x-auto">
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
                  {tripleData.map((row, i) => (
                    <tr key={i} className={`border-b border-white/10 hover:bg-white/5 ${i % 2 === 0 ? 'bg-white/5' : ''}`}>
                      <td className="p-3 font-medium">{row.feature}</td>
                      <td className="p-3">{row.windows}</td>
                      <td className="p-3">{row.macos}</td>
                      <td className="p-3">{row.linux}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard className="border-l-4 border-blue-500">
              <h4 className="font-bold text-blue-600">🪟 Windows</h4>
              <p className="text-xs text-muted-foreground mt-1">Best for: Gaming, Business, General</p>
            </GlassCard>
            <GlassCard className="border-l-4 border-gray-500">
              <h4 className="font-bold text-gray-600 dark:text-gray-300">🍎 macOS</h4>
              <p className="text-xs text-muted-foreground mt-1">Best for: Creativity, Apple Ecosystem</p>
            </GlassCard>
            <GlassCard className="border-l-4 border-orange-500">
              <h4 className="font-bold text-orange-600">🐧 Linux</h4>
              <p className="text-xs text-muted-foreground mt-1">Best for: Development, Servers, Security</p>
            </GlassCard>
          </div>
        </motion.div>
      )}

      {/* ===== TAB 3: Features ===== */}
      {activeTab === 'features' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-2xl font-bold">📊 Feature Ratings (1-10)</h2>
          
          <div className="overflow-x-auto glass rounded-2xl p-4">
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
                {ratingData.map((row, i) => (
                  <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 font-medium">{row.category}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${row.windows * 10}%` }} />
                        </div>
                        <span className="text-xs">{row.windows}/10</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gray-500 rounded-full" style={{ width: `${row.macos * 10}%` }} />
                        </div>
                        <span className="text-xs">{row.macos}/10</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${row.linux * 10}%` }} />
                        </div>
                        <span className="text-xs">{row.linux}/10</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Category Winners */}
          <GlassCard>
            <h3 className="text-xl font-bold mb-4">🏆 Best by Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categoryWinners.map((item, i) => (
                <div key={i} className="text-center p-3 glass rounded-xl">
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                  <p className={`font-bold text-sm ${
                    item.winner === 'Windows' ? 'text-blue-600' :
                    item.winner === 'macOS' ? 'text-gray-600' :
                    'text-orange-600'
                  }`}>
                    {item.winner === 'Windows' && '🪟'}
                    {item.winner === 'macOS' && '🍎'}
                    {item.winner === 'Linux' && '🐧'}
                    {item.winner}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* ===== TAB 4: Summary ===== */}
      {activeTab === 'summary' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-2xl font-bold">📌 Summary & Recommendations</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard className="border-2 border-blue-500/30 bg-blue-50 dark:bg-blue-950/20">
              <FaWindows className="text-4xl text-blue-600 mb-2" />
              <h3 className="text-xl font-bold text-blue-600">Windows</h3>
              <div className="mt-2 space-y-1">
                <p className="font-semibold text-sm text-green-600">✅ Advantages</p>
                <ul className="text-xs text-muted-foreground list-disc list-inside">
                  {advantages.windows.slice(0, 3).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
                <p className="font-semibold text-sm text-red-500 mt-2">❌ Disadvantages</p>
                <ul className="text-xs text-muted-foreground list-disc list-inside">
                  {disadvantages.windows.slice(0, 3).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
                <p className="text-sm mt-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <span className="font-semibold">Best for:</span> Gaming, Business, General Use
                </p>
              </div>
            </GlassCard>

            <GlassCard className="border-2 border-gray-500/30 bg-gray-50 dark:bg-gray-800/20">
              <FaApple className="text-4xl text-gray-600 dark:text-gray-300 mb-2" />
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300">macOS</h3>
              <div className="mt-2 space-y-1">
                <p className="font-semibold text-sm text-green-600">✅ Advantages</p>
                <ul className="text-xs text-muted-foreground list-disc list-inside">
                  {advantages.macos.slice(0, 3).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
                <p className="font-semibold text-sm text-red-500 mt-2">❌ Disadvantages</p>
                <ul className="text-xs text-muted-foreground list-disc list-inside">
                  {disadvantages.macos.slice(0, 3).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
                <p className="text-sm mt-2 p-2 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                  <span className="font-semibold">Best for:</span> Creativity, Apple Ecosystem
                </p>
              </div>
            </GlassCard>

            <GlassCard className="border-2 border-orange-500/30 bg-orange-50 dark:bg-orange-950/20">
              <FaLinux className="text-4xl text-orange-500 mb-2" />
              <h3 className="text-xl font-bold text-orange-600">Linux</h3>
              <div className="mt-2 space-y-1">
                <p className="font-semibold text-sm text-green-600">✅ Advantages</p>
                <ul className="text-xs text-muted-foreground list-disc list-inside">
                  {advantages.linux.slice(0, 3).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
                <p className="font-semibold text-sm text-red-500 mt-2">❌ Disadvantages</p>
                <ul className="text-xs text-muted-foreground list-disc list-inside">
                  {disadvantages.linux.slice(0, 3).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
                <p className="text-sm mt-2 p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <span className="font-semibold">Best for:</span> Development, Servers, Security
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Quick Reference */}
          <GlassCard>
            <h3 className="text-xl font-bold mb-4">📋 Quick Reference</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="p-3 text-left font-semibold">Use Case</th>
                    <th className="p-3 text-left text-blue-600">Windows</th>
                    <th className="p-3 text-left text-gray-600">macOS</th>
                    <th className="p-3 text-left text-orange-600">Linux</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Gaming', '✅ Best', '❌ Limited', '⚠️ Good'],
                    ['Programming', '✅ Good', '✅ Good', '✅ Best'],
                    ['Security', '⚠️ Moderate', '✅ Good', '✅ Best'],
                    ['Creativity', '✅ Good', '✅ Best', '⚠️ Good'],
                    ['Business', '✅ Best', '✅ Good', '⚠️ Good'],
                    ['Servers', '⚠️ Good', '❌ Rare', '✅ Best'],
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

          {/* Final Verdict */}
          <GlassCard className="bg-gradient-to-r from-blue-50 via-gray-50 to-orange-50 dark:from-blue-950/20 dark:via-gray-950/20 dark:to-orange-950/20 border-2 border-primary/20">
            <h3 className="text-2xl font-bold text-center mb-3">🏆 Final Verdict</h3>
            <p className="text-center text-muted-foreground max-w-3xl mx-auto">
              <span className="font-semibold text-blue-600">Windows</span> is the 
              <strong> best choice for gaming, business, and general consumer use</strong> 
              with its vast software library and ease of use. 
              <span className="font-semibold text-gray-600"> macOS</span> is the 
              <strong> best choice for creative professionals</strong> 
              with its optimized hardware and software integration. 
              <span className="font-semibold text-orange-600"> Linux</span> is the 
              <strong> best choice for developers, cybersecurity professionals, and servers</strong> 
              with its security, customization, and open-source nature. The right choice depends on your specific needs.
            </p>
          </GlassCard>
        </motion.div>
      )}
    </motion.div>
  );
}
