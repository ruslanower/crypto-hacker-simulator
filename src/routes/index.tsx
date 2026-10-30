import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bitcoin, Crosshair, Moon, ScrollText, ShoppingCart, Skull, Terminal, Thermometer, Siren, Fish, Flame, Volume2, VolumeX, Globe
} from "lucide-react";
import { useGame } from "@/game/useGame";
import { LEVEL_THRESHOLDS, TARGETS, getLevelTitle } from "@/game/data";
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
import { getLang, setLang, t, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crypto Hacker Simulator — Cyber Clicker" },
      { name: "description", content: "Cyberpunk incremental clicker: botnets, DeFi exploits, Tornado Cash laundering, DEX trading, and Darknet Street Cred." },
      { property: "og:title", content: "Crypto Hacker Simulator" },
      { property: "og:description", content: "Build your cyber syndicate: from basement script kiddie to legendary ghost of Satoshi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Game,
});

type Tab = "terminal" | "shop" | "ops" | "contracts" | "market" | "darknet";

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
  const [lang, setLangState] = useState<Lang>(getLang);
  const now = useNow();

  const toggleSound = () => {
    const next = sound.toggle();
    setAudioEnabled(next);
  };

  const toggleLang = () => {
    const next = lang === "en" ? "ua" : "en";
    setLang(next);
    setLangState(next);
    sound.playTap(1.2);
  };

  if (!state) {
    return (
      <div className="flex min-h-screen items-center justify-center font-mono text-primary animate-pulse">
        {t("connectingTor", lang)}
      </div>
    );
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
  const hackTarget = TARGETS.find((it) => it.id === hackId);

  const switchTab = (newTab: Tab) => {
    sound.playTap(1.1);
    setTab(newTab);
  };

  const navItems: { id: Tab; label: string; shortLabel: string; icon: typeof Terminal }[] = [
    { id: "terminal", label: t("tabTerminal", lang), shortLabel: t("navTerminal", lang), icon: Terminal },
    { id: "shop", label: t("tabShop", lang), shortLabel: t("navShop", lang), icon: ShoppingCart },
    { id: "ops", label: t("tabOps", lang), shortLabel: t("navOps", lang), icon: Crosshair },
    { id: "contracts", label: t("tabContracts", lang), shortLabel: t("navContracts", lang), icon: ScrollText },
    { id: "market", label: t("tabMarket", lang), shortLabel: t("navMarket", lang), icon: Bitcoin },
    { id: "darknet", label: t("tabDarknet", lang), shortLabel: t("navDarknet", lang), icon: Skull },
  ];

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row lg:gap-6 lg:p-6 w-full max-w-full overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-6 space-y-4">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleLang}
                title={lang === "en" ? "Switch to Ukrainian" : "Switch to English"}
                className="px-2 py-1 rounded-md border border-border bg-card/60 text-xs font-mono font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1"
              >
                <Globe className="size-3" />
                <span>{lang.toUpperCase()}</span>
              </button>
              <button
                type="button"
                onClick={toggleSound}
                title={audioEnabled ? "Mute SFX" : "Enable SFX"}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {audioEnabled ? <Volume2 className="size-4 text-primary" /> : <VolumeX className="size-4" />}
              </button>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((n) => (
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
      <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0 w-full max-w-full overflow-x-hidden">
        <div className="flex items-center justify-between px-3 sm:px-4 pt-3 sm:pt-4 lg:hidden">
          <Logo />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLang}
              title={lang === "en" ? "Switch to Ukrainian" : "Switch to English"}
              className="px-2 py-1 rounded-md border border-border bg-card/60 text-xs font-mono font-bold text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1"
            >
              <Globe className="size-3" />
              <span>{lang.toUpperCase()}</span>
            </button>
            <button
              type="button"
              onClick={toggleSound}
              title={audioEnabled ? "Mute SFX" : "Enable SFX"}
              className="p-1.5 rounded-md border border-border bg-card/60 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {audioEnabled ? <Volume2 className="size-4 text-primary" /> : <VolumeX className="size-4" />}
            </button>
          </div>
        </div>

        <StatBar s={s} lang={lang} />
        <CrisisBanner s={s} now={now} act={act} lang={lang} />

        <main className="flex-1 p-3 sm:p-4 lg:px-0 w-full min-w-0 max-w-full">
          {tab === "terminal" && <TerminalTab s={s} act={act} lang={lang} />}
          {tab === "shop" && <ShopTab s={s} act={act} lang={lang} />}
          {tab === "ops" && <OpsTab s={s} act={act} now={now} onStart={startOp} lang={lang} />}
          {tab === "contracts" && <ContractsTab s={s} act={act} now={now} lang={lang} />}
          {tab === "market" && <MarketTab s={s} act={act} lang={lang} />}
          {tab === "darknet" && <DarknetTab s={s} act={act} onReset={reset} lang={lang} />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-border bg-card/95 backdrop-blur lg:hidden pb-[env(safe-area-inset-bottom,0px)]">
        {navItems.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => switchTab(n.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 py-2 text-[9px] font-bold uppercase transition-colors active:scale-95",
              tab === n.id ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <n.icon className="size-4 shrink-0" />
            <span className="truncate max-w-[54px] tracking-tight text-center leading-none">{n.shortLabel}</span>
          </button>
        ))}
      </nav>

      {/* Hack Modal */}
      {hackTarget && (
        <HackModal
          target={hackTarget}
          bonusSec={perkLevel(s, "hacker") * 1.5}
          lang={lang}
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
            <div className="mt-3 text-lg font-bold text-foreground">{t("offlineTitle", lang)}</div>
            <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {t("offlineDesc", lang, { time: formatDuration(offline.seconds) })}
            </div>
            <div className="mt-3 text-3xl font-bold text-primary glow-text">+{fmt(offline.earned)}</div>
            <GameButton
              className="mt-5 w-full"
              onClick={() => {
                sound.playSuccess();
                dismissOffline();
              }}
            >
              {t("offlineClaimBtn", lang)}
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

function StatBar({ s, lang }: { s: GameState; lang: Lang }) {
  const level = getLevel(s.runEarned);
  const cur = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const next = LEVEL_THRESHOLDS[level];
  const pct = next ? ((s.runEarned - cur) / (next - cur)) * 100 : 100;
  const throttling = isThrottling(s);
  const isOverheating = s.temp >= 92;
  const rankTitle = getLevelTitle(level, lang);

  return (
    <div className="panel mx-3 sm:mx-4 mt-2 grid gap-2.5 p-3 sm:p-4 lg:mx-0 lg:mt-0">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase text-muted-foreground">{t("cleanBalance", lang)}</div>
          <div className="text-3xl font-bold text-primary glow-text">{fmt(s.cash)}</div>
          <div className="font-mono text-xs text-info">
            +{fmt(cashPerSecond(s))}/s
            {throttling && <span className="ml-2 text-destructive font-bold">{t("throttlingAlert", lang)}</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 font-mono text-xs">
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">{t("dirtyCrypto", lang)}</div>
            <div className="font-bold text-warning">{fmt(s.dirty)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">{t("reputation", lang)}</div>
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

      <div className="grid gap-2.5 sm:grid-cols-2">
        <Meter
          value={pct}
          tone="primary"
          label={
            <span className="flex items-center gap-1 truncate max-w-[190px]">
              <span>{t("rankPrefix", lang)} {level}/15</span>
              <span className="hidden sm:inline opacity-75">· {rankTitle}</span>
            </span>
          }
          right={next ? `${fmt(s.runEarned)} / ${fmt(next)}` : t("maxLevel", lang)}
        />
        <Meter
          value={s.heat}
          tone={s.heat > 75 ? "destructive" : s.heat > 45 ? "warning" : "muted"}
          label={t("fbiThreat", lang)}
          right={`${s.heat.toFixed(0)}%`}
        />
      </div>
    </div>
  );
}

function CrisisBanner({
  s, now, act, lang,
}: { s: GameState; now: number; act: (fn: (s: GameState) => GameState) => void; lang: Lang }) {
  const c = s.crisis;
  if (!c) return null;
  const left = (c.endsAt - now) / 1000;

  const info = {
    police: {
      icon: Siren,
      title: t("crisisPoliceTitle", lang),
      text: t("crisisPoliceDesc", lang),
      btn: t("crisisPoliceBtn", lang, { cost: fmt(c.cost) }),
      tone: "destructive" as const,
    },
    overheat: {
      icon: Flame,
      title: t("crisisOverheatTitle", lang),
      text: t("crisisOverheatDesc", lang),
      btn: t("crisisOverheatBtn", lang, { cost: fmt(c.cost) }),
      tone: "warning" as const,
    },
    whale: {
      icon: Fish,
      title: t("crisisWhaleTitle", lang),
      text: t("crisisWhaleDesc", lang),
      btn: t("crisisWhaleBtn", lang, { val: fmt(c.reward) }),
      tone: "primary" as const,
    },
  }[c.type];

  return (
    <div className={cn("panel mx-3 sm:mx-4 mt-3 flex flex-wrap items-center gap-3 border-2 p-3 lg:mx-0", c.type === "whale" ? "border-primary glow-box" : "border-destructive glow-danger")}>
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
