// Pure game logic: every function takes state (+ time/random) and returns new state.
import {
  ACHIEVEMENTS,
  COINS,
  COST_GROWTH,
  LEVEL_THRESHOLDS,
  MILESTONE_STEP,
  PERKS,
  TARGETS,
  UPGRADES,
  type UpgradeDef,
} from "./data";

export type LogKind = "info" | "ok" | "warn" | "bad";
export interface LogLine {
  id: number;
  text: string;
  kind: LogKind;
}

export type ContractKind = "taps" | "earn" | "hacks" | "wash" | "buy";
export interface Contract {
  id: string;
  kind: ContractKind;
  goal: number;
  start: number;
  reward: number;
  claimed: boolean;
}

export type CrisisType = "police" | "overheat" | "whale";
export interface Crisis {
  type: CrisisType;
  endsAt: number;
  cost: number;
  reward: number;
}

export interface CoinState {
  symbol: string;
  price: number;
  history: number[];
}

export interface Holding {
  amount: number;
  avgCost: number;
}

export interface Stats {
  taps: number;
  hacks: number;
  washed: number;
  washes: number;
  raids: number;
  bought: number;
  contracts: number;
  prestiges: number;
  tradeProfit: number;
}

export interface GameState {
  version: number;
  cash: number;
  dirty: number;
  runEarned: number;
  allTimeEarned: number;
  credibility: number; // spendable
  credibilityTotal: number; // drives multiplier
  perks: Record<string, number>;
  owned: Record<string, number>;
  heat: number;
  temp: number;
  gas: number;
  combo: number;
  lastTapAt: number;
  cooldowns: Record<string, number>;
  coins: CoinState[];
  holdings: Record<string, Holding>;
  achievements: string[];
  stats: Stats;
  contracts: Contract[];
  contractsRefreshAt: number;
  crisis: Crisis | null;
  nextCrisisAt: number;
  logs: LogLine[];
  logSeq: number;
  lastSaved: number;
}

export const SAVE_VERSION = 2;
export const THROTTLE_TEMP = 85;
export const CONTRACT_REFRESH_MS = 15 * 60 * 1000;
export const BASE_OFFLINE_HOURS = 2;

export function createInitialState(now: number): GameState {
  return {
    version: SAVE_VERSION,
    cash: 0,
    dirty: 0,
    runEarned: 0,
    allTimeEarned: 0,
    credibility: 0,
    credibilityTotal: 0,
    perks: {},
    owned: {},
    heat: 0,
    temp: 40,
    gas: 35,
    combo: 0,
    lastTapAt: 0,
    cooldowns: {},
    coins: COINS.map((c) => ({ symbol: c.symbol, price: c.price, history: [c.price] })),
    holdings: {},
    achievements: [],
    stats: { taps: 0, hacks: 0, washed: 0, washes: 0, raids: 0, bought: 0, contracts: 0, prestiges: 0, tradeProfit: 0 },
    contracts: [],
    contractsRefreshAt: 0,
    crisis: null,
    nextCrisisAt: now + 4 * 60 * 1000,
    logs: [
      { id: 1, text: "[*] SHADOW TERMINAL v5.0 — з'єднання через TOR встановлено", kind: "info" },
      { id: 2, text: "[*] Тапай по терміналу, щоб брутфорсити хеші. Купуй софт для пасивного доходу.", kind: "info" },
    ],
    logSeq: 2,
    lastSaved: now,
  };
}

// ---------- derived values ----------

export const perkLevel = (s: GameState, id: string) => s.perks[id] ?? 0;
export const ownedCount = (s: GameState, id: string) => s.owned[id] ?? 0;

export function upgradeCost(def: UpgradeDef, count: number): number {
  return Math.ceil(def.baseCost * Math.pow(COST_GROWTH, count));
}

export function milestoneMultiplier(count: number): number {
  return Math.pow(2, Math.floor(count / MILESTONE_STEP));
}

export function getLevel(runEarned: number): number {
  let lvl = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) if (runEarned >= (LEVEL_THRESHOLDS[i] ?? Infinity)) lvl = i + 1;
  return lvl;
}

export const prestigeMultiplier = (s: GameState) => 1 + s.credibilityTotal * 0.05;
export const isThrottling = (s: GameState) => s.temp >= THROTTLE_TEMP;

function sumType(s: GameState, type: UpgradeDef["type"]) {
  let total = 0;
  for (const u of UPGRADES) {
    if (u.type !== type) continue;
    const n = ownedCount(s, u.id);
    total += n * u.power * milestoneMultiplier(n);
  }
  return total;
}

