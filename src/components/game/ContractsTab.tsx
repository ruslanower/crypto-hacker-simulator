import { CheckCircle2 } from "lucide-react";
import { claimContract, contractProgress, fmt, type Contract, type GameState } from "@/game/engine";
import { GameButton, Meter, SectionTitle, formatDuration } from "./ui";

function label(c: Contract) {
  switch (c.kind) {
    case "taps": return `Зробити ${c.goal} тапів`;
    case "earn": return `Заробити ${fmt(c.goal)}`;
    case "hacks": return `Успішно зламати ${c.goal} ${c.goal === 1 ? "ціль" : "цілі"}`;
    case "wash": return `Відмити ${fmt(c.goal)}`;
    case "buy": return `Купити ${c.goal} апгрейдів`;
  }
}

export function ContractsTab({ s, act, now }: { s: GameState; act: (fn: (s: GameState) => GameState) => void; now: number }) {
  return (
    <div>
      <SectionTitle hint={`Нові через ${formatDuration((s.contractsRefreshAt - now) / 1000)}`}>Контракти</SectionTitle>
      <p className="mb-4 text-xs text-muted-foreground">Замовлення з даркнету. Оновлюються кожні 15 хвилин — забирай нагороду до оновлення.</p>
      <div className="grid gap-2.5 md:grid-cols-3">
        {s.contracts.map((c) => {
          const p = contractProgress(s, c);
          const done = p >= c.goal;
          return (
            <div key={c.id} className="panel flex flex-col gap-3 p-4">
              <div className="font-bold">{label(c)}</div>
              <Meter value={(p / c.goal) * 100} tone={done ? "primary" : "info"} label="Прогрес" right={c.kind === "earn" || c.kind === "wash" ? `${fmt(p)} / ${fmt(c.goal)}` : `${Math.floor(p)} / ${c.goal}`} />
              <div className="font-mono text-xs text-muted-foreground">Нагорода: <span className="text-primary">{fmt(c.reward)}</span></div>
              {c.claimed ? (
                <div className="flex items-center justify-center gap-1.5 py-2 font-mono text-xs text-primary"><CheckCircle2 className="size-4" /> Виконано</div>
              ) : (
                <GameButton disabled={!done} onClick={() => act((st) => claimContract(st, c.id))}>Забрати</GameButton>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
