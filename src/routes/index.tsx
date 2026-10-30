import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bitcoin, Crosshair, Moon, ScrollText, ShoppingCart, Skull, Terminal, Thermometer, Siren, Fish, Flame, Volume2, VolumeX, ShieldAlert
} from "lucide-react";
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
import { sound } from "@/lib/audio";

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
  const [audioEnabled, setAudioEnabled] = useState(sound.enabled);
  const now = useNow();

  const toggleSound = () => {
    const next = sound.toggle();
    setAudioEnabled(next);
  };

  if (!state) {
    return <div className="flex min-h-screen items-center justify-center font-mono text-primary animate-pulse">Підключення до захищеної мережі TOR...</div>;
  }
  const s = state;

  const startOp = (id: string) => {
    const next = startHack(s, id, Date.now());
    if (next) {
      sound.playTap(1.4);
      act(() => next);
      setHackId(id);
    }
  };
  const hackTarget = TARGETS.find((t) => t.id === hackId);

  const switchTab = (newTab: Tab) => {
    sound.playTap(1.1);
    setTab(newTab);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row lg:gap-6 lg:p-6">
      {/* Desktop Sidebar */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-6 space-y-4">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={toggleSound}
              title={audioEnabled ? "Вимкнути звук" : "Увімкнути звук"}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {audioEnabled ? <Volume2 className="size-4 text-primary" /> : <VolumeX className="size-4" />}
            </button>
          </div>
          <nav className="space-y-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => switchTab(n.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold uppercase tracking-wide transition-colors cursor-pointer",
                  tab === n.id ? "bg-primary text-primary-foreground glow-box" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <n.icon className="size-4" /> {n.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
        <div className="flex items-center justify-between px-4 pt-4 lg:hidden">
          <Logo />
          <button
            type="button"
            onClick={toggleSound}
            title={audioEnabled ? "Вимкнути звук" : "Увімкнути звук"}
            className="p-1.5 rounded-md border border-border bg-card/60 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {audioEnabled ? <Volume2 className="size-4 text-primary" /> : <VolumeX className="size-4" />}
          </button>
        </div>

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

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-border bg-card/95 backdrop-blur lg:hidden">
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => switchTab(n.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 py-2 text-[8px] font-bold uppercase transition-colors",
              tab === n.id ? "text-primary" : "text-muted-foreground"
            )}
          >
            <n.icon className="size-4" />
            <span className="truncate max-w-[50px]">{n.label}</span>
          </button>
        ))}
      </nav>

      {/* Hack Modal */}
      {hackTarget && (
        <HackModal
          target={hackTarget}
          bonusSec={perkLevel(s, "hacker") * 1.5}
          onDone={(ok) => {
            const id = hackTarget.id;
            setHackId(null);
            act((st) => resolveHack(st, id, ok, Math.random()));
          }}
        />
      )}

      {/* Offline Earnings Dialog */}
      {offline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm">
          <div className="panel w-full max-w-sm p-6 text-center border-primary/40 glow-box">
            <Moon className="mx-auto size-10 text-info animate-pulse" />
            <div className="mt-3 text-lg font-bold text-foreground">Поки ти був офлайн</div>
            <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Ботнет непомітно працював у фоні {formatDuration(offline.seconds)}
            </div>
            <div className="mt-3 text-3xl font-bold text-primary glow-text">+{fmt(offline.earned)}</div>
            <GameButton
              className="mt-5 w-full"
              onClick={() => {
                sound.playSuccess();
                dismissOffline();
              }}
            >
              Забрати крипту
            </GameButton>
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
        <div className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground">HACKER SIM</div>
      </div>
    </div>
  );
}

function StatBar({ s }: { s: GameState }) {
  const level = getLevel(s.runEarned);
  const cur = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const next = LEVEL_THRESHOLDS[level];
  const pct = next ? ((s.runEarned - cur) / (next - cur)) * 100 : 100;
  const throttling = isThrottling(s);
  const isOverheating = s.temp >= 92;

  return (
    <div className="panel mx-4 mt-4 grid gap-3 p-4 lg:mx-0 lg:mt-0">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase text-muted-foreground">Чистий баланс</div>
          <div className="text-3xl font-bold text-primary glow-text">{fmt(s.cash)}</div>
          <div className="font-mono text-xs text-info">
            +{fmt(cashPerSecond(s))}/с
            {throttling && <span className="ml-2 text-destructive font-bold">ТРОТЛІНГ ×0.4</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 font-mono text-xs">
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Брудні</div>
            <div className="font-bold text-warning">{fmt(s.dirty)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Репутація</div>
            <div className="font-bold text-info">{s.credibility}</div>
          </div>
          <div className="flex items-center gap-1">
            <Thermometer className={cn("size-4", isOverheating ? "text-destructive animate-bounce" : throttling ? "text-warning" : "text-info")} />
            <span className={cn(isOverheating ? "text-destructive font-bold" : throttling ? "text-warning" : "")}>
              {s.temp.toFixed(0)}°C
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Meter
          value={pct}
          tone="primary"
          label={`Ранг ${level}/15: ${LEVEL_TITLES[level - 1] ?? "Сатоші"}`}
          right={next ? `${fmt(s.runEarned)} / ${fmt(next)}` : "МАКСИМУМ"}
        />
        <Meter
          value={s.heat}
          tone={s.heat > 75 ? "destructive" : s.heat > 45 ? "warning" : "muted"}
          label="Загроза FBI"
          right={`${s.heat.toFixed(0)}%`}
        />
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
    overheat: { icon: Flame, title: "Пожежа в серверній!", text: "Проводка плавиться. Виклич техніка, або залізо згорить.", btn: `Викликати техніка · ${fmt(c.cost)}`, tone: "warning" as const },
    whale: { icon: Fish, title: "Кит у мемпулі!", text: "Величезна транзакція без захисту. Встигни перехопити сендвічем!", btn: `Перехопити +${fmt(c.reward)}`, tone: "primary" as const },
  }[c.type];

  return (
    <div className={cn("panel mx-4 mt-3 flex flex-wrap items-center gap-3 border-2 p-3 lg:mx-0", c.type === "whale" ? "border-primary glow-box" : "border-destructive glow-danger")}>
      <info.icon className={cn("size-7 animate-pulse", c.type === "whale" ? "text-primary" : "text-destructive")} />
      <div className="min-w-0 flex-1">
        <div className="font-bold text-foreground">{info.title} <span className="font-mono text-xs text-muted-foreground">· {formatDuration(left)}</span></div>
        <div className="text-xs text-muted-foreground">{info.text}</div>
      </div>
      <GameButton
        tone={info.tone}
        disabled={c.type !== "whale" && s.cash < c.cost}
        onClick={() => {
          sound.playSuccess();
          act(resolveCrisis);
        }}
      >
        {info.btn}
      </GameButton>
    </div>
  );
}
