import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bitcoin, Crosshair, Moon, ScrollText, ShoppingCart, Skull, Terminal, Thermometer, Siren, Fish, Flame } from "lucide-react";
import { useGame } from "@/game/useGame";
import { LEVEL_THRESHOLDS, LEVEL_TITLES, TARGETS } from "@/game/data";
import { cashPerSecond, fmt, getLevel, isThrottling, perkLevel, resolveCrisis, resolveHack, startHack, type GameState } from "@/game/engine";
import { cn } from "@/lib/utils";
import { TerminalTab } from "@/components/game/TerminalTab";
import { ShopTab } from "@/components/game/ShopTab";
import { OpsTab } from "@/components/game/OpsTab";
import { MarketTab } from "@/components/game/MarketTab";
import { ContractsTab } from "@/components/game/ContractsTab";
import { DarknetTab } from "@/components/game/DarknetTab";
import { HackModal } from "@/components/game/HackModal";
import { GameButton, Meter, formatDuration } from "@/components/game/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crypto Hacker Simulator — кібер-клікер" },
      { name: "description", content: "Хакерський idle-клікер: ботнети, DeFi-злами, відмивання крипти, біржа та репутація даркнету." },
      { property: "og:title", content: "Crypto Hacker Simulator" },
      { property: "og:description", content: "Збудуй кібер-синдикат: від скрипт-кідді до легенди даркнету." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Game,
});

type Tab = "terminal" | "shop" | "ops" | "contracts" | "market" | "darknet";
const NAV: { id: Tab; label: string; icon: typeof Terminal }[] = [
  { id: "terminal", label: "Термінал", icon: Terminal },
  { id: "shop", label: "Апгрейди", icon: ShoppingCart },
  { id: "ops", label: "Операції", icon: Crosshair },
  { id: "contracts", label: "Контракти", icon: ScrollText },
  { id: "market", label: "Біржа", icon: Bitcoin },
  { id: "darknet", label: "Даркнет", icon: Skull },
];

function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(iv);
  }, []);
  return now;
}

function Game() {
  const { state, act, offline, dismissOffline, reset } = useGame();
  const [tab, setTab] = useState<Tab>("terminal");
  const [hackId, setHackId] = useState<string | null>(null);
  const now = useNow();

  if (!state) {
    return <div className="flex min-h-screen items-center justify-center font-mono text-primary animate-pulse">Підключення до TOR...</div>;
  }
  const s = state;

  const startOp = (id: string) => {
    const next = startHack(s, id, Date.now());
    if (next) {
      act(() => next);
      setHackId(id);
    }
  };
  const hackTarget = TARGETS.find((t) => t.id === hackId);
  const claimable = s.contracts.filter((c) => !c.claimed && false).length;
  void claimable;

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row lg:gap-6 lg:p-6">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-6 space-y-4">
          <Logo />
          <nav className="space-y-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setTab(n.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold uppercase tracking-wide transition-colors",
                  tab === n.id ? "bg-primary text-primary-foreground glow-box" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <n.icon className="size-4" /> {n.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
        <div className="flex items-center justify-between px-4 pt-4 lg:hidden"><Logo /></div>
        <StatBar s={s} />
        <CrisisBanner s={s} now={now} act={act} />
        <main className="flex-1 p-4 lg:px-0">
          {tab === "terminal" && <TerminalTab s={s} act={act} />}
          {tab === "shop" && <ShopTab s={s} act={act} />}
          {tab === "ops" && <OpsTab s={s} act={act} now={now} onStart={startOp} />}
          {tab === "contracts" && <ContractsTab s={s} act={act} now={now} />}
          {tab === "market" && <MarketTab s={s} act={act} />}
          {tab === "darknet" && <DarknetTab s={s} act={act} onReset={reset} />}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-border bg-card/95 backdrop-blur lg:hidden">
        {NAV.map((n) => (
          <button key={n.id} type="button" onClick={() => setTab(n.id)} className={cn("flex flex-col items-center gap-0.5 py-2 text-[9px] font-bold uppercase", tab === n.id ? "text-primary" : "text-muted-foreground")}>
            <n.icon className="size-5" />
            {n.label}
          </button>
        ))}
      </nav>

      {hackTarget && (
        <HackModal
          target={hackTarget}
          bonusSec={perkLevel(s, "hacker")}
          onDone={(ok) => {
            const id = hackTarget.id;
            setHackId(null);
            act((st) => resolveHack(st, id, ok, Math.random()));
          }}
        />
      )}

      {offline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm">
          <div className="panel w-full max-w-sm p-6 text-center">
            <Moon className="mx-auto size-10 text-info" />
            <div className="mt-3 text-lg font-bold">Поки тебе не було</div>
            <div className="mt-1 text-sm text-muted-foreground">Ботнет працював {formatDuration(offline.seconds)} на половині потужності</div>
            <div className="mt-3 text-3xl font-bold text-primary glow-text">+{fmt(offline.earned)}</div>
            <GameButton className="mt-5 w-full" onClick={dismissOffline}>Забрати</GameButton>
          </div>
        </div>
      )}
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Skull className="size-7 text-primary" />
      <div className="leading-none">
        <div className="text-lg font-bold tracking-widest text-primary glow-text">CRYPTO</div>
        <div className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">HACKER SIM</div>
      </div>
    </div>
  );
}

