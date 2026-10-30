import { useState } from "react";
import { Bot, Lock, Snowflake, Flame, ShieldCheck, AlertTriangle } from "lucide-react";
import { MILESTONE_STEP, UPGRADES, type UpgradeType } from "@/game/data";
import {
  buyUpgrade, coolingPower, fmt, getLevel, heatGeneration, milestoneMultiplier, ownedCount, purgeFans, upgradeCost, type GameState,
} from "@/game/engine";
import { cn } from "@/lib/utils";
import { GameButton, ICONS, Meter, SectionTitle } from "./ui";
import { sound } from "@/lib/audio";

const TABS: { id: UpgradeType; label: string; unit: (n: number) => string }[] = [
  { id: "software", label: "Софт · Пасив", unit: (n) => `+${fmt(n)}/с` },
  { id: "hardware", label: "Залізо · Тап", unit: (n) => `+${fmt(n)} до сили тапу` },
  { id: "cooling", label: "Охолодження", unit: (n) => `−${n.toFixed(1)}°C/с` },
];

export function ShopTab({ s, act }: { s: GameState; act: (fn: (s: GameState) => GameState) => void }) {
  const [tab, setTab] = useState<UpgradeType>("software");
  const level = getLevel(s.runEarned);
  const current = TABS.find((t) => t.id === tab)!;
  const net = heatGeneration(s) - coolingPower(s);
  const isOverheating = s.temp >= 92;
  const isThrottling = s.temp >= 85;

  const onBuy = (id: string) => {
    sound.playBuy();
    act((st) => buyUpgrade(st, id));
  };

  return (
    <div>
      <SectionTitle hint="Кожні 25 одиниць одного типу подвоюють віддачу">Чорний ринок обладнання</SectionTitle>

      <div className="mb-4 flex gap-1 rounded-lg border border-border bg-muted/50 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 rounded-md px-2 py-2 text-xs font-bold uppercase tracking-wide transition-colors cursor-pointer",
              tab === t.id ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Temperature & Cooling status panel */}
      <div className={cn(
        "panel mb-4 grid gap-3 p-3.5 sm:grid-cols-[1fr_auto] sm:items-center",
        isOverheating ? "border-destructive bg-destructive/10 glow-danger" : isThrottling ? "border-warning" : "border-border"
      )}>
        <div>
          <Meter
            value={((s.temp - 35) / 70) * 100}
            tone={isOverheating ? "destructive" : isThrottling ? "warning" : "info"}
            label={`Температура серверної · Тепловий баланс: ${net > 0 ? `+${net.toFixed(2)}` : net.toFixed(2)}°C/с`}
            right={`${s.temp.toFixed(1)}°C`}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
            {isOverheating ? (
              <span className="flex items-center gap-1 font-bold text-destructive animate-pulse">
                <AlertTriangle className="size-3.5" /> КРИТИЧНИЙ ПЕРЕГРІВ! Без охолодження залізо починає згоряти!
              </span>
            ) : isThrottling ? (
              <span className="flex items-center gap-1 font-bold text-warning">
                <Flame className="size-3.5" /> ТРОТЛІНГ: частоти скинуто, весь прибуток урізано на 60%!
              </span>
            ) : (
              <span className="flex items-center gap-1 text-primary">
                <ShieldCheck className="size-3.5" /> Температура в нормі. Охолодження повністю справляється з жаром.
              </span>
            )}
          </div>
        </div>

        <GameButton tone={s.temp > 80 ? "warning" : "info"} onClick={() => { sound.playTap(1.5); act(purgeFans); }}>
          <Snowflake className="size-3.5" /> Азотна продувка
        </GameButton>

        <p className="text-[11px] text-muted-foreground sm:col-span-2 border-t border-border/60 pt-2 mt-1">
          💡 <strong>Навіщо охолодження:</strong> Потужне залізо та риги виділяють тепло. Якщо воно нагріється до 85°C — дохід впаде у 2.5 рази. Якщо триматиметься вище 92°C — найдорожче залізо може згоріти!
        </p>
      </div>

      {/* Upgrades grid */}
      <div className="grid gap-2.5 md:grid-cols-2">
        {UPGRADES.filter((u) => u.type === tab).map((u) => {
          const n = ownedCount(s, u.id);
          const cost = upgradeCost(u, n);
          const locked = level < u.levelRequired;
          const afford = s.cash >= cost;
          const Icon = ICONS[u.icon] ?? Bot;
          const nextMilestone = (Math.floor(n / MILESTONE_STEP) + 1) * MILESTONE_STEP;
          return (
            <div key={u.id} className={cn("panel flex gap-3 p-3 transition-opacity", locked && "opacity-50")}>
              <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-md border", locked ? "border-border text-muted-foreground" : "border-primary/40 bg-primary/10 text-primary")}>
                {locked ? <Lock className="size-5" /> : <Icon className="size-6" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-bold">{u.name}</span>
                  <span className="rounded bg-muted px-1.5 font-mono text-[10px] text-primary">×{n}</span>
                </div>
                <div className="text-[11px] text-muted-foreground">{locked ? `Відкривається на ${u.levelRequired}-му рівні хакера` : u.description}</div>
                {!locked && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px]">
                    <span className="text-info font-semibold">{current.unit(u.power * milestoneMultiplier(n))} кожен</span>
                    {u.heatGen ? <span className="text-warning">+{u.heatGen}°C/с</span> : null}
                    <span className="text-muted-foreground">{n}/{nextMilestone} до ×2</span>
                  </div>
                )}
              </div>
              <GameButton disabled={locked || !afford} onClick={() => onBuy(u.id)} className="self-center flex-col gap-0 px-3 min-w-20">
                <span className="text-[9px] opacity-80">{locked ? "Блок" : "Купити"}</span>
                <span>{fmt(cost)}</span>
              </GameButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
