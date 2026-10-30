import { CheckCircle2, Lock, Palmtree, Award, Sparkles, Download, RotateCcw } from "lucide-react";
import {
  ACHIEVEMENTS, LEVEL_THRESHOLDS, PERKS, getLevelTitle, getLevelDesc, getPerkName, getPerkDesc, getAchTitle, getAchDesc,
} from "@/game/data";
import { buyPerk, fmt, getLevel, perkCost, perkLevel, prestige, prestigeGain, prestigeMultiplier, type GameState } from "@/game/engine";
import { cn } from "@/lib/utils";
import { GameButton, SectionTitle } from "./ui";
import { sound } from "@/lib/audio";
import { t, type Lang } from "@/lib/i18n";

export function DarknetTab({
  s, act, onReset, lang,
}: { s: GameState; act: (fn: (s: GameState) => GameState) => void; onReset: () => void; lang: Lang }) {
  const currentLvl = getLevel(s.runEarned);
  const gain = prestigeGain(s);
  const nextAt = Math.pow(gain + 1, 2) * 1e6;

  const onPrestige = () => {
    const msg = t("confirmPrestige", lang, {
      gain,
      pct: ((prestigeMultiplier(s) - 1) * 100).toFixed(0),
    });
    if (confirm(msg)) {
      sound.playSuccess();
      act((st) => prestige(st, Date.now()));
    }
  };

  const exportSave = () => {
    try {
      const raw = localStorage.getItem("shadow-terminal-save");
      if (!raw) return alert("No save data found.");
      navigator.clipboard.writeText(raw);
      alert(t("saveCopiedAlert", lang));
    } catch {
      alert("Clipboard error.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Reputation & Prestige Explanation */}
      <div>
        <SectionTitle hint={t("permanentBonusHint", lang, { val: ((prestigeMultiplier(s) - 1) * 100).toFixed(0) })}>
          {t("darknetRepTitle", lang)}
        </SectionTitle>
        <div className="panel grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center border-info/50 bg-info/5">
          <div>
            <div className="text-sm font-semibold text-foreground">
              {t("cleanSlateTitle", lang)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground leading-relaxed">
              💡 {t("reputationFaq", lang)}
            </div>
            <div className="mt-2 font-mono text-xs flex flex-wrap gap-4">
              <span>{t("spendableRep", lang)} <strong className="text-warning">{s.credibility} rep</strong></span>
              <span>
                {t("totalRep", lang)} <strong className="text-info">{s.credibilityTotal} rep</strong> ({t("multiplierLabel", lang, { val: prestigeMultiplier(s).toFixed(2) })})
              </span>
            </div>
            <div className="mt-1 font-mono text-[11px] text-muted-foreground">
              {t("nextRepAt", lang, { next: fmt(nextAt), cur: fmt(s.runEarned) })}
            </div>
          </div>
          <GameButton tone="warning" disabled={gain <= 0} onClick={onPrestige} className="min-w-36 py-3">
            <Palmtree className="size-4" /> {gain > 0 ? t("fleeOffshoreBtn", lang, { val: gain }) : t("fleeReq", lang, { val: fmt(1e6) })}
          </GameButton>
        </div>
      </div>

      {/* Darknet Perks */}
      <div>
        <SectionTitle>{t("perksTitle", lang)}</SectionTitle>
        <div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-3">
          {PERKS.map((p) => {
            const lvl = perkLevel(s, p.id);
            const max = lvl >= p.maxLevel;
            const cost = perkCost(p.baseCost, lvl);
            const name = getPerkName(p, lang);
            const desc = getPerkDesc(p, lang);

            return (
              <div key={p.id} className="panel flex flex-col gap-2 p-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold">{name}</span>
                  <span className="font-mono text-xs text-info font-bold">{lvl}/{p.maxLevel}</span>
                </div>
                <div className="text-[11px] text-muted-foreground">{desc}</div>
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
                  {max ? t("maxPerkLevel", lang) : t("upgradePerkBtn", lang, { cost })}
                </GameButton>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <SectionTitle hint={`${s.achievements.length}/${ACHIEVEMENTS.length}`}>{t("achievementsTitle", lang)}</SectionTitle>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((a) => {
            const got = s.achievements.includes(a.id);
            const title = getAchTitle(a, lang);
            const desc = getAchDesc(a, lang);

            return (
              <div key={a.id} className={cn("panel flex items-center gap-3 p-3", !got && "opacity-55")}>
                {got ? <Award className="size-5 shrink-0 text-primary" /> : <Lock className="size-5 shrink-0 text-muted-foreground" />}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold">{title}</div>
                  <div className="text-[11px] text-muted-foreground">{desc}</div>
                </div>
                {a.reward > 0 && <span className="font-mono text-[10px] text-warning font-bold">+{a.reward} rep</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* 15 Hacker Ranks & Slang Hierarchy (Moved to bottom of the list) */}
      <div>
        <SectionTitle hint={`${t("rankPrefix", lang)} ${currentLvl}/15`}>
          {t("ranksTitle", lang)}
        </SectionTitle>
        <p className="text-xs text-muted-foreground mb-3">{t("ranksSubtitle", lang)}</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {LEVEL_THRESHOLDS.map((thresh, idx) => {
            const lvl = idx + 1;
            const isUnlocked = currentLvl >= lvl;
            const isCurrent = currentLvl === lvl;
            const title = getLevelTitle(lvl, lang);
            const desc = getLevelDesc(lvl, lang);

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
                      {t("rankPrefix", lang)} {lvl}
                    </span>
                    <span className="text-muted-foreground">{fmt(thresh)}</span>
                  </div>
                  <div className="font-bold text-sm text-foreground">{title}</div>
                  <div className="text-[11px] text-muted-foreground mt-1 leading-snug">{desc}</div>
                </div>
                {isCurrent && (
                  <div className="mt-2 text-[10px] font-mono text-primary font-bold uppercase tracking-wider">
                    {t("currentRankBadge", lang)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Save & Reset Panel */}
      <div className="panel p-4 font-mono text-xs text-muted-foreground space-y-3">
        <div className="font-bold uppercase text-foreground">{t("saveStatsTitle", lang)}</div>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 text-[11px]">
          <span>{t("statTaps", lang)} <strong>{s.stats.taps.toLocaleString("en-US")}</strong></span>
          <span>{t("statHacks", lang)} <strong>{s.stats.hacks}</strong></span>
          <span>{t("statRaids", lang)} <strong>{s.stats.raids}</strong></span>
          <span>{t("statContracts", lang)} <strong>{s.stats.contracts}</strong></span>
          <span>{t("statEarned", lang)} <strong>{fmt(s.allTimeEarned)}</strong></span>
          <span>{t("statPrestiges", lang)} <strong>{s.stats.prestiges}</strong></span>
          <span>{t("statRank", lang)} <strong>{currentLvl}/15</strong></span>
          <span>{t("statSaved", lang)}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
          <GameButton tone="muted" onClick={exportSave} className="text-xs">
            <Download className="size-3.5" /> {t("copySaveBtn", lang)}
          </GameButton>
          <button
            type="button"
            className="flex items-center gap-1.5 text-destructive hover:underline text-xs ml-auto cursor-pointer"
            onClick={() => {
              if (confirm(t("confirmWipe", lang))) {
                onReset();
              }
            }}
          >
            <RotateCcw className="size-3.5" /> {t("wipeSaveBtn", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
