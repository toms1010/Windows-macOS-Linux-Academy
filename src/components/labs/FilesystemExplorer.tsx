import { useMemo, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import CodeBlock from '@/components/ui/CodeBlock';
import { FaLinux, FaWindows, FaFolder, FaDatabase, FaLock, FaTerminal, FaUserShield } from 'react-icons/fa';

export interface FsNode {
  id: string;
  name: string;
  path: string;
  purpose: string;
  contents: string;
  security: string;
  admin: string;
  commands: string[];
  /** Child node ids — makes this node expandable in the tree */
  children?: string[];
  /** Registry is a database, not a directory — rendered distinctly */
  kind?: 'dir' | 'registry';
}

const LINUX_NODES: FsNode[] = [
  {
    id: 'slash', name: '/', path: '/',
    purpose: 'The single root of the whole hierarchy — every disk, USB stick and network share is mounted somewhere under here.',
    contents: 'Only subdirectories; files never live directly in / on a healthy system.',
    security: 'drwxr-xr-x root:root — everyone can traverse, only root can add entries.',
    admin: 'Almost never written to directly; used as the mount anchor.',
    commands: ['ls /', 'df -h', 'mount | column -t'],
    children: ['bin', 'boot', 'dev', 'etc', 'home', 'lib', 'media', 'mnt', 'opt', 'proc', 'roothome', 'run', 'sbin', 'srv', 'sys', 'tmp', 'usr', 'var'],
  },
  {
    id: 'bin', name: 'bin', path: '/bin (→ /usr/bin)',
    purpose: 'Essential user commands needed for boot and repair.',
    contents: 'ls, cp, mv, cat, bash, systemctl basics.',
    security: 'rwxr-xr-x root:root — executable by all, writable only by root.',
    admin: 'On modern distros a symlink to /usr/bin (usrmerge). Never add personal scripts here — use /usr/local/bin.',
    commands: ['ls /bin', 'which ls', 'ls -l /bin'],
  },
  {
    id: 'boot', name: 'boot', path: '/boot',
    purpose: 'Boot loader and kernel images.',
    contents: 'vmlinuz kernels, initramfs images, GRUB config.',
    security: 'Usually root-only readable; a tampered kernel owns the machine.',
    admin: 'Clean old kernels with the package manager when /boot fills up, or updates fail.',
    commands: ['ls /boot', 'uname -r', 'df -h /boot'],
  },
  {
    id: 'dev', name: 'dev', path: '/dev',
    purpose: 'Hardware exposed as files — everything is a file.',
    contents: 'sda (disks), tty/pts (terminals), null, zero, random.',
    security: 'Device nodes with strict group ownership (e.g. disk, dialout).',
    admin: 'Managed automatically by udev; check here when disks or serial devices misbehave.',
    commands: ['ls /dev', 'lsblk', 'ls -l /dev/sda*'],
  },
  {
    id: 'etc', name: 'etc', path: '/etc',
    purpose: 'System-wide configuration files (editable text).',
    contents: 'passwd, hosts, fstab, ssh/sshd_config, nginx/.',
    security: 'Mostly rw-r--r-- root:root; secrets like shadow are rw------- (root only).',
    admin: 'Back up /etc before upgrades. Prefer version-controlling host config here.',
    commands: ['ls /etc', 'cat /etc/hosts', 'sudo -e /etc/hostname'],
  },
  {
    id: 'home', name: 'home', path: '/home',
    purpose: 'One directory per regular user; personal files and per-user config.',
    contents: '/home/alice, shell dotfiles (.bashrc), user projects.',
    security: 'Typically rwxr-x--- user:user — other users cannot list your home on strict systems.',
    admin: 'Quota and backup policies usually target /home. Never store service data here.',
    commands: ['ls /home', 'echo $HOME', 'ls -la ~'],
  },
  {
    id: 'lib', name: 'lib', path: '/lib (→ /usr/lib)',
    purpose: 'Shared libraries the binaries in /bin and /sbin need at boot.',
    contents: 'libc.so, kernel modules under /lib/modules.',
    security: 'Read-only for non-root; library injection here compromises everything.',
    admin: 'Diagnose missing libraries with ldd; let the package manager own this tree.',
    commands: ['ldd /bin/ls', 'ls /lib/x86_64-linux-gnu | head'],
  },
  {
    id: 'media', name: 'media', path: '/media',
    purpose: 'Mount point for removable media (USB sticks, DVDs).',
    contents: 'Per-user subdirectories created on insertion, e.g. /media/alice/USB.',
    security: 'Mounted with restrictive options (noexec, nodev) by default on desktops.',
    admin: 'Look here first when a plugged-in drive “doesn\u2019t show up”.',
    commands: ['ls /media', 'lsblk -f', 'mount | grep media'],
  },
  {
    id: 'mnt', name: 'mnt', path: '/mnt',
    purpose: 'Traditional temporary mount point for admins (network shares, rescue disks).',
    contents: 'Empty by default; populated manually, e.g. /mnt/backup.',
    security: 'Inherits root ownership — set permissions when mounting.',
    admin: 'Prefer /mnt for manual/one-off mounts, /media for automatic removable media.',
    commands: ['ls /mnt', 'sudo mount /dev/sdb1 /mnt/data'],
  },
  {
    id: 'opt', name: 'opt', path: '/opt',
    purpose: 'Optional third-party software bundles (self-contained).',
    contents: 'google/chrome, spotify-style vendor trees, commercial agents.',
    security: 'Vendor-owned; audit setuid binaries vendors drop here.',
    admin: 'Good place for software installed outside the package manager.',
    commands: ['ls /opt', 'find /opt -maxdepth 2'],
  },
  {
    id: 'proc', name: 'proc', path: '/proc',
    purpose: 'Virtual window into the kernel and every process (not real files).',
    contents: '/proc/cpuinfo, /proc/meminfo, /proc/PID/ directories.',
    security: 'World-readable status, but per-process dirs are owner-restricted (hidepid hardening exists).',
    admin: 'First stop for debugging: load, memory, open files, sysctls under /proc/sys.',
    commands: ['cat /proc/cpuinfo | head', 'cat /proc/meminfo | head', 'ls /proc/$$/fd'],
  },
  {
    id: 'roothome', name: 'root', path: '/root',
    purpose: 'The root user\u2019s home — kept on / so rescue shells always have it.',
    contents: 'Root dotfiles, rescue scripts.',
    security: 'rwx------ root:root — nobody else may even list it.',
    admin: 'Keep a known-good rescue script and SSH key here, not in /home.',
    commands: ['sudo ls -la /root'],
  },
  {
    id: 'run', name: 'run', path: '/run',
    purpose: 'Runtime state that must not survive reboot (tmpfs).',
    contents: 'PID files, sockets, systemd state, lock files.',
    security: 'Strict per-service subdirectories; wiped at boot by design.',
    admin: 'Check here for stale PID files when a service claims to already run.',
    commands: ['ls /run', 'ls /run/*.pid 2>/dev/null'],
  },
  {
    id: 'sbin', name: 'sbin', path: '/sbin (→ /usr/sbin)',
    purpose: 'System administration binaries — tools root needs for boot and repair.',
    contents: 'fdisk, iptables, reboot, fsck.',
    security: 'rwxr-xr-x root:root; on modern systems a symlink into /usr/sbin.',
    admin: 'Separate from /bin historically so minimal rescue PATHs stayed small.',
    commands: ['ls /sbin', 'which fdisk'],
  },
  {
    id: 'sys', name: 'sys', path: '/sys',
    purpose: 'Virtual view of kernel devices and drivers (sysfs) — sibling of /proc for hardware.',
    contents: 'block/, bus/, class/, kernel parameters.',
    security: 'Mostly read-only; writable tunables are root-only.',
    admin: 'Tune device behavior live, e.g. laptop backlight or scheduler knobs.',
    commands: ['ls /sys/block', 'cat /sys/block/sda/queue/scheduler'],
  },
  {
    id: 'srv', name: 'srv', path: '/srv',
    purpose: 'Data served by the machine (convention, often empty by default).',
    contents: 'Web roots, FTP trees some admins place here.',
    security: 'Set by the admin to match the service account.',
    admin: 'Useful convention to separate served data from the OS and from /home.',
    commands: ['ls -la /srv'],
  },
  {
    id: 'tmp', name: 'tmp', path: '/tmp',
    purpose: 'Temporary files for all users; sticky-bit directory (1777).',
    contents: 'Editor backups, installer scratch, socket files.',
    security: 'rwxrwxrwt — anyone may create, but only owners (or root) may delete their files.',
    admin: 'Cleared on reboot (often tmpfs). Try the sticky bit yourself in the Permissions Lab.',
    commands: ['ls -ld /tmp', 'ls /tmp'],
  },
  {
    id: 'usr', name: 'usr', path: '/usr',
    purpose: 'The bulk of the system: programs, libraries, docs (read-only shareable).',
    contents: 'bin/, lib/, share/man, local/ for site additions.',
    security: 'Managed by the package manager; admins add to /usr/local, never /usr/bin.',
    admin: '/usr/local/bin is the correct home for hand-built tools.',
    commands: ['ls /usr', 'ls /usr/local/bin', 'man man'],
  },
  {
    id: 'var', name: 'var', path: '/var',
    purpose: 'Variable data: logs, mail, caches, databases, web content.',
    contents: 'log/ (journal, syslog, nginx), lib/postgresql, www/.',
    security: 'Service-owned subtrees (e.g. syslog:adm); log tampering hides intrusions.',
    admin: 'Monitor disk usage here — full /var/log breaks services. Rotate logs.',
    commands: ['ls /var/log', 'du -sh /var/* 2>/dev/null', 'journalctl --disk-usage'],
  },
];

const WINDOWS_NODES: FsNode[] = [
  {
    id: 'c', name: 'C:\\', path: 'C:\\',
    purpose: 'A drive-letter namespace — each volume is its own tree (C:, D:), unlike Linux\u2019s single rooted hierarchy.',
    contents: 'Windows/, Program Files/, Users/, plus pagefile.sys and boot files (hidden).',
    security: 'NTFS ACLs with inheritance from the volume root; SYSTEM and Administrators own OS areas.',
    admin: 'Permissions flow down by inheritance — fix access at the folder level, not file by file.',
    commands: ['dir C:\\', 'icacls C:\\Windows', 'Get-PSDrive'],
    children: ['windows', 'pf', 'pf86', 'users', 'programdata', 'temp', 'registry'],
  },
  {
    id: 'windows', name: 'Windows', path: 'C:\\Windows',
    purpose: 'The OS itself: kernel, drivers, servicing store and system tools.',
    contents: 'System32/, SysWOW64/, WinSxS/, Fonts/, Logs/.',
    security: 'TrustedInstaller owns most files; even Administrators must take ownership to modify.',
    admin: 'Never delete from WinSxS by hand — use DISM / Component Cleanup.',
    commands: ['dir C:\\Windows', 'dism /online /cleanup-image /analyzecomponentstore'],
    children: ['system32'],
  },
  {
    id: 'system32', name: 'System32', path: 'C:\\Windows\\System32',
    purpose: 'Core 64-bit system binaries and libraries (yes — “32” holds 64-bit files for compatibility history).',
    contents: 'ntoskrnl-adjacent DLLs, drivers/ (etc/, drivers/etc/hosts), config/ (registry hives).',
    security: 'Write access requires elevation; tampering breaks Secure Boot trust.',
    admin: 'drivers/etc/hosts is the Windows counterpart of /etc/hosts; config/ holds the registry hives.',
    commands: ['dir C:\\Windows\\System32', 'type C:\\Windows\\System32\\drivers\\etc\\hosts'],
  },
  {
    id: 'pf', name: 'Program Files', path: 'C:\\Program Files',
    purpose: 'Machine-wide 64-bit applications installed for all users.',
    contents: 'Vendor folders (e.g. Git/, PowerShell/).',
    security: 'Standard users read/execute; installers must elevate to write (UAC prompt).',
    admin: 'Prefer per-machine installs here so the app works for every profile.',
    commands: ['dir "C:\\Program Files"', 'icacls "C:\\Program Files"'],
  },
  {
    id: 'pf86', name: 'Program Files (x86)', path: 'C:\\Program Files (x86)',
    purpose: 'Machine-wide 32-bit applications, transparently redirected by WOW64.',
    contents: '32-bit vendor software; filesystem redirection keeps 32-bit apps working.',
    security: 'Same ACL model as Program Files.',
    admin: 'If a 32-bit app “can\u2019t find” System32 files, it is being redirected to SysWOW64 — by design.',
    commands: ['dir "C:\\Program Files (x86)"'],
  },
  {
    id: 'users', name: 'Users', path: 'C:\\Users',
    purpose: 'One profile folder per user — the counterpart of /home.',
    contents: 'alice/ (Desktop, Documents, AppData/ with Roaming/Local/LocalLow).',
    security: 'Each profile grants full control to its owner and SYSTEM; other users are denied.',
    admin: 'AppData/Roaming follows domain users; AppData/Local holds caches and machine-bound data.',
    commands: ['dir C:\\Users', 'echo %USERPROFILE%', 'dir %APPDATA%'],
  },
  {
    id: 'programdata', name: 'ProgramData', path: 'C:\\ProgramData',
    purpose: 'Machine-wide application data shared across users (hidden by default).',
    contents: 'Vendor state, templates, shared caches.',
    security: 'Creator/owner semantics with inherited ACLs; per-user secrets must NOT live here.',
    admin: 'The right home for shared templates; user secrets belong in the profile.',
    commands: ['dir C:\\ProgramData'],
  },
  {
    id: 'temp', name: 'Temp', path: 'C:\\Windows\\Temp',
    purpose: 'System-wide scratch space for installers and services.',
    contents: 'Installer extracts, service caches. Per-user temp lives at %TEMP%.',
    security: 'CREATOR OWNER semantics; regular users cannot read each other\u2019s files.',
    admin: 'Safe to empty when installers stall — the Linux /tmp counterpart.',
    commands: ['dir C:\\Windows\\Temp', 'echo %TEMP%'],
  },
  {
    id: 'registry', name: 'Registry', path: 'HKLM \\ HKCU (not a folder!)',
    purpose: 'The central hierarchical configuration database — Windows\u2019 answer to /etc, but a database, not text files.',
    contents: 'Hives: SYSTEM, SOFTWARE, SAM, SECURITY, NTUSER.DAT per user. Keys, values, and data types.',
    security: 'Every key carries its own ACL (Allow/Deny ACEs for users and groups), editable in regedit → Permissions.',
    admin: 'Back up keys before editing (reg export). Prefer Group Policy over hand-editing; changes apply without parsing files.',
    commands: ['reg query HKLM\\SOFTWARE', 'reg export HKLM\\SOFTWARE backup.reg'],
    kind: 'registry',
    children: ['hklm', 'hkcu', 'hkcr', 'hku', 'hkcc'],
  },
  {
    id: 'hklm', name: 'HKEY_LOCAL_MACHINE', path: 'HKLM',
    purpose: 'Machine-wide settings: installed software, drivers, services, boot configuration.',
    contents: 'SOFTWARE/, SYSTEM/ (services + drivers), SAM (local accounts), SECURITY.',
    security: 'Writers limited to SYSTEM and Administrators; standard users read most keys.',
    admin: 'Services and driver state live here — back up SYSTEM before driver surgery.',
    commands: ['reg query HKLM\\SOFTWARE', 'reg query HKLM\\SYSTEM\\CurrentControlSet\\Services'],
    kind: 'registry',
  },
  {
    id: 'hkcu', name: 'HKEY_CURRENT_USER', path: 'HKCU',
    purpose: 'The logged-on user\u2019s profile settings (a live view of their NTUSER.DAT).',
    contents: 'Software/, Environment, Control Panel preferences.',
    security: 'Owned by the user; other users cannot read it.',
    admin: 'Per-user app config and logon scripts resolve from here.',
    commands: ['reg query HKCU\\Software', 'reg query HKCU\\Environment'],
    kind: 'registry',
  },
  {
    id: 'hkcr', name: 'HKEY_CLASSES_ROOT', path: 'HKCR',
    purpose: 'File associations and COM registration (merged view of HKLM + HKCU software classes).',
    contents: '.txt → txtfile mappings, shell verbs (open/edit), COM CLSIDs.',
    security: 'Machine entries need elevation; per-user overrides live under HKCU.',
    admin: '“Open with” fixes and default-app repairs happen here.',
    commands: ['reg query HKCR\\.txt', 'assoc .txt'],
  },
  {
    id: 'hku', name: 'HKEY_USERS', path: 'HKU',
    purpose: 'All loaded user profiles by SID, including .DEFAULT for the logon screen.',
    contents: 'S-1-5-21-… keys, one per profile.',
    security: 'Each SID key is ACL\u2019d to its owner and SYSTEM.',
    admin: 'Edit another user\u2019s settings by loading their NTUSER.DAT here.',
    commands: ['reg query HKU', 'whoami /user'],
  },
  {
    id: 'hkcc', name: 'HKEY_CURRENT_CONFIG', path: 'HKCC',
    purpose: 'The hardware profile actually booted with (display, printers).',
    contents: 'System\\CurrentControlSet\\Control snapshots.',
    security: 'Regenerated each boot; admins rarely edit directly.',
    admin: 'Display/printer issues after docking usually trace back here.',
    commands: ['reg query HKCC', 'msinfo32'],
    kind: 'registry',
  },
];

function TreeNode({
  node,
  depth,
  selectedId,
  expanded,
  onToggle,
  onSelect,
  accent,
}: {
  node: FsNode;
  depth: number;
  selectedId: string;
  expanded: boolean;
  onToggle: () => void;
  onSelect: () => void;
  accent: string;
}) {
  const selected = node.id === selectedId;
  const hasKids = !!node.children && node.children.length > 0;
  const isRegistry = node.kind === 'registry';
  return (
    <div>
      <div className="flex items-center gap-1" style={{ paddingLeft: depth * 14 }}>
        {hasKids ? (
          <button
            onClick={onToggle}
            aria-expanded={expanded}
            aria-label={expanded ? `Collapse ${node.name}` : `Expand ${node.name}`}
            className="w-5 h-5 shrink-0 rounded hover:bg-primary/10 text-muted-foreground text-xs transition"
          >
            <span aria-hidden="true" className={`inline-block transition-transform ${expanded ? 'rotate-90' : ''}`}>
              ▶
            </span>
          </button>
        ) : (
          <span className="w-5 shrink-0" aria-hidden="true" />
        )}
        <button
          onClick={onSelect}
          aria-pressed={selected}
          className={`flex-1 min-w-0 text-left px-2 py-1.5 rounded-lg font-mono text-sm transition border flex items-center gap-2 ${
            selected ? `${accent} text-white border-transparent` : 'glass hover:bg-primary/10 border-transparent'
          }`}
        >
          {isRegistry ? (
            <FaDatabase aria-hidden="true" className={`shrink-0 ${selected ? '' : 'text-muted-foreground'}`} />
          ) : (
            <FaFolder aria-hidden="true" className={`shrink-0 ${selected ? '' : 'text-muted-foreground'}`} />
          )}
          <span className="truncate">{node.name}</span>
          {isRegistry && (
            <span className="text-[10px] font-mono opacity-80 shrink-0">registry</span>
          )}
        </button>
      </div>
    </div>
  );
}

function NodeTree({
  nodes,
  rootId,
  selectedId,
  expandedIds,
  onToggle,
  onSelect,
  accent,
}: {
  nodes: FsNode[];
  rootId: string;
  selectedId: string;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  accent: string;
}) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const renderLevel = (ids: string[], depth: number): JSX.Element[] =>
    ids.flatMap((id) => {
      const node = byId.get(id);
      if (!node) return [];
      const expanded = expandedIds.has(id);
      const kids = node.children?.filter((cid) => byId.has(cid)) ?? [];
      return [
        <TreeNode
          key={id}
          node={node}
          depth={depth}
          selectedId={selectedId}
          expanded={expanded}
          onToggle={() => onToggle(id)}
          onSelect={() => onSelect(id)}
          accent={accent}
        />,
        ...(expanded && kids.length > 0 ? renderLevel(kids, depth + 1) : []),
      ];
    });
  return <div className="space-y-0.5">{renderLevel([rootId], 0)}</div>;
}

