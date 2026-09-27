import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { 
  FaWindows, FaMicrochip, FaDatabase, FaShieldAlt, FaCode, 
  FaGamepad, FaCloud, FaServer, FaCogs, FaLock, FaUserLock,
  FaFolderOpen, FaNetworkWired, FaDesktop, FaCheck, FaTimes,
  FaLaptop, FaMobile, FaTablet, FaGlobe, FaPrint, FaKeyboard,
  FaMouse, FaCamera, FaPlay, FaStop, FaPause, FaFileAlt,
  FaFolder, FaHdd, FaMemory, FaTasks
} from 'react-icons/fa';

export default function Windows() {
  // Static classes only — Tailwind JIT cannot generate `border-${color}-500`
  // template strings, so map every color explicitly.
  const borderFor: Record<string, string> = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    purple: 'border-purple-500',
    orange: 'border-orange-500',
  };
  const textFor: Record<string, string> = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <FaWindows className="text-5xl text-blue-600" />
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Windows <span className="text-blue-600">Overview</span>
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Microsoft Windows is one of the most widely used operating systems in the world. 
          Known for its user-friendly graphical interface, broad software compatibility, 
          and strong support for gaming, business, and enterprise environments.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          { icon: <FaDesktop />, label: 'First Release', value: '1985', color: 'blue' },
          { icon: <FaCogs />, label: 'Kernel Type', value: 'Hybrid (NT)', color: 'green' },
          { icon: <FaShieldAlt />, label: 'Security', value: 'Advanced', color: 'purple' },
          { icon: <FaGamepad />, label: 'Gaming', value: 'Best Platform', color: 'orange' },
        ].map((stat, i) => (
          <GlassCard key={i} className={`text-center border-t-4 ${borderFor[stat.color]} hover:scale-105 transition`}>
            <div className={`text-3xl ${textFor[stat.color]} mx-auto mb-1`}>{stat.icon}</div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* NT Kernel & Architecture */}
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaMicrochip className="text-blue-500" /> Windows NT Kernel & Architecture
        </h2>
        <p className="text-muted-foreground mb-4">
          The <strong>Windows NT (New Technology) Kernel</strong> is the core component of the Windows operating system. 
          It is a <strong>hybrid kernel</strong>, combining features of both monolithic and microkernel architectures 
          to provide high performance, reliability, and flexibility.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">🔧 Key Features</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Supports Symmetric Multiprocessing (SMP)</li>
              <li>Hardware Abstraction Layer (HAL)</li>
              <li>Multitasking support</li>
              <li>Virtual memory management</li>
              <li>Process scheduling</li>
              <li>32-bit and 64-bit support</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">✅ Advantages</h3>
            <ul className="list-disc list-inside text-sm text-green-600 space-y-1">
              <li>High system stability</li>
              <li>Efficient multitasking</li>
              <li>Broad hardware compatibility</li>
              <li>Enterprise-level performance</li>
            </ul>
          </div>
        </div>
      </GlassCard>

      {/* File System */}
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaDatabase className="text-yellow-500" /> File System: NTFS
        </h2>
        <p className="text-muted-foreground mb-4">
          <strong>NTFS (New Technology File System)</strong> is the default file system used by modern Windows operating systems. 
          It provides better security, reliability, and storage management than older file systems like FAT32.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">🔧 Key Features</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Supports very large files and partitions</li>
              <li>File and folder permissions (ACL)</li>
              <li>File compression</li>
              <li>File encryption (EFS)</li>
              <li>Disk quotas</li>
              <li>Journaling for data recovery</li>
              <li>Symbolic links and hard links</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">✅ Advantages</h3>
            <ul className="list-disc list-inside text-sm text-green-600 space-y-1">
              <li>Highly reliable</li>
              <li>Better data corruption protection</li>
              <li>Improved security</li>
              <li>Faster file access</li>
              <li>Suitable for enterprise environments</li>
            </ul>
          </div>
        </div>
      </GlassCard>

      {/* Security Features */}
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaShieldAlt className="text-red-500" /> Security Features
        </h2>
        <p className="text-muted-foreground mb-4">
          Windows provides multiple layers of security to protect users and organizations from cyber threats.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { icon: <FaShieldAlt />, title: 'Microsoft Defender', desc: 'Built-in antivirus and real-time threat detection' },
            { icon: <FaLock />, title: 'BitLocker', desc: 'Full drive encryption to protect sensitive data' },
            { icon: <FaUserLock />, title: 'Windows Hello', desc: 'Biometric authentication with fingerprint or face' },
            { icon: <FaCogs />, title: 'Secure Boot', desc: 'Prevents unauthorized OS from loading' },
            { icon: <FaGlobe />, title: 'SmartScreen', desc: 'Protects from malicious websites and downloads' },
            { icon: <FaNetworkWired />, title: 'Firewall', desc: 'Monitors incoming/outgoing network traffic' },
          ].map((item, i) => (
            <div key={i} className="p-3 glass rounded-xl hover:scale-105 transition text-center">
              <div className="text-2xl text-primary mx-auto mb-1">{item.icon}</div>
              <h4 className="font-semibold text-sm">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Development Environment */}
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaCode className="text-green-500" /> Development Environment
        </h2>
        <p className="text-muted-foreground mb-4">
          Windows is one of the most popular platforms for software development with powerful tools and frameworks.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 glass rounded-xl border-l-4 border-blue-500">
            <h4 className="font-bold text-blue-600">.NET Platform</h4>
            <p className="text-xs text-muted-foreground mt-1">Framework for building desktop, web, mobile, cloud, and enterprise applications.</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs rounded-full">C#</span>
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs rounded-full">VB.NET</span>
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs rounded-full">F#</span>
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs rounded-full">ASP.NET</span>
            </div>
          </div>
          
          <div className="p-3 glass rounded-xl border-l-4 border-purple-500">
            <h4 className="font-bold text-purple-600">Visual Studio</h4>
            <p className="text-xs text-muted-foreground mt-1">Integrated Development Environment (IDE) with powerful features.</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 text-xs rounded-full">IntelliSense</span>
              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 text-xs rounded-full">Debugger</span>
              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 text-xs rounded-full">Git</span>
            </div>
          </div>
          
          <div className="p-3 glass rounded-xl border-l-4 border-orange-500">
            <h4 className="font-bold text-orange-600">VS Code</h4>
            <p className="text-xs text-muted-foreground mt-1">Lightweight cross-platform code editor with extensive language support.</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 text-xs rounded-full">Python</span>
              <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 text-xs rounded-full">JavaScript</span>
              <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 text-xs rounded-full">Java</span>
              <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 text-xs rounded-full">C++</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Gaming Support */}
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaGamepad className="text-green-500" /> Gaming Support
        </h2>
        <p className="text-muted-foreground mb-4">
          Windows is considered the <strong>best operating system for gaming</strong> with extensive features and platform support.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">🎮 Features</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>DirectX 12 Ultimate</li>
              <li>Xbox integration</li>
              <li>NVIDIA and AMD graphics support</li>
              <li>Wide game compatibility</li>
              <li>Virtual Reality (VR) support</li>
              <li>Game Mode optimization</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">📦 Popular Platforms</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Steam</li>
              <li>Epic Games Store</li>
              <li>Xbox App</li>
              <li>Battle.net</li>
              <li>GOG Galaxy</li>
            </ul>
          </div>
        </div>
      </GlassCard>

      {/* Advantages & Disadvantages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="border-l-4 border-green-500">
          <h3 className="text-xl font-bold text-green-600 mb-3 flex items-center gap-2">
            <FaCheck /> Advantages
          </h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>User-friendly interface</li>
            <li>Excellent hardware compatibility</li>
            <li>Largest software ecosystem</li>
            <li>Best gaming platform</li>
            <li>Strong enterprise support</li>
            <li>Excellent developer tools</li>
            <li>Wide hardware availability</li>
            <li>Regular security updates</li>
          </ul>
        </GlassCard>

        <GlassCard className="border-l-4 border-red-500">
          <h3 className="text-xl font-bold text-red-500 mb-3 flex items-center gap-2">
            <FaTimes /> Disadvantages
          </h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>Higher hardware requirements than Linux</li>
            <li>More frequently targeted by malware</li>
            <li>Paid operating system license</li>
            <li>Some updates may require system restarts</li>
            <li>Can consume more RAM and storage</li>
          </ul>
        </GlassCard>
      </div>

      {/* Software Compatibility */}
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaDesktop className="text-blue-500" /> Software Compatibility
        </h2>
        <p className="text-muted-foreground mb-4">
          Windows supports the <strong>largest ecosystem of desktop software</strong> for both personal and professional use.
        </p>
        
        <div className="flex flex-wrap gap-2">
          {[
            'Microsoft Office', 'Adobe Photoshop', 'Adobe Premiere Pro',
            'AutoCAD', 'SolidWorks', 'MATLAB', 'Android Studio',
            'Visual Studio', 'VMware Workstation', 'Docker Desktop'
          ].map((app, i) => (
            <span key={i} className="px-3 py-1 glass rounded-full text-xs hover:scale-105 transition">
              {app}
            </span>
          ))}
        </div>
      </GlassCard>

      {/* Networking & Cloud */}
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaCloud className="text-cyan-500" /> Networking & Cloud
        </h2>
        <p className="text-muted-foreground mb-4">
          Windows supports enterprise networking and cloud services with powerful integration.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <h3 className="font-semibold mb-2">🔧 Features</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Windows Server</li>
              <li>Microsoft Azure integration</li>
              <li>Hyper-V virtualization</li>
              <li>Remote Desktop Protocol (RDP)</li>
              <li>SMB File Sharing</li>
              <li>VPN support</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">☁️ Cloud Services</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Microsoft 365</li>
              <li>OneDrive</li>
              <li>Azure Active Directory</li>
              <li>Microsoft Intune</li>
            </ul>
          </div>
        </div>
      </GlassCard>

      {/* Summary */}
      <GlassCard className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-2 border-blue-500/30">
        <div className="flex items-center gap-3 mb-3">
          <FaWindows className="text-4xl text-blue-600" />
          <h2 className="text-2xl font-bold">Summary</h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Windows is a <strong>versatile, powerful, and widely adopted operating system</strong> that excels in 
          gaming, business, enterprise, and software development. With its <strong>hybrid NT kernel</strong>, 
          <strong>NTFS file system</strong>, comprehensive <strong>security features</strong>, and extensive 
          <strong>software ecosystem</strong>, Windows remains the <strong>preferred choice for millions of users worldwide</strong>.
        </p>
      </GlassCard>
    </motion.div>
  );
}
