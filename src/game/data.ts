// Static game content. Balance numbers live here; the engine only applies them.

export type UpgradeType = "hardware" | "cooling" | "software";

export interface UpgradeDef {
  id: string;
  name: string;
  description: string;
  type: UpgradeType;
  baseCost: number;
  power: number; // tap power, cooling °C/s, or $/s
  heatGen?: number; // hardware temperature generation per unit
  levelRequired: number;
  icon: string;
}

// Payback time grows with each tier (~120s → ~2h), cost growth 1.15 per unit.
export const COST_GROWTH = 1.15;
// Each 25 units of the same item doubles its output.
export const MILESTONE_STEP = 25;

export const UPGRADES: UpgradeDef[] = [
  // HARDWARE — tap power
  { id: "mouse_macro", name: "Мишка з макросом", description: "Автоклік подвійних натискань.", type: "hardware", baseCost: 25, power: 0.2, heatGen: 0.05, levelRequired: 1, icon: "Mouse" },
  { id: "mech_keyboard", name: "Механічна клавіатура", description: "Швидке введення шеллкодів.", type: "hardware", baseCost: 400, power: 1.5, heatGen: 0.15, levelRequired: 2, icon: "Keyboard" },
  { id: "cpu_multicore", name: "64-ядерний серверний CPU", description: "Перебір хешів RandomX.", type: "hardware", baseCost: 6000, power: 9, heatGen: 0.4, levelRequired: 3, icon: "Cpu" },
  { id: "gpu_rig", name: "Ферма 8× RTX 5090", description: "KawPow та Blake3 на максимумі.", type: "hardware", baseCost: 90000, power: 55, heatGen: 1.1, levelRequired: 4, icon: "LayoutGrid" },
  { id: "asic_container", name: "ASIC-контейнер S21", description: "Промисловий SHA-256.", type: "hardware", baseCost: 1.4e6, power: 320, heatGen: 3, levelRequired: 6, icon: "Server" },
  { id: "quantum_emulator", name: "Квантовий емулятор Shor", description: "Факторинг ключів secp256k1.", type: "hardware", baseCost: 2.5e7, power: 2000, heatGen: 8, levelRequired: 8, icon: "Atom" },

  // COOLING
  { id: "case_fans", name: "RGB-вентилятори 120мм", description: "Базовий продув корпусу.", type: "cooling", baseCost: 120, power: 0.4, levelRequired: 1, icon: "Fan" },
  { id: "water_cooling", name: "Кастомна СВО", description: "Мідні водоблоки.", type: "cooling", baseCost: 3500, power: 2, levelRequired: 3, icon: "Droplets" },
  { id: "immersion_tank", name: "Імерсійна ванна", description: "Риги в діелектричній оливі.", type: "cooling", baseCost: 60000, power: 7, levelRequired: 5, icon: "Waves" },
  { id: "cryo_nitrogen", name: "Кріостанція (рідкий азот)", description: "Екстремальне охолодження.", type: "cooling", baseCost: 1.2e6, power: 25, levelRequired: 7, icon: "Snowflake" },

  // SOFTWARE — passive income
  { id: "phishing_bot", name: "Telegram-фішинг спамер", description: "Фейкові ейрдропи.", type: "software", baseCost: 60, power: 0.4, levelRequired: 1, icon: "Bot" },
  { id: "clipper", name: "Clipper-троян", description: "Підміняє адреси в буфері.", type: "software", baseCost: 900, power: 3.5, levelRequired: 2, icon: "Copy" },
  { id: "xmr_botnet", name: "Ботнет Monero", description: "Прихований майнінг на чужих ПК.", type: "software", baseCost: 12000, power: 24, levelRequired: 3, icon: "Network" },
  { id: "mev_bot", name: "MEV sandwich-бот", description: "Фронтранінг у мемпулі.", type: "software", baseCost: 180000, power: 150, levelRequired: 5, icon: "Flame" },
  { id: "flashloan_fuzzer", name: "Flash Loan фазер", description: "Шукає розсинхрон оракулів.", type: "software", baseCost: 3e6, power: 1000, levelRequired: 6, icon: "Scale" },
  { id: "zero_day", name: "Zero-day брокер", description: "Reentrancy та proxy-баги.", type: "software", baseCost: 5e7, power: 7000, levelRequired: 8, icon: "Terminal" },
  { id: "ai_agent", name: "Автономний AI-агент", description: "Сам шукає та експлуатує цілі.", type: "software", baseCost: 9e8, power: 50000, levelRequired: 9, icon: "BrainCircuit" },
];

export interface TargetDef {
  id: string;
  title: string;
  reference: string;
  requiredLevel: number;
  loot: number;
  heat: number;
  cooldownSec: number;
  rounds: number; // minigame stages
  seqLength: number;
  timeSec: number; // per round
  hidden: boolean; // sequence hides after preview
}

