import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          <span className="font-semibold text-slate-700">Apex Collections 360</span>
          <span>·</span>
          <span>Strict Contract &amp; Schema Allow-list Enforced</span>
        </div>
        <div className="font-medium text-slate-600">
          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold mr-2">
            Educational prototype
          </span>
          <span>Synthetic data only. Not endorsed by financial institutions.</span>
        </div>
      </div>
    </footer>
  );
};