export const comboMultiplier = (s: GameState) => 1 + Math.min(s.combo, 50) / 50;

export function tapPower(s: GameState): number {
  const base = 0.5 + sumType(s, "hardware");
  const mul = prestigeMultiplier(s) * (1 + 0.2 * perkLevel(s, "tap")) * (isThrottling(s) ? 0.4 : 1);
  return base * mul * comboMultiplier(s);
}

export function cashPerSecond(s: GameState, ignoreThrottle = false): number {
  const mul = prestigeMultiplier(s) * (1 + 0.15 * perkLevel(s, "income"));
  return sumType(s, "software") * mul * (!ignoreThrottle && isThrottling(s) ? 0.4 : 1);
}

export const coolingPower = (s: GameState) => 0.6 + sumType(s, "cooling");

export function heatGeneration(s: GameState): number {
  let total = 0;
  for (const u of UPGRADES) if (u.type === "hardware") total += ownedCount(s, u.id) * (u.heatGen ?? 0);
  return total;
}

export function washFee(s: GameState): number {
  return Math.max(0.03, 0.15 - 0.02 * perkLevel(s, "laundry") + (s.gas > 150 ? 0.05 : 0));
}

export function prestigeGain(s: GameState): number {
  return Math.floor(Math.sqrt(s.runEarned / 1e6));
}

export const perkCost = (baseCost: number, level: number) => baseCost * (level + 1);

export function hackGasCost(s: GameState, requiredLevel: number) {
  return Math.round(s.gas * 0.6 * requiredLevel * requiredLevel);
}

export function bribeCost(s: GameState) {
  return Math.max(200, Math.round(s.cash * 0.2));
}

// ---------- helpers ----------

export function log(s: GameState, text: string, kind: LogKind = "info"): GameState {
  const id = s.logSeq + 1;
  return { ...s, logSeq: id, logs: [...s.logs.slice(-59), { id, text, kind }] };
}

function earn(s: GameState, amount: number): GameState {
  return { ...s, cash: s.cash + amount, runEarned: s.runEarned + amount, allTimeEarned: s.allTimeEarned + amount };
}

export function fmt(n: number): string {
  const abs = Math.abs(n);
  const units: [number, string][] = [
    [1e15, "Qa"],
    [1e12, "T"],
    [1e9, "B"],
    [1e6, "M"],
    [1e3, "K"],
  ];
  for (const [v, u] of units) if (abs >= v) return `$${(n / v).toFixed(2)}${u}`;
  if (abs < 10 && abs > 0 && abs % 1 !== 0) return `$${n.toFixed(2)}`;
  return `$${Math.floor(n).toLocaleString("en-US")}`;
}

// ---------- actions ----------

export function tap(s: GameState, now: number): GameState {
  const combo = now - s.lastTapAt < 450 ? s.combo + 1 : Math.max(0, s.combo - 5);
  let next: GameState = { ...s, combo, lastTapAt: now };
  const power = tapPower(next);
  next = earn(next, power);
  next = { ...next, temp: Math.min(105, next.temp + 0.02), stats: { ...next.stats, taps: next.stats.taps + 1 } };
  return next;
}

export function buyUpgrade(s: GameState, id: string): GameState {
  const def = UPGRADES.find((u) => u.id === id);
  if (!def) return s;
  if (getLevel(s.runEarned) < def.levelRequired) return s;
  const n = ownedCount(s, id);
  const cost = upgradeCost(def, n);
  if (s.cash < cost) return s;
  let next: GameState = {
    ...s,
    cash: s.cash - cost,
    owned: { ...s.owned, [id]: n + 1 },
    stats: { ...s.stats, bought: s.stats.bought + 1 },
  };
  if ((n + 1) % MILESTONE_STEP === 0) next = log(next, `[★] ${def.name} ×${n + 1} — віддача подвоєна!`, "ok");
  return next;
}

export function purgeFans(s: GameState): GameState {
  return log({ ...s, temp: Math.max(35, s.temp - 12) }, "[❄] Екстрена продувка: −12°C", "info");
}

export function startHack(s: GameState, id: string, now: number): GameState | null {
  const t = TARGETS.find((x) => x.id === id);
  if (!t) return null;
  if (getLevel(s.runEarned) < t.requiredLevel) return null;
  if ((s.cooldowns[id] ?? 0) > now) return null;
  const gas = hackGasCost(s, t.requiredLevel);
  if (s.cash < gas) return null;
  const next = { ...s, cash: s.cash - gas, cooldowns: { ...s.cooldowns, [id]: now + t.cooldownSec * 1000 } };
  return log(next, `[⛽] Сплачено ${fmt(gas)} газу. Ін'єкція в «${t.title}»...`, "info");
}

