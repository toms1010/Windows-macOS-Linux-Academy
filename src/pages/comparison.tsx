import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { 
  FaWindows, FaApple, FaLinux, FaCheck, FaTimes, FaArrowRight,
  FaMicrochip, FaTasks, FaMemory, FaDatabase, FaNetworkWired,
  FaShieldAlt, FaDesktop, FaGamepad, FaCode, FaCloud
} from 'react-icons/fa';

export default function Comparison() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          OS <span className="text-primary">Comparison</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive comparison of Windows, macOS, and Linux operating systems
        </p>
      </div>

      {/* OS Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="text-center border-t-4 border-blue-500 hover:scale-105 transition">
          <FaWindows className="text-4xl text-blue-500 mx-auto mb-2" />
          <h3 className="text-xl font-bold text-blue-600">Windows</h3>
          <p className="text-xs text-muted-foreground">72% Market Share</p>
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 text-xs rounded-full">Gaming</span>
            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 text-xs rounded-full">Business</span>
            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 text-xs rounded-full">Software</span>
          </div>
        </GlassCard>

        <GlassCard className="text-center border-t-4 border-gray-500 hover:scale-105 transition">
          <FaApple className="text-4xl text-gray-600 dark:text-gray-300 mx-auto mb-2" />
          <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300">macOS</h3>
          <p className="text-xs text-muted-foreground">16% Market Share</p>
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 text-xs rounded-full">Design</span>
            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 text-xs rounded-full">iOS Dev</span>
            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 text-xs rounded-full">Music</span>
          </div>
        </GlassCard>

        <GlassCard className="text-center border-t-4 border-orange-500 hover:scale-105 transition">
          <FaLinux className="text-4xl text-orange-500 mx-auto mb-2" />
          <h3 className="text-xl font-bold text-orange-600">Linux</h3>
          <p className="text-xs text-muted-foreground">4% Market Share</p>
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 text-xs rounded-full">DevOps</span>
            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 text-xs rounded-full">Cloud</span>
            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 text-xs rounded-full">Security</span>
          </div>
        </GlassCard>
      </div>

      {/* Detailed Comparison Table */}
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>📊</span> Detailed Comparison
        </h2>
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
              {[
                ['Performance', '8/10', '9/10', '10/10'],
                ['Security', '8/10', '9/10', '10/10'],
                ['Ease of Use', '9/10', '10/10', '7/10'],
                ['Gaming', '10/10', '5/10', '7/10'],
                ['Programming', '8/10', '9/10', '10/10'],
                ['Customization', '8/10', '6/10', '10/10'],
                ['Software Compatibility', '10/10', '8/10', '7/10'],
                ['Cloud & Servers', '7/10', '6/10', '10/10'],
                ['Memory Usage', '3.5 GB', '2.5 GB', '1.2 GB'],
                ['Cost', 'Paid', 'Premium', 'Free'],
                ['Open Source', '❌', '❌', '✅'],
                ['Hardware Compatibility', 'Many', 'Apple Only', 'Any'],
              ].map((row, i) => (
                <tr key={i} className={`border-b border-white/10 hover:bg-white/5 ${i % 2 === 0 ? 'bg-white/5' : ''}`}>
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

      {/* Feature Ratings with Bars */}
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>📈</span> Feature Ratings (1-10)
        </h2>
        <div className="space-y-3">
          {[
            { category: 'Performance', windows: 8, macos: 9, linux: 10 },
            { category: 'Security', windows: 8, macos: 9, linux: 10 },
            { category: 'Ease of Use', windows: 9, macos: 10, linux: 7 },
            { category: 'Gaming', windows: 10, macos: 5, linux: 7 },
            { category: 'Programming', windows: 8, macos: 9, linux: 10 },
            { category: 'Customization', windows: 8, macos: 6, linux: 10 },
            { category: 'Software', windows: 10, macos: 8, linux: 7 },
            { category: 'Cloud/Servers', windows: 7, macos: 6, linux: 10 },
          ].map((item, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center py-1">
              <span className="text-sm font-medium">{item.category}</span>
              <div className="col-span-1 sm:col-span-3 grid grid-cols-1 min-[480px]:grid-cols-3 gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-blue-600 w-8">Win</span>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${item.windows * 10}%` }} />
                  </div>
                  <span className="text-xs">{item.windows}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600 w-8">macOS</span>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-500 rounded-full" style={{ width: `${item.macos * 10}%` }} />
                  </div>
                  <span className="text-xs">{item.macos}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-orange-600 w-8">Linux</span>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${item.linux * 10}%` }} />
                  </div>
                  <span className="text-xs">{item.linux}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Category Winners */}
      <GlassCard>
        <h3 className="text-xl font-bold mb-4">🏆 Best by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { category: 'Gaming', winner: 'Windows' },
            { category: 'Security', winner: 'Linux' },
            { category: 'Programming', winner: 'Linux' },
            { category: 'Creativity', winner: 'macOS' },
            { category: 'Business', winner: 'Windows' },
            { category: 'Servers', winner: 'Linux' },
            { category: 'Mobile Dev', winner: 'macOS' },
            { category: 'Engineering', winner: 'Windows' },
          ].map((item, i) => (
            <div key={i} className="text-center p-3 glass rounded-xl hover:scale-105 transition">
              <p className="text-xs text-muted-foreground">{item.category}</p>
              <p className={`font-bold text-sm ${
                item.winner === 'Windows' ? 'text-blue-600' :
                item.winner === 'macOS' ? 'text-gray-600 dark:text-gray-300' :
                'text-orange-600'
              }`}>
                {item.winner === 'Windows' && '🪟 '}
                {item.winner === 'macOS' && '🍎 '}
                {item.winner === 'Linux' && '🐧 '}
                {item.winner}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Advantages & Disadvantages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Windows */}
        <GlassCard className="border-l-4 border-blue-500">
          <h3 className="text-lg font-bold text-blue-600 mb-2 flex items-center gap-2">
            <FaWindows /> Windows
          </h3>
          <div className="mb-2">
            <p className="font-semibold text-green-600 text-sm">✅ Advantages</p>
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
              <li>Largest software library</li>
              <li>Best gaming platform</li>
              <li>Wide hardware support</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-red-500 text-sm">❌ Disadvantages</p>
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
              <li>More malware targets</li>
              <li>Higher resource usage</li>
              <li>Paid license</li>
            </ul>
          </div>
        </GlassCard>

        {/* macOS */}
        <GlassCard className="border-l-4 border-gray-500">
          <h3 className="text-lg font-bold text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
            <FaApple /> macOS
          </h3>
          <div className="mb-2">
            <p className="font-semibold text-green-600 text-sm">✅ Advantages</p>
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
              <li>Excellent security</li>
              <li>Optimized performance</li>
              <li>Great creative software</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-red-500 text-sm">❌ Disadvantages</p>
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
              <li>Expensive hardware</li>
              <li>Limited gaming</li>
              <li>Apple-only hardware</li>
            </ul>
          </div>
        </GlassCard>

        {/* Linux */}
        <GlassCard className="border-l-4 border-orange-500">
          <h3 className="text-lg font-bold text-orange-600 mb-2 flex items-center gap-2">
            <FaLinux /> Linux
          </h3>
          <div className="mb-2">
            <p className="font-semibold text-green-600 text-sm">✅ Advantages</p>
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
              <li>Free and open source</li>
              <li>Very secure and stable</li>
              <li>Highly customizable</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-red-500 text-sm">❌ Disadvantages</p>
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
              <li>Learning curve</li>
              <li>Limited commercial software</li>
              <li>Some driver issues</li>
            </ul>
          </div>
        </GlassCard>
      </div>

      {/* Quick Reference Table */}
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>📋</span> Quick Reference
        </h2>
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
                <tr key={i} className={`border-b border-white/10 hover:bg-white/5 ${i % 2 === 0 ? 'bg-white/5' : ''}`}>
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
        <div className="flex justify-center gap-6 text-3xl mb-3">
          <FaWindows className="text-blue-500" />
          <FaApple className="text-gray-600 dark:text-gray-300" />
          <FaLinux className="text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-center">🏆 Final Verdict</h2>
        <p className="text-center text-muted-foreground max-w-3xl mx-auto text-sm">
          <span className="font-semibold text-blue-600">Windows</span> is the 
          <strong> best choice for gaming, business, and general consumer use</strong> 
          with its vast software library and ease of use. 
          <span className="font-semibold text-gray-600"> macOS</span> is the 
          <strong> best choice for creative professionals</strong> 
          with its optimized hardware and software integration. 
          <span className="font-semibold text-orange-600"> Linux</span> is the 
          <strong> best choice for developers, cybersecurity, and servers</strong> 
          with its security, customization, and open-source nature.
        </p>
      </GlassCard>
    </motion.div>
  );
}
