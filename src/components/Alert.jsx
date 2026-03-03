import React, { useEffect, useState } from "react";

const ICONS = {
  success: (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
    </svg>
  ),
};

const STYLES = {
  success: {
    bar: "bg-emerald-500",
    icon: "text-emerald-500",
    border: "border-emerald-500/60",
    bg: "bg-emerald-500/10",
  },
  error: {
    bar: "bg-rose-500",
    icon: "text-rose-500",
    border: "border-rose-500/60",
    bg: "bg-rose-500/10",
  },
  warning: {
    bar: "bg-yellow-500",
    icon: "text-yellow-500",
    border: "border-yellow-500/60",
    bg: "bg-yellow-500/10",
  },
  info: {
    bar: "bg-blue-500",
    icon: "text-blue-500",
    border: "border-blue-500/60",
    bg: "bg-blue-500/10",
  },
};

const Alert = ({ type = "info", message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!message) return;

    // Trigger enter animation
    const enterTimeout = setTimeout(() => setVisible(true), 10);

    // Progress bar countdown
    let progressInterval;
    if (duration > 0) {
      const step = 100 / (duration / 50);
      progressInterval = setInterval(() => {
        setProgress(prev => Math.max(prev - step, 0));
      }, 50);
    }

    // Auto dismiss
    let dismissTimeout;
    if (duration > 0) {
      dismissTimeout = setTimeout(() => dismiss(), duration);
    }

    return () => {
      clearTimeout(enterTimeout);
      clearTimeout(dismissTimeout);
      clearInterval(progressInterval);
    };
  }, [message, duration]);

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => {
      setProgress(100);
      onClose?.();
    }, 300); // wait for exit animation
  };

  if (!message) return null;

  const s = STYLES[type] || STYLES.success;

  return (
    <div
      className={`
        fixed top-5 left-1/2 z-9999
        w-[calc(100%-2rem)] max-w-sm
        transition-all duration-300 ease-out
        ${visible
          ? "opacity-100 -translate-x-1/2 translate-y-0"
          : "opacity-0 -translate-x-1/2 -translate-y-3 pointer-events-none"
        }
      `}
      role="alert"
      aria-live="assertive"
    >
      <div
        className={`
          relative overflow-hidden rounded-md border ${s.border} ${s.bg}
          shadow-2xl shadow-black/40 backdrop-blur-sm
        `}
      >
        {/* Progress bar */}
        {duration > 0 && (
          <div
            className={`absolute top-0 left-0 h-0.5 ${s.bar} transition-all duration-75 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        )}

        <div className="flex items-start gap-3 px-4 py-3.5">
          {/* Icon */}
          <span className={`mt-0.5 ${s.icon}`}>{ICONS[type]}</span>

          {/* Message */}
          <p className={`flex-1 ${s.icon} text-sm leading-snug`}>
            {message}
          </p>

          {/* Close button */}
          <button
            onClick={dismiss}
            className={`mt-0.5 ${s.icon} transition-colors`}
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;