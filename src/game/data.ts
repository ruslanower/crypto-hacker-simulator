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

// Cost growth per owned unit
export const COST_GROWTH = 1.15;
// Each 25 units of the same item doubles its output
export const MILESTONE_STEP = 25;

export const UPGRADES: UpgradeDef[] = [
  // ==================== HARDWARE (Сила тапу + нагрів) ====================
  {
    id: "mouse_macro",
    name: "Офісна мишка з макросом",
    description: "Копійчаний автоклік подвійних натискань.",
    type: "hardware",
    baseCost: 25,
    power: 0.5,
    heatGen: 0.04,
    levelRequired: 1,
    icon: "Mouse",
  },
  {
    id: "rgb_mousepad",
    name: "Геймерський килимок з підігрівом",
    description: "Ідеальне ковзання для безперервного тапу.",
    type: "hardware",
    baseCost: 150,
    power: 1.5,
    heatGen: 0.08,
    levelRequired: 1,
    icon: "LayoutGrid",
  },
  {
    id: "mech_keyboard",
    name: "Механічна клавіатура (Blue switches)",
    description: "Швидке введення шеллкодів під гучний клікінг.",
    type: "hardware",
    baseCost: 650,
    power: 4.5,
    heatGen: 0.16,
    levelRequired: 2,
    icon: "Keyboard",
  },
  {
    id: "cpu_multicore",
    name: "16-ядерний розігнаний CPU",
    description: "Багатопотоковий перебір хешів RandomX.",
    type: "hardware",
    baseCost: 3500,
    power: 16,
    heatGen: 0.35,
    levelRequired: 3,
    icon: "Cpu",
  },
  {
    id: "threadripper",
    name: "64-ядерний серверний Threadripper",
    description: "Паралельний факторинг слабких RSA-ключів.",
    type: "hardware",
    baseCost: 22000,
    power: 65,
    heatGen: 0.75,
    levelRequired: 4,
    icon: "Cpu",
  },
  {
    id: "gpu_quad",
    name: "Риг 4× RTX 4090",
    description: "Обчислення KawPow та розганяння меморії.",
    type: "hardware",
    baseCost: 110000,
    power: 240,
    heatGen: 1.6,
    levelRequired: 5,
    icon: "LayoutGrid",
  },
  {
    id: "gpu_rig_5090",
    name: "Ферма 8× RTX 5090 Super",
    description: "Максимальний хешрейт на алгоритмах Blake3.",
    type: "hardware",
    baseCost: 650000,
    power: 950,
    heatGen: 3.2,
    levelRequired: 6,
    icon: "Server",
  },
  {
    id: "fpga_cluster",
    name: "Кластер FPGA-прискорювачів",
    description: "Апаратне розпаралелювання підпису secp256k1.",
    type: "hardware",
    baseCost: 4000000,
    power: 4200,
    heatGen: 6.5,
    levelRequired: 7,
    icon: "Binary",
  },
  {
    id: "asic_container",
    name: "ASIC-контейнер Antminer S21",
    description: "Промисловий контейнер SHA-256 біля ГЕС.",
    type: "hardware",
    baseCost: 25000000,
    power: 22000,
    heatGen: 14,
    levelRequired: 9,
    icon: "Server",
  },
  {
    id: "datacenter_rack",
    name: "Оптоволоконна серверна стійка",
    description: "Пряме підключення до нод бірж через Dark Fiber.",
    type: "hardware",
    baseCost: 180000000,
    power: 120000,
    heatGen: 30,
    levelRequired: 11,
    icon: "Wifi",
  },
  {
    id: "quantum_emulator",
    name: "Квантовий симулятор алгоритму Шора",
    description: "Миттєвий злам еліптичних кривих криптографії.",
    type: "hardware",
    baseCost: 1500000000,
    power: 850000,
    heatGen: 70,
    levelRequired: 13,
    icon: "Atom",
  },
  {
    id: "satellite_array",
    name: "Орбітальний супутниковий масив",
    description: "Суперкомп'ютер у космосі поза юрисдикціями країн.",
    type: "hardware",
    baseCost: 15000000000,
    power: 6000000,
    heatGen: 150,
    levelRequired: 14,
    icon: "Satellite",
  },

  // ==================== COOLING (Охолодження °C/с) ====================
  {
    id: "usb_fan",
    name: "Настільний USB-вентилятор",
    description: "Дме на системник і трохи освіжає кімнату.",
    type: "cooling",
    baseCost: 60,
    power: 0.35,
    levelRequired: 1,
    icon: "Fan",
  },
  {
    id: "case_fans",
    name: "RGB-вентилятори 120мм Noctua",
    description: "Тихий та стабільний продув корпусу.",
    type: "cooling",
    baseCost: 350,
    power: 1.1,
    levelRequired: 2,
    icon: "Fan",
  },
  {
    id: "server_turbine",
    name: "Високооборотна серверна турбіна",
    description: "Шумить як винищувач, але збиває температуру.",
    type: "cooling",
    baseCost: 2400,
    power: 3.2,
    levelRequired: 3,
    icon: "Fan",
  },
  {
    id: "water_cooling",
    name: "Кастомна мідна водянка (СВО)",
    description: "Мідні водоблоки та великий радіатор 420мм.",
    type: "cooling",
    baseCost: 15000,
    power: 8.5,
    levelRequired: 4,
    icon: "Droplets",
  },
  {
    id: "industrial_chiller",
    name: "Промисловий фреоновий чиллер",
    description: "Кондиціонування приміщення до холодного туману.",
    type: "cooling",
    baseCost: 90000,
    power: 22,
    levelRequired: 6,
    icon: "Snowflake",
  },
  {
    id: "immersion_tank",
    name: "Імерсійна ванна з діелектриком",
    description: "Плати повністю занурені в мінеральну охолоджуючу оливу.",
    type: "cooling",
    baseCost: 550000,
    power: 58,
    levelRequired: 7,
    icon: "Waves",
  },
  {
    id: "cryo_nitrogen",
    name: "Кріостанція рідкого азоту",
    description: "Температура охолодження до -196°C.",
    type: "cooling",
    baseCost: 4500000,
    power: 160,
    levelRequired: 9,
    icon: "Snowflake",
  },
  {
    id: "permafrost_bunker",
    name: "Бункер у вічній мерзлоті (Шпіцберген)",
    description: "Природний арктичний холод захищає від будь-якого жару.",
    type: "cooling",
    baseCost: 35000000,
    power: 450,
    levelRequired: 11,
    icon: "Shield",
  },
  {
    id: "superconducting_helium",
    name: "Надпровідна гелієва система",
    description: "Квантове охолодження близьке до абсолютного нуля.",
    type: "cooling",
    baseCost: 300000000,
    power: 1500,
    levelRequired: 13,
    icon: "Atom",
  },
  {
    id: "space_radiator",
    name: "Вакуумний космічний терморадіатор",
    description: "Розсіює гігавати тепла прямо у відкритий космос.",
    type: "cooling",
    baseCost: 3000000000,
    power: 6000,
    levelRequired: 14,
    icon: "Orbit",
  },

  // ==================== SOFTWARE (Пасивний дохід $/сек) ====================
  {
    id: "phishing_bot",
    name: "Telegram-фішинг спамер",
    description: "Розсилає фейкові посилання на «Free Airdrop 500 USDT».",
    type: "software",
    baseCost: 50,
    power: 0.6,
    levelRequired: 1,
    icon: "Bot",
  },
  {
    id: "fake_metamask",
    name: "Фейкова сторінка розширення MetaMask",
    description: "Перехоплює поспіхом введені seed-фрази користувачів.",
    type: "software",
    baseCost: 320,
    power: 2.5,
    levelRequired: 2,
    icon: "Globe",
  },
  {
    id: "clipper",
    name: "Clipper-троян у буфері",
    description: "Тихо підміняє криптоадреси при копіюванні.",
    type: "software",
    baseCost: 1800,
    power: 10,
    levelRequired: 3,
    icon: "Copy",
  },
  {
    id: "xmr_botnet",
    name: "Прихований ботнет Monero",
    description: "Майнить XMR на заражених смарт-ТВ та роутерах.",
    type: "software",
    baseCost: 12000,
    power: 48,
    levelRequired: 4,
    icon: "Network",
  },
  {
    id: "dex_sniper",
    name: "Снайпер нових пулів Uniswap",
    description: "Миттєво викуповує перші токени мемкоїнів при лістингу.",
    type: "software",
    baseCost: 75000,
    power: 220,
    levelRequired: 5,
    icon: "Zap",
  },
  {
    id: "mev_bot",
    name: "MEV sandwich-бот у мемпулі",
    description: "Фронтранить великі транзакції перед валідацією блоку.",
    type: "software",
    baseCost: 450000,
    power: 980,
    levelRequired: 6,
    icon: "Flame",
  },
  {
    id: "flashloan_fuzzer",
    name: "Flash Loan арбітражний фазер",
    description: "Автоматично бере мільйонні позики без застави для арбітражу.",
    type: "software",
    baseCost: 2800000,
    power: 4500,
    levelRequired: 8,
    icon: "Scale",
  },
  {
    id: "contract_drainer",
    name: "Універсальний EVM Drainer",
    description: "Експлуатує небезпечні Permit2 та approve-підписи гаманців.",
    type: "software",
    baseCost: 18000000,
    power: 24000,
    levelRequired: 9,
    icon: "Terminal",
  },
  {
    id: "zero_day",
    name: "Zero-day брокер вразливостей",
    description: "Знаходить reentrancy та помилки компілятора Solidity/Vyper.",
    type: "software",
    baseCost: 120000000,
    power: 130000,
    levelRequired: 11,
    icon: "Binary",
  },
  {
    id: "ai_agent",
    name: "Автономний AI-агент зламу бірж",
    description: "Шукає розсинхрон цін та дефекти ліквідації через LLM.",
    type: "software",
    baseCost: 850000000,
    power: 750000,
    levelRequired: 12,
    icon: "BrainCircuit",
  },
  {
    id: "global_exploit_grid",
    name: "Глобальна тіньова нейромережа",
    description: "Сотні серверів координують атаки 51% на молоді мережі.",
    type: "software",
    baseCost: 6000000000,
    power: 4200000,
    levelRequired: 14,
    icon: "Globe",
  },
  {
    id: "skynet_web3",
    name: "Квантовий синдикат «Skynet Web3»",
    description: "Сам створює біржі, пампить токени й сам же забирає ліквідність.",
    type: "software",
    baseCost: 50000000000,
    power: 30000000,
    levelRequired: 15,
    icon: "Sparkles",
  },
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
  { id: "discord_drainer", title: "Спам-дрейнер Discord", reference: "Inferno Drainer (масовий фішинг)", requiredLevel: 2, loot: 2500, heat: 12, cooldownSec: 90, rounds: 1, seqLength: 3, timeSec: 12, hidden: false },
  { id: "seed_phish", title: "Фейковий гаманець у App Store", reference: "Фішинг seed-фраз мобільних юзерів", requiredLevel: 3, loot: 18000, heat: 16, cooldownSec: 180, rounds: 2, seqLength: 4, timeSec: 12, hidden: false },
  { id: "vanity", title: "Злам генератора адрес", reference: "Wintermute / Profanity, $160M", requiredLevel: 4, loot: 150000, heat: 22, cooldownSec: 300, rounds: 2, seqLength: 4, timeSec: 11, hidden: true },
  { id: "euler", title: "Збій ліквідації DeFi", reference: "Euler Finance eToken баг, $197M", requiredLevel: 6, loot: 1.2e6, heat: 28, cooldownSec: 500, rounds: 3, seqLength: 5, timeSec: 11, hidden: true },
  { id: "curve", title: "Баг компілятора Vyper", reference: "Curve Finance reentrancy, $73M", requiredLevel: 7, loot: 8.5e6, heat: 34, cooldownSec: 800, rounds: 3, seqLength: 5, timeSec: 10, hidden: true },
  { id: "ronin", title: "Ключі валідаторів сайдчейну", reference: "Ronin Network (Lazarus, 5/9 валідаторів, $620M)", requiredLevel: 9, loot: 6.5e7, heat: 42, cooldownSec: 1200, rounds: 3, seqLength: 6, timeSec: 10, hidden: true },
  { id: "wormhole", title: "Підробка підпису мосту Solana", reference: "Wormhole Bridge exploit, $320M", requiredLevel: 10, loot: 4.5e8, heat: 50, cooldownSec: 1800, rounds: 4, seqLength: 6, timeSec: 9, hidden: true },
  { id: "bybit", title: "Сліпе підписання казначейства", reference: "Bybit Historic Safe Heist, $1.5B (2025)", requiredLevel: 12, loot: 4e9, heat: 62, cooldownSec: 2500, rounds: 4, seqLength: 7, timeSec: 9, hidden: true },
  { id: "poly_network", title: "Підміна списку зберігачів", reference: "Poly Network cross-chain хак, $611M", requiredLevel: 13, loot: 2.5e10, heat: 70, cooldownSec: 3600, rounds: 5, seqLength: 7, timeSec: 8, hidden: true },
  { id: "satoshi", title: "Гаманці Сатоші Накамото", reference: "1.1 мільйона біткоїнів ери Genesis", requiredLevel: 15, loot: 1.5e11, heat: 85, cooldownSec: 5400, rounds: 5, seqLength: 8, timeSec: 8, hidden: true },
];

