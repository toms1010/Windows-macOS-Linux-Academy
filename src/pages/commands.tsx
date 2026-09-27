import { useState } from 'react';
import CommandList from '@/components/pages/CommandList';

const commands = [
  { name: 'ls', description: 'List directory contents', example: 'ls -la' },
  { name: 'cd', description: 'Change directory', example: 'cd /home' },
  { name: 'mkdir', description: 'Create directory', example: 'mkdir newdir' },
  { name: 'rm', description: 'Remove files or directories', example: 'rm -rf dir' },
  { name: 'cp', description: 'Copy files', example: 'cp file1 file2' },
  { name: 'mv', description: 'Move or rename files', example: 'mv old new' },
  { name: 'chmod', description: 'Change file permissions', example: 'chmod 755 script.sh' },
  { name: 'chown', description: 'Change file owner', example: 'chown user:group file' },
  { name: 'grep', description: 'Search text using patterns', example: 'grep "error" log.txt' },
  { name: 'find', description: 'Find files', example: 'find . -name "*.txt"' },
  { name: 'cat', description: 'Concatenate and display files', example: 'cat file.txt' },
  { name: 'nano', description: 'Text editor', example: 'nano file.txt' },
  { name: 'vim', description: 'Advanced text editor', example: 'vim file.txt' },
  { name: 'top', description: 'Task manager', example: 'top' },
  { name: 'htop', description: 'Interactive task manager', example: 'htop' },
  { name: 'systemctl', description: 'Control system services', example: 'systemctl start nginx' },
  { name: 'journalctl', description: 'View system logs', example: 'journalctl -f' },
  { name: 'apt', description: 'Package manager (Debian/Ubuntu)', example: 'apt install nodejs' },
  { name: 'snap', description: 'Snap package manager', example: 'snap install docker' },
  { name: 'docker', description: 'Container management', example: 'docker ps' },
  { name: 'git', description: 'Version control', example: 'git status' },
];

export default function Commands() {
  const [filter, setFilter] = useState('');
  const query = filter.trim().toLowerCase();
  const filtered = query
    ? commands.filter(
        (c) => c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)
      )
    : commands;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Linux Command Reference</h1>
      <label htmlFor="command-filter" className="sr-only">
        Search commands
      </label>
      <input
        id="command-filter"
        type="search"
        placeholder="Search commands..."
        className="glass px-4 py-2 rounded-full w-full max-w-md mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <p className="text-sm text-muted-foreground mb-4" aria-live="polite">
        {filtered.length} of {commands.length} commands shown.
      </p>
      {filtered.length === 0 ? (
        <div className="glass p-6 rounded-2xl">
          <p className="text-muted-foreground">
            No commands match &ldquo;{filter.trim()}&rdquo;. Try &ldquo;git&rdquo; or
            &ldquo;docker&rdquo;.
          </p>
        </div>
      ) : (
        <CommandList commands={filtered} />
      )}
    </div>
  );
}