export function resolveHack(s: GameState, id: string, success: boolean, rand: number): GameState {
  const t = TARGETS.find((x) => x.id === id);
  if (!t) return s;
  const stealth = 1 - 0.1 * perkLevel(s, "stealth");
  if (success) {
    const loot = t.loot * (0.85 + rand * 0.35) * prestigeMultiplier(s);
    const next: GameState = {
      ...s,
      dirty: s.dirty + loot,
      runEarned: s.runEarned + loot,
      allTimeEarned: s.allTimeEarned + loot,
      heat: Math.min(100, s.heat + t.heat * stealth),
      stats: { ...s.stats, hacks: s.stats.hacks + 1 },
    };
    return log(next, `[🔥] Злам «${t.title}» успішний: +${fmt(loot)} брудних`, "ok");
  }
  return log({ ...s, heat: Math.min(100, s.heat + t.heat * 1.5 * stealth) }, `[✖] «${t.title}»: IDS заблокував атаку. Загроза росте!`, "bad");
}

export function wash(s: GameState): GameState {
  if (s.dirty <= 0) return s;
  const clean = s.dirty * (1 - washFee(s));
  const next: GameState = {
    ...s,
    cash: s.cash + clean,
    dirty: 0,
    heat: Math.max(0, s.heat - 20),
    stats: { ...s.stats, washed: s.stats.washed + s.dirty, washes: s.stats.washes + 1 },
  };
  return log(next, `[🌪] Відмито через міксер: +${fmt(clean)} чистих`, "ok");
}

export function bribe(s: GameState): GameState {
  const cost = bribeCost(s);
  if (s.cash < cost || s.heat <= 0) return s;
  return log({ ...s, cash: s.cash - cost, heat: Math.max(0, s.heat - 35) }, `[🛡] Змінено IP/MAC, знищено пристрої: −35% загрози (${fmt(cost)})`, "info");
}

export function buyCoin(s: GameState, symbol: string, spend: number): GameState {
  const coin = s.coins.find((c) => c.symbol === symbol);
  if (!coin || spend <= 0 || spend > s.cash) return s;
  const amount = spend / coin.price;
  const h = s.holdings[symbol] ?? { amount: 0, avgCost: 0 };
  const total = h.amount + amount;
  const avgCost = (h.amount * h.avgCost + spend) / total;
  return { ...s, cash: s.cash - spend, holdings: { ...s.holdings, [symbol]: { amount: total, avgCost } } };
}

export function sellCoin(s: GameState, symbol: string): GameState {
  const coin = s.coins.find((c) => c.symbol === symbol);
  const h = s.holdings[symbol];
  if (!coin || !h || h.amount <= 0) return s;
  const value = h.amount * coin.price;
  const profit = value - h.amount * h.avgCost;
  const holdings = { ...s.holdings };
  delete holdings[symbol];
  const next: GameState = {
    ...s,
    cash: s.cash + value,
    holdings,
    stats: { ...s.stats, tradeProfit: s.stats.tradeProfit + Math.max(0, profit) },
  };
  return log(next, `[₿] Продано ${symbol}: ${fmt(value)} (${profit >= 0 ? "+" : ""}${fmt(profit)})`, profit >= 0 ? "ok" : "warn");
}

export function buyPerk(s: GameState, id: string): GameState {
  const def = PERKS.find((p) => p.id === id);
  if (!def) return s;
  const lvl = perkLevel(s, id);
  if (lvl >= def.maxLevel) return s;
  const cost = perkCost(def.baseCost, lvl);
  if (s.credibility < cost) return s;
  return { ...s, credibility: s.credibility - cost, perks: { ...s.perks, [id]: lvl + 1 } };
}

export function prestige(s: GameState, now: number): GameState {
  const gain = prestigeGain(s);
  if (gain <= 0) return s;
  const fresh = createInitialState(now);
  const next: GameState = {
    ...fresh,
    allTimeEarned: s.allTimeEarned,
    credibility: s.credibility + gain,
    credibilityTotal: s.credibilityTotal + gain,
    perks: s.perks,
    achievements: s.achievements,
    stats: { ...s.stats, prestiges: s.stats.prestiges + 1 },
    logSeq: s.logSeq,
  };
  return log(next, `[🏖] Операція «Чистий аркуш»: +${gain} репутації даркнету`, "ok");
}

