import { useMemo, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import CodeBlock from '@/components/ui/CodeBlock';

type PermClass = 'owner' | 'group' | 'other';
type PermBit = 'r' | 'w' | 'x';

interface ClassPerms {
  r: boolean;
  w: boolean;
  x: boolean;
}

interface ModeState {
  owner: ClassPerms;
  group: ClassPerms;
  other: ClassPerms;
  /** 0-7: setuid(4) + setgid(2) + sticky(1) */
  special: number;
}

const BIT_VALUE: Record<PermBit, number> = { r: 4, w: 2, x: 1 };
const CLASSES: { id: PermClass; label: string }[] = [
  { id: 'owner', label: 'Owner (u)' },
  { id: 'group', label: 'Group (g)' },
  { id: 'other', label: 'Others (o)' },
];
const BITS: { id: PermBit; label: string; value: number }[] = [
  { id: 'r', label: 'Read', value: 4 },
  { id: 'w', label: 'Write', value: 2 },
  { id: 'x', label: 'Execute', value: 1 },
];

function digitOf(p: ClassPerms): number {
  return (p.r ? 4 : 0) + (p.w ? 2 : 0) + (p.x ? 1 : 0);
}

function permsOfDigit(d: number): ClassPerms {
  return { r: (d & 4) !== 0, w: (d & 2) !== 0, x: (d & 1) !== 0 };
}

/** Build a symbolic string like -rwxr-xr-x, honouring setuid/setgid/sticky. */
function symbolicOf(mode: ModeState, isDir = false): string {
  const execChar = (p: ClassPerms, specialBit: boolean, stickyChar: 's' | 't'): string => {
    if (p.x) return specialBit ? stickyChar : 'x';
    return specialBit ? stickyChar.toUpperCase() : '-';
  };
  const setuid = (mode.special & 4) !== 0;
  const setgid = (mode.special & 2) !== 0;
  const sticky = (mode.special & 1) !== 0;
  return (
    (isDir ? 'd' : '-') +
    (mode.owner.r ? 'r' : '-') +
    (mode.owner.w ? 'w' : '-') +
    execChar(mode.owner, setuid, 's') +
    (mode.group.r ? 'r' : '-') +
    (mode.group.w ? 'w' : '-') +
    execChar(mode.group, setgid, 's') +
    (mode.other.r ? 'r' : '-') +
    (mode.other.w ? 'w' : '-') +
    execChar(mode.other, sticky, 't')
  );
}

function numericOf(mode: ModeState): string {
  const body = `${digitOf(mode.owner)}${digitOf(mode.group)}${digitOf(mode.other)}`;
  return mode.special > 0 ? `${mode.special}${body}` : body;
}

function wordsOf(p: ClassPerms): string {
  const parts: string[] = [];
  if (p.r) parts.push('read');
  if (p.w) parts.push('write');
  if (p.x) parts.push('execute');
  return parts.length > 0 ? parts.join(', ') : 'no permissions';
}

const DEFAULT_MODE: ModeState = {
  owner: { r: true, w: true, x: true },
  group: { r: true, w: false, x: true },
  other: { r: true, w: false, x: true },
  special: 0,
};

type LabTab = 'calculator' | 'symbolic' | 'special' | 'ownership' | 'acl' | 'umask';

export interface AclEntry {
  id: number;
  kind: 'user' | 'group';
  name: string;
  r: boolean;
  w: boolean;
  x: boolean;
}

const TABS: { id: LabTab; label: string }[] = [
  { id: 'calculator', label: 'chmod Calculator' },
  { id: 'symbolic', label: 'Symbolic Mode' },
  { id: 'special', label: 'Special Bits' },
  { id: 'ownership', label: 'chown Explorer' },
  { id: 'acl', label: 'ACL Calculator' },
  { id: 'umask', label: 'umask Simulator' },
];

function rwxString(p: { r: boolean; w: boolean; x: boolean }): string {
  return `${p.r ? 'r' : '-'}${p.w ? 'w' : '-'}${p.x ? 'x' : '-'}`;
}

/**
 * Parse symbolic clauses like "u+x", "g-w", "o=rx", "u=rwx,g=rx,o=rx"
 * against a base mode. Returns the new mode or an error message.
 */
function applySymbolic(base: ModeState, input: string): { mode: ModeState } | { error: string } {
  const next: ModeState = {
    owner: { ...base.owner },
    group: { ...base.group },
    other: { ...base.other },
    special: base.special,
  };
  const clauses = input
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
  if (clauses.length === 0) return { error: 'Enter at least one clause, e.g. u+x.' };

  for (const clause of clauses) {
    const match = clause.match(/^([ugoa]*)([+=-])([rwx]*)$/i);
    if (!match) {
      return { error: `Could not parse "${clause}". Use forms like u+x, g-w, o=rx.` };
    }
    const [, whoRaw, op, permsRaw] = match;
    const who = whoRaw === '' || whoRaw.toLowerCase() === 'a' ? 'ugo' : whoRaw.toLowerCase();
    if (!/^[ugo]+$/.test(who)) {
      return { error: `Unknown class in "${clause}". Use u, g, o or a.` };
    }
    if (op === '=' && permsRaw === '') {
      return { error: `"${clause}" needs permissions after =, e.g. u=rw.` };
    }
    const targets: PermClass[] = [];
    if (who.includes('u')) targets.push('owner');
    if (who.includes('g')) targets.push('group');
    if (who.includes('o')) targets.push('other');
    const perms = permsRaw.toLowerCase().split('').filter((c): c is PermBit => c === 'r' || c === 'w' || c === 'x');

    for (const t of targets) {
      if (op === '=') {
        next[t] = { r: false, w: false, x: false };
        for (const p of perms) next[t][p] = true;
      } else if (op === '+') {
        for (const p of perms) next[t][p] = true;
      } else {
        for (const p of perms) next[t][p] = false;
      }
    }
  }
  return { mode: next };
}

const SPECIAL_INFO = [
  {
    bit: 4,
    name: 'setuid',
    example: '4755 → -rwsr-xr-x',
    desc: 'The program runs with the file owner\u2019s privileges, not the caller\u2019s. Example: /usr/bin/passwd runs as root so it can edit /etc/shadow.',
  },
  {
    bit: 2,
    name: 'setgid',
    example: '2755 → -rwxr-sr-x',
    desc: 'The program runs with the file group\u2019s privileges. On directories, new files inherit the directory\u2019s group instead of the creator\u2019s group.',
  },
  {
    bit: 1,
    name: 'sticky bit',
    example: '1777 → -rwxrwxrwt',
    desc: 'On directories like /tmp, anyone can create files but only the file\u2019s owner (or root) may delete or rename them.',
  },
];

const UMASK_PRESETS = ['022', '027', '077'];

export default function PermissionsLab() {
  const [tab, setTab] = useState<LabTab>('calculator');
  const [mode, setMode] = useState<ModeState>(DEFAULT_MODE);

  // Symbolic tab state
  const [symbolicInput, setSymbolicInput] = useState('u=rwx,g=rx,o=rx');
  const [symbolicBase] = useState<ModeState>({
    owner: { r: true, w: true, x: false },
    group: { r: true, w: true, x: false },
    other: { r: true, w: true, x: false },
    special: 0,
  });
  const symbolicResult = useMemo(() => applySymbolic(symbolicBase, symbolicInput), [symbolicBase, symbolicInput]);

  // chown tab state
  const [chownOwner, setChownOwner] = useState('alice');
  const [chownGroup, setChownGroup] = useState('developers');
  const [chownFile, setChownFile] = useState('project.txt');
  const [chownRecursive, setChownRecursive] = useState(false);

  // umask tab state
  const [umaskInput, setUmaskInput] = useState('022');

  // ACL tab state (all simulated — preview only)
  const [aclFile, setAclFile] = useState('shared.txt');
  const [aclOwner, setAclOwner] = useState('alice');
  const [aclOwnerPerms, setAclOwnerPerms] = useState<ClassPerms>({ r: true, w: true, x: true });
  const [aclGroup, setAclGroup] = useState('developers');
  const [aclGroupPerms, setAclGroupPerms] = useState<ClassPerms>({ r: true, w: false, x: true });
  const [aclOtherPerms, setAclOtherPerms] = useState<ClassPerms>({ r: false, w: false, x: false });
  const [aclEntries, setAclEntries] = useState<AclEntry[]>([
    { id: 1, kind: 'user', name: 'bob', r: true, w: false, x: true },
  ]);
  const [aclNextId, setAclNextId] = useState(2);
  const [aclKind, setAclKind] = useState<'user' | 'group'>('user');
  const [aclName, setAclName] = useState('');
  const [aclNew, setAclNew] = useState<ClassPerms>({ r: true, w: false, x: false });
  const [aclError, setAclError] = useState('');
  const [aclShowDefault, setAclShowDefault] = useState(false);
  const aclMask: ClassPerms = useMemo(() => {
    const union = { ...aclGroupPerms };
    for (const e of aclEntries) {
      if (e.r) union.r = true;
      if (e.w) union.w = true;
      if (e.x) union.x = true;
    }
    return union;
  }, [aclGroupPerms, aclEntries]);

  const aclText = useMemo(() => {
    const lines = [
      `# file: ${aclFile || 'file'}`,
      `# owner: ${aclOwner || 'owner'}`,
      `# group: ${aclGroup || 'group'}`,
      `user::${rwxString(aclOwnerPerms)}`,
      ...aclEntries.map((e) => `${e.kind}:${e.name}:${rwxString(e)}`),
      `group::${rwxString(aclGroupPerms)}`,
      `mask::${rwxString(aclMask)}`,
      `other::${rwxString(aclOtherPerms)}`,
    ];
    if (aclShowDefault) {
      lines.push(
        `default:user::${rwxString(aclOwnerPerms)}`,
        `default:group::${rwxString(aclGroupPerms)}`,
        `default:other::${rwxString(aclOtherPerms)}`
      );
    }
    return lines.join('\n');
  }, [aclFile, aclOwner, aclGroup, aclOwnerPerms, aclGroupPerms, aclOtherPerms, aclEntries, aclMask, aclShowDefault]);

  const addAclEntry = () => {
    const name = aclName.trim();
    if (!name) {
      setAclError('Enter a user or group name.');
      return;
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(name)) {
      setAclError('Names may only contain letters, digits, dot, dash and underscore.');
      return;
    }
    if (aclEntries.some((e) => e.kind === aclKind && e.name === name)) {
      setAclError(`An entry for ${aclKind} “${name}” already exists.`);
      return;
    }
    setAclError('');
    setAclEntries((prev) => [...prev, { id: aclNextId, kind: aclKind, name, ...aclNew }]);
    setAclNextId((n) => n + 1);
    setAclName('');
  };

  const umaskDigits = useMemo(() => {
    const clean = umaskInput.trim();
    if (!/^[0-7]{3}$/.test(clean)) return null;
    return clean.split('').map(Number);
  }, [umaskInput]);

  const toggleBit = (cls: PermClass, bit: PermBit) => {
    setMode((prev) => ({ ...prev, [cls]: { ...prev[cls], [bit]: !prev[cls][bit] } }));
  };

  const setDigit = (cls: PermClass, digit: number) => {
    if (digit < 0 || digit > 7 || Number.isNaN(digit)) return;
    setMode((prev) => ({ ...prev, [cls]: permsOfDigit(digit) }));
  };

  const toggleSpecial = (bit: number) => {
    setMode((prev) => ({ ...prev, special: prev.special & bit ? prev.special & ~bit : prev.special | bit }));
  };

  const useSymbolicResult = () => {
    if ('mode' in symbolicResult) setMode({ ...symbolicResult.mode });
  };

  const numeric = numericOf(mode);
  const symbolic = symbolicOf(mode);
  const chownCommand = `chown ${chownRecursive ? '-R ' : ''}${chownOwner || 'owner'}:${chownGroup || 'group'} ${chownFile || 'file'}`;

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Permissions lab sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              tab === t.id ? 'bg-primary text-white' : 'glass hover:bg-primary/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Live preview (shared across calculator-style tabs) */}
      {(tab === 'calculator' || tab === 'special') && (
        <GlassCard className="border-2 border-primary/20">
          <h2 className="font-bold mb-2">Live permission preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm" aria-live="polite">
            <div className="p-3 glass rounded-xl">
              <p className="text-xs text-muted-foreground">Numeric</p>
              <p className="font-mono text-2xl font-bold text-primary">{numeric}</p>
              <p className="font-mono text-xs mt-1 break-all">chmod {numeric} file.txt</p>
            </div>
            <div className="p-3 glass rounded-xl">
              <p className="text-xs text-muted-foreground">Symbolic</p>
              <p className="font-mono text-2xl font-bold">{symbolic}</p>
              <p className="text-xs mt-1 text-muted-foreground">as shown by ls -l</p>
            </div>
            <div className="p-3 glass rounded-xl text-xs space-y-1">
              <p>
                <span className="font-semibold">Owner:</span> {wordsOf(mode.owner)}
              </p>
              <p>
                <span className="font-semibold">Group:</span> {wordsOf(mode.group)}
              </p>
              <p>
                <span className="font-semibold">Others:</span> {wordsOf(mode.other)}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <CodeBlock code={`$ chmod ${numeric} file.txt\n$ ls -l file.txt\n${symbolic} 1 student student 0 Jan 1 12:00 file.txt`} language="bash" />
          </div>
        </GlassCard>
      )}

      {tab === 'calculator' && (
        <GlassCard>
          <h2 className="font-bold mb-1">chmod calculator</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Tick boxes or type digits. Read = 4, Write = 2, Execute = 1 — each digit is the sum of its permissions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CLASSES.map((cls) => (
              <fieldset key={cls.id} className="p-3 glass rounded-xl">
                <legend className="sr-only">{cls.label} permissions</legend>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{cls.label}</span>
                  <label className="flex items-center gap-1 text-sm">
                    <span className="sr-only">{cls.label} numeric digit</span>
                    <input
                      type="number"
                      min={0}
                      max={7}
                      value={digitOf(mode[cls.id])}
                      onChange={(e) => setDigit(cls.id, parseInt(e.target.value, 10))}
                      className="w-14 px-2 py-1 rounded-lg glass text-center font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label={`${cls.label} numeric digit 0 to 7`}
                    />
                  </label>
                </div>
                <div className="space-y-2">
                  {BITS.map((bit) => (
                    <label key={bit.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mode[cls.id][bit.id]}
                        onChange={() => toggleBit(cls.id, bit.id)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="font-mono font-semibold w-4">{bit.id}</span>
                      <span className="text-muted-foreground">
                        {bit.label} ({bit.value})
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <button
            onClick={() => setMode(DEFAULT_MODE)}
            className="mt-4 px-4 py-2 glass rounded-full text-sm hover:bg-primary/10 transition"
          >
            Reset to 755
          </button>
        </GlassCard>
      )}

      {tab === 'symbolic' && (
        <GlassCard>
          <h2 className="font-bold mb-1">Symbolic mode</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Symbolic mode changes permissions relative to the current state: <code className="font-mono">u</code> (owner),{' '}
            <code className="font-mono">g</code> (group), <code className="font-mono">o</code> (others),{' '}
            <code className="font-mono">a</code> (all) with <code className="font-mono">+</code> (add),{' '}
            <code className="font-mono">-</code> (remove), <code className="font-mono">=</code> (set exactly).
            Applied here to a base of <code className="font-mono">666 (-rw-rw-rw-)</code>.
          </p>
          <label htmlFor="symbolic-input" className="block text-sm font-medium mb-1">
            Symbolic expression
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="symbolic-input"
              type="text"
              value={symbolicInput}
              onChange={(e) => setSymbolicInput(e.target.value)}
              placeholder="e.g. u+x or u=rwx,g=rx,o=rx"
              spellCheck={false}
              autoCapitalize="off"
              className="flex-1 px-4 py-2 rounded-xl glass font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={useSymbolicResult}
              disabled={!('mode' in symbolicResult)}
              className="px-4 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary-dark transition disabled:opacity-50"
            >
              Load into calculator
            </button>
          </div>
          <div className="mt-3" aria-live="polite">
            {'mode' in symbolicResult ? (
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-sm">
                <p>
                  Result: <code className="font-mono font-bold">{numericOf(symbolicResult.mode)}</code>{' '}
                  <code className="font-mono">({symbolicOf(symbolicResult.mode)})</code>
                </p>
                <p className="text-muted-foreground mt-1">
                  So <code className="font-mono">chmod 755 file</code> and{' '}
                  <code className="font-mono">chmod u=rwx,g=rx,o=rx file</code> produce exactly the same permissions —
                  numeric is compact, symbolic is explicit.
                </p>
              </div>
            ) : (
              <p className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-600 dark:text-red-400" role="alert">
                {symbolicResult.error}
              </p>
            )}
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {['u+x script.sh', 'g-w file.txt', 'o=rx notes.txt'].map((ex) => (
              <button
                key={ex}
                onClick={() => setSymbolicInput(ex.split(' ')[0])}
                className="px-3 py-2 glass rounded-xl font-mono hover:bg-primary/10 transition text-left"
              >
                <span className="text-muted-foreground">try: </span>chmod {ex}
              </button>
            ))}
          </div>
        </GlassCard>
      )}

      {tab === 'special' && (
        <GlassCard>
          <h2 className="font-bold mb-1">Special permissions</h2>
          <p className="text-sm text-muted-foreground mb-4">
            A fourth leading digit enables setuid (4), setgid (2) and the sticky bit (1). Toggle them to see how the
            symbolic string changes — note the <code className="font-mono">s</code>/<code className="font-mono">t</code> in
            the execute position.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {SPECIAL_INFO.map((s) => {
              const active = (mode.special & s.bit) !== 0;
              return (
                <button
                  key={s.name}
                  onClick={() => toggleSpecial(s.bit)}
                  aria-pressed={active}
                  className={`px-4 py-2 rounded-full font-mono text-sm transition ${
                    active ? 'bg-primary text-white' : 'glass hover:bg-primary/10'
                  }`}
                >
                  {s.name} ({s.bit})
                </button>
              );
            })}
            <button
              onClick={() => setMode(DEFAULT_MODE)}
              className="px-4 py-2 glass rounded-full text-sm hover:bg-primary/10 transition"
            >
              Reset to 755
            </button>
          </div>
          <div className="space-y-2">
            {SPECIAL_INFO.map((s) => (
              <div key={s.name} className="p-3 glass rounded-xl text-sm">
                <p className="font-mono font-bold">
                  {s.name} <span className="text-muted-foreground font-normal">· {s.example}</span>
                </p>
                <p className="text-muted-foreground text-xs mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {tab === 'ownership' && (
        <GlassCard>
          <h2 className="font-bold mb-1">chown explorer (simulated)</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Every file has an <strong>owner user</strong> and an <strong>owner group</strong>.{' '}
            <code className="font-mono">chown user:group file</code> changes them — this lab only previews the command,
            it never touches real files.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="chown-owner" className="block text-sm font-medium mb-1">
                Owner user
              </label>
              <input
                id="chown-owner"
                type="text"
                value={chownOwner}
                onChange={(e) => setChownOwner(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                autoCapitalize="off"
                spellCheck={false}
              />
            </div>
            <div>
              <label htmlFor="chown-group" className="block text-sm font-medium mb-1">
                Owner group
              </label>
              <input
                id="chown-group"
                type="text"
                value={chownGroup}
                onChange={(e) => setChownGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                autoCapitalize="off"
                spellCheck={false}
              />
            </div>
            <div>
              <label htmlFor="chown-file" className="block text-sm font-medium mb-1">
                File
              </label>
              <input
                id="chown-file"
                type="text"
                value={chownFile}
                onChange={(e) => setChownFile(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                autoCapitalize="off"
                spellCheck={false}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm mt-3 cursor-pointer">
            <input
              type="checkbox"
              checked={chownRecursive}
              onChange={(e) => setChownRecursive(e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            Recursive (<code className="font-mono">-R</code>: also change everything inside directories)
          </label>
          <div className="mt-3" aria-live="polite">
            <CodeBlock code={`$ ${chownCommand}`} language="bash" />
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <div className="p-3 glass rounded-xl">
              <p className="font-bold text-blue-600">Owner → {chownOwner || 'owner'}</p>
              <p className="text-muted-foreground mt-1">The user whose quota and identity the file belongs to.</p>
            </div>
            <div className="p-3 glass rounded-xl">
              <p className="font-bold text-purple-600">Group → {chownGroup || 'group'}</p>
              <p className="text-muted-foreground mt-1">Team sharing the file; group permissions apply to its members.</p>
            </div>
            <div className="p-3 glass rounded-xl">
              <p className="font-bold text-orange-600">File → {chownFile || 'file'}</p>
              <p className="text-muted-foreground mt-1">The target. Only root (or the owner, for groups) may change ownership.</p>
            </div>
          </div>
        </GlassCard>
      )}

      {tab === 'acl' && (
        <GlassCard>
          <h2 className="font-bold mb-1">ACL calculator (simulated)</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Mode bits allow exactly one user and one group per file. POSIX ACLs add{' '}
            <strong>named entries</strong> — extra users/groups with their own rights — plus a{' '}
            <strong>mask</strong> that caps every group-class entry. Preview only: nothing here runs{' '}
            <code className="font-mono">setfacl</code>, and not every filesystem/mount enables ACLs.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="acl-file" className="block text-sm font-medium mb-1">File</label>
              <input
                id="acl-file"
                type="text"
                value={aclFile}
                onChange={(e) => setAclFile(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                autoCapitalize="off"
                spellCheck={false}
              />
            </div>
            <div>
              <label htmlFor="acl-owner-name" className="block text-sm font-medium mb-1">Owner user</label>
              <input
                id="acl-owner-name"
                type="text"
                value={aclOwner}
                onChange={(e) => setAclOwner(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                autoCapitalize="off"
                spellCheck={false}
              />
            </div>
            <div>
              <label htmlFor="acl-group-name" className="block text-sm font-medium mb-1">Owner group</label>
              <input
                id="acl-group-name"
                type="text"
                value={aclGroup}
                onChange={(e) => setAclGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                autoCapitalize="off"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Base triplet */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            {([
              { label: 'user:: (owner)', value: aclOwnerPerms, set: setAclOwnerPerms },
              { label: 'group:: (owner group)', value: aclGroupPerms, set: setAclGroupPerms },
              { label: 'other::', value: aclOtherPerms, set: setAclOtherPerms },
            ]).map((row) => (
              <fieldset key={row.label} className="p-3 glass rounded-xl">
                <legend className="sr-only">{row.label} permissions</legend>
                <p className="font-mono text-xs font-bold mb-2">{row.label}</p>
                <div className="flex gap-3">
                  {(['r', 'w', 'x'] as const).map((b) => (
                    <label key={b} className="flex items-center gap-1 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={row.value[b]}
                        onChange={() => row.set({ ...row.value, [b]: !row.value[b] })}
                        className="w-4 h-4 accent-blue-600"
                        aria-label={`${row.label} ${b}`}
                      />
                      <span className="font-mono">{b}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          {/* Named entries */}
          <h3 className="font-semibold text-sm mt-4 mb-2">Named entries</h3>
          {aclEntries.length === 0 ? (
            <p className="text-xs text-muted-foreground mb-2">No named entries — add one below to see the mask react.</p>
          ) : (
            <ul className="space-y-1.5 mb-2">
              {aclEntries.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center gap-2 p-2 glass rounded-xl text-sm">
                  <span className="font-mono font-bold">
                    {e.kind}:{e.name}:{rwxString(e)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    effective: {rwxString({ r: e.r && aclMask.r, w: e.w && aclMask.w, x: e.x && aclMask.x })} (entry ∩ mask)
                  </span>
                  <button
                    onClick={() => setAclEntries((prev) => prev.filter((x) => x.id !== e.id))}
                    aria-label={`Remove ${e.kind} ${e.name}`}
                    className="ml-auto px-2 py-0.5 text-xs glass rounded-full hover:bg-red-500/20 hover:text-red-500 transition"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
            <label className="text-sm">
              <span className="block text-xs font-medium mb-1">Subject</span>
              <span className="flex gap-2">
                <select
                  value={aclKind}
                  onChange={(e) => setAclKind(e.target.value as 'user' | 'group')}
                  className="px-2 py-2 rounded-xl glass text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                  aria-label="Entry subject type"
                >
                  <option value="user">user</option>
                  <option value="group">group</option>
                </select>
                <input
                  type="text"
                  value={aclName}
                  onChange={(e) => setAclName(e.target.value)}
                  placeholder="name"
                  className="w-32 px-3 py-2 rounded-xl glass font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-label="Entry name"
                />
              </span>
            </label>
            <fieldset className="flex gap-3 items-center">
              <legend className="sr-only">New entry permissions</legend>
              {(['r', 'w', 'x'] as const).map((b) => (
                <label key={b} className="flex items-center gap-1 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aclNew[b]}
                    onChange={() => setAclNew({ ...aclNew, [b]: !aclNew[b] })}
                    className="w-4 h-4 accent-blue-600"
                    aria-label={`New entry ${b}`}
                  />
                  <span className="font-mono">{b}</span>
                </label>
              ))}
            </fieldset>
            <button
              onClick={addAclEntry}
              className="px-4 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary-dark transition"
            >
              Add entry
            </button>
          </div>
          {aclError && (
            <p className="text-sm text-red-500 mt-2" role="alert">
              {aclError}
            </p>
          )}

          <label className="flex items-center gap-2 text-sm mt-3 cursor-pointer">
            <input
              type="checkbox"
              checked={aclShowDefault}
              onChange={(e) => setAclShowDefault(e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            Show default ACL (directory inheritance preview)
          </label>

          <div className="mt-3" aria-live="polite">
            <CodeBlock code={`$ getfacl ${aclFile || 'file'}\n${aclText}`} language="bash" />
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className="p-3 glass rounded-xl">
              <p className="font-bold">Mask = union of group-class rights</p>
              <p className="text-muted-foreground mt-1">
                Current mask <code className="font-mono font-bold">{rwxString(aclMask)}</code>: every named user/group
                entry is ANDed with it. Tightening the mask instantly restricts all named entries — that is why
                <code className="font-mono"> chmod g-w </code> on an ACL file edits the mask, not group::.
              </p>
            </div>
            <div className="p-3 glass rounded-xl">
              <p className="font-bold">Default ACL (directories only)</p>
              <p className="text-muted-foreground mt-1">
                <code className="font-mono">default:…</code> entries are inherited by newly created files inside the
                directory. They never grant access to the directory itself.
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {tab === 'umask' && (
        <GlassCard>
          <h2 className="font-bold mb-1">umask simulator</h2>
          <p className="text-sm text-muted-foreground mb-4">
            The umask <em>removes</em> permission bits from the defaults: files start at{' '}
            <code className="font-mono">666 (rw-rw-rw-)</code> and directories at{' '}
            <code className="font-mono">777 (rwxrwxrwx)</code>. Files never gain execute from creation — that is why the
            defaults differ.
          </p>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <label htmlFor="umask-input" className="text-sm font-medium">
              umask value
            </label>
            <input
              id="umask-input"
              type="text"
              inputMode="numeric"
              value={umaskInput}
              onChange={(e) => setUmaskInput(e.target.value)}
              className="w-24 px-3 py-2 rounded-xl glass font-mono text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary"
              aria-describedby="umask-help"
            />
            {UMASK_PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setUmaskInput(p)}
                className={`px-3 py-1.5 rounded-full font-mono text-xs transition ${
                  umaskInput === p ? 'bg-primary text-white' : 'glass hover:bg-primary/10'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <p id="umask-help" className="text-xs text-muted-foreground mb-3">
            Common values: 022 (default on most systems), 027 (group-private), 077 (owner-only).
          </p>
          {umaskDigits ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm" aria-live="polite">
              {[
                { label: 'New file', base: 6, baseStr: '666' },
                { label: 'New directory', base: 7, baseStr: '777' },
              ].map((kind) => {
                // Per-digit: result = base & ~mask. Files additionally never
                // receive execute from creation, so mask file x-bits too.
                const raw = umaskDigits.map((m) => kind.base & ~m & 7);
                const result =
                  kind.label === 'New file' ? raw.map((d) => d & 6) : raw;
                const sym: ModeState = {
                  owner: permsOfDigit(result[0]),
                  group: permsOfDigit(result[1]),
                  other: permsOfDigit(result[2]),
                  special: 0,
                };
                return (
                  <div key={kind.label} className="p-3 glass rounded-xl">
                    <p className="font-semibold">{kind.label}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {kind.baseStr} − umask {umaskInput.trim()} =
                    </p>
                    <p className="font-mono text-2xl font-bold text-primary">{result.join('')}</p>
                    <p className="font-mono text-sm">{symbolicOf(sym, kind.label !== 'New file')}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-600 dark:text-red-400" role="alert">
              Enter three octal digits (each 0–7), e.g. 022.
            </p>
          )}
          <div className="mt-3">
            <CodeBlock
              code={`$ umask ${umaskInput.trim() || '022'}\n$ touch newfile && mkdir newdir\n$ ls -l\n# permissions above are what you would see`}
              language="bash"
            />
          </div>
        </GlassCard>
      )}
    </div>
  );
}
