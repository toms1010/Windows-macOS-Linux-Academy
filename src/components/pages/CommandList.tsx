interface Command {
  name: string;
  description: string;
  example: string;
}

export default function CommandList({ commands }: { commands: Command[] }) {
  return (
    <div className="grid gap-4">
      {commands.map((cmd, i) => (
        <div key={i} className="glass p-4 rounded-2xl hover:shadow-lg transition">
          <code className="text-primary font-mono text-lg">{cmd.name}</code>
          <p className="text-muted-foreground">{cmd.description}</p>
          <div className="mt-2 bg-black/5 dark:bg-white/5 p-2 rounded font-mono text-sm">
            $ {cmd.example}
          </div>
        </div>
      ))}
    </div>
  );
}
