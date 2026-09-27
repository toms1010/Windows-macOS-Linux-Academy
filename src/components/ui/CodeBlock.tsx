import { useState } from 'react';
import { FaCopy } from 'react-icons/fa';

export default function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative glass rounded-2xl p-4 font-mono text-sm overflow-x-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs uppercase text-muted-foreground">{language}</span>
        <button
          onClick={copy}
          aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
          className="flex items-center gap-1 text-xs hover:text-primary transition"
        >
          <FaCopy aria-hidden="true" /> <span aria-live="polite">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}