function NodeDetail({ node, accentText }: { node: FsNode; accentText: string }) {
  const rows: [string, string][] = [
    ['Purpose', node.purpose],
    ['Typical contents', node.contents],
    ['Permissions / security', node.security],
    ['Admin significance', node.admin],
  ];
  return (
    <div className="space-y-3" aria-live="polite">
      <div>
        <p className={`font-mono font-bold ${accentText}`}>{node.path}</p>
        <div className="mt-2 space-y-2">
          {rows.map(([label, text]) => (
            <div key={label} className="p-3 glass rounded-xl text-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
              <p className="mt-0.5">{text}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Try it</p>
        <CodeBlock code={node.commands.map((c) => `$ ${c}`).join('\n')} language="bash" />
      </div>
    </div>
  );
}

/** Cross-OS concepts: one idea, where it lives on each system. */
const CONCEPTS: { id: string; label: string; linuxId: string; winId: string }[] = [
  { id: 'user_profiles', label: 'User Profiles', linuxId: 'home', winId: 'users' },
  { id: 'system_logs', label: 'System Logs', linuxId: 'var', winId: 'windows' },
  { id: 'config_store', label: 'Config Storage', linuxId: 'etc', winId: 'registry' },
  { id: 'installed_apps', label: 'Applications', linuxId: 'usr', winId: 'pf' },
  { id: 'system_binaries', label: 'Core Binaries', linuxId: 'bin', winId: 'system32' },
  { id: 'kernel_hardware', label: 'Kernel & Hardware', linuxId: 'boot', winId: 'system32' },
];

function matches(node: FsNode, q: string): boolean {
  const hay = `${node.name} ${node.path} ${node.purpose} ${node.contents}`.toLowerCase();
  return q.split(/\s+/).filter(Boolean).every((tok) => hay.includes(tok));
}

export default function FilesystemExplorer() {
  const [linuxId, setLinuxId] = useState('etc');
  const [winId, setWinId] = useState('users');
  const [query, setQuery] = useState('');
  const [activeConcept, setActiveConcept] = useState<string | null>(null);
  const linux = LINUX_NODES.find((n) => n.id === linuxId) ?? LINUX_NODES[0];
  const win = WINDOWS_NODES.find((n) => n.id === winId) ?? WINDOWS_NODES[0];
  const q = query.trim().toLowerCase();
  const linuxVisible = useMemo(() => (q ? LINUX_NODES.filter((n) => matches(n, q)) : LINUX_NODES), [q]);
  const winVisible = useMemo(() => (q ? WINDOWS_NODES.filter((n) => matches(n, q)) : WINDOWS_NODES), [q]);

  const [osTab, setOsTab] = useState<'linux' | 'windows'>('linux');
  const [linuxExpanded, setLinuxExpanded] = useState<Set<string>>(new Set(['slash']));
  const [winExpanded, setWinExpanded] = useState<Set<string>>(new Set(['c']));

  const toggleId = (set: Set<string>, apply: (next: Set<string>) => void, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    apply(next);
  };

  const resetTree = () => {
    setQuery('');
    setActiveConcept(null);
    setLinuxId('etc');
    setWinId('users');
    setLinuxExpanded(new Set(['slash']));
    setWinExpanded(new Set(['c']));
  };

  const expandAll = (nodes: FsNode[], apply: (next: Set<string>) => void) => {
    apply(new Set(nodes.filter((n) => n.children?.length).map((n) => n.id)));
  };

  const jumpToConcept = (id: string) => {
    const c = CONCEPTS.find((x) => x.id === id);
    if (!c) return;
    setActiveConcept(id);
    setLinuxId(c.linuxId);
    setWinId(c.winId);
    // Reveal the targets inside their trees
    setLinuxExpanded((prev) => new Set(prev).add('slash'));
    setWinExpanded((prev) => new Set(prev).add('c').add(c.winId === 'system32' ? 'windows' : 'c'));
  };

  return (
    <div className="space-y-6">
      {/* Search + concept chips */}
      <GlassCard>
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="flex-1">
            <label htmlFor="fs-search" className="sr-only">
              Search filesystem nodes
            </label>
            <input
              id="fs-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search nodes — e.g. logs, boot, registry…"
              className="w-full px-4 py-2 rounded-xl glass text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {q && (
            <p className="text-xs text-muted-foreground" aria-live="polite">
              {linuxVisible.length + winVisible.length} nodes match
            </p>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Cross-system concepts">
          <span className="text-xs text-muted-foreground self-center">Jump to concept:</span>
          {CONCEPTS.map((c) => (
            <button
              key={c.id}
              onClick={() => jumpToConcept(c.id)}
              aria-pressed={activeConcept === c.id}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                activeConcept === c.id ? 'bg-primary text-white' : 'glass hover:bg-primary/10'
              }`}
            >
              {c.label}
            </button>
          ))}
          <button
            onClick={resetTree}
            className="ml-auto px-3 py-1.5 glass rounded-full text-xs hover:bg-primary/10 transition"
          >
            Reset tree
          </button>
        </div>
      </GlassCard>

      {/* Mobile OS switch — desktop shows both trees side by side */}
      <div className="flex lg:hidden gap-2 p-1 glass rounded-full" role="tablist" aria-label="Operating system">
        {(['linux', 'windows'] as const).map((os) => (
          <button
            key={os}
            role="tab"
            aria-selected={osTab === os}
            onClick={() => setOsTab(os)}
            className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition ${
              osTab === os ? 'bg-primary text-white' : 'hover:bg-primary/10'
            }`}
          >
            {os === 'linux' ? '🐧 Linux' : '🪟 Windows'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Linux side */}
        <GlassCard className={`border-t-4 border-orange-500 ${osTab === 'linux' ? '' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold flex items-center gap-2">
              <FaLinux className="text-orange-500 text-xl" aria-hidden="true" /> Linux — one tree from /
            </h2>
            <div className="flex gap-1">
              <button
                onClick={() => expandAll(LINUX_NODES, setLinuxExpanded)}
                className="px-2 py-1 text-[11px] glass rounded-full hover:bg-primary/10 transition"
              >
                Expand all
              </button>
              <button
                onClick={() => setLinuxExpanded(new Set(['slash']))}
                className="px-2 py-1 text-[11px] glass rounded-full hover:bg-primary/10 transition"
              >
                Collapse
              </button>
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto pr-1">
            {q ? (
              <>
                {linuxVisible.length === 0 && (
                  <p className="text-xs text-muted-foreground p-2">No Linux nodes match “{query.trim()}”.</p>
                )}
                {linuxVisible.map((n) => (
                  <div key={n.id} className="mb-0.5">
                    <TreeNode
                      node={n}
                      depth={0}
                      selectedId={linuxId}
                      expanded={false}
                      onToggle={() => undefined}
                      onSelect={() => { setLinuxId(n.id); setActiveConcept(null); }}
                      accent="bg-orange-500"
                    />
                  </div>
                ))}
              </>
            ) : (
              <NodeTree
                nodes={LINUX_NODES}
                rootId="slash"
                selectedId={linuxId}
                expandedIds={linuxExpanded}
                onToggle={(id) => toggleId(linuxExpanded, setLinuxExpanded, id)}
                onSelect={(id) => { setLinuxId(id); setActiveConcept(null); }}
                accent="bg-orange-500"
              />
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <NodeDetail node={linux} accentText="text-orange-600" />
          </div>
        </GlassCard>

        {/* Windows side */}
        <GlassCard className={`border-t-4 border-blue-500 ${osTab === 'windows' ? '' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold flex items-center gap-2">
              <FaWindows className="text-blue-500 text-xl" aria-hidden="true" /> Windows — drives + Registry
            </h2>
            <div className="flex gap-1">
              <button
                onClick={() => expandAll(WINDOWS_NODES, setWinExpanded)}
                className="px-2 py-1 text-[11px] glass rounded-full hover:bg-primary/10 transition"
              >
                Expand all
              </button>
              <button
                onClick={() => setWinExpanded(new Set(['c']))}
                className="px-2 py-1 text-[11px] glass rounded-full hover:bg-primary/10 transition"
              >
                Collapse
              </button>
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto pr-1">
            {q ? (
              <>
                {winVisible.length === 0 && (
                  <p className="text-xs text-muted-foreground p-2">No Windows nodes match “{query.trim()}”.</p>
                )}
                {winVisible.map((n) => (
                  <div key={n.id} className="mb-0.5">
                    <TreeNode
                      node={n}
                      depth={0}
                      selectedId={winId}
                      expanded={false}
                      onToggle={() => undefined}
                      onSelect={() => { setWinId(n.id); setActiveConcept(null); }}
                      accent="bg-blue-500"
                    />
                  </div>
                ))}
              </>
            ) : (
              <NodeTree
                nodes={WINDOWS_NODES}
                rootId="c"
                selectedId={winId}
                expandedIds={winExpanded}
                onToggle={(id) => toggleId(winExpanded, setWinExpanded, id)}
                onSelect={(id) => { setWinId(id); setActiveConcept(null); }}
                accent="bg-blue-500"
              />
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-white/10">
            <NodeDetail node={win} accentText="text-blue-600" />
          </div>
        </GlassCard>
      </div>

      {/* Security models */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="border-l-4 border-orange-500">
          <h3 className="font-bold flex items-center gap-2 mb-2">
            <FaLock className="text-orange-500" aria-hidden="true" /> Linux: mode bits
          </h3>
          <p className="font-mono text-sm font-bold">rwxr-xr-x · owner : group : others</p>
          <p className="text-sm text-muted-foreground mt-1">
            Three fixed classes, three bits each (read/write/execute). Simple and uniform — every file, directory and
            device speaks the same language. Coarse for teams: try the Permissions Lab to feel it.
          </p>
        </GlassCard>
        <GlassCard className="border-l-4 border-blue-500">
          <h3 className="font-bold flex items-center gap-2 mb-2">
            <FaUserShield className="text-blue-500" aria-hidden="true" /> Windows: ACLs
          </h3>
          <p className="font-mono text-sm font-bold">ACL = list of ACEs: User/Group + Allow/Deny</p>
          <p className="text-sm text-muted-foreground mt-1">
            Each file, folder and registry key carries an access-control list of entries, inherited from parents unless
            blocked. Far more expressive than mode bits — and far easier to misconfigure.
          </p>
        </GlassCard>
      </div>
      <GlassCard className="border-2 border-primary/20">
        <h3 className="font-bold flex items-center gap-2 mb-1">
          <FaDatabase className="text-primary" aria-hidden="true" /> Honest comparison
        </h3>
        <p className="text-sm text-muted-foreground">
          Mode bits and ACLs are <strong>not equivalent systems</strong>: Linux trades expressiveness for uniformity
          (one model everywhere, extended only by ACLs/SELinux where needed), while Windows trades simplicity for
          fine-grained per-object control via inheritance. Neither is “better” — they optimise for different
          administration styles. <FaTerminal className="inline" aria-hidden="true" /> Compare with{' '}
          <code className="font-mono">ls -l /etc</code> versus <code className="font-mono">icacls C:\Windows</code>.
        </p>
      </GlassCard>
    </div>
  );
}
