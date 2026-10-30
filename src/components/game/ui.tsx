import type { ReactNode } from "react";
import {
  Atom, Bot, BrainCircuit, Copy, Cpu, Droplets, Fan, Flame, Keyboard, LayoutGrid, Mouse, Network, Scale, Server, Snowflake, Terminal, Waves,
  Zap, Shield, Globe, Radio, Sparkles, Orbit, Binary, Wifi, Satellite, Gauge, Disc
} from "lucide-react";
import { cn } from "@/lib/utils";

export const ICONS: Record<string, typeof Bot> = {
  Atom, Bot, BrainCircuit, Copy, Cpu, Droplets, Fan, Flame, Keyboard, LayoutGrid, Mouse, Network, Scale, Server, Snowflake, Terminal, Waves,
  Zap, Shield, Globe, Radio, Sparkles, Orbit, Binary, Wifi, Satellite, Gauge, Disc
};

type Tone = "primary" | "info" | "warning" | "destructive" | "muted";

const toneBtn: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground hover:brightness-110 glow-box",
  info: "bg-info text-info-foreground hover:brightness-110",
  warning: "bg-warning text-warning-foreground hover:brightness-110",
  destructive: "bg-destructive text-destructive-foreground hover:brightness-110 glow-danger",
  muted: "bg-secondary text-secondary-foreground hover:bg-accent border border-border",
};

export function GameButton({
  tone = "primary", disabled, onClick, children, className,
}: { tone?: Tone; disabled?: boolean; onClick?: () => void; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 font-mono text-xs font-bold uppercase tracking-wide transition-all active:scale-95 select-none",
        disabled ? "cursor-not-allowed border border-border bg-muted text-muted-foreground" : toneBtn[tone],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Meter({ value, tone, label, right }: { value: number; tone: Tone; label: ReactNode; right: ReactNode }) {
  const bar: Record<Tone, string> = {
    primary: "bg-primary", info: "bg-info", warning: "bg-warning", destructive: "bg-destructive", muted: "bg-muted-foreground",
  };
  return (
    <div className="w-full min-w-0">
      <div className="mb-1 flex items-center justify-between gap-2 font-mono text-[10px] uppercase text-muted-foreground">
        <span className="truncate min-w-0">{label}</span>
        <span className="shrink-0">{right}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full transition-all duration-300", bar[tone])} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}

export function SectionTitle({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
      <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-primary glow-text min-w-0">
        {children}
      </h2>
      {hint && <div className="font-mono text-[10px] sm:text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function formatDuration(sec: number) {
  const s = Math.max(0, Math.ceil(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h) return `${h}г ${m}хв`;
  if (m) return `${m}:${String(r).padStart(2, "0")}`;
  return `${r}с`;
}