export interface CoinDef {
  symbol: string;
  name: string;
  price: number;
  volatility: number;
}

export const COINS: CoinDef[] = [
  { symbol: "BTC", name: "Bitcoin", price: 92450, volatility: 2 },
  { symbol: "ETH", name: "Ethereum", price: 3420, volatility: 3 },
  { symbol: "SOL", name: "Solana", price: 198, volatility: 5 },
  { symbol: "XMR", name: "Monero", price: 185, volatility: 4 },
  { symbol: "DOGE", name: "Dogecoin", price: 0.19, volatility: 8 },
  { symbol: "PEPE", name: "Pepe", price: 0.000012, volatility: 14 },
];

// Lifetime earnings needed for each level (15 рівнів)
export const LEVEL_THRESHOLDS = [
  0,               // Lvl 1
  1500,            // Lvl 2
  8000,            // Lvl 3
  35000,           // Lvl 4
  150000,          // Lvl 5
  750000,          // Lvl 6
  3500000,         // Lvl 7
  15000000,        // Lvl 8
  60000000,        // Lvl 9
  250000000,       // Lvl 10
  1000000000,      // Lvl 11 ($1B)
  5000000000,      // Lvl 12 ($5B)
  25000000000,     // Lvl 13 ($25B)
  100000000000,    // Lvl 14 ($100B)
  500000000000,    // Lvl 15 ($500B)
];

