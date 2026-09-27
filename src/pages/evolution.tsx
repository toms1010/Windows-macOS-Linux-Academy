import { motion } from 'framer-motion';
import { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { FaAndroid, FaWindows, FaLinux, FaMobile, FaTablet, FaLaptop } from 'react-icons/fa';

const earlySystems = [
  {
    era: '1940s-1950s',
    title: 'Serial Processing',
    desc: 'No OS. Programs ran one at a time using punch cards.',
    problems: ['Setup time', 'Scheduling issues', 'No user interaction'],
  },
  {
    era: 'Mid-1950s',
    title: 'Simple Batch Systems',
    desc: 'First OS developed for IBM 701/704. Used a monitor to batch jobs.',
    benefit: 'Reduced setup time by batching similar jobs',
  },
  {
    era: '1964',
    title: 'Multiprogrammed Batch Systems',
    desc: 'IBM System/360. Introduced multitasking.',
    benefit: 'CPU switches between jobs during I/O operations',
  },
  {
    era: '1961',
    title: 'Time-Sharing Systems',
    desc: 'IBM 709 with CTSS. Multiple users via terminals.',
    benefit: 'Supported up to 32 users simultaneously',
  },
];

const windowsVersions = [
  { year: 1981, name: 'MS-DOS', desc: 'Command line OS, foundation for Windows' },
  { year: 1985, name: 'Windows 1.0', desc: 'First GUI, multitasking environment' },
  { year: 1987, name: 'Windows 2.0', desc: 'Overlapping windows, minimize/maximize' },
  { year: 1990, name: 'Windows 3.0', desc: 'Improved memory management, first successful version' },
  { year: 1995, name: 'Windows 95', desc: 'Start menu, long filenames, plug-and-play' },
  { year: 1996, name: 'Windows NT 4.0', desc: 'Business-oriented, Task Manager introduced' },
  { year: 1998, name: 'Windows 98', desc: 'AGP support, broader hardware support' },
  { year: 2000, name: 'Windows ME', desc: 'Home PC focus, Windows Movie Maker' },
  { year: 2001, name: 'Windows XP', desc: 'Task-based GUI, improved reliability' },
  { year: 2003, name: 'Windows Server 2003', desc: '64 CPUs, 2TB RAM support' },
  { year: 2007, name: 'Windows Vista', desc: 'Aero interface, Windows Search' },
  { year: 2008, name: 'Windows Server 2008', desc: 'Self-healing NTFS' },
  { year: 2009, name: 'Windows 7', desc: 'Windows Virtual, touch recognition' },
  { year: 2012, name: 'Windows 8', desc: 'Touch interface, tiles, ARM support' },
  { year: 2014, name: 'Windows 10', desc: 'Start menu returns, universal apps' },
  { year: 2021, name: 'Windows 11', desc: 'Centered Start, rounded corners, cleaner UI' },
];

// Complete Android versions from your lecture
const androidVersions = [
  { version: '1.0', name: '—', year: 2008, features: 'First Android release, Android Market, Gmail, Google Maps, Web Browser, Notifications' },
  { version: '1.1', name: 'Petit Four (unofficial)', year: 2009, features: 'Bug fixes, improved API, enhanced messaging' },
  { version: '1.5', name: 'Cupcake', year: 2009, features: 'On-screen keyboard, widgets, video recording, auto-rotation' },
  { version: '1.6', name: 'Donut', year: 2009, features: 'Universal search, improved camera, battery usage indicator, support for different screen sizes' },
  { version: '2.0–2.1', name: 'Eclair', year: 2009, features: 'Google Maps Navigation, multiple accounts, live wallpapers, Bluetooth 2.1' },
  { version: '2.2', name: 'Froyo', year: 2010, features: 'Faster performance (JIT compiler), Wi-Fi hotspot, Adobe Flash support' },
  { version: '2.3', name: 'Gingerbread', year: 2010, features: 'Better gaming, NFC support, improved copy/paste, power management' },
  { version: '3.x', name: 'Honeycomb', year: 2011, features: 'Tablet-only interface, Action Bar, system bar, multi-core processor support' },
  { version: '4.0', name: 'Ice Cream Sandwich', year: 2011, features: 'Face Unlock, Android Beam, redesigned interface, screenshot capture' },
  { version: '4.1–4.3', name: 'Jelly Bean', year: 2012, features: 'Google Now, Project Butter (smooth UI), expandable notifications, voice search' },
  { version: '4.4', name: 'KitKat', year: 2013, features: '"OK Google" voice command, immersive mode, improved memory optimization' },
  { version: '5.0–5.1', name: 'Lollipop', year: 2014, features: 'Material Design, lock screen notifications, ART runtime, battery saver' },
  { version: '6.0', name: 'Marshmallow', year: 2015, features: 'Fingerprint authentication, Doze mode, app permissions, USB Type-C support' },
  { version: '7.0–7.1', name: 'Nougat', year: 2016, features: 'Split-screen multitasking, quick reply, Vulkan graphics API, improved notifications' },
  { version: '8.0–8.1', name: 'Oreo', year: 2017, features: 'Picture-in-Picture, notification channels, autofill framework, faster boot' },
  { version: '9', name: 'Pie', year: 2018, features: 'Gesture navigation, Adaptive Battery, Digital Wellbeing, App Actions' },
  { version: '10', name: 'Android 10', year: 2019, features: 'Dark Mode, Smart Reply, Live Caption, privacy improvements, gesture navigation' },
  { version: '11', name: 'Android 11', year: 2020, features: 'Chat bubbles, screen recorder, media controls, one-time permissions' },
  { version: '12', name: 'Android 12', year: 2021, features: 'Material You design, Privacy Dashboard, microphone/camera indicators, one-handed mode' },
  { version: '13', name: 'Android 13', year: 2022, features: 'Per-app language, notification permission, Bluetooth LE Audio, clipboard privacy' },
  { version: '14', name: 'Android 14', year: 2023, features: 'Ultra HDR photos, Health Connect, AI wallpapers, better battery optimization' },
  { version: '15', name: 'Android 15', year: 2024, features: 'Private Space, partial screen sharing, satellite connectivity support, improved foldable support' },
  { version: '16', name: 'Android 16', year: '2025/2026', features: 'Live Updates notifications, desktop windowing improvements, enhanced AI features, stronger security, improved multitasking' },
];

// Android feature evolution summary
const featureEvolution = [
  { era: 'Early Android (1.0–4.4)', years: '2008–2013', features: 'Basic design, PIN/Password security, Basic multitasking, Simple notifications, Basic power saving, Wi-Fi/Bluetooth' },
  { era: 'Middle Android (5.0–11)', years: '2014–2020', features: 'Material Design, Fingerprint/App Permissions, ART Runtime/Battery Saver, Rich notifications, Doze Mode, NFC/USB-C' },
  { era: 'Modern Android (12–16)', years: '2021–2026', features: 'Material You with AI personalization, Privacy Dashboard/Private Space, AI optimization, Smart notifications/Live Updates, Adaptive Battery with AI, Satellite support/Wi-Fi 7' },
];

export default function Evolution() {
  const [activeTab, setActiveTab] = useState('early');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-4xl font-bold mb-4">Evolution of Operating Systems</h1>
      <p className="text-lg text-muted-foreground mb-6">
        From simple serial processing to modern cloud-ready systems - explore how operating systems evolved.
      </p>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('early')}
          className={`px-4 py-2 rounded-full transition ${
            activeTab === 'early' ? 'bg-primary text-white' : 'glass hover:bg-primary/10'
          }`}
        >
          📜 Early Systems
        </button>
        <button
          onClick={() => setActiveTab('windows')}
          className={`px-4 py-2 rounded-full transition ${
            activeTab === 'windows' ? 'bg-primary text-white' : 'glass hover:bg-primary/10'
          }`}
        >
          🪟 Windows
        </button>
        <button
          onClick={() => setActiveTab('android')}
          className={`px-4 py-2 rounded-full transition ${
            activeTab === 'android' ? 'bg-primary text-white' : 'glass hover:bg-primary/10'
          }`}
        >
          🤖 Android
        </button>
        <button
          onClick={() => setActiveTab('evolution')}
          className={`px-4 py-2 rounded-full transition ${
            activeTab === 'evolution' ? 'bg-primary text-white' : 'glass hover:bg-primary/10'
          }`}
        >
          📊 Feature Evolution
        </button>
      </div>

      {/* Early Systems */}
      {activeTab === 'early' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {earlySystems.map((system, i) => (
            <GlassCard key={i} className="hover:shadow-lg transition">
              <div className="text-sm text-primary font-mono">{system.era}</div>
              <h3 className="text-xl font-bold mt-1">{system.title}</h3>
              <p className="text-muted-foreground text-sm mt-2">{system.desc}</p>
              {system.problems && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-red-500">Problems:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {system.problems.map((p, j) => (
                      <li key={j}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
              {system.benefit && (
                <div className="mt-3 text-sm text-green-600 dark:text-green-400">
                  ✅ {system.benefit}
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}

      {/* Windows Evolution */}
      {activeTab === 'windows' && (
        <div className="relative flex flex-col gap-3 before:absolute before:left-4 before:top-0 before:h-full before:w-1 before:bg-primary/30">
          {windowsVersions.map((version, i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-start gap-6 ml-12 relative"
            >
              <div className="absolute -left-10 w-6 h-6 rounded-full bg-primary border-4 border-white dark:border-slate-800 flex items-center justify-center text-white text-xs font-bold">
                {i + 1}
              </div>
              <div className="glass p-4 rounded-2xl flex-1 hover:shadow-lg transition">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xl font-bold">{version.name}</span>
                  <span className="text-sm font-mono text-primary">{version.year}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{version.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Android Evolution - Complete Version */}
      {activeTab === 'android' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <FaAndroid className="text-5xl text-green-500" />
            <div>
              <h2 className="text-2xl font-bold">Android Version History</h2>
              <p className="text-sm text-muted-foreground">2008 – Present | 27 versions</p>
            </div>
          </div>

          {/* Android versions in a scrollable grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
            {androidVersions.map((version, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`glass p-4 rounded-2xl hover:shadow-lg transition border-l-4 ${
                  parseInt(version.version) >= 12 ? 'border-green-500' :
                  parseInt(version.version) >= 5 ? 'border-blue-500' :
                  'border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-primary">v{version.version}</span>
                    {version.name !== '—' && version.name !== 'Android 10' && version.name !== 'Android 11' && 
                     version.name !== 'Android 12' && version.name !== 'Android 13' && version.name !== 'Android 14' &&
                     version.name !== 'Android 15' && version.name !== 'Android 16' && (
                      <span className="ml-2 text-sm font-medium text-muted-foreground">({version.name})</span>
                    )}
                    {version.name === 'Android 10' && <span className="ml-2 text-sm font-medium text-muted-foreground">(Queen Cake)</span>}
                    {version.name === 'Android 11' && <span className="ml-2 text-sm font-medium text-muted-foreground">(Red Velvet)</span>}
                    {version.name === 'Android 12' && <span className="ml-2 text-sm font-medium text-muted-foreground">(Snow Cone)</span>}
                    {version.name === 'Android 13' && <span className="ml-2 text-sm font-medium text-muted-foreground">(Tiramisu)</span>}
                    {version.name === 'Android 14' && <span className="ml-2 text-sm font-medium text-muted-foreground">(Upside Down Cake)</span>}
                    {version.name === 'Android 15' && <span className="ml-2 text-sm font-medium text-muted-foreground">(Vanilla Ice Cream)</span>}
                    {version.name === 'Android 16' && <span className="ml-2 text-sm font-medium text-muted-foreground">(Baklava)</span>}
                  </div>
                  <span className="text-xs font-mono bg-primary/10 px-2 py-1 rounded-full">{version.year}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{version.features}</p>
              </motion.div>
            ))}
          </div>

          {/* Android Era Summary */}
          <GlassCard className="mt-4 border-2 border-green-500/30">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <FaAndroid className="text-green-500" /> Android Evolution Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-100 dark:bg-gray-800/30 p-4 rounded-xl border-l-4 border-gray-500">
                <h4 className="font-bold text-sm">📱 Early Android</h4>
                <p className="text-xs text-muted-foreground">2008–2013 (1.0–4.4)</p>
                <ul className="text-xs text-muted-foreground list-disc list-inside mt-2 space-y-1">
                  <li>Core smartphone features</li>
                  <li>Widgets and notifications</li>
                  <li>Google services integration</li>
                  <li>Basic multitasking</li>
                </ul>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-xl border-l-4 border-blue-500">
                <h4 className="font-bold text-sm">🎨 Material Design Era</h4>
                <p className="text-xs text-muted-foreground">2014–2020 (5.0–11)</p>
                <ul className="text-xs text-muted-foreground list-disc list-inside mt-2 space-y-1">
                  <li>Material Design UI</li>
                  <li>Improved security (permissions)</li>
                  <li>Battery optimization (Doze)</li>
                  <li>Multi-tasking features</li>
                </ul>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-xl border-l-4 border-green-500">
                <h4 className="font-bold text-sm">🤖 AI & Privacy Era</h4>
                <p className="text-xs text-muted-foreground">2021–2026 (12–16)</p>
                <ul className="text-xs text-muted-foreground list-disc list-inside mt-2 space-y-1">
                  <li>Material You AI personalization</li>
                  <li>Privacy Dashboard</li>
                  <li>AI-powered features</li>
                  <li>Satellite connectivity</li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Feature Evolution */}
      {activeTab === 'evolution' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <FaAndroid className="text-green-500" />
            <span>Android Feature Evolution</span>
          </h2>
          
          <div className="overflow-x-auto glass rounded-2xl p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-3 text-left font-semibold">Feature</th>
                  <th className="p-3 text-left text-gray-500">Early Android (1.0–4.4)</th>
                  <th className="p-3 text-left text-blue-500">Middle Android (5.0–11)</th>
                  <th className="p-3 text-left text-green-500">Modern Android (12–16)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['User Interface', 'Basic design', 'Material Design', 'Material You with AI personalization'],
                  ['Security', 'PIN and Password', 'Fingerprint, App Permissions', 'Privacy Dashboard, Private Space, Theft Protection'],
                  ['Performance', 'Basic multitasking', 'ART Runtime, Battery Saver', 'AI optimization, smoother animations'],
                  ['Camera', 'Basic camera app', 'HDR, Manual controls', 'Ultra HDR, AI image processing'],
                  ['Notifications', 'Simple notifications', 'Rich notifications', 'Smart notifications with Live Updates'],
                  ['Battery', 'Basic power saving', 'Doze Mode', 'Adaptive Battery with AI optimization'],
                  ['Connectivity', 'Wi-Fi, Bluetooth', 'NFC, USB-C', 'Satellite support, Wi-Fi 7 improvements'],
                  ['Accessibility', 'Basic accessibility', 'Voice Assistant', 'AI-powered accessibility features'],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 font-medium">{row[0]}</td>
                    <td className="p-3 text-xs">{row[1]}</td>
                    <td className="p-3 text-xs">{row[2]}</td>
                    <td className="p-3 text-xs">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard className="border-l-4 border-gray-500">
              <h4 className="font-bold flex items-center gap-2">
                <span>📱</span> Early Android (1.0–4.4)
              </h4>
              <p className="text-xs text-muted-foreground">2008–2013</p>
              <p className="text-sm mt-2">Established Android with core smartphone features, widgets, notifications, and Google services.</p>
            </GlassCard>
            <GlassCard className="border-l-4 border-blue-500">
              <h4 className="font-bold flex items-center gap-2">
                <span>🎨</span> Middle Android (5.0–11)
              </h4>
              <p className="text-xs text-muted-foreground">2014–2020</p>
              <p className="text-sm mt-2">Focused on Material Design, improved security, multitasking, battery life, and user experience.</p>
            </GlassCard>
            <GlassCard className="border-l-4 border-green-500">
              <h4 className="font-bold flex items-center gap-2">
                <span>🤖</span> Modern Android (12–16)
              </h4>
              <p className="text-xs text-muted-foreground">2021–2025/2026</p>
              <p className="text-sm mt-2">Advanced privacy controls, AI-powered personalization, desktop-like productivity, and modern hardware support.</p>
            </GlassCard>
          </div>
        </div>
      )}
    </motion.div>
  );
}