function StatBar({ s }: { s: GameState }) {
  const level = getLevel(s.runEarned);
  const cur = LEVEL_THRESHOLDS[level - 1];
  const next = LEVEL_THRESHOLDS[level];
  const pct = next ? ((s.runEarned - cur) / (next - cur)) * 100 : 100;
  const throttling = isThrottling(s);
  return (
    <div className="panel mx-4 mt-4 grid gap-3 p-4 lg:mx-0 lg:mt-0">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase text-muted-foreground">Чисті кошти</div>
          <div className="text-3xl font-bold text-primary glow-text">{fmt(s.cash)}</div>
          <div className="font-mono text-xs text-info">+{fmt(cashPerSecond(s))}/с{throttling && <span className="ml-2 text-destructive">ТРОТЛІНГ ×0.4</span>}</div>
        </div>
        <div className="flex gap-4 font-mono text-xs">
          <div><div className="text-[10px] uppercase text-muted-foreground">Брудні</div><div className="font-bold text-warning">{fmt(s.dirty)}</div></div>
          <div><div className="text-[10px] uppercase text-muted-foreground">Репутація</div><div className="font-bold text-info">{s.credibility}</div></div>
          <div className="flex items-center gap-1"><Thermometer className={cn("size-4", throttling ? "text-destructive" : "text-info")} /><span className={throttling ? "text-destructive" : ""}>{s.temp.toFixed(0)}°C</span></div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Meter value={pct} tone="primary" label={`LVL ${level} · ${LEVEL_TITLES[level - 1]}`} right={next ? `${fmt(s.runEarned)} / ${fmt(next)}` : "MAX"} />
        <Meter value={s.heat} tone={s.heat > 75 ? "destructive" : s.heat > 45 ? "warning" : "muted"} label="Загроза" right={`${s.heat.toFixed(0)}%`} />
      </div>
    </div>
  );
}

function CrisisBanner({ s, now, act }: { s: GameState; now: number; act: (fn: (s: GameState) => GameState) => void }) {
  const c = s.crisis;
  if (!c) return null;
  const left = (c.endsAt - now) / 1000;
  const info = {
    police: { icon: Siren, title: "Ордер на обшук!", text: "Кіберполіція вийшла на слід. Підкупи інформатора, або буде облава.", btn: `Підкупити · ${fmt(c.cost)}`, tone: "destructive" as const },
    overheat: { icon: Flame, title: "Пожежа в серверній!", text: "Проводка плавиться. Виклич техніка, або риги згорять у тротлінг.", btn: `Техніка · ${fmt(c.cost)}`, tone: "warning" as const },
    whale: { icon: Fish, title: "Кит у мемпулі!", text: "Велика транзакція без захисту. Встигни перехопити!", btn: `Перехопити +${fmt(c.reward)}`, tone: "primary" as const },
  }[c.type];
  return (
    <div className={cn("panel mx-4 mt-3 flex flex-wrap items-center gap-3 border-2 p-3 lg:mx-0", c.type === "whale" ? "border-primary glow-box" : "border-destructive glow-danger")}>
      <info.icon className={cn("size-7 animate-pulse", c.type === "whale" ? "text-primary" : "text-destructive")} />
      <div className="min-w-0 flex-1">
        <div className="font-bold">{info.title} <span className="font-mono text-xs text-muted-foreground">· {formatDuration(left)}</span></div>
        <div className="text-xs text-muted-foreground">{info.text}</div>
      </div>
      <GameButton tone={info.tone} disabled={c.type !== "whale" && s.cash < c.cost} onClick={() => act(resolveCrisis)}>{info.btn}</GameButton>
    </div>
  );
}
