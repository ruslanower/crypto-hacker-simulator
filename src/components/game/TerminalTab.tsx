import { useEffect, useRef, useState } from "react";
import { Fingerprint, Wind } from "lucide-react";
import { fmt, tap, tapPower, wash, washFee, comboMultiplier, type GameState } from "@/game/engine";
import { cn } from "@/lib/utils";
import { GameButton } from "./ui";

interface Float { id: number; x: number; y: number; text: string }

export function TerminalTab({ s, act }: { s: GameState; act: (fn: (s: GameState) => GameState) => void }) {
  const [floats, setFloats] = useState<Float[]>([]);
  const seq = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [s.logs.length]);

  const onTap = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = ++seq.current;
    const power = tapPower(s);
    setFloats((f) => [...f.slice(-12), { id, x: e.clientX - rect.left, y: e.clientY - rect.top, text: `+${fmt(power)}` }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 900);
    act((st) => tap(st, Date.now()));
  };

  const combo = comboMultiplier(s);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
      <div className="panel flex flex-col items-center gap-4 p-5">
        <div className="text-center">
          <div className="font-mono text-[11px] uppercase text-muted-foreground">Сила тапу</div>
          <div className="text-2xl font-bold text-primary glow-text">{fmt(tapPower(s))}</div>
        </div>

        <button
          type="button"
          onPointerDown={onTap}
          className="tap-core relative flex size-56 select-none items-center justify-center rounded-full border-2 border-primary/60 glow-box transition-transform active:scale-95 touch-manipulation"
          aria-label="Брутфорс хешу"
        >
          <div className="absolute inset-3 rounded-full border border-dashed border-primary/40 animate-spin-slow" />
          <Fingerprint className="size-24 text-primary" strokeWidth={1.2} />
          {floats.map((f) => (
            <span
              key={f.id}
              className="pointer-events-none absolute animate-float-up font-mono text-sm font-bold text-primary glow-text"
              style={{ left: f.x, top: f.y }}
            >
              {f.text}
            </span>
          ))}
        </button>

        <div className="w-full max-w-xs">
          <div className="mb-1 flex justify-between font-mono text-[10px] uppercase text-muted-foreground">
            <span>Комбо</span>
            <span className={cn(combo > 1.5 && "text-warning")}>×{combo.toFixed(2)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-warning transition-all" style={{ width: `${(combo - 1) * 100}%` }} />
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">Тапай швидко без пауз — комбо подвоює силу.</p>
        </div>

        {s.dirty > 0 && (
          <div className="w-full rounded-md border border-warning/40 bg-warning/10 p-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="font-mono text-[10px] uppercase text-warning">Брудна крипта</div>
                <div className="font-bold text-warning">{fmt(s.dirty)}</div>
              </div>
              <GameButton tone="warning" onClick={() => act(wash)}>
                <Wind className="size-3.5" /> Відмити (−{Math.round(washFee(s) * 100)}%)
              </GameButton>
            </div>
          </div>
        )}
      </div>

      <div className="panel scanlines flex min-h-80 flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2 font-mono text-[11px] text-muted-foreground">
          <span className="size-2 rounded-full bg-destructive" />
          <span className="size-2 rounded-full bg-warning" />
          <span className="size-2 rounded-full bg-primary" />
          <span className="ml-2">root@shadow:~# tail -f ops.log</span>
        </div>
        <div ref={logRef} className="h-96 flex-1 space-y-1 overflow-y-auto p-3 font-mono text-xs lg:h-[28rem]">
          {s.logs.map((l) => (
            <div
              key={l.id}
              className={cn(
                l.kind === "ok" && "text-primary",
                l.kind === "warn" && "text-warning",
                l.kind === "bad" && "text-destructive",
                l.kind === "info" && "text-muted-foreground",
              )}
            >
              {l.text}
            </div>
          ))}
          <div className="animate-pulse text-primary">▌</div>
        </div>
      </div>
    </div>
  );
}
