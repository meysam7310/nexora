
"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  TrendingUp,
  Target,
  Zap,
  ArrowUpRight,
  CircleCheck,
} from "lucide-react";

const TARGET_PROGRESS = 78;

const RADIUS = 72;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function RadialProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    const duration = 1800;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);

      // Smooth ease-out animation
      const easedProgress = 1 - Math.pow(1 - rawProgress, 4);

      setProgress(Math.round(easedProgress * TARGET_PROGRESS));

      if (rawProgress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const offset =
    CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <section className="relative flex h-full min-h-[390px] flex-col overflow-hidden rounded-2xl border border-[#e9ecf2] bg-white p-5 transition-colors duration-200 dark:border-gray-800 dark:bg-[#111827]">

      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-500/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-cyan-400/[0.06] blur-3xl" />

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Performance Overview
            </h2>

            <span className="rounded-md bg-violet-50 px-1.5 py-0.5 text-[9px] font-semibold text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
              LIVE
            </span>
          </div>

          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Overall business performance
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-600 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-400">
          <Activity size={17} />
        </div>
      </div>

      {/* Circular Gauge */}
      <div className="relative flex flex-1 flex-col items-center justify-center py-5">

        <div className="relative h-[205px] w-[205px]">

          <svg
            viewBox="0 0 180 180"
            className="h-full w-full -rotate-90 overflow-visible"
            role="img"
            aria-label={`Performance progress ${TARGET_PROGRESS}%`}
          >
            <defs>
              <linearGradient
                id="nexoraProgressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#35D6D0" />
                <stop offset="45%" stopColor="#3B9FF5" />
                <stop offset="100%" stopColor="#9461F7" />
              </linearGradient>

              <filter
                id="nexoraProgressGlow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur
                  stdDeviation="3.5"
                  result="blur"
                />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background Ring */}
            <circle
              cx="90"
              cy="90"
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="11"
              className="text-gray-100 dark:text-gray-800"
            />

            {/* Progress Ring */}
            <circle
              cx="90"
              cy="90"
              r={RADIUS}
              fill="none"
              stroke="url(#nexoraProgressGradient)"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              filter="url(#nexoraProgressGlow)"
            />

            {/* Inner Decorative Ring */}
            <circle
              cx="90"
              cy="90"
              r="59"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 5"
              className="text-gray-200 dark:text-gray-700"
            />
          </svg>

          {/* Exact Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <span className="text-[42px] font-bold leading-none tracking-[-2px] text-gray-900 dark:text-white tabular-nums">
                {progress}%
              </span>

              <span className="mt-2 text-[10px] font-medium uppercase tracking-[1.5px] text-gray-400 dark:text-gray-500">
                Performance
              </span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-1 flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>

          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            Excellent Performance
          </span>
        </div>
      </div>

      {/* Performance Details */}
      <div className="relative grid grid-cols-2 gap-3">

        {/* Completed */}
        <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-800 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
              <Target size={14} />
            </div>

            <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400">
              78%
            </span>
          </div>

          <p className="mt-3 text-[10px] text-gray-400 dark:text-gray-500">
            Completed
          </p>

          <p className="mt-0.5 text-sm font-semibold text-gray-800 dark:text-gray-200">
            On Target
          </p>
        </div>

        {/* Remaining */}
        <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-800 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
              <Zap size={14} />
            </div>

            <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-400">
              22%
            </span>
          </div>

          <p className="mt-3 text-[10px] text-gray-400 dark:text-gray-500">
            Remaining
          </p>

          <p className="mt-0.5 text-sm font-semibold text-gray-800 dark:text-gray-200">
            In Progress
          </p>
        </div>
      </div>

      {/* Bottom Growth Indicator */}
      <div className="relative mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <TrendingUp size={14} />
          </div>

          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">
              Growth rate
            </p>

            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
              Compared to last period
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          <ArrowUpRight size={13} />
          12.8%
        </div>
      </div>
    </section>
  );
}
