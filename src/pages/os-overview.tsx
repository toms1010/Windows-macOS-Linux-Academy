import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { 
  FaMicrochip, FaTasks, FaMemory, FaDatabase, FaNetworkWired, 
  FaShieldAlt, FaDesktop, FaUsb, FaCogs, FaFolderOpen, FaGlobe,
  FaArrowRight, FaCheckCircle
} from 'react-icons/fa';

export default function OSOverview() {
  // Static classes only — Tailwind JIT cannot generate `border-${color}-500`
  // template strings, so map every color explicitly.
  const borderFor: Record<string, string> = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    purple: 'border-purple-500',
    yellow: 'border-yellow-500',
    cyan: 'border-cyan-500',
    red: 'border-red-500',
    pink: 'border-pink-500',
    orange: 'border-orange-500',
  };
  const textFor: Record<string, string> = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    yellow: 'text-yellow-500',
    cyan: 'text-cyan-500',
    red: 'text-red-500',
    pink: 'text-pink-500',
    orange: 'text-orange-500',
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          What is an <span className="text-primary">Operating System</span>?
        </h1>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-muted-foreground">
            An <strong>Operating System (OS)</strong> is system software that manages a computer&apos;s hardware 
            and software resources while providing common services for application programs. 
            It serves as the interface between the user and the computer hardware.
          </p>
        </div>
      </div>

      {/* Definition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="text-center border-t-4 border-blue-500">
          <div className="text-4xl text-blue-500 mb-3">🖥️</div>
          <h3 className="font-bold text-lg">Hardware Management</h3>
          <p className="text-sm text-muted-foreground">Manages CPU, memory, storage, and I/O devices</p>
        </GlassCard>
        <GlassCard className="text-center border-t-4 border-green-500">
          <div className="text-4xl text-green-500 mb-3">📱</div>
          <h3 className="font-bold text-lg">Software Management</h3>
          <p className="text-sm text-muted-foreground">Provides environment for applications to run</p>
        </GlassCard>
        <GlassCard className="text-center border-t-4 border-orange-500">
          <div className="text-4xl text-orange-500 mb-3">🔗</div>
          <h3 className="font-bold text-lg">User Interface</h3>
          <p className="text-sm text-muted-foreground">Interface between user and computer hardware</p>
        </GlassCard>
      </div>

      {/* Key Components Section */}
      <h2 className="text-2xl font-bold mt-8 flex items-center gap-2">
        <FaCogs className="text-primary" /> Key Components
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <FaMicrochip />, label: 'Kernel', color: 'blue', desc: 'Core component, bridge between hardware and software' },
          { icon: <FaTasks />, label: 'Process Management', color: 'green', desc: 'Creates, schedules, executes programs' },
          { icon: <FaMemory />, label: 'Memory Management', color: 'purple', desc: 'Allocates and manages RAM' },
          { icon: <FaDatabase />, label: 'File System', color: 'yellow', desc: 'Organizes and manages data storage' },
          { icon: <FaNetworkWired />, label: 'Networking', color: 'cyan', desc: 'Enables communication and connectivity' },
          { icon: <FaShieldAlt />, label: 'Security', color: 'red', desc: 'Protects system and data' },
          { icon: <FaDesktop />, label: 'User Interface', color: 'pink', desc: 'GUI and CLI interaction' },
          { icon: <FaUsb />, label: 'Device Drivers', color: 'orange', desc: 'Hardware communication' },
        ].map((comp, i) => (
          <GlassCard key={i} className={`${borderFor[comp.color]} border-l-4 hover:scale-105 transition text-center`}>
            <div className={`text-4xl ${textFor[comp.color]} mb-2 flex justify-center`}>{comp.icon}</div>
            <h3 className="font-bold text-base">{comp.label}</h3>
            <p className="text-xs text-muted-foreground mt-1">{comp.desc}</p>
          </GlassCard>
        ))}
      </div>

      {/* Component Details */}
      <h2 className="text-2xl font-bold mt-8 flex items-center gap-2">
        <FaCheckCircle className="text-primary" /> Component Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: 'Kernel',
            icon: <FaMicrochip className="text-blue-500" />,
            desc: 'Controls CPU scheduling, memory allocation, hardware communication, and system calls.',
            example: 'Allocates resources when you open an application'
          },
          {
            title: 'Process Management',
            icon: <FaTasks className="text-green-500" />,
            desc: 'Creates, schedules, executes, and terminates running programs, enabling multitasking.',
            example: 'Run browser, music player, and editor simultaneously'
          },
          {
            title: 'Memory Management',
            icon: <FaMemory className="text-purple-500" />,
            desc: 'Controls RAM allocation, supports virtual memory, and prevents memory conflicts.',
            example: 'Reserves 4GB RAM for Photoshop'
          },
          {
            title: 'File System',
            icon: <FaDatabase className="text-yellow-500" />,
            desc: 'Organizes data on storage devices, controls file permissions, prevents corruption.',
            example: 'Saves and organizes Word documents'
          },
          {
            title: 'Networking',
            icon: <FaNetworkWired className="text-cyan-500" />,
            desc: 'Manages Wi-Fi/Ethernet, supports TCP/IP, enables file and device sharing.',
            example: 'Connects to websites and servers'
          },
          {
            title: 'Security',
            icon: <FaShieldAlt className="text-red-500" />,
            desc: 'User authentication, password management, data encryption, and firewall protection.',
            example: 'Verifies identity with password or fingerprint'
          },
          {
            title: 'User Interface',
            icon: <FaDesktop className="text-pink-500" />,
            desc: 'GUI (windows, icons, menus) and CLI (text-based commands) for user interaction.',
            example: 'Click icons to launch applications'
          },
          {
            title: 'Device Drivers',
            icon: <FaUsb className="text-orange-500" />,
            desc: 'Allows OS to communicate with printers, graphics cards, keyboards, and mice.',
            example: 'Install printer driver for printing'
          },
        ].map((comp, i) => (
          <GlassCard key={i} className="hover:shadow-lg transition border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{comp.icon}</span>
              <h3 className="font-bold text-lg">{comp.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{comp.desc}</p>
            <div className="mt-2 p-2 bg-primary/5 rounded-lg">
              <p className="text-xs">
                <span className="font-semibold">💡 Example:</span> {comp.example}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Primary Functions */}
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaTasks className="text-primary" /> Primary Functions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { icon: <FaMicrochip />, text: 'Manages CPU, memory, storage, and I/O devices' },
            { icon: <FaDesktop />, text: 'Provides an environment for applications to run' },
            { icon: <FaGlobe />, text: 'Controls communication between software and hardware' },
            { icon: <FaShieldAlt />, text: 'Ensures system security and user authentication' },
            { icon: <FaFolderOpen />, text: 'Organizes files and directories' },
            { icon: <FaNetworkWired />, text: 'Supports networking and internet connectivity' },
            { icon: <FaCogs />, text: 'Allows multiple applications to run simultaneously' }
          ].map((func, i) => (
            <div key={i} className="flex items-center gap-3 p-3 hover:bg-primary/5 rounded-lg transition border border-white/10">
              <span className="text-primary text-xl">{func.icon}</span>
              <span className="text-sm text-muted-foreground">{func.text}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* File Systems */}
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaDatabase className="text-primary" /> Common File Systems
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
            <p className="font-bold text-blue-600">Windows</p>
            <p className="text-sm font-mono">NTFS, FAT32, exFAT</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/20 rounded-xl text-center">
            <p className="font-bold text-gray-600 dark:text-gray-300">macOS</p>
            <p className="text-sm font-mono">APFS, HFS+</p>
          </div>
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center">
            <p className="font-bold text-orange-600">Linux</p>
            <p className="text-sm font-mono">ext4, XFS, Btrfs</p>
          </div>
        </div>
      </GlassCard>

      {/* UI Types */}
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaDesktop className="text-primary" /> User Interface Types
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 className="font-bold text-lg text-blue-600 flex items-center gap-2">
              <FaDesktop /> Graphical User Interface (GUI)
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Windows, macOS, Ubuntu Desktop</p>
            <p className="text-xs text-muted-foreground mt-1">Uses windows, icons, buttons, and menus</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/20 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-lg text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <FaUsb /> Command-Line Interface (CLI)
            </h3>
            <p className="text-sm text-muted-foreground mt-1">PowerShell, Bash, Zsh</p>
            <p className="text-xs text-muted-foreground mt-1">Uses text-based commands</p>
          </div>
        </div>
      </GlassCard>

      {/* Summary Table */}
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4">📊 Component Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="p-3 text-left font-semibold">Component</th>
                <th className="p-3 text-left font-semibold">Main Function</th>
              </tr>
            </thead>
            <tbody>
              {[
                { comp: 'Kernel', func: 'Bridge between hardware and software' },
                { comp: 'Process Management', func: 'Run and schedule programs' },
                { comp: 'Memory Management', func: 'Allocate and manage RAM' },
                { comp: 'File System', func: 'Organize and store data' },
                { comp: 'Networking', func: 'Enable communication' },
                { comp: 'Security', func: 'Protect system and data' },
                { comp: 'User Interface', func: 'User interaction' },
                { comp: 'Device Drivers', func: 'Hardware communication' },
              ].map((row, i) => (
                <tr key={i} className={`border-b border-white/10 hover:bg-white/5 ${i % 2 === 0 ? 'bg-white/5' : ''}`}>
                  <td className="p-3 font-medium">{row.comp}</td>
                  <td className="p-3 text-muted-foreground text-xs">{row.func}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
}
