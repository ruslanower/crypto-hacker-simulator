import { Lock, ShieldOff, Wind, Crosshair, Clock } from "lucide-react";
import { TARGETS } from "@/game/data";
import { bribe, bribeCost, fmt, getLevel, hackGasCost, prestigeMultiplier, wash, washFee, type GameState } from "@/game/engine";
import { cn } from "@/lib/utils";
import { GameButton, Meter, SectionTitle, formatDuration } from "./ui";
import { sound } from "@/lib/audio";

export function OpsTab({ s, act, now, onStart }: { s: GameState; act: (fn: (s: GameState) => GameState) => void; now: number; onStart: (id: string) => void }) {
  const level = getLevel(s.runEarned);

  return (
    <div>
      <SectionTitle hint={`Газ: ${s.gas} Gwei`}>Операції</SectionTitle>

      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <div className="panel p-3">
          <Meter value={s.heat} tone={s.heat > 75 ? "destructive" : s.heat > 45 ? "warning" : "primary"} label="Загроза кіберполіції" right={`${s.heat.toFixed(0)}%`} />
          <p className="mt-2 text-[11px] text-muted-foreground">На 100% — облава: −70% брудних і −10% чистих грошей.</p>
          <GameButton
            tone="destructive"
            className="mt-2 w-full"
            disabled={s.cash < bribeCost(s) || s.heat <= 0}
            onClick={() => {
              sound.playTap(0.9);
              act(bribe);
            }}
          >
            <ShieldOff className="size-3.5" /> Замести сліди · {fmt(bribeCost(s))}
          </GameButton>
        </div>
        <div className="panel p-3">
          <div className="font-mono text-[10px] uppercase text-muted-foreground">Брудна крипта</div>
          <div className="text-xl font-bold text-warning">{fmt(s.dirty)}</div>
          <p className="mt-1 text-[11px] text-muted-foreground">Комісія міксера {Math.round(washFee(s) * 100)}%{s.gas > 150 ? " (дорогий газ!)" : ""}. Відмивання знижує загрозу на 25%.</p>
          <GameButton
            tone="warning"
            className="mt-2 w-full"
            disabled={s.dirty <= 0}
            onClick={() => {
              sound.playWash();
              act(wash);
            }}
          >
            <Wind className="size-3.5" /> Відмити через Tornado Cash
          </GameButton>
        </div>
      </div>

      <div className="grid gap-2.5 md:grid-cols-2">
        {TARGETS.map((t) => {
          const locked = level < t.requiredLevel;
          const cd = Math.max(0, ((s.cooldowns[t.id] ?? 0) - now) / 1000);
          const gas = hackGasCost(s, t.requiredLevel);
          const can = !locked && cd <= 0 && s.cash >= gas;
          return (
            <div key={t.id} className={cn("panel p-3", locked && "opacity-50")}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold">{t.title}</div>
                  <div className="text-[11px] text-muted-foreground">{t.reference}</div>
                </div>
                <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-info">LVL {t.requiredLevel}</span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-[10px]">
                <div><div className="text-muted-foreground">Здобич</div><div className="text-primary">~{fmt(t.loot * prestigeMultiplier(s))}</div></div>
                <div><div className="text-muted-foreground">Загроза</div><div className="text-destructive">+{t.heat}%</div></div>
                <div><div className="text-muted-foreground">Злом</div><div>{t.rounds}×{t.seqLength}{t.hidden ? " 👁" : ""}</div></div>
              </div>
              <GameButton className="mt-3 w-full" tone={cd > 0 ? "muted" : "primary"} disabled={!can} onClick={() => onStart(t.id)}>
                {locked ? <><Lock className="size-3.5" /> Рівень {t.requiredLevel}</> : cd > 0 ? <><Clock className="size-3.5" /> {formatDuration(cd)}</> : <><Crosshair className="size-3.5" /> Атакувати · газ {fmt(gas)}</>}
              </GameButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