// ---------- contracts ----------

function statFor(s: GameState, kind: ContractKind): number {
  switch (kind) {
    case "taps":
      return s.stats.taps;
    case "earn":
      return s.runEarned;
    case "hacks":
      return s.stats.hacks;
    case "wash":
      return s.stats.washed;
    case "buy":
      return s.stats.bought;
  }
}

export const contractProgress = (s: GameState, c: Contract) => Math.min(c.goal, statFor(s, c.kind) - c.start);

export function generateContracts(s: GameState, now: number, rand: () => number): GameState {
  const lvl = getLevel(s.runEarned);
  const income = Math.max(1, cashPerSecond(s, true) + tapPower(s) * 2);
  const pool: ContractKind[] = ["taps", "earn", "buy"];
  if (lvl >= 2) pool.push("hacks", "wash");
  const picked: ContractKind[] = [];
  while (picked.length < 3) {
    const k = pool[Math.floor(rand() * pool.length)];
    if (!picked.includes(k) || picked.length >= pool.length) picked.push(k);
  }
  const contracts = picked.map((kind, i): Contract => {
    let goal = 0;
    let reward = 0;
    if (kind === "taps") {
      goal = 300 + Math.floor(rand() * 4) * 100;
      reward = Math.max(150, tapPower(s) * goal * 1.5);
    } else if (kind === "earn") {
      goal = Math.round(Math.max(1000, income * 600) / 100) * 100;
      reward = goal * 0.4;
    } else if (kind === "hacks") {
      goal = 1 + Math.floor(rand() * 2);
      reward = Math.max(2000, income * 300 * goal);
    } else if (kind === "wash") {
      goal = Math.round(Math.max(2000, income * 400) / 100) * 100;
      reward = goal * 0.3;
    } else {
      goal = 5 + Math.floor(rand() * 6);
      reward = Math.max(300, income * 120);
    }
    return { id: `${now}-${i}`, kind, goal, start: statFor(s, kind), reward: Math.round(reward), claimed: false };
  });
  return { ...s, contracts, contractsRefreshAt: now + CONTRACT_REFRESH_MS };
}

export function claimContract(s: GameState, id: string): GameState {
  const c = s.contracts.find((x) => x.id === id);
  if (!c || c.claimed || contractProgress(s, c) < c.goal) return s;
  let next = earn(s, c.reward);
  next = {
    ...next,
    contracts: next.contracts.map((x) => (x.id === id ? { ...x, claimed: true } : x)),
    stats: { ...next.stats, contracts: next.stats.contracts + 1 },
  };
  return log(next, `[📜] Контракт виконано: +${fmt(c.reward)}`, "ok");
}

// ---------- crisis ----------

export function resolveCrisis(s: GameState): GameState {
  const c = s.crisis;
  if (!c) return s;
  if (c.type === "whale") return log({ ...earn(s, c.reward), crisis: null }, `[🐋] Перехоплено транзакцію кита: +${fmt(c.reward)}`, "ok");
  if (s.cash < c.cost) return s;
  let next: GameState = { ...s, cash: s.cash - c.cost, crisis: null };
  if (c.type === "police") next = { ...next, heat: Math.max(0, next.heat - 30) };
  if (c.type === "overheat") next = { ...next, temp: 45 };
  return log(next, "[🛡] Кризу нейтралізовано", "ok");
}

function raid(s: GameState): GameState {
  const lostDirty = s.dirty * 0.7;
  const lostCash = s.cash * 0.1;
  const next: GameState = {
    ...s,
    dirty: s.dirty - lostDirty,
    cash: s.cash - lostCash,
    heat: 30,
    stats: { ...s.stats, raids: s.stats.raids + 1 },
  };
  return log(next, `[🚨] ОБЛАВА КІБЕРПОЛІЦІЇ! Втрачено ${fmt(lostDirty + lostCash)}`, "bad");
}

// ---------- tick ----------

