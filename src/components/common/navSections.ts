export interface NavSection {
  title: string;
  links: { href: string; label: string }[];
}

/** Single source of truth for the full site navigation (sidebar + mobile drawer). */
export const NAV_SECTIONS: NavSection[] = [
  {
    title: '📚 Getting Started',
    links: [
      { href: '/', label: 'Home' },
      { href: '/os-overview', label: 'OS Overview' },
      { href: '/os', label: 'What is an OS?' },
    ],
  },
  {
    title: '📊 Comparisons',
    links: [
      { href: '/comparison', label: 'Windows vs Linux' },
      { href: '/triple-comparison', label: 'Win vs macOS vs Linux' },
    ],
  },
  {
    title: '🖥️ Operating Systems',
    links: [
      { href: '/windows', label: 'Windows Overview' },
      { href: '/linux', label: 'Linux Overview' },
      { href: '/evolution', label: 'Evolution Timeline' },
    ],
  },
  {
    title: '⚙️ Core Concepts',
    links: [
      { href: '/kernel', label: 'Kernel' },
      { href: '/kernel-types', label: 'Kernel Types' },
      { href: '/linux-architecture', label: 'Linux Architecture' },
      { href: '/windows-architecture', label: 'Windows Architecture' },
    ],
  },
  {
    title: '🧪 Interactive Labs',
    links: [
      { href: '/permissions', label: 'Permissions Lab' },
      { href: '/cpu-scheduling', label: 'CPU Scheduling' },
      { href: '/virtual-memory', label: 'Virtual Memory' },
      { href: '/filesystem-explorer', label: 'Filesystem Explorer' },
      { href: '/system-calls', label: 'System Calls' },
    ],
  },
  {
    title: '💻 Development',
    links: [
      { href: '/roadmap', label: 'Backend Roadmap' },
      { href: '/ubuntu-guide', label: 'Ubuntu Server Guide' },
      { href: '/projects', label: 'Ubuntu Projects' },
    ],
  },
  {
    title: '🛠️ Tools & Resources',
    links: [
      { href: '/commands', label: 'Command Reference' },
      { href: '/terminal-simulator', label: 'Terminal Simulator' },
      { href: '/quiz', label: 'Interactive Quiz' },
      { href: '/resources', label: 'Resources' },
      { href: '/learning-hub', label: 'Learning Hub' },
    ],
  },
  {
    title: '📬 Contact',
    links: [{ href: '/contact', label: 'Contact' }],
  },
  {
    title: '👤 Account',
    links: [
      { href: '/login', label: 'Sign In' },
      { href: '/signup', label: 'Sign Up' },
      { href: '/profile', label: 'Profile' },
    ],
  },
];
