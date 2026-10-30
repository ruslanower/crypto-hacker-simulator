import { useState } from "react";
import { Lock, Snowflake } from "lucide-react";
import { MILESTONE_STEP, UPGRADES, type UpgradeType } from "@/game/data";
import {
  buyUpgrade, coolingPower, fmt, getLevel, heatGeneration, milestoneMultiplier, ownedCount, purgeFans, upgradeCost, type GameState,
} from "@/game/engine";
import { cn } from "@/lib/utils";
import { GameButton, ICONS, Meter, SectionTitle } from "./ui";

const TABS: { id: UpgradeType; label: string; unit: (n: number) => string }[] = [
  { id: "software", label: "Софт · пасив", unit: (n) => `+${fmt(n)}/с` },
  { id: "hardware", label: "Залізо · тап", unit: (n) => `+${fmt(n)} за тап` },
  { id: "cooling", label: "Охолодження", unit: (n) => `−${n.toFixed(1)}°C/с` },
];

export function ShopTab({ s, act }: { s: GameState; act: (fn: (s: GameState) => GameState) => void }) {
  const [tab, setTab] = useState<UpgradeType>("software");
  const level = getLevel(s.runEarned);
  const current = TABS.find((t) => t.id === tab)!;
  const net = heatGeneration(s) - coolingPower(s);

  return (
    <div>
      <SectionTitle hint="Кожні 25 одиниць подвоюють віддачу">Чорний ринок</SectionTitle>

      <div className="mb-4 flex gap-1 rounded-lg border border-border bg-muted/50 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 rounded-md px-2 py-2 text-xs font-bold uppercase tracking-wide transition-colors",
              tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab !== "software" && (
        <div className="panel mb-4 grid gap-3 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <Meter
            value={((s.temp - 35) / 70) * 100}
            tone={s.temp >= 85 ? "destructive" : s.temp >= 70 ? "warning" : "info"}
            label={`Температура ригів · ${net > 0 ? "+" : ""}${net.toFixed(2)}°C/с`}
            right={`${s.temp.toFixed(1)}°C`}
          />
          <GameButton tone="info" onClick={() => act(purgeFans)}>
            <Snowflake className="size-3.5" /> Продувка
          </GameButton>
          <p className="text-[11px] text-muted-foreground sm:col-span-2">
            Від 85°C — тротлінг: увесь дохід ×0.4. Залізо гріє, охолодження врівноважує.
          </p>
        </div>
      )}

      <div className="grid gap-2.5 md:grid-cols-2">
        {UPGRADES.filter((u) => u.type === tab).map((u) => {
          const n = ownedCount(s, u.id);
          const cost = upgradeCost(u, n);
          const locked = level < u.levelRequired;
          const afford = s.cash >= cost;
          const Icon = ICONS[u.icon] ?? ICONS.Bot;
          const nextMilestone = (Math.floor(n / MILESTONE_STEP) + 1) * MILESTONE_STEP;
          return (
            <div key={u.id} className={cn("panel flex gap-3 p-3", locked && "opacity-50")}>
              <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-md border", locked ? "border-border text-muted-foreground" : "border-primary/40 bg-primary/10 text-primary")}>
                {locked ? <Lock className="size-5" /> : <Icon className="size-6" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-bold">{u.name}</span>
                  <span className="rounded bg-muted px-1.5 font-mono text-[10px] text-primary">×{n}</span>
                </div>
                <div className="text-[11px] text-muted-foreground">{locked ? `Відкриється на рівні ${u.levelRequired}` : u.description}</div>
                {!locked && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px]">
                    <span className="text-info">{current.unit(u.power * milestoneMultiplier(n))} кожен</span>
                    {u.heatGen ? <span className="text-warning">+{u.heatGen}°C/с</span> : null}
                    <span className="text-muted-foreground">{n}/{nextMilestone} до ×2</span>
                  </div>
                )}
              </div>
              <GameButton disabled={locked || !afford} onClick={() => act((st) => buyUpgrade(st, u.id))} className="self-center flex-col gap-0 px-3">
                <span className="text-[9px] opacity-80">Купити</span>
                <span>{fmt(cost)}</span>
              </GameButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