export const TARGETS: TargetDef[] = [
  { id: "discord_drainer", title: "Спам-дрейнер Discord", reference: "Inferno Drainer", requiredLevel: 2, loot: 2500, heat: 10, cooldownSec: 120, rounds: 1, seqLength: 3, timeSec: 12, hidden: false },
  { id: "seed_phish", title: "Фейковий гаманець у App Store", reference: "Фішинг seed-фраз", requiredLevel: 3, loot: 18000, heat: 14, cooldownSec: 300, rounds: 2, seqLength: 4, timeSec: 12, hidden: false },
  { id: "vanity", title: "Злам генератора адрес", reference: "Wintermute / Profanity, 2022", requiredLevel: 4, loot: 150000, heat: 20, cooldownSec: 600, rounds: 2, seqLength: 4, timeSec: 11, hidden: true },
  { id: "euler", title: "Збій ліквідації DeFi", reference: "Euler Finance, 2023", requiredLevel: 5, loot: 1.1e6, heat: 26, cooldownSec: 900, rounds: 3, seqLength: 5, timeSec: 11, hidden: true },
  { id: "curve", title: "Баг компілятора Vyper", reference: "Curve Finance, 2023", requiredLevel: 6, loot: 8e6, heat: 32, cooldownSec: 1200, rounds: 3, seqLength: 5, timeSec: 10, hidden: true },
  { id: "ronin", title: "Ключі валідаторів сайдчейну", reference: "Ronin Network, 2022", requiredLevel: 7, loot: 6e7, heat: 40, cooldownSec: 1800, rounds: 3, seqLength: 6, timeSec: 10, hidden: true },
  { id: "wormhole", title: "Підробка підпису мосту", reference: "Wormhole, 2022", requiredLevel: 8, loot: 4.5e8, heat: 48, cooldownSec: 2700, rounds: 4, seqLength: 6, timeSec: 9, hidden: true },
  { id: "bybit", title: "Сліпе підписання казначейства", reference: "Bybit, 2025", requiredLevel: 9, loot: 4e9, heat: 60, cooldownSec: 3600, rounds: 4, seqLength: 7, timeSec: 9, hidden: true },
  { id: "satoshi", title: "Гаманці Сатоші", reference: "Легенда", requiredLevel: 10, loot: 5e10, heat: 75, cooldownSec: 7200, rounds: 5, seqLength: 7, timeSec: 8, hidden: true },
];

export interface CoinDef {
  symbol: string;
  name: string;
  price: number;
  volatility: number; // max % move per market tick
}

export const COINS: CoinDef[] = [
  { symbol: "BTC", name: "Bitcoin", price: 92450, volatility: 2 },
  { symbol: "ETH", name: "Ethereum", price: 3420, volatility: 3 },
  { symbol: "SOL", name: "Solana", price: 198, volatility: 5 },
  { symbol: "XMR", name: "Monero", price: 185, volatility: 4 },
  { symbol: "DOGE", name: "Dogecoin", price: 0.19, volatility: 8 },
  { symbol: "PEPE", name: "Pepe", price: 0.000012, volatility: 14 },
];

// Lifetime earnings needed for each level (index = level - 1).
export const LEVEL_THRESHOLDS = [0, 2e3, 2e4, 2e5, 1.5e6, 1.2e7, 1e8, 1e9, 1.2e10, 1.5e11];

export const LEVEL_TITLES = [
  "Гаражний скрипт-кідді",
  "Дрібний фішер",
  "Оператор ботнету",
  "Мисливець за ключами",
  "DeFi експлойт-архітектор",
  "MEV-хижак",
  "Міжланцюговий диверсант",
  "Тіньовий брокер",
  "Державна APT-група",
  "Легенда даркнету",
];

export interface PerkDef {
  id: string;
  name: string;
  description: string;
  maxLevel: number;
  baseCost: number; // credibility
}

export const PERKS: PerkDef[] = [
  { id: "income", name: "Ширша мережа", description: "+15% пасивного доходу за рівень", maxLevel: 10, baseCost: 1 },
  { id: "tap", name: "Швидкі пальці", description: "+20% сили тапу за рівень", maxLevel: 10, baseCost: 1 },
  { id: "laundry", name: "Свій міксер", description: "−2% комісії відмивання за рівень", maxLevel: 5, baseCost: 2 },
  { id: "stealth", name: "Тінь", description: "−10% загрози від операцій за рівень", maxLevel: 5, baseCost: 2 },
  { id: "offline", name: "Автопілот", description: "+1 год офлайн-доходу за рівень", maxLevel: 6, baseCost: 2 },
  { id: "hacker", name: "Холодна голова", description: "+1с на раунд злому за рівень", maxLevel: 5, baseCost: 3 },
];

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  reward: number; // credibility
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "tap_1", title: "Перша транзакція", description: "Зробіть перший тап", reward: 0 },
  { id: "tap_1k", title: "Мозолі на пальцях", description: "1 000 тапів", reward: 1 },
  { id: "tap_10k", title: "Живий ботнет", description: "10 000 тапів", reward: 2 },
  { id: "earn_10k", title: "Перші гроші", description: "Заробіть $10K за весь час", reward: 0 },
  { id: "earn_1m", title: "Мільйонер", description: "Заробіть $1M за весь час", reward: 1 },
  { id: "earn_1b", title: "Мільярдер", description: "Заробіть $1B за весь час", reward: 3 },
  { id: "hack_1", title: "Перший злам", description: "Успішна операція", reward: 0 },
  { id: "hack_25", title: "Серійний зломщик", description: "25 успішних операцій", reward: 2 },
  { id: "wash_1", title: "Мильний міксер", description: "Відмийте брудні гроші", reward: 0 },
  { id: "raid_survive", title: "Пережив облаву", description: "Потрапте під облаву поліції", reward: 1 },
  { id: "trade_profit", title: "Трейдер", description: "Продайте монету з прибутком", reward: 1 },
  { id: "contract_10", title: "Надійний підрядник", description: "Виконайте 10 контрактів", reward: 2 },
  { id: "milestone", title: "Масштабування", description: "Купіть 25 одиниць одного апгрейду", reward: 1 },
  { id: "level_10", title: "Легенда", description: "Досягніть 10 рівня", reward: 5 },
];
