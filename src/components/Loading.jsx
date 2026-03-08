import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-9999 bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
      <div className="text-center leading-tight flex flex-col gap-6">
        <p className="font-semibold tracking-wide text-slate-900 dark:text-white text-4xl pulse-anim transition-colors duration-300">
          Disaster<span className="text-emerald-500 dark:text-emerald-400">Net</span>
        </p>
        <div className="h-8 w-8 border-4 border-emerald-500 dark:border-emerald-400 border-t-transparent dark:border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default Loading;