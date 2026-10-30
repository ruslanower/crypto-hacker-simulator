import { useEffect, useRef, useState } from "react";
import { Fingerprint, Wind, Flame, Snowflake, AlertTriangle, ShieldCheck } from "lucide-react";
import { fmt, tap, tapPower, baseTapPower, wash, washFee, comboMultiplier, purgeFans, coolingPower, heatGeneration, isThrottling, type GameState } from "@/game/engine";
import { cn } from "@/lib/utils";
import { GameButton } from "./ui";
import { sound } from "@/lib/audio";
import { t, type Lang } from "@/lib/i18n";

interface Float { id: number; x: number; y: number; text: string }

export function TerminalTab({ s, act, lang }: { s: GameState; act: (fn: (s: GameState) => GameState) => void; lang: Lang }) {
  const [floats, setFloats] = useState<Float[]>([]);
  const seq = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [s.logs.length]);

  const triggerTap = (clientX: number, clientY: number) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    const x = rect ? clientX - rect.left : 80 + (Math.random() * 30 - 15);
    const y = rect ? clientY - rect.top : 80 + (Math.random() * 30 - 15);
    const id = ++seq.current;
    const power = tapPower(s);

    setFloats((f) => [...f.slice(-12), { id, x, y, text: `+${fmt(power)}` }]);
    setTimeout(() => setFloats((f) => f.filter((it) => it.id !== id)), 850);

    sound.playTap();
    if (s.combo > 0 && s.combo % 10 === 0) {
      sound.playCombo(Math.floor(s.combo / 10));
    }
    act((st) => tap(st, Date.now()));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "touch") {
      triggerTap(e.clientX, e.clientY);
    }
  };

  const onTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
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
    <div className="grid gap-3 lg:grid-cols-[1fr_1.1fr]">
      <div className="panel flex flex-col items-center gap-3 p-3.5 sm:p-5">
        {/* Tap info block */}
        <div className="text-center">
          <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{t("tapPowerWithCombo", lang)}</div>
          <div className="text-2xl sm:text-3xl font-bold text-primary glow-text tracking-tight">{fmt(current)}</div>
          <div className="font-mono text-[11px] text-muted-foreground">
            {t("constantBaseTap", lang)} <span className="text-foreground font-bold">{fmt(base)}</span>
            {combo > 1 && <span className="text-warning ml-1 font-bold">(×{combo.toFixed(2)})</span>}
          </div>
        </div>

        {/* Big Tap Button - Scaled for 320px-360px mobile screens */}
        <button
          ref={buttonRef}
          type="button"
          onPointerDown={onPointerDown}
          onTouchStart={onTouchStart}
          className={cn(
            "tap-core relative flex size-40 sm:size-52 select-none items-center justify-center rounded-full border-2 glow-box transition-transform active:scale-95 touch-manipulation cursor-pointer shrink-0 my-1",
            isOverheating ? "border-destructive glow-danger animate-pulse" : throttling ? "border-warning" : "border-primary/60"
          )}
          aria-label="Brute Force Hash"
        >
          <div className="absolute inset-2 sm:inset-3 rounded-full border border-dashed border-primary/40 animate-spin-slow pointer-events-none" />
          <Fingerprint className="size-16 sm:size-20 text-primary pointer-events-none" strokeWidth={1.2} />
          {floats.map((f) => (
            <span
              key={f.id}
              className="pointer-events-none absolute animate-float-up font-mono text-xs sm:text-sm font-bold text-primary glow-text"
              style={{ left: f.x, top: f.y }}
            >
              {f.text}
            </span>
          ))}
        </button>

        {/* Combo bar */}
        <div className="w-full max-w-xs">
          <div className="mb-1 flex justify-between font-mono text-[9px] uppercase text-muted-foreground">
            <span>{t("comboSpeed", lang)}</span>
            <span className={cn(combo > 1.4 && "text-warning font-bold")}>×{combo.toFixed(2)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-warning transition-all" style={{ width: `${Math.min(100, (combo - 1) * 100)}%` }} />
          </div>
          <p className="mt-1 text-center text-[9px] text-muted-foreground leading-tight">{t("comboHint", lang)}</p>
        </div>

        {/* Temperature & Cooling status badge */}
        <div className={cn(
          "w-full rounded-md border p-2 sm:p-2.5 font-mono text-xs flex items-center justify-between gap-2",
          isOverheating ? "border-destructive bg-destructive/15 text-destructive" :
          throttling ? "border-warning bg-warning/10 text-warning" : "border-border bg-card/60 text-muted-foreground"
        )}>
          <div className="flex items-center gap-2 min-w-0">
            {isOverheating ? <AlertTriangle className="size-4 shrink-0 text-destructive animate-bounce" /> :
             throttling ? <Flame className="size-4 shrink-0 text-warning" /> : <ShieldCheck className="size-4 shrink-0 text-primary" />}
            <div className="min-w-0">
              <div className="font-bold uppercase text-[9px] sm:text-[10px] truncate">
                {isOverheating ? t("criticalOverheat", lang) :
                 throttling ? t("throttlingNotice", lang) : t("coolingStable", lang)}
              </div>
              <div className="text-[9px] text-muted-foreground truncate">
                {s.temp.toFixed(1)}°C · {t("thermalBalance", lang)} {netHeat > 0 ? `+${netHeat.toFixed(1)}` : netHeat.toFixed(1)}°C/s
              </div>
            </div>
          </div>
          <GameButton tone={s.temp > 80 ? "warning" : "info"} onClick={() => { sound.playTap(1.4); act(purgeFans); }} className="py-1 px-2 text-[9px] shrink-0">
            <Snowflake className="size-3" /> {t("nitrogenPurge", lang)}
          </GameButton>
        </div>

        {/* Dirty money & Tornado Cash laundering */}
        {s.dirty > 0 && (
          <div className="w-full rounded-md border border-warning/40 bg-warning/10 p-2.5 sm:p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="font-mono text-[9px] uppercase font-bold text-warning truncate">{t("dirtyCryptoWarning", lang)}</div>
                <div className="font-bold text-warning text-base sm:text-lg">{fmt(s.dirty)}</div>
                <div className="text-[9px] text-muted-foreground truncate">{t("threatNotice", lang)} {s.heat.toFixed(0)}%</div>
              </div>
              <GameButton tone="warning" onClick={() => { sound.playWash(); act(wash); }} className="text-[10px] py-1.5 px-2.5 shrink-0">
                <Wind className="size-3.5" /> {t("washViaTornado", lang)} (−{Math.round(washFee(s) * 100)}%)
              </GameButton>
            </div>
          </div>
        )}
      </div>

      {/* Terminal Logs Panel */}
      <div className="panel scanlines flex min-h-64 sm:min-h-80 flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2 font-mono text-[10px] sm:text-[11px] text-muted-foreground">
          <span className="size-2 rounded-full bg-destructive" />
          <span className="size-2 rounded-full bg-warning" />
          <span className="size-2 rounded-full bg-primary" />
          <span className="ml-2 truncate">{t("rootTerminal", lang)}</span>
        </div>
        <div ref={logRef} className="h-64 sm:h-96 flex-1 space-y-1 overflow-y-auto p-2.5 sm:p-3 font-mono text-[11px] sm:text-xs lg:h-[28rem]">
          {s.logs.map((l) => (
            <div
              key={l.id}
              className={cn(
                "break-words",
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
