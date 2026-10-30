import { useEffect, useRef, useState } from "react";
import { Fingerprint, Wind, Flame, Snowflake, AlertTriangle, ShieldCheck } from "lucide-react";
import { fmt, tap, tapPower, baseTapPower, wash, washFee, comboMultiplier, purgeFans, coolingPower, heatGeneration, isThrottling, type GameState } from "@/game/engine";
import { cn } from "@/lib/utils";
import { GameButton } from "./ui";
import { sound } from "@/lib/audio";

interface Float { id: number; x: number; y: number; text: string }

export function TerminalTab({ s, act }: { s: GameState; act: (fn: (s: GameState) => GameState) => void }) {
  const [floats, setFloats] = useState<Float[]>([]);
  const seq = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [s.logs.length]);

  const triggerTap = (clientX: number, clientY: number) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    const x = rect ? clientX - rect.left : 110 + (Math.random() * 40 - 20);
    const y = rect ? clientY - rect.top : 110 + (Math.random() * 40 - 20);
    const id = ++seq.current;
    const power = tapPower(s);

    setFloats((f) => [...f.slice(-14), { id, x, y, text: `+${fmt(power)}` }]);
    setTimeout(() => setFloats((f) => f.filter((it) => it.id !== id)), 900);

    sound.playTap();
    if (s.combo > 0 && s.combo % 10 === 0) {
      sound.playCombo(Math.floor(s.combo / 10));
    }
    act((st) => tap(st, Date.now()));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    // If not a touch event (desktop click), trigger
    if (e.pointerType !== "touch") {
      triggerTap(e.clientX, e.clientY);
    }
  };

  const onTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    // Support multi-finger drumming on mobile!
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      triggerTap(touch.clientX, touch.clientY);
    }
  };

  const combo = comboMultiplier(s);
  const base = baseTapPower(s);
  const current = tapPower(s);
  const throttling = isThrottling(s);
  const netHeat = heatGeneration(s) - coolingPower(s);
  const isOverheating = s.temp >= 92;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
      <div className="panel flex flex-col items-center gap-4 p-5">
        {/* Tap info block */}
        <div className="text-center">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Сила тапу (з комбо)</div>
          <div className="text-3xl font-bold text-primary glow-text">{fmt(current)}</div>
          <div className="font-mono text-xs text-muted-foreground">
            Постійна базова: <span className="text-foreground font-bold">{fmt(base)}</span>
            {combo > 1 && <span className="text-warning ml-1.5 font-bold">(×{combo.toFixed(2)})</span>}
          </div>
        </div>

        {/* Big Tap Button */}
        <button
          ref={buttonRef}
          type="button"
          onPointerDown={onPointerDown}
          onTouchStart={onTouchStart}
          className={cn(
            "tap-core relative flex size-52 select-none items-center justify-center rounded-full border-2 glow-box transition-transform active:scale-95 touch-manipulation cursor-pointer",
            isOverheating ? "border-destructive glow-danger animate-pulse" : throttling ? "border-warning" : "border-primary/60"
          )}
          aria-label="Брутфорс хешу"
        >
          <div className="absolute inset-3 rounded-full border border-dashed border-primary/40 animate-spin-slow pointer-events-none" />
          <Fingerprint className="size-20 text-primary pointer-events-none" strokeWidth={1.2} />
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

        {/* Combo bar */}
        <div className="w-full max-w-xs">
          <div className="mb-1 flex justify-between font-mono text-[10px] uppercase text-muted-foreground">
            <span>Комбо-швидкість</span>
            <span className={cn(combo > 1.4 && "text-warning font-bold")}>×{combo.toFixed(2)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-warning transition-all" style={{ width: `${Math.min(100, (combo - 1) * 100)}%` }} />
          </div>
          <p className="mt-1 text-center text-[10px] text-muted-foreground">Базова сила ніколи не зникає! Швидкі тапи множать її в рази.</p>
        </div>

        {/* Temperature & Cooling status badge */}
        <div className={cn(
          "w-full rounded-md border p-2.5 font-mono text-xs flex items-center justify-between gap-2",
          isOverheating ? "border-destructive bg-destructive/15 text-destructive" :
          throttling ? "border-warning bg-warning/10 text-warning" : "border-border bg-card/60 text-muted-foreground"
        )}>
          <div className="flex items-center gap-2">
            {isOverheating ? <AlertTriangle className="size-4 text-destructive animate-bounce" /> :
             throttling ? <Flame className="size-4 text-warning" /> : <ShieldCheck className="size-4 text-primary" />}
            <div>
              <div className="font-bold uppercase text-[10px]">
                {isOverheating ? "Критичний жар (>92°C)! Залізо може згоріти!" :
                 throttling ? "Тротлінг (>85°C): дохід урізано ×0.4" : "Охолодження стабільне"}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {s.temp.toFixed(1)}°C · Баланс: {netHeat > 0 ? `+${netHeat.toFixed(1)}` : netHeat.toFixed(1)}°C/с
              </div>
            </div>
          </div>
          <GameButton tone={s.temp > 80 ? "warning" : "info"} onClick={() => { sound.playTap(1.4); act(purgeFans); }} className="py-1 px-2.5 text-[10px]">
            <Snowflake className="size-3" /> Продувка
          </GameButton>
        </div>

        {/* Dirty money & Tornado Cash laundering */}
        {s.dirty > 0 && (
          <div className="w-full rounded-md border border-warning/40 bg-warning/10 p-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="font-mono text-[10px] uppercase font-bold text-warning">Брудна крипта (ризик конфіскації!)</div>
                <div className="font-bold text-warning text-lg">{fmt(s.dirty)}</div>
                <div className="text-[10px] text-muted-foreground">Загроза FBI: {s.heat.toFixed(0)}% · Облава конфіскує 75%</div>
              </div>
              <GameButton tone="warning" onClick={() => { sound.playWash(); act(wash); }}>
                <Wind className="size-3.5" /> Відмити (−{Math.round(washFee(s) * 100)}%)
              </GameButton>
            </div>
          </div>
        )}
      </div>

      {/* Terminal Logs Panel */}
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
                l.kind === "warn" && "text-warning font-semibold",
                l.kind === "bad" && "text-destructive font-bold",
                l.kind === "info" && "text-muted-foreground",
              )}
            >
              {l.text}
            </div>
          ))}
          <div className="animate-pulse text-primary font-bold">▌</div>
        </div>
      </div>
    </div>
  );
}
