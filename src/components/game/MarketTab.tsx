import { COINS } from "@/game/data";
import { buyCoin, fmt, sellCoin, type GameState } from "@/game/engine";
import { cn } from "@/lib/utils";
import { GameButton, SectionTitle } from "./ui";
import { sound } from "@/lib/audio";

function Spark({ data, up }: { data: number[]; up: boolean }) {
  if (data.length < 2) return <div className="h-10" />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${36 - ((v - min) / (max - min || 1)) * 32}`).join(" ");
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className={cn("h-10 w-full", up ? "text-primary" : "text-destructive")}>
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const price = (p: number) => (p < 0.01 ? `$${p.toPrecision(3)}` : p < 10 ? `$${p.toFixed(3)}` : fmt(p));

export function MarketTab({ s, act }: { s: GameState; act: (fn: (s: GameState) => GameState) => void }) {
  return (
    <div>
      <SectionTitle hint="Ціни оновлюються кожні 5с">Біржа</SectionTitle>
      <p className="mb-4 text-xs text-muted-foreground">Купуй на просадці, продавай на піку. Мем-коїни можуть злетіти або обвалитись у рази.</p>
      <div className="grid gap-2.5 md:grid-cols-2">
        {s.coins.map((c) => {
          const def = COINS.find((d) => d.symbol === c.symbol)!;
          const first = c.history[Math.max(0, c.history.length - 12)] ?? c.price;
          const ch = ((c.price - first) / first) * 100;
          const h = s.holdings[c.symbol];
          const value = h ? h.amount * c.price : 0;
          const pnl = h ? value - h.amount * h.avgCost : 0;
          return (
            <div key={c.symbol} className="panel p-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold">{c.symbol}</span> <span className="text-xs text-muted-foreground">{def.name}</span>
                </div>
                <div className="text-right font-mono">
                  <div className="text-sm font-bold">{price(c.price)}</div>
                  <div className={cn("text-[10px]", ch >= 0 ? "text-primary" : "text-destructive")}>{ch >= 0 ? "+" : ""}{ch.toFixed(2)}%</div>
                </div>
              </div>
              <Spark data={c.history} up={ch >= 0} />
              {h && (
                <div className="mt-1 flex justify-between font-mono text-[10px]">
                  <span className="text-muted-foreground">Позиція {fmt(value)}</span>
                  <span className={pnl >= 0 ? "text-primary" : "text-destructive"}>{pnl >= 0 ? "+" : ""}{fmt(pnl)}</span>
                </div>
              )}
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                <GameButton
                  tone="info"
                  disabled={s.cash < 10}
                  onClick={() => {
                    sound.playBuy();
                    act((st) => buyCoin(st, c.symbol, st.cash * 0.25));
                  }}
                >
                  25%
                </GameButton>
                <GameButton
                  tone="info"
                  disabled={s.cash < 10}
                  onClick={() => {
                    sound.playBuy();
                    act((st) => buyCoin(st, c.symbol, st.cash));
                  }}
                >
                  Все
                </GameButton>
                <GameButton
                  tone="warning"
                  disabled={!h}
                  onClick={() => {
                    if (pnl >= 0) sound.playSuccess();
                    else sound.playTap(0.8);
                    act((st) => sellCoin(st, c.symbol));
                  }}
                >
                  Продати
                </GameButton>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
