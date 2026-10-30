import { CheckCircle2 } from "lucide-react";
import { claimContract, contractProgress, fmt, type Contract, type GameState } from "@/game/engine";
import { GameButton, Meter, SectionTitle, formatDuration } from "./ui";
import { sound } from "@/lib/audio";
import { t, type Lang } from "@/lib/i18n";

function label(c: Contract, lang: Lang) {
  switch (c.kind) {
    case "taps":
      return t("goalTaps", lang, { goal: c.goal });
    case "earn":
      return t("goalEarn", lang, { goal: fmt(c.goal) });
    case "hacks":
      return t("goalHacks", lang, {
        goal: c.goal,
        targets: c.goal === 1 ? t("targetWordSingle", lang) : t("targetWordPlural", lang),
      });
    case "wash":
      return t("goalWash", lang, { goal: fmt(c.goal) });
    case "buy":
      return t("goalBuy", lang, { goal: c.goal });
  }
}

export function ContractsTab({
  s, act, now, lang,
}: { s: GameState; act: (fn: (s: GameState) => GameState) => void; now: number; lang: Lang }) {
  const timeLeft = formatDuration((s.contractsRefreshAt - now) / 1000);

  return (
    <div>
      <SectionTitle hint={t("refreshIn", lang, { time: timeLeft })}>
        {t("contractsTitle", lang)}
      </SectionTitle>
      <p className="mb-4 text-xs text-muted-foreground">{t("contractsSubtitle", lang)}</p>

      <div className="grid gap-2.5 md:grid-cols-3">
        {s.contracts.map((c) => {
          const p = contractProgress(s, c);
          const done = p >= c.goal;
          return (
            <div key={c.id} className="panel flex flex-col gap-3 p-4">
              <div className="font-bold text-sm">{label(c, lang)}</div>
              <Meter
                value={(p / c.goal) * 100}
                tone={done ? "primary" : "info"}
                label={t("contractProgress", lang)}
                right={c.kind === "earn" || c.kind === "wash" ? `${fmt(p)} / ${fmt(c.goal)}` : `${Math.floor(p)} / ${c.goal}`}
              />
              <div className="font-mono text-xs text-muted-foreground">
                {t("rewardLabel", lang)} <span className="text-primary font-bold">{fmt(c.reward)}</span>
              </div>
              {c.claimed ? (
                <div className="flex items-center justify-center gap-1.5 py-2 font-mono text-xs text-primary font-bold">
                  <CheckCircle2 className="size-4" /> {t("completedStatus", lang)}
                </div>
              ) : (
                <GameButton
                  disabled={!done}
                  onClick={() => {
                    sound.playSuccess();
                    act((st) => claimContract(st, c.id));
                  }}
                >
                  {t("claimBtn", lang)}
                </GameButton>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
