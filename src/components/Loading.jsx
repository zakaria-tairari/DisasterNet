import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center">
      <div className="text-center leading-tight flex flex-col gap-6">
        <p className="font-semibold tracking-wide text-white text-4xl">
          Disaster<span className="text-emerald-400">Net</span>
        </p>
        <div className="h-8 w-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default Loading;