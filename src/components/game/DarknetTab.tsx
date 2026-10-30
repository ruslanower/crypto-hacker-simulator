import { CheckCircle2, Lock, Palmtree, Award, ShieldAlert, Sparkles, Download, RotateCcw } from "lucide-react";
import { ACHIEVEMENTS, LEVEL_DESCRIPTIONS, LEVEL_THRESHOLDS, LEVEL_TITLES, PERKS } from "@/game/data";
import { buyPerk, fmt, getLevel, perkCost, perkLevel, prestige, prestigeGain, prestigeMultiplier, type GameState } from "@/game/engine";
import { cn } from "@/lib/utils";
import { GameButton, SectionTitle } from "./ui";
import { sound } from "@/lib/audio";

export function DarknetTab({ s, act, onReset }: { s: GameState; act: (fn: (s: GameState) => GameState) => void; onReset: () => void }) {
  const currentLvl = getLevel(s.runEarned);
  const gain = prestigeGain(s);
  const nextAt = Math.pow(gain + 1, 2) * 1e6;

  const onPrestige = () => {
    if (confirm(`Виконати операцію «Чистий аркуш»?\n\nВаші гроші та залізо будуть скинуті, але ви назавжди отримаєте +${gain} репутації (+${gain * 5}% доходу назавжди)!`)) {
      sound.playSuccess();
      act((st) => prestige(st, Date.now()));
    }
  };

  const exportSave = () => {
    try {
      const raw = localStorage.getItem("shadow-terminal-save");
      if (!raw) return alert("Немає збереження для експорту.");
      navigator.clipboard.writeText(raw);
      alert("✅ Збереження скопійовано в буфер обміну! Збережіть його в надійному місці.");
    } catch {
      alert("Помилка копіювання.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Reputation & Prestige Explanation */}
      <div>
        <SectionTitle hint={`Постійний бонус доходу: +${((prestigeMultiplier(s) - 1) * 100).toFixed(0)}%`}>
          Репутація в Даркнеті
        </SectionTitle>
        <div className="panel grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center border-info/50 bg-info/5">
          <div>
            <div className="text-sm font-semibold text-foreground">
              Операція «Чистий аркуш» — спалити паспорти та зникнути в офшорах
            </div>
            <div className="mt-2 text-xs text-muted-foreground leading-relaxed">
              💡 <strong>Навіщо потрібна репутація:</strong> Кожен 1 бал репутації дає <span className="text-primary font-bold">+5% перманентного бусту</span> до абсолютно всього доходу (кліки та ботнети) назавжди, навіть після нового старту! Також це валюта для купівлі елітних перків.
            </div>
            <div className="mt-2 font-mono text-xs flex flex-wrap gap-4">
              <span>Доступно до витрат: <strong className="text-warning">{s.credibility} реп.</strong></span>
              <span>Загалом накопичено: <strong className="text-info">{s.credibilityTotal} реп.</strong> (множник ×{prestigeMultiplier(s).toFixed(2)})</span>
            </div>
            <div className="mt-1 font-mono text-[11px] text-muted-foreground">
              Наступний бал репутації на {fmt(nextAt)} заробітку (зараз {fmt(s.runEarned)}).
            </div>
          </div>
          <GameButton tone="warning" disabled={gain <= 0} onClick={onPrestige} className="min-w-36 py-3">
            <Palmtree className="size-4" /> {gain > 0 ? `+${gain} репутації` : `Потрібно ${fmt(1e6)}`}
          </GameButton>
        </div>
      </div>

      {/* 15 Hacker Ranks & Slang Hierarchy */}
      <div>
        <SectionTitle hint={`Поточний: Рівень ${currentLvl}/15`}>Тіньова ієрархія (15 рангів)</SectionTitle>
        <p className="text-xs text-muted-foreground mb-3">
          Твій авторитет зростає разом із заробітком за забіг. Кожен ранг відкриває нові операції та залізо.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 max-h-96 overflow-y-auto p-1">
          {LEVEL_TITLES.map((title, idx) => {
            const lvl = idx + 1;
            const isUnlocked = currentLvl >= lvl;
            const isCurrent = currentLvl === lvl;
            const thresh = LEVEL_THRESHOLDS[idx];
            return (
              <div
                key={lvl}
                className={cn(
                  "panel p-3 flex flex-col justify-between text-xs transition-colors",
                  isCurrent ? "border-primary bg-primary/10 glow-box" : isUnlocked ? "border-border/80" : "opacity-40 border-dashed"
                )}
              >
                <div>
                  <div className="flex items-center justify-between font-mono mb-1">
                    <span className="font-bold flex items-center gap-1.5">
                      {isCurrent ? <Sparkles className="size-3.5 text-primary" /> : isUnlocked ? <CheckCircle2 className="size-3.5 text-info" /> : <Lock className="size-3.5 text-muted-foreground" />}
                      Рівень {lvl}
                    </span>
                    <span className="text-muted-foreground">{fmt(thresh)}</span>
                  </div>
                  <div className="font-bold text-sm text-foreground">{title}</div>
                  <div className="text-[11px] text-muted-foreground mt-1 leading-snug">{LEVEL_DESCRIPTIONS[idx]}</div>
                </div>
                {isCurrent && (
                  <div className="mt-2 text-[10px] font-mono text-primary font-bold uppercase tracking-wider">
                    ★ Поточний статус
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Darknet Perks */}
      <div>
        <SectionTitle>Тіньові перки (постійні бонуси)</SectionTitle>
        <div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-3">
          {PERKS.map((p) => {
            const lvl = perkLevel(s, p.id);
            const max = lvl >= p.maxLevel;
            const cost = perkCost(p.baseCost, lvl);
            return (
              <div key={p.id} className="panel flex flex-col gap-2 p-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold">{p.name}</span>
                  <span className="font-mono text-xs text-info font-bold">{lvl}/{p.maxLevel}</span>
                </div>
                <div className="text-[11px] text-muted-foreground">{p.description}</div>
                <div className="flex gap-0.5">
                  {Array.from({ length: p.maxLevel }).map((_, i) => (
                    <div key={i} className={cn("h-1 flex-1 rounded-full", i < lvl ? "bg-info" : "bg-muted")} />
                  ))}
                </div>
                <GameButton
                  tone="info"
                  disabled={max || s.credibility < cost}
                  onClick={() => {
                    sound.playBuy();
                    act((st) => buyPerk(st, p.id));
                  }}
                >
                  {max ? "Максимальний рівень" : `Покращити · ${cost} реп.`}
                </GameButton>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <SectionTitle hint={`${s.achievements.length}/${ACHIEVEMENTS.length}`}>Досягнення</SectionTitle>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((a) => {
            const got = s.achievements.includes(a.id);
            return (
              <div key={a.id} className={cn("panel flex items-center gap-3 p-3", !got && "opacity-55")}>
                {got ? <Award className="size-5 shrink-0 text-primary" /> : <Lock className="size-5 shrink-0 text-muted-foreground" />}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold">{a.title}</div>
                  <div className="text-[11px] text-muted-foreground">{a.description}</div>
                </div>
                {a.reward > 0 && <span className="font-mono text-[10px] text-warning font-bold">+{a.reward} реп.</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Save & Reset Panel */}
      <div className="panel p-4 font-mono text-xs text-muted-foreground space-y-3">
        <div className="font-bold uppercase text-foreground">Локальне збереження та статистика</div>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 text-[11px]">
          <span>Тапів: <strong>{s.stats.taps.toLocaleString("en-US")}</strong></span>
          <span>Зламів: <strong>{s.stats.hacks}</strong></span>
          <span>Облав поліції: <strong>{s.stats.raids}</strong></span>
          <span>Контрактів: <strong>{s.stats.contracts}</strong></span>
          <span>Усього зароблено: <strong>{fmt(s.allTimeEarned)}</strong></span>
          <span>Зникнень в офшори: <strong>{s.stats.prestiges}</strong></span>
          <span>Поточний рівень: <strong>{currentLvl}/15</strong></span>
          <span>Збережено: <strong>автоматично</strong></span>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
          <GameButton tone="muted" onClick={exportSave} className="text-xs">
            <Download className="size-3.5" /> Скопіювати сейв у буфер
          </GameButton>
          <button
            type="button"
            className="flex items-center gap-1.5 text-destructive hover:underline text-xs ml-auto"
            onClick={() => {
              if (confirm("УВАГА! Ви впевнені, що хочете стерти збереження та почати все спочатку?")) {
                onReset();
              }
            }}
          >
            <RotateCcw className="size-3.5" /> Стерти весь прогрес і почати спочатку
          </button>
        </div>
      </div>
    </div>
  );
}
