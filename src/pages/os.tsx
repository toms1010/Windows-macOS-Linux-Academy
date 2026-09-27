import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { 
  FaMicrochip, FaTasks, FaMemory, FaDatabase, FaNetworkWired, 
  FaShieldAlt, FaDesktop, FaUsb, FaCogs, FaLaptop, FaServer,
  FaWindows, FaApple, FaLinux, FaMobile, FaTablet, FaGlobe,
  FaUser, FaLock, FaFolderOpen, FaWifi, FaPrint, FaKeyboard,
  FaMouse, FaCamera, FaPlay, FaStop, FaPause, FaFileAlt,
  FaFolder, FaHdd, FaCloud, FaTerminal
} from 'react-icons/fa';

export default function OS() {
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
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          An operating system (OS) is system software that manages computer hardware, 
          software resources, and provides common services for computer programs.
        </p>
      </div>

      {/* Definition Card */}
      <GlassCard className="bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-950/20 dark:to-orange-950/20 border-2 border-primary/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <FaCogs className="text-primary" /> What is an OS?
            </h2>
            <p className="text-muted-foreground">
              An <strong>Operating System (OS)</strong> is system software that manages a computer&apos;s hardware 
              and software resources while providing common services for application programs. 
              It serves as the interface between the user and the computer hardware, allowing 
              users to interact with the system through a graphical user interface (GUI) or a 
              command-line interface (CLI).
            </p>
            <p className="text-muted-foreground mt-3">
              Without an operating system, a computer cannot efficiently execute programs, 
              manage memory, communicate with hardware devices, or organize files. Every 
              computer, smartphone, tablet, and server requires an operating system to function properly.
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-center">
                <FaWindows className="text-4xl text-blue-600 mx-auto" />
                <span className="text-sm font-semibold">Windows</span>
                <p className="text-xs text-muted-foreground">Desktop & Server</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-800/30 rounded-xl text-center">
                <FaApple className="text-4xl text-gray-600 dark:text-gray-300 mx-auto" />
                <span className="text-sm font-semibold">macOS</span>
                <p className="text-xs text-muted-foreground">Apple Ecosystem</p>
              </div>
              <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-center col-span-2">
                <FaLinux className="text-4xl text-orange-500 mx-auto" />
                <span className="text-sm font-semibold">Linux</span>
                <p className="text-xs text-muted-foreground">Open Source & Servers</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Primary Functions */}
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaTasks className="text-primary" /> Primary Functions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { icon: <FaMicrochip />, text: 'Manages the computer\'s CPU, memory, storage, and input/output devices' },
            { icon: <FaDesktop />, text: 'Provides an environment where applications can run' },
            { icon: <FaGlobe />, text: 'Controls communication between software and hardware' },
            { icon: <FaShieldAlt />, text: 'Ensures system security and user authentication' },
            { icon: <FaFolderOpen />, text: 'Organizes files and directories' },
            { icon: <FaNetworkWired />, text: 'Supports networking and internet connectivity' },
            { icon: <FaCogs />, text: 'Allows multiple applications to run simultaneously (multitasking)' }
          ].map((func, i) => (
            <div key={i} className="flex items-start gap-3 p-3 hover:bg-primary/5 rounded-lg transition border border-white/10">
              <span className="text-primary text-xl mt-0.5">{func.icon}</span>
              <span className="text-sm text-muted-foreground">{func.text}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Key Components */}
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
          <GlassCard key={i} className={`${borderFor[comp.color]} border-l-4 hover:scale-105 transition`}>
            <div className={`text-3xl ${textFor[comp.color]} mb-2`}>{comp.icon}</div>
            <h3 className="font-bold text-lg">{comp.label}</h3>
            <p className="text-xs text-muted-foreground">{comp.desc}</p>
          </GlassCard>
        ))}
      </div>

      {/* Detailed Component Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: 'Kernel',
            icon: <FaMicrochip className="text-blue-500" />,
            desc: 'The kernel is the core component that manages CPU scheduling, memory allocation, hardware communication, and system calls from applications.',
            example: 'When you open a web browser, the kernel allocates CPU time, memory, and storage resources.'
          },
          {
            title: 'Process Management',
            icon: <FaTasks className="text-green-500" />,
            desc: 'Process management creates, schedules, executes, and terminates running programs, enabling multitasking and preventing process conflicts.',
            example: 'You can browse the web, listen to music, and edit a document simultaneously.'
          },
          {
            title: 'Memory Management',
            icon: <FaMemory className="text-purple-500" />,
            desc: 'Memory management controls the allocation and release of RAM, supports virtual memory, and prevents memory conflicts.',
            example: 'When Photoshop requires 4 GB of RAM, the OS reserves that memory while other apps continue running.'
          },
          {
            title: 'File System',
            icon: <FaDatabase className="text-yellow-500" />,
            desc: 'The file system organizes and manages data on storage devices, controlling file permissions and preventing data corruption.',
            example: 'When saving a document, the OS determines where it is stored on the disk.'
          },
          {
            title: 'Networking',
            icon: <FaNetworkWired className="text-cyan-500" />,
            desc: 'Networking manages Wi-Fi/Ethernet connections, supports TCP/IP communication, and enables file/device sharing.',
            example: 'When visiting a website, the OS communicates with servers over the Internet.'
          },
          {
            title: 'Security',
            icon: <FaShieldAlt className="text-red-500" />,
            desc: 'Security protects the system with user authentication, password management, data encryption, and firewall protection.',
            example: 'When you log in with a password, PIN, or fingerprint, the OS verifies your identity.'
          },
          {
            title: 'User Interface',
            icon: <FaDesktop className="text-pink-500" />,
            desc: 'The UI enables user interaction through GUI (windows, icons, menus) or CLI (text-based commands).',
            example: 'Clicking an application icon launches the program through the graphical interface.'
          },
          {
            title: 'Device Drivers',
            icon: <FaUsb className="text-orange-500" />,
            desc: 'Device drivers allow the OS to communicate with hardware devices like printers, graphics cards, keyboards, and mice.',
            example: 'When a printer is connected, the OS installs the appropriate driver for printing.'
          },
        ].map((comp, i) => (
          <GlassCard key={i} className="hover:shadow-lg transition border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{comp.icon}</span>
              <h3 className="font-bold text-lg">{comp.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{comp.desc}</p>
            <div className="p-2 bg-primary/5 rounded-lg">
              <p className="text-xs">
                <span className="font-semibold">💡 Example:</span> {comp.example}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* File Systems Table */}
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaHdd className="text-primary" /> Common File Systems by OS
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="p-3 text-left font-semibold">Operating System</th>
                <th className="p-3 text-left font-semibold">File Systems</th>
                <th className="p-3 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { os: 'Windows', fs: 'NTFS, FAT32, exFAT', desc: 'NTFS for security, FAT32 for compatibility, exFAT for large files' },
                { os: 'macOS', fs: 'APFS, HFS+', desc: 'APFS optimized for SSDs, HFS+ for older systems' },
                { os: 'Linux', fs: 'ext4, XFS, Btrfs', desc: 'ext4 for general use, XFS for large files, Btrfs for advanced features' },
              ].map((row, i) => (
                <tr key={i} className={`border-b border-white/10 hover:bg-white/5 ${i % 2 === 0 ? 'bg-white/5' : ''}`}>
                  <td className="p-3 font-medium">{row.os}</td>
                  <td className="p-3 font-mono text-xs">{row.fs}</td>
                  <td className="p-3 text-muted-foreground text-xs">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* GUI vs CLI */}
      <GlassCard>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FaDesktop className="text-primary" /> User Interface Types
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 className="font-bold text-lg text-blue-600 flex items-center gap-2">
              <FaDesktop /> Graphical User Interface (GUI)
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Uses windows, icons, buttons, and menus for user interaction.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-xs">Windows</span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-xs">macOS</span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-xs">Ubuntu</span>
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/20 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-lg text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <FaTerminal /> Command-Line Interface (CLI)
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Uses text-based commands for system interaction and automation.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800/50 rounded-full text-xs">PowerShell</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800/50 rounded-full text-xs">Bash</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800/50 rounded-full text-xs">Zsh</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* OS Examples */}
      <GlassCard className="bg-gradient-to-r from-blue-50 via-gray-50 to-orange-50 dark:from-blue-950/20 dark:via-gray-950/20 dark:to-orange-950/20 border-2 border-primary/20">
        <h2 className="text-2xl font-bold mb-4 text-center">🖥️ Popular Operating Systems</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <FaWindows className="text-5xl text-blue-600 mx-auto mb-2" />
            <h3 className="font-bold">Windows</h3>
            <p className="text-xs text-muted-foreground">Microsoft | 1985</p>
            <p className="text-xs text-muted-foreground mt-1">Most widely used desktop OS</p>
          </div>
          <div className="text-center p-4">
            <FaApple className="text-5xl text-gray-600 dark:text-gray-300 mx-auto mb-2" />
            <h3 className="font-bold">macOS</h3>
            <p className="text-xs text-muted-foreground">Apple | 1984</p>
            <p className="text-xs text-muted-foreground mt-1">Creative professionals choice</p>
          </div>
          <div className="text-center p-4">
            <FaLinux className="text-5xl text-orange-500 mx-auto mb-2" />
            <h3 className="font-bold">Linux</h3>
            <p className="text-xs text-muted-foreground">Open Source | 1991</p>
            <p className="text-xs text-muted-foreground mt-1">Server & development platform</p>
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
                <th className="p-3 text-left font-semibold">Example</th>
              </tr>
            </thead>
            <tbody>
              {[
                { comp: 'Kernel', func: 'Bridge between hardware and software', example: 'CPU scheduling, memory allocation' },
                { comp: 'Process Management', func: 'Run and schedule programs', example: 'Multitasking applications' },
                { comp: 'Memory Management', func: 'Allocate and manage RAM', example: 'Virtual memory, RAM allocation' },
                { comp: 'File System', func: 'Organize and store data', example: 'Saving and retrieving files' },
                { comp: 'Networking', func: 'Enable communication', example: 'Internet connectivity, file sharing' },
                { comp: 'Security', func: 'Protect system and data', example: 'User authentication, encryption' },
                { comp: 'User Interface', func: 'User interaction', example: 'GUI windows, CLI commands' },
                { comp: 'Device Drivers', func: 'Hardware communication', example: 'Printers, graphics cards, keyboards' },
              ].map((row, i) => (
                <tr key={i} className={`border-b border-white/10 hover:bg-white/5 ${i % 2 === 0 ? 'bg-white/5' : ''}`}>
                  <td className="p-3 font-medium">{row.comp}</td>
                  <td className="p-3 text-muted-foreground text-xs">{row.func}</td>
                  <td className="p-3 text-muted-foreground text-xs">{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
}