export const LEVEL_TITLES = [
  "Мамин скрипт-кідді",
  "Тапальщик ейрдропів",
  "Дрібний Discord-фішер",
  "Гроза шкільного Wi-Fi",
  "Підвальний криптошахтар",
  "Повелитель прасок та ботнетів",
  "GitHub-мисливець за ключами",
  "DeFi-багошукач на Vyper",
  "MEV-сендвіч хижак",
  "Золотий клієнт Tornado Cash",
  "Зломщик міжланцюгових мостів",
  "Тіньовий маркет-мейкер",
  "Кошмар кіберполіції та Інтерполу",
  "Синдикат рівня Lazarus",
  "Цифровий Привид Сатоші",
];

export const LEVEL_DESCRIPTIONS = [
  "Шукає в Google «як зламати пентагон через блокнот без вірусів».",
  "Цілими днями клікає хом'яка та шле рефералки всім друзям у Telegram.",
  "Розсилає фейкові посилання на «Безкоштовний Discord Nitro» у приватні чати.",
  "Перехоплює паролі сусідів через старий ноутбук на уроці інформатики.",
  "Майнить Monero на старій мікрохвильовці й щиро дивується рахунку за світло.",
  "Зомбував 10,000 розумних чайників, роботів-пилососів та IP-камер сусідів.",
  "Парсить публічні репозиторії GitHub у пошуках залитих розробниками .env файлів.",
  "Знайшов критичну вразливість смарт-контракту на $10M і вдав, що так і треба.",
  "Фронтранить недосвідчених трейдерів у мемпулі на соті частки секунди.",
  "Постійний VIP-клієнт міксерів, має 4 паспорти та таємну віллу в Дубаї.",
  "Скомпрометував 5 із 9 валідаторів і вивів 300,000 ETH за обідньою перервою.",
  "Керує ціною газу в Ethereum і дампить цілі мемкоїни одним коротким твітом.",
  "Червоне сповіщення Інтерполу, а він спокійно п'є кокосовий сік на Балі.",
  "Спецслужби трьох континентів звинувачують один одного в його фінансуванні.",
  "Володіє ключами від першого блоку Генезису і може обвалити світову фінансову систему.",
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
  { id: "tap", name: "Швидкі пальці", description: "+25% сили тапу за рівень", maxLevel: 10, baseCost: 1 },
  { id: "laundry", name: "Свій міксер", description: "−2.5% комісії відмивання через Tornado", maxLevel: 5, baseCost: 2 },
  { id: "stealth", name: "Тіньовий проксі", description: "−12% загрози FBI від усіх операцій", maxLevel: 5, baseCost: 2 },
  { id: "cooling", name: "Кріо-оптимізація", description: "+20% ефективності всіх систем охолодження", maxLevel: 5, baseCost: 2 },
  { id: "offline", name: "Автопілот ботнету", description: "+1.5 год офлайн-доходу за рівень", maxLevel: 6, baseCost: 2 },
  { id: "hacker", name: "Холодна голова", description: "+1.5с на кожен раунд міні-гри злому", maxLevel: 5, baseCost: 3 },
];

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  reward: number; // credibility
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "tap_1", title: "Перша транзакція", description: "Зробіть перший тап по терміналу", reward: 0 },
  { id: "tap_1k", title: "Мозолі на пальцях", description: "1 000 успішних тапів", reward: 1 },
  { id: "tap_10k", title: "Живий ботнет", description: "10 000 тапів", reward: 3 },
  { id: "earn_10k", title: "Перші гроші", description: "Заробіть $10K за весь час", reward: 0 },
  { id: "earn_1m", title: "Крипто-мільйонер", description: "Заробіть $1M за весь час", reward: 2 },
  { id: "earn_1b", title: "Тіньовий мільярдер", description: "Заробіть $1B за весь час", reward: 5 },
  { id: "hack_1", title: "Перший злам", description: "Успішно виконайте операцію з рейдів", reward: 1 },
  { id: "hack_25", title: "Серійний кіберзломщик", description: "25 успішних операцій", reward: 3 },
  { id: "wash_1", title: "Чисті руки", description: "Відмийте брудні гроші через Tornado Cash", reward: 1 },
  { id: "raid_survive", title: "Втік від облави", description: "Переживіть рейд кіберполіції", reward: 1 },
  { id: "trade_profit", title: "Успішний трейдер", description: "Продайте крипту на піку з прибутком", reward: 1 },
  { id: "contract_10", title: "Надійний підрядник", description: "Виконайте 10 контрактів даркнету", reward: 2 },
  { id: "milestone", title: "Промислове масштабування", description: "Купіть 25 одиниць будь-якого апгрейду", reward: 1 },
  { id: "level_10", title: "VIP Даркнету", description: "Досягніть 10-го рівня хакера", reward: 4 },
  { id: "level_15", title: "Привид Сатоші", description: "Досягніть максимального 15-го рівня", reward: 10 },
];
