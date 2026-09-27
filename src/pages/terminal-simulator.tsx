import { motion } from 'framer-motion';
import Head from 'next/head';
import GlassCard from '@/components/ui/GlassCard';
import TerminalDebuggerScenarios from '@/components/labs/TerminalDebuggerScenarios';
import { useState, useRef, useEffect } from 'react';
import {
  FaTerminal, FaCopy, FaTrash, FaInfoCircle
} from 'react-icons/fa';

interface CommandHistory {
  command: string;
  output: string | JSX.Element;
  type: 'input' | 'output' | 'error' | 'info' | 'system';
}

export default function TerminalSimulator() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: 'system',
      output: (
        <div className="space-y-1">
          <p className="text-green-400">🐧 Welcome to Linux Terminal Simulator!</p>
          <p className="text-gray-400">Type <span className="text-yellow-400">help</span> to see available commands</p>
          <p className="text-gray-400">📂 Try <span className="text-yellow-400">ls</span> to list files</p>
          <p className="text-gray-400">💡 Type <span className="text-yellow-400">clear</span> to clear the screen</p>
        </div>
      ),
      type: 'system'
    }
  ]);
  const [currentDir, setCurrentDir] = useState('/home/user');
  const [user] = useState('student');
  const [hostname] = useState('linux-academy');
  const [isRunning] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // File system simulation - proper structure.
  // Updated immutably so React re-renders reliably after mkdir/touch.
  const [filesystem, setFilesystem] = useState<Record<string, any>>({
    '/': {
      type: 'dir',
      content: {
        'home': { type: 'dir', content: {} },
        'etc': { type: 'dir', content: {} },
        'var': { type: 'dir', content: {} },
        'usr': { type: 'dir', content: {} },
        'bin': { type: 'dir', content: {} },
        'tmp': { type: 'dir', content: {} },
      }
    },
    '/home': {
      type: 'dir',
      content: {
        'user': { type: 'dir', content: {} }
      }
    },
    '/home/user': {
      type: 'dir',
      content: {
        'Documents': { type: 'dir', content: {} },
        'Downloads': { type: 'dir', content: {} },
        'Pictures': { type: 'dir', content: {} },
        'Music': { type: 'dir', content: {} },
        'Videos': { type: 'dir', content: {} },
        'Projects': { type: 'dir', content: {} },
        '.bashrc': { type: 'file', content: '# Bash configuration file' },
        '.profile': { type: 'file', content: '# Profile configuration' },
        'README.md': { type: 'file', content: '# Welcome to Linux Academy\n\nThis is your home directory.' },
        'notes.txt': { type: 'file', content: 'Linux commands practice notes:\n- ls: list files\n- cd: change directory\n- pwd: print working directory' },
        'hello.sh': { type: 'file', content: '#!/bin/bash\necho "Hello, World!"' },
      }
    },
    '/home/user/Documents': {
      type: 'dir',
      content: {
        'report.txt': { type: 'file', content: 'This is a sample report file.\nDate: 2024-01-15\nAuthor: Student' },
        'essay.docx': { type: 'file', content: 'My Essay\n\nThis is my essay content.' },
      }
    },
    '/home/user/Downloads': {
      type: 'dir',
      content: {
        'ubuntu-22.04.iso': { type: 'file', content: 'Ubuntu 22.04 LTS Desktop ISO (3.2 GB)' },
        'software.deb': { type: 'file', content: 'Debian package file' },
      }
    },
    '/home/user/Projects': {
      type: 'dir',
      content: {
        'website': { type: 'dir', content: {} },
        'app': { type: 'dir', content: {} },
      }
    },
    '/home/user/Projects/website': {
      type: 'dir',
      content: {
        'index.html': { type: 'file', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Website</title>\n</head>\n<body>\n  <h1>Hello World!</h1>\n</body>\n</html>' },
        'style.css': { type: 'file', content: 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}' },
        'app.js': { type: 'file', content: 'console.log("Hello from JavaScript!");' },
      }
    },
    '/etc': {
      type: 'dir',
      content: {
        'hostname': { type: 'file', content: 'linux-academy' },
        'hosts': { type: 'file', content: '127.0.0.1 localhost\n127.0.1.1 linux-academy' },
        'passwd': { type: 'file', content: 'root:x:0:0:root:/root:/bin/bash\nstudent:x:1000:1000:Student:/home/user:/bin/bash' },
      }
    }
  });

  // Helper to get current directory content
  const getDirContent = (path: string) => {
    // Normalize path
    let normalizedPath = path;
    if (normalizedPath === '/') return filesystem['/'];
    
    // Remove trailing slash
    if (normalizedPath.endsWith('/') && normalizedPath.length > 1) {
      normalizedPath = normalizedPath.slice(0, -1);
    }
    
    // Direct lookup
    if (filesystem[normalizedPath]) {
      return filesystem[normalizedPath];
    }
    
    // Try to find by traversing
    const parts = normalizedPath.split('/').filter(Boolean);
    let current = filesystem['/'];
    
    for (const part of parts) {
      if (current.type === 'dir' && current.content && current.content[part]) {
        current = current.content[part];
      } else {
        return null;
      }
    }
    
    return current;
  };

  // Helper to get parent path
  const getParentPath = (path: string) => {
    const parts = path.split('/').filter(Boolean);
    parts.pop();
    return parts.length ? '/' + parts.join('/') : '/';
  };

  // Helper to join paths
  const joinPath = (base: string, target: string) => {
    if (target.startsWith('/')) return target;
    if (base === '/') return '/' + target;
    return base + '/' + target;
  };

  const commands: Record<string, (args: string[]) => string | JSX.Element> = {
    help: () => (
      <div className="space-y-1">
        <p className="text-yellow-400">📚 Available Commands:</p>
        <p><span className="text-green-400">help</span> - Show this help message</p>
        <p><span className="text-green-400">ls</span> - List directory contents</p>
        <p><span className="text-green-400">cd [dir]</span> - Change directory</p>
        <p><span className="text-green-400">pwd</span> - Print working directory</p>
        <p><span className="text-green-400">mkdir [name]</span> - Create directory</p>
        <p><span className="text-green-400">touch [file]</span> - Create file</p>
        <p><span className="text-green-400">cat [file]</span> - Display file content</p>
        <p><span className="text-green-400">echo [text]</span> - Display text</p>
        <p><span className="text-green-400">clear</span> - Clear terminal</p>
        <p><span className="text-green-400">whoami</span> - Display current user</p>
        <p><span className="text-green-400">uname</span> - System information</p>
        <p><span className="text-green-400">date</span> - Current date and time</p>
        <p><span className="text-green-400">uptime</span> - System uptime</p>
        <p><span className="text-green-400">history</span> - Show command history</p>
        <p><span className="text-green-400">tree</span> - Show directory structure</p>
      </div>
    ),
    tree: () => {
      const dir = getDirContent(currentDir);
      if (!dir || dir.type !== 'dir') return <span className="text-red-400">Not a directory</span>;
      
      const renderTree = (content: Record<string, any>, prefix: string = '') => {
        const items = Object.keys(content || {});
        if (items.length === 0) return <span className="text-gray-500">(empty)</span>;
        
        return (
          <div className="space-y-0.5">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              const isDir = content[item].type === 'dir';
              const connector = isLast ? '└── ' : '├── ';
              const childPrefix = isLast ? '    ' : '│   ';
              
              return (
                <div key={item}>
                  <span className={isDir ? 'text-blue-400' : 'text-gray-300'}>
                    {connector}{isDir ? '📁' : '📄'} {item}
                  </span>
                  {isDir && content[item].content && (
                    <div className="pl-4">
                      {renderTree(content[item].content, childPrefix)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      };
      
      return renderTree(dir.content);
    },
    ls: (args: string[]) => {
      // Separate flags (e.g. -l) from the optional path argument.
      const flags = args.filter((a) => a.startsWith('-'));
      const paths = args.filter((a) => !a.startsWith('-'));
      const targetPath = paths.length > 0 ? paths[0] : currentDir;
      const dir = getDirContent(targetPath);
      
      if (!dir) return <span className="text-red-400">Directory not found: {targetPath}</span>;
      if (dir.type !== 'dir') return <span className="text-red-400">Not a directory: {targetPath}</span>;
      
      const items = Object.keys(dir.content || {});
      if (items.length === 0) return <span className="text-gray-500">(empty directory)</span>;
      
      const isLong = flags.some((f) => f.includes('l'));
      return (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => {
            const isDir = dir.content[item].type === 'dir';
            return (
              <span key={i} className={isDir ? 'text-blue-400 font-bold' : 'text-gray-300'}>
                {isDir ? '📁' : '📄'} {item}
                {isLong && isDir && '/'}
              </span>
            );
          })}
        </div>
      );
    },
    pwd: () => <span className="text-blue-400">{currentDir}</span>,
    whoami: () => <span className="text-green-400">{user}</span>,
    uname: () => <span className="text-cyan-400">Linux academy 6.5.0-14-generic #14-Ubuntu SMP</span>,
    date: () => <span className="text-yellow-400">{new Date().toString()}</span>,
    uptime: () => <span className="text-green-400">up 2 days, 4 hours, 32 minutes, 3 users</span>,
    echo: (args: string[]) => <span className="text-white">{args.join(' ') || ''}</span>,
    who: () => (
      <div className="space-y-1">
        <p><span className="text-green-400">{user}</span> pts/0  2024-01-15 10:30 (:0)</p>
        <p><span className="text-gray-400">root</span> pts/1  2024-01-15 10:35 (192.168.1.100)</p>
      </div>
    ),
    clear: () => {
      setHistory([]);
      return <span className="text-gray-500">Terminal cleared</span>;
    },
    mkdir: (args: string[]) => {
      if (!args.length) return <span className="text-red-400">Usage: mkdir [directory name]</span>;
      const dir = getDirContent(currentDir);
      if (!dir || dir.type !== 'dir') return <span className="text-red-400">Current directory not found</span>;

      const newDir = args[0];
      if (newDir.includes('/')) return <span className="text-red-400">Only simple names are supported: {newDir}</span>;
      if (dir.content[newDir]) return <span className="text-red-400">Directory already exists: {newDir}</span>;

      setFilesystem((prev) => {
        const next = { ...prev };
        const current = next[currentDir];
        if (!current || current.type !== 'dir') return prev;
        next[currentDir] = {
          ...current,
          content: { ...current.content, [newDir]: { type: 'dir', content: {} } },
        };
        return next;
      });
      return <span className="text-green-400">Directory &lsquo;{newDir}&rsquo; created</span>;
    },
    touch: (args: string[]) => {
      if (!args.length) return <span className="text-red-400">Usage: touch [filename]</span>;
      const dir = getDirContent(currentDir);
      if (!dir || dir.type !== 'dir') return <span className="text-red-400">Current directory not found</span>;

      const newFile = args[0];
      if (newFile.includes('/')) return <span className="text-red-400">Only simple names are supported: {newFile}</span>;
      if (dir.content[newFile]) return <span className="text-yellow-400">File already exists: {newFile}</span>;

      setFilesystem((prev) => {
        const next = { ...prev };
        const current = next[currentDir];
        if (!current || current.type !== 'dir') return prev;
        next[currentDir] = {
          ...current,
          content: { ...current.content, [newFile]: { type: 'file', content: '' } },
        };
        return next;
      });
      return <span className="text-green-400">File &lsquo;{newFile}&rsquo; created</span>;
    },
    cat: (args: string[]) => {
      if (!args.length) return <span className="text-red-400">Usage: cat [filename]</span>;
      const dir = getDirContent(currentDir);
      if (!dir || dir.type !== 'dir') return <span className="text-red-400">Current directory not found</span>;
      
      const file = args[0];
      if (!dir.content[file]) return <span className="text-red-400">File not found: {file}</span>;
      if (dir.content[file].type !== 'file') return <span className="text-red-400">Not a file: {file}</span>;
      
      return <span className="text-white whitespace-pre-wrap">{dir.content[file].content}</span>;
    },
    cd: (args: string[]) => {
      if (!args.length) {
        setCurrentDir('/home/user');
        return <span className="text-gray-400">Changed to home directory</span>;
      }
      
      const target = args[0];
      let newPath = '';
      
      if (target === '..') {
        newPath = getParentPath(currentDir);
      } else if (target === '~' || target === '/home/user') {
        newPath = '/home/user';
      } else if (target.startsWith('/')) {
        newPath = target;
      } else {
        newPath = joinPath(currentDir, target);
      }
      
      // Check if the directory exists
      const dir = getDirContent(newPath);
      if (!dir) return <span className="text-red-400">Directory not found: {target}</span>;
      if (dir.type !== 'dir') return <span className="text-red-400">Not a directory: {target}</span>;
      
      setCurrentDir(newPath);
      return <span className="text-gray-400">Changed to: {newPath}</span>;
    },
    history: () => {
      if (commandHistory.length === 0) {
        return <span className="text-gray-500">No commands in history</span>;
      }
      return (
        <div className="space-y-0.5">
          {commandHistory.map((cmd, i) => (
            <p key={i} className="text-gray-400">{String(i + 1).padStart(4, ' ')}  {cmd}</p>
          ))}
        </div>
      );
    },
  };

  const executeCommand = (cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (command === '') return;

    // Add to history
    setCommandHistory(prev => [...prev, cmd]);

    // Add input to history
    setHistory(prev => [...prev, { 
      command: cmd, 
      output: '',
      type: 'input' 
    }]);

    if (command === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    if (command in commands) {
      const result = commands[command](args);
      setHistory(prev => [...prev, { 
        command: '', 
        output: result,
        type: 'output' 
      }]);
    } else {
      setHistory(prev => [...prev, { 
        command: '', 
        output: <span className="text-red-400">Command not found: {command}. Type &lsquo;help&rsquo; for available commands.</span>,
        type: 'error' 
      }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input.trim());
      setInput('');
      setHistoryIndex(-1);
    }
  };

  const runQuickCommand = (cmd: string) => {
    executeCommand(cmd);
    setInput('');
    setHistoryIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (commandHistory.length === 0) return;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      // historyIndex -1 means "new input"; otherwise index into commandHistory.
      const newIndex =
        historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      if (historyIndex >= commandHistory.length - 1) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex] || '');
      }
    }
  };

  const clearTerminal = () => {
    setHistory([
      {
        command: 'system',
        output: (
          <div className="space-y-1">
            <p className="text-green-400">🐧 Terminal cleared! Type <span className="text-yellow-400">help</span> to see commands</p>
          </div>
        ),
        type: 'system'
      }
    ]);
    setInput('');
  };

  const copyTerminal = async () => {
    const text = history.map(h => {
      if (h.type === 'input') return `${user}@${hostname}:${currentDir}$ ${h.command}`;
      if ((h.type === 'output' || h.type === 'error') && typeof h.output === 'string') return h.output;
      return '';
    }).filter(Boolean).join('\n');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard unavailable (permissions / insecure context) — stay silent.
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Terminal Simulator & Debugging Scenarios | Win vs Linux Academy</title>
        <meta
          name="description"
          content="Practice Linux commands in a safe simulator, then fix guided debugging scenarios: permissions, logs and cleanup."
        />
      </Head>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <FaTerminal className="text-4xl text-green-500" />
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Linux <span className="text-primary">Terminal</span> Simulator
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
          Practice Linux commands in a safe, interactive environment. Type <span className="text-green-400">help</span> to get started.
        </p>
      </div>

      {/* Terminal */}
      <GlassCard className="p-0 overflow-hidden border-2 border-green-500/30">
        {/* Terminal Header */}
        <div className="bg-gray-900 dark:bg-gray-950 px-4 py-2 flex items-center justify-between border-b border-green-500/20">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs text-gray-400 ml-2">{user}@{hostname}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              {isRunning ? 'Running' : 'Stopped'}
            </span>
            <button onClick={copyTerminal} className="text-gray-500 hover:text-white transition text-xs p-1 rounded hover:bg-gray-700" title="Copy output" aria-label="Copy terminal output">
              <FaCopy aria-hidden="true" />
            </button>
            <button onClick={clearTerminal} className="text-gray-500 hover:text-white transition text-xs p-1 rounded hover:bg-gray-700" title="Clear terminal" aria-label="Clear terminal">
              <FaTrash aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Terminal Output */}
        <div
          ref={terminalRef}
          onClick={() => inputRef.current?.focus()}
          className="bg-black text-white p-4 font-mono text-sm h-96 overflow-y-auto"
          style={{ fontFamily: 'monospace' }}
        >
          <div className="space-y-0.5">
            {history.map((entry, index) => (
              <div key={index}>
                {entry.type === 'system' && (
                  <div className="text-gray-400">
                    {entry.output}
                  </div>
                )}
                {entry.type === 'input' && (
                  <div>
                    <span className="text-green-400">{user}</span>
                    <span className="text-white">@</span>
                    <span className="text-cyan-400">{hostname}</span>
                    <span className="text-white">:</span>
                    <span className="text-blue-400">{currentDir}</span>
                    <span className="text-white">$ </span>
                    <span className="text-white">{entry.command}</span>
                  </div>
                )}
                {entry.type === 'output' && (
                  <div className="pl-0 text-gray-300">
                    {entry.output}
                  </div>
                )}
                {entry.type === 'error' && (
                  <div className="pl-0 text-red-400">
                    {entry.output}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Input Line */}
          <div className="flex items-center mt-0.5">
            <span className="text-green-400">{user}</span>
            <span className="text-white">@</span>
            <span className="text-cyan-400">{hostname}</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">{currentDir}</span>
            <span className="text-white">$ </span>
            <form onSubmit={handleSubmit} className="flex-1 flex">
              <label htmlFor="terminal-input" className="sr-only">
                Terminal input — type a Linux command
              </label>
              <input
                id="terminal-input"
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-white font-mono text-sm"
                placeholder="Type a command..."
                autoFocus
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </form>
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="bg-gray-900 dark:bg-gray-950 px-4 py-1.5 border-t border-green-500/20 flex justify-between text-xs text-gray-500">
          <span className="flex items-center gap-2">
            <span>🖥️ Terminal</span>
            <span>|</span>
            <span className="text-blue-400">📂 {currentDir}</span>
          </span>
          <div className="flex items-center gap-3">
            <span>↑↓ History</span>
            <span>|</span>
            <span className="text-yellow-400">💡 help</span>
          </div>
        </div>
      </GlassCard>

      {/* Quick Commands */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
          <span>⚡</span> Quick Commands
        </h3>
        <div className="flex flex-wrap gap-2">
          {['help', 'ls', 'ls -l', 'pwd', 'whoami', 'date', 'clear', 'echo Hello', 'mkdir test', 'touch file.txt', 'cat file.txt', 'tree'].map((cmd) => (
            <button
              key={cmd}
              onClick={() => runQuickCommand(cmd)}
              aria-label={`Run command ${cmd}`}
              className="px-3 py-1 text-xs glass rounded-full hover:bg-primary/20 hover:text-primary transition"
            >
              $ {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Command Reference */}
      <GlassCard>
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <FaInfoCircle className="text-blue-500" /> Command Reference
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
          {[
            ['help', 'Show all commands'],
            ['ls', 'List directory contents'],
            ['ls -l', 'List with details'],
            ['cd [dir]', 'Change directory'],
            ['cd ..', 'Go to parent'],
            ['pwd', 'Print working directory'],
            ['mkdir [name]', 'Create directory'],
            ['touch [file]', 'Create file'],
            ['cat [file]', 'Display file'],
            ['echo [text]', 'Display text'],
            ['clear', 'Clear terminal'],
            ['whoami', 'Current user'],
            ['uname', 'System info'],
            ['date', 'Current date'],
            ['uptime', 'System uptime'],
            ['history', 'Command history'],
            ['tree', 'Show directory tree'],
          ].map(([cmd, desc], i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-green-400">{cmd}</span>
              <span className="text-gray-500">-</span>
              <span className="text-gray-400">{desc}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Terminal Tips */}
      <GlassCard className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-2 border-green-500/30">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <span>💡</span> Terminal Tips
        </h3>
        <ul className="text-xs text-muted-foreground space-y-0.5">
          <li>• Use <span className="text-green-400">↑</span> and <span className="text-green-400">↓</span> arrow keys to navigate command history</li>
          <li>• Type <span className="text-green-400">clear</span> to clear the terminal screen</li>
          <li>• Use <span className="text-green-400">cd ..</span> to go to parent directory</li>
          <li>• Use <span className="text-green-400">cd ~</span> or <span className="text-green-400">cd</span> to go to home directory</li>
          <li>• <span className="text-green-400">ls -l</span> shows detailed file information</li>
          <li>• <span className="text-green-400">tree</span> shows the directory structure</li>
        </ul>
      </GlassCard>
      {/* Guided Debugging Scenarios */}
      <div className="pt-4">
        <h2 className="text-2xl font-bold mb-1">Guided Debugging Scenarios</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Ready for a challenge? Fix these real-world system issues with the commands you just practiced —
          still fully simulated, nothing leaves your browser.
        </p>
        <TerminalDebuggerScenarios />
      </div>
    </motion.div>
    </>
  );
}
