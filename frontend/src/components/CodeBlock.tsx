import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'sql',
  title,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-lg overflow-hidden border border-slate-700 bg-brand-navy text-slate-100 font-mono text-xs shadow-md ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          {title && <span className="text-slate-400 font-sans text-xs ml-2 font-medium">{title}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-white px-2 py-0.5 rounded text-[11px] font-sans hover:bg-slate-800 transition-colors"
            title="Copy code"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto leading-relaxed text-emerald-400/90 whitespace-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
};
