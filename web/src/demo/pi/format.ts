// Formatting and clock helpers for the demo.
import { useSyncExternalStore } from 'react';

const TZ = 'Asia/Almaty';

export function fmtDate(iso: string, opts: { year?: boolean } = {}) {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00+05:00` : iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: opts.year === false ? undefined : 'numeric', timeZone: TZ });
}

export function fmtDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: TZ })}, ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: TZ })}`;
}

export function relTime(iso: string, now: number) {
  const diff = Math.round((now - new Date(iso).getTime()) / 1000);
  if (diff < 45) return 'just now';
  if (diff < 3600) return `${Math.round(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)} h ago`;
  const days = Math.round(diff / 86400);
  if (days === 1) return 'yesterday';
  if (days < 14) return `${days} days ago`;
  return fmtDate(iso);
}

export function daysUntil(iso: string, now: number) {
  const d = new Date(iso.length === 10 ? `${iso}T23:59:59+05:00` : iso).getTime();
  return Math.ceil((d - now) / 86400000);
}

export function isoToday(now: number) {
  return new Date(now).toLocaleDateString('en-CA', { timeZone: TZ });
}

// A shared clock that ticks every 30 seconds, read via useSyncExternalStore.
let current = Date.now();
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribe(fn: () => void) {
  listeners.add(fn);
  if (!timer) {
    current = Date.now();
    timer = setInterval(() => { current = Date.now(); listeners.forEach((l) => l()); }, 30_000);
  }
  return () => {
    listeners.delete(fn);
    if (!listeners.size && timer) { clearInterval(timer); timer = null; }
  };
}

export function useNow() {
  return useSyncExternalStore(subscribe, () => current, () => current);
}
