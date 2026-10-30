import { Lock, ShieldOff, Wind, Crosshair, Clock } from "lucide-react";
import { TARGETS, getTargetTitle, getTargetRef } from "@/game/data";
import { bribe, bribeCost, fmt, getLevel, hackGasCost, prestigeMultiplier, wash, washFee, type GameState } from "@/game/engine";
import { cn } from "@/lib/utils";
import { GameButton, Meter, SectionTitle, formatDuration } from "./ui";
import { sound } from "@/lib/audio";
import { t, type Lang } from "@/lib/i18n";

export function OpsTab({
  s, act, now, onStart, lang,
}: { s: GameState; act: (fn: (s: GameState) => GameState) => void; now: number; onStart: (id: string) => void; lang: Lang }) {
  const level = getLevel(s.runEarned);

  return (
    <div>
      <SectionTitle hint={`${t("gasLabel", lang)} ${s.gas} Gwei`}>{t("operationsTitle", lang)}</SectionTitle>

      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <div className="panel p-3">
          <Meter
            value={s.heat}
            tone={s.heat > 75 ? "destructive" : s.heat > 45 ? "warning" : "primary"}
            label={t("fbiPoliceThreat", lang)}
            right={`${s.heat.toFixed(0)}%`}
          />
          <p className="mt-2 text-[11px] text-muted-foreground">{t("raid100Warning", lang)}</p>
          <GameButton
            tone="destructive"
            className="mt-2 w-full"
            disabled={s.cash < bribeCost(s) || s.heat <= 0}
            onClick={() => {
              sound.playTap(0.9);
              act(bribe);
            }}
          >
            <ShieldOff className="size-3.5" /> {t("wipeTraces", lang)} · {fmt(bribeCost(s))}
          </GameButton>
        </div>

        <div className="panel p-3">
          <div className="font-mono text-[10px] uppercase text-muted-foreground">{t("dirtyCryptoWarning", lang)}</div>
          <div className="text-xl font-bold text-warning">{fmt(s.dirty)}</div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {t("mixerFeeDesc", lang, { fee: `${Math.round(washFee(s) * 100)}` })}
            {s.gas > 150 ? " (High gas!)" : ""}
          </p>
          <GameButton
            tone="warning"
            className="mt-2 w-full"
            disabled={s.dirty <= 0}
            onClick={() => {
              sound.playWash();
              act(wash);
            }}
          >
            <Wind className="size-3.5" /> {t("washAllTornado", lang)}
          </GameButton>
        </div>
      </div>

      <div className="grid gap-2.5 md:grid-cols-2">
        {TARGETS.map((target) => {
          const locked = level < target.requiredLevel;
          const cd = Math.max(0, ((s.cooldowns[target.id] ?? 0) - now) / 1000);
          const gas = hackGasCost(s, target.requiredLevel);
          const can = !locked && cd <= 0 && s.cash >= gas;
          const title = getTargetTitle(target, lang);
          const reference = getTargetRef(target, lang);

          return (
            <div key={target.id} className={cn("panel p-3", locked && "opacity-50")}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold">{title}</div>
                  <div className="text-[11px] text-muted-foreground">{reference}</div>
                </div>
                <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-info">
                  LVL {target.requiredLevel}
                </span>
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-[10px]">
                <div>
                  <div className="text-muted-foreground">{t("lootLabel", lang)}</div>
                  <div className="text-primary font-bold">~{fmt(target.loot * prestigeMultiplier(s))}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">{t("threatLabel", lang)}</div>
                  <div className="text-destructive font-bold">+{target.heat}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">{t("hackTypeLabel", lang)}</div>
                  <div>{target.rounds}×{target.seqLength}{target.hidden ? " 👁" : ""}</div>
                </div>
              </div>

              <GameButton
                className="mt-3 w-full"
                tone={cd > 0 ? "muted" : "primary"}
                disabled={!can}
                onClick={() => onStart(target.id)}
              >
                {locked ? (
                  <><Lock className="size-3.5" /> {t("levelRequiredBtn", lang, { lvl: target.requiredLevel })}</>
                ) : cd > 0 ? (
                  <><Clock className="size-3.5" /> {formatDuration(cd)}</>
                ) : (
                  <><Crosshair className="size-3.5" /> {t("attackBtn", lang, { val: fmt(gas) })}</>
                )}
              </GameButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