function checkAchievements(s: GameState): GameState {
  const has = new Set(s.achievements);
  const lvl = getLevel(s.runEarned);
  const maxOwned = Math.max(0, ...Object.values(s.owned));
  const conds: Record<string, boolean> = {
    tap_1: s.stats.taps >= 1,
    tap_1k: s.stats.taps >= 1000,
    tap_10k: s.stats.taps >= 10000,
    earn_10k: s.allTimeEarned >= 1e4,
    earn_1m: s.allTimeEarned >= 1e6,
    earn_1b: s.allTimeEarned >= 1e9,
    hack_1: s.stats.hacks >= 1,
    hack_25: s.stats.hacks >= 25,
    wash_1: s.stats.washes >= 1,
    raid_survive: s.stats.raids >= 1,
    trade_profit: s.stats.tradeProfit > 0,
    contract_10: s.stats.contracts >= 10,
    milestone: maxOwned >= MILESTONE_STEP,
    level_10: lvl >= 10,
  };
  let next = s;
  for (const a of ACHIEVEMENTS) {
    if (has.has(a.id) || !conds[a.id]) continue;
    next = {
      ...next,
      achievements: [...next.achievements, a.id],
      credibility: next.credibility + a.reward,
      credibilityTotal: next.credibilityTotal + a.reward,
    };
    next = log(next, `[🏆] Досягнення: ${a.title}${a.reward ? ` (+${a.reward} реп.)` : ""}`, "ok");
  }
  return next;
}

export function tick(s: GameState, dtSec: number, now: number, rand: () => number = Math.random): GameState {
  const prevLevel = getLevel(s.runEarned);
  let next = earn(s, cashPerSecond(s) * dtSec);

  // temperature & heat
  const dTemp = (heatGeneration(next) - coolingPower(next)) * dtSec * 0.5;
  next = {
    ...next,
    temp: Math.min(105, Math.max(35, next.temp + dTemp)),
    heat: Math.max(0, next.heat - 0.05 * dtSec),
    combo: now - next.lastTapAt > 1200 ? Math.max(0, next.combo - 20 * dtSec) : next.combo,
  };

  if (next.heat >= 100) next = raid(next);

  // crisis lifecycle
  if (next.crisis && now >= next.crisis.endsAt) {
    const c = next.crisis;
    next = { ...next, crisis: null };
    if (c.type === "police") next = raid(next);
    else if (c.type === "overheat") next = log({ ...next, temp: 105 }, "[🔥] Риги перегрілись! Тротлінг на повну", "bad");
    else next = log(next, "[🐋] Кит пішов. Можливість втрачено", "warn");
  } else if (!next.crisis && now >= next.nextCrisisAt && prevLevel >= 2) {
    const roll = rand();
    const type: CrisisType = roll < 0.4 ? "police" : roll < 0.7 ? "overheat" : "whale";
    const duration = type === "whale" ? 15000 : 30000;
    const cost = Math.max(100, Math.round(next.cash * (type === "police" ? 0.12 : 0.06)));
    const reward = Math.max(500, Math.round(cashPerSecond(next, true) * 90 + tapPower(next) * 60));
    next = { ...next, crisis: { type, endsAt: now + duration, cost, reward }, nextCrisisAt: now + (3 + rand() * 5) * 60 * 1000 };
  }

  if (now >= next.contractsRefreshAt) next = generateContracts(next, now, rand);

  const newLevel = getLevel(next.runEarned);
  if (newLevel > prevLevel) next = log(next, `[⬆] Новий рівень ${newLevel}! Відкрито нові апгрейди та цілі`, "ok");

  return checkAchievements(next);
}

export function marketTick(s: GameState, rand: () => number = Math.random): GameState {
  const coins = s.coins.map((c) => {
    const def = COINS.find((d) => d.symbol === c.symbol)!;
    const shock = rand() < 0.03 ? (rand() < 0.5 ? -1 : 1) * def.volatility * 3 : 0;
    const drift = (def.price - c.price) / def.price * 0.02; // pull back toward base
    const move = (rand() * 2 - 1) * def.volatility + shock + drift * 100;
    const price = Math.max(def.price * 0.05, c.price * (1 + move / 100));
    return { ...c, price, history: [...c.history.slice(-39), price] };
  });
  const gas = Math.round(Math.min(300, Math.max(12, s.gas + (rand() * 2 - 1) * 40)));
  return { ...s, coins, gas };
}

export function applyOffline(s: GameState, now: number): { state: GameState; earned: number; seconds: number } {
  const maxSec = (BASE_OFFLINE_HOURS + perkLevel(s, "offline")) * 3600;
  const seconds = Math.min(maxSec, Math.max(0, (now - s.lastSaved) / 1000));
  if (seconds < 60) return { state: s, earned: 0, seconds: 0 };
  const earned = cashPerSecond(s, true) * seconds * 0.5;
  return { state: { ...earn(s, earned), temp: 40, crisis: null, lastSaved: now }, earned, seconds };
}
