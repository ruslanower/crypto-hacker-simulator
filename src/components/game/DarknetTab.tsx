import { CheckCircle2, Lock, Palmtree } from "lucide-react";
import { ACHIEVEMENTS, LEVEL_THRESHOLDS, PERKS } from "@/game/data";
import { buyPerk, fmt, perkCost, perkLevel, prestige, prestigeGain, prestigeMultiplier, type GameState } from "@/game/engine";
import { cn } from "@/lib/utils";
import { GameButton, SectionTitle } from "./ui";

export function DarknetTab({ s, act, onReset }: { s: GameState; act: (fn: (s: GameState) => GameState) => void; onReset: () => void }) {
  const gain = prestigeGain(s);
  const nextAt = Math.pow(gain + 1, 2) * 1e6;

  return (
    <div className="space-y-6">
      <div>
        <SectionTitle hint={`Множник ×${prestigeMultiplier(s).toFixed(2)}`}>Репутація даркнету</SectionTitle>
        <div className="panel grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="text-sm">Операція «Чистий аркуш» — зникнути, скинути гроші й апгрейди, але отримати репутацію.</div>
            <div className="mt-2 font-mono text-xs text-muted-foreground">
              Кожне очко: +5% до всього доходу назавжди і валюта для перків. Наступне очко на {fmt(nextAt)} за забіг (зараз {fmt(s.runEarned)}).
            </div>
            <div className="mt-1 font-mono text-xs">Доступно до витрат: <span className="text-warning">{s.credibility} реп.</span></div>
          </div>
          <GameButton tone="warning" disabled={gain <= 0} onClick={() => { if (confirm(`Скинути прогрес і отримати +${gain} репутації?`)) act((st) => prestige(st, Date.now())); }}>
            <Palmtree className="size-4" /> {gain > 0 ? `+${gain} реп.` : `Потрібно ${fmt(1e6)}`}
          </GameButton>
        </div>
      </div>

      <div>
        <SectionTitle>Перки</SectionTitle>
        <div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-3">
          {PERKS.map((p) => {
            const lvl = perkLevel(s, p.id);
            const max = lvl >= p.maxLevel;
            const cost = perkCost(p.baseCost, lvl);
            return (
              <div key={p.id} className="panel flex flex-col gap-2 p-3">
                <div className="flex justify-between"><span className="font-bold">{p.name}</span><span className="font-mono text-xs text-info">{lvl}/{p.maxLevel}</span></div>
                <div className="text-[11px] text-muted-foreground">{p.description}</div>
                <div className="flex gap-0.5">
                  {Array.from({ length: p.maxLevel }).map((_, i) => <div key={i} className={cn("h-1 flex-1 rounded-full", i < lvl ? "bg-info" : "bg-muted")} />)}
                </div>
                <GameButton tone="info" disabled={max || s.credibility < cost} onClick={() => act((st) => buyPerk(st, p.id))}>
                  {max ? "Максимум" : `Покращити · ${cost} реп.`}
                </GameButton>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <SectionTitle hint={`${s.achievements.length}/${ACHIEVEMENTS.length}`}>Досягнення</SectionTitle>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((a) => {
            const got = s.achievements.includes(a.id);
            return (
              <div key={a.id} className={cn("panel flex items-center gap-3 p-3", !got && "opacity-55")}>
                {got ? <CheckCircle2 className="size-5 shrink-0 text-primary" /> : <Lock className="size-5 shrink-0 text-muted-foreground" />}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold">{a.title}</div>
                  <div className="text-[11px] text-muted-foreground">{a.description}</div>
                </div>
                {a.reward > 0 && <span className="font-mono text-[10px] text-warning">+{a.reward}</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="panel p-4 font-mono text-xs text-muted-foreground">
        <div className="mb-2 font-bold uppercase text-foreground">Статистика</div>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
          <span>Тапів: {s.stats.taps.toLocaleString("en-US")}</span>
          <span>Зламів: {s.stats.hacks}</span>
          <span>Облав: {s.stats.raids}</span>
          <span>Контрактів: {s.stats.contracts}</span>
          <span>Усього зароблено: {fmt(s.allTimeEarned)}</span>
          <span>Зникнень: {s.stats.prestiges}</span>
          <span>Рівнів: {LEVEL_THRESHOLDS.length}</span>
        </div>
        <button type="button" className="mt-3 text-destructive hover:underline" onClick={() => { if (confirm("Стерти весь прогрес назавжди?")) onReset(); }}>
          Стерти збереження
        </button>
      </div>
    </div>
  );
}
