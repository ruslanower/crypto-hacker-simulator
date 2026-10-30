// Static game content with bilingual EN / UA support.
// Default language: English ("en")
import type { Lang } from "@/lib/i18n";

export type UpgradeType = "hardware" | "cooling" | "software";

export interface UpgradeDef {
  id: string;
  name: string;
  nameEn: string;
  nameUa: string;
  description: string;
  descEn: string;
  descUa: string;
  type: UpgradeType;
  baseCost: number;
  power: number; // tap power, cooling °C/s, or $/s
  heatGen?: number; // hardware temperature generation per unit
  levelRequired: number;
  icon: string;
}

export function getUpgradeName(u: UpgradeDef, lang: Lang): string {
  return lang === "ua" ? u.nameUa : u.nameEn;
}

export function getUpgradeDesc(u: UpgradeDef, lang: Lang): string {
  return lang === "ua" ? u.descUa : u.descEn;
}

// Cost growth per owned unit
export const COST_GROWTH = 1.15;
// Each 25 units of the same item doubles its output
export const MILESTONE_STEP = 25;

export const UPGRADES: UpgradeDef[] = [
  // ==================== HARDWARE ====================
  {
    id: "mouse_macro",
    name: "Office Macro Mouse",
    nameEn: "Office Macro Mouse",
    nameUa: "Офісна мишка з макросом",
    description: "Cheap double-click macro automation.",
    descEn: "Cheap double-click macro automation.",
    descUa: "Копійчаний автоклік подвійних натискань.",
    type: "hardware",
    baseCost: 25,
    power: 0.5,
    heatGen: 0.04,
    levelRequired: 1,
    icon: "Mouse",
  },
  {
    id: "rgb_mousepad",
    name: "Heated RGB Mousepad",
    nameEn: "Heated RGB Mousepad",
    nameUa: "Геймерський килимок з підігрівом",
    description: "Flawless friction-free glides for endless clicking.",
    descEn: "Flawless friction-free glides for endless clicking.",
    descUa: "Ідеальне ковзання для безперервного тапу.",
    type: "hardware",
    baseCost: 150,
    power: 1.5,
    heatGen: 0.08,
    levelRequired: 1,
    icon: "LayoutGrid",
  },
  {
    id: "mech_keyboard",
    name: "Mechanical Keyboard (Blue Switches)",
    nameEn: "Mechanical Keyboard (Blue Switches)",
    nameUa: "Механічна клавіатура (Blue switches)",
    description: "Lightning-fast shellcode entry with satisfying clicky clatter.",
    descEn: "Lightning-fast shellcode entry with satisfying clicky clatter.",
    descUa: "Швидке введення шеллкодів під гучний клікінг.",
    type: "hardware",
    baseCost: 650,
    power: 4.5,
    heatGen: 0.16,
    levelRequired: 2,
    icon: "Keyboard",
  },
  {
    id: "cpu_multicore",
    name: "Overclocked 16-Core CPU",
    nameEn: "Overclocked 16-Core CPU",
    nameUa: "16-ядерний розігнаний CPU",
    description: "Multi-threaded RandomX hashing machine.",
    descEn: "Multi-threaded RandomX hashing machine.",
    descUa: "Багатопотоковий перебір хешів RandomX.",
    type: "hardware",
    baseCost: 3500,
    power: 16,
    heatGen: 0.35,
    levelRequired: 3,
    icon: "Cpu",
  },
  {
    id: "threadripper",
    name: "64-Core Server Threadripper",
    nameEn: "64-Core Server Threadripper",
    nameUa: "64-ядерний серверний Threadripper",
    description: "Parallel factorization of weak RSA keys.",
    descEn: "Parallel factorization of weak RSA keys.",
    descUa: "Паралельний факторинг слабких RSA-ключів.",
    type: "hardware",
    baseCost: 22000,
    power: 65,
    heatGen: 0.75,
    levelRequired: 4,
    icon: "Cpu",
  },
  {
    id: "gpu_quad",
    name: "Quad RTX 4090 Mining Rig",
    nameEn: "Quad RTX 4090 Mining Rig",
    nameUa: "Риг 4× RTX 4090",
    description: "Blistering KawPow memory bandwidth crunching.",
    descEn: "Blistering KawPow memory bandwidth crunching.",
    descUa: "Обчислення KawPow та розганяння меморії.",
    type: "hardware",
    baseCost: 110000,
    power: 240,
    heatGen: 1.6,
    levelRequired: 5,
    icon: "LayoutGrid",
  },
  {
    id: "gpu_rig_5090",
    name: "8× RTX 5090 Super Farm",
    nameEn: "8× RTX 5090 Super Farm",
    nameUa: "Ферма 8× RTX 5090 Super",
    description: "Maximum parallel throughput on Blake3 algorithms.",
    descEn: "Maximum parallel throughput on Blake3 algorithms.",
    descUa: "Максимальний хешрейт на алгоритмах Blake3.",
    type: "hardware",
    baseCost: 650000,
    power: 950,
    heatGen: 3.2,
    levelRequired: 6,
    icon: "Server",
  },
  {
    id: "fpga_cluster",
    name: "FPGA Accelerator Cluster",
    nameEn: "FPGA Accelerator Cluster",
    nameUa: "Кластер FPGA-прискорювачів",
    description: "Custom silicon optimized for secp256k1 signature brute force.",
    descEn: "Custom silicon optimized for secp256k1 signature brute force.",
    descUa: "Апаратне розпаралелювання підпису secp256k1.",
    type: "hardware",
    baseCost: 4000000,
    power: 4200,
    heatGen: 6.5,
    levelRequired: 7,
    icon: "Binary",
  },
  {
    id: "asic_container",
    name: "Antminer S21 Container",
    nameEn: "Antminer S21 Container",
    nameUa: "ASIC-контейнер Antminer S21",
    description: "Industrial megawatt SHA-256 container planted near a hydro dam.",
    descEn: "Industrial megawatt SHA-256 container planted near a hydro dam.",
    descUa: "Промисловий контейнер SHA-256 біля ГЕС.",
    type: "hardware",
    baseCost: 25000000,
    power: 22000,
    heatGen: 14,
    levelRequired: 9,
    icon: "Server",
  },
  {
    id: "datacenter_rack",
    name: "Dark Fiber Exchange Rack",
    nameEn: "Dark Fiber Exchange Rack",
    nameUa: "Оптоволоконна серверна стійка",
    description: "Sub-millisecond colocation right next to top crypto exchange nodes.",
    descEn: "Sub-millisecond colocation right next to top crypto exchange nodes.",
    descUa: "Пряме підключення до нод бірж через Dark Fiber.",
    type: "hardware",
    baseCost: 180000000,
    power: 120000,
    heatGen: 30,
    levelRequired: 11,
    icon: "Wifi",
  },
  {
    id: "quantum_emulator",
    name: "Shor's Quantum Simulator",
    nameEn: "Shor's Quantum Simulator",
    nameUa: "Квантовий симулятор алгоритму Шора",
    description: "Instant factoring of elliptic curve public keys.",
    descEn: "Instant factoring of elliptic curve public keys.",
    descUa: "Миттєвий злам еліптичних кривих криптографії.",
    type: "hardware",
    baseCost: 1500000000,
    power: 850000,
    heatGen: 70,
    levelRequired: 13,
    icon: "Atom",
  },
  {
    id: "satellite_array",
    name: "Orbital Satellite Supercomputer",
    nameEn: "Orbital Satellite Supercomputer",
    nameUa: "Орбітальний супутниковий масив",
    description: "Extraterrestrial computation station immune to national jurisdictions.",
    descEn: "Extraterrestrial computation station immune to national jurisdictions.",
    descUa: "Суперкомп'ютер у космосі поза юрисдикціями країн.",
    type: "hardware",
    baseCost: 15000000000,
    power: 6000000,
    heatGen: 150,
    levelRequired: 14,
    icon: "Satellite",
  },

  // ==================== COOLING ====================
  {
    id: "usb_fan",
    name: "Desk USB Fan",
    nameEn: "Desk USB Fan",
    nameUa: "Настільний USB-вентилятор",
    description: "Blows on the chassis and keeps you slightly cooler.",
    descEn: "Blows on the chassis and keeps you slightly cooler.",
    descUa: "Дме на системник і трохи освіжає кімнату.",
    type: "cooling",
    baseCost: 60,
    power: 0.35,
    levelRequired: 1,
    icon: "Fan",
  },
  {
    id: "case_fans",
    name: "120mm Noctua High-Static Fans",
    nameEn: "120mm Noctua High-Static Fans",
    nameUa: "RGB-вентилятори 120мм Noctua",
    description: "Whisper quiet, reliable constant airflow.",
    descEn: "Whisper quiet, reliable constant airflow.",
    descUa: "Тихий та стабільний продув корпусу.",
    type: "cooling",
    baseCost: 350,
    power: 1.1,
    levelRequired: 2,
    icon: "Fan",
  },
  {
    id: "server_turbine",
    name: "5000 RPM Blower Turbine",
    nameEn: "5000 RPM Blower Turbine",
    nameUa: "Високооборотна серверна турбіна",
    description: "Sounds like a fighter jet, but forces heat out fast.",
    descEn: "Sounds like a fighter jet, but forces heat out fast.",
    descUa: "Шумить як винищувач, але збиває температуру.",
    type: "cooling",
    baseCost: 2400,
    power: 3.2,
    levelRequired: 3,
    icon: "Fan",
  },
  {
    id: "water_cooling",
    name: "Custom Copper Water Loop (AIO)",
    nameEn: "Custom Copper Water Loop (AIO)",
    nameUa: "Кастомна мідна водянка (СВО)",
    description: "Copper waterblocks and a massive 420mm radiator.",
    descEn: "Copper waterblocks and a massive 420mm radiator.",
    descUa: "Мідні водоблоки та великий радіатор 420мм.",
    type: "cooling",
    baseCost: 15000,
    power: 8.5,
    levelRequired: 4,
    icon: "Droplets",
  },
  {
    id: "industrial_chiller",
    name: "Industrial Freon Chiller",
    nameEn: "Industrial Freon Chiller",
    nameUa: "Промисловий фреоновий чиллер",
    description: "Cools the server room down to sub-zero fog.",
    descEn: "Cools the server room down to sub-zero fog.",
    descUa: "Кондиціонування приміщення до холодного туману.",
    type: "cooling",
    baseCost: 90000,
    power: 22,
    levelRequired: 6,
    icon: "Snowflake",
  },
  {
    id: "immersion_tank",
    name: "Dielectric Immersion Oil Bath",
    nameEn: "Dielectric Immersion Oil Bath",
    nameUa: "Імерсійна ванна з діелектриком",
    description: "Motherboards submerged entirely in non-conductive synthetic coolant.",
    descEn: "Motherboards submerged entirely in non-conductive synthetic coolant.",
    descUa: "Плати повністю занурені в мінеральну охолоджуючу оливу.",
    type: "cooling",
    baseCost: 550000,
    power: 58,
    levelRequired: 7,
    icon: "Waves",
  },
  {
    id: "cryo_nitrogen",
    name: "Liquid Nitrogen Cryo Station",
    nameEn: "Liquid Nitrogen Cryo Station",
    nameUa: "Кріостанція рідкого азоту",
    description: "Extreme sub-ambient chill reaching -196°C.",
    descEn: "Extreme sub-ambient chill reaching -196°C.",
    descUa: "Температура охолодження до -196°C.",
    type: "cooling",
    baseCost: 4500000,
    power: 160,
    levelRequired: 9,
    icon: "Snowflake",
  },
  {
    id: "permafrost_bunker",
    name: "Svalbard Permafrost Bunker",
    nameEn: "Svalbard Permafrost Bunker",
    nameUa: "Бункер у вічній мерзлоті (Шпіцберген)",
    description: "Natural sub-Arctic permafrost isolates against catastrophic heat.",
    descEn: "Natural sub-Arctic permafrost isolates against catastrophic heat.",
    descUa: "Природний арктичний холод захищає від будь-якого жару.",
    type: "cooling",
    baseCost: 35000000,
    power: 450,
    levelRequired: 11,
    icon: "Shield",
  },
  {
    id: "superconducting_helium",
    name: "Superconducting Liquid Helium",
    nameEn: "Superconducting Liquid Helium",
    nameUa: "Надпровідна гелієва система",
    description: "Quantum thermal conductivity nearing absolute zero.",
    descEn: "Quantum thermal conductivity nearing absolute zero.",
    descUa: "Квантове охолодження близьке до абсолютного нуля.",
    type: "cooling",
    baseCost: 300000000,
    power: 1500,
    levelRequired: 13,
    icon: "Atom",
  },
  {
    id: "space_radiator",
    name: "Deep Space Vacuum Radiator",
    nameEn: "Deep Space Vacuum Radiator",
    nameUa: "Вакуумний космічний терморадіатор",
    description: "Radiates gigawatts of heat directly into deep cosmic vacuum.",
    descEn: "Radiates gigawatts of heat directly into deep cosmic vacuum.",
    descUa: "Розсіює гігавати тепла прямо у відкритий космос.",
    type: "cooling",
    baseCost: 3000000000,
    power: 6000,
    levelRequired: 14,
    icon: "Orbit",
  },

  // ==================== SOFTWARE ====================
  {
    id: "phishing_bot",
    name: "Telegram Airdrop Phishing Bot",
    nameEn: "Telegram Airdrop Phishing Bot",
    nameUa: "Telegram-фішинг спамер",
    description: "Spams fake 'Free 500 USDT Claim' links to gullible groups.",
    descEn: "Spams fake 'Free 500 USDT Claim' links to gullible groups.",
    descUa: "Розсилає фейкові посилання на «Free Airdrop 500 USDT».",
    type: "software",
    baseCost: 50,
    power: 0.6,
    levelRequired: 1,
    icon: "Bot",
  },
  {
    id: "fake_metamask",
    name: "Cloned MetaMask Extension",
    nameEn: "Cloned MetaMask Extension",
    nameUa: "Фейкова сторінка розширення MetaMask",
    description: "Snags hurriedly pasted seed phrases from search ads.",
    descEn: "Snags hurriedly pasted seed phrases from search ads.",
    descUa: "Перехоплює поспіхом введені seed-фрази користувачів.",
    type: "software",
    baseCost: 320,
    power: 2.5,
    levelRequired: 2,
    icon: "Globe",
  },
  {
    id: "clipper",
    name: "Clipboard Address Clipper",
    nameEn: "Clipboard Address Clipper",
    nameUa: "Clipper-троян у буфері",
    description: "Quietly replaces copied crypto addresses with your own wallet.",
    descEn: "Quietly replaces copied crypto addresses with your own wallet.",
    descUa: "Тихо підміняє криптоадреси при копіюванні.",
    type: "software",
    baseCost: 1800,
    power: 10,
    levelRequired: 3,
    icon: "Copy",
  },
  {
    id: "xmr_botnet",
    name: "Stealth Monero IoT Botnet",
    nameEn: "Stealth Monero IoT Botnet",
    nameUa: "Прихований ботнет Monero",
    description: "Silently mines XMR on compromised smart TVs and routers.",
    descEn: "Silently mines XMR on compromised smart TVs and routers.",
    descUa: "Майнить XMR на заражених смарт-ТВ та роутерах.",
    type: "software",
    baseCost: 12000,
    power: 48,
    levelRequired: 4,
    icon: "Network",
  },
  {
    id: "dex_sniper",
    name: "Uniswap Pool Sniper",
    nameEn: "Uniswap Pool Sniper",
    nameUa: "Снайпер нових пулів Uniswap",
    description: "Instantly scoops first-block supply on newly deployed memecoins.",
    descEn: "Instantly scoops first-block supply on newly deployed memecoins.",
    descUa: "Миттєво викуповує перші токени мемкоїнів при лістингу.",
    type: "software",
    baseCost: 75000,
    power: 220,
    levelRequired: 5,
    icon: "Zap",
  },
  {
    id: "mev_bot",
    name: "Memepool MEV Sandwich Bot",
    nameEn: "Memepool MEV Sandwich Bot",
    nameUa: "MEV sandwich-бот у мемпулі",
    description: "Frontruns and backruns high-slippage decentralized trades.",
    descEn: "Frontruns and backruns high-slippage decentralized trades.",
    descUa: "Фронтранить великі транзакції перед валідацією блоку.",
    type: "software",
    baseCost: 450000,
    power: 980,
    levelRequired: 6,
    icon: "Flame",
  },
  {
    id: "flashloan_fuzzer",
    name: "Flash Loan Arbitrage Fuzzer",
    nameEn: "Flash Loan Arbitrage Fuzzer",
    nameUa: "Flash Loan арбітражний фазер",
    description: "Takes multi-million uncollateralized loans to exploit oracle desyncs.",
    descEn: "Takes multi-million uncollateralized loans to exploit oracle desyncs.",
    descUa: "Автоматично бере мільйонні позики без застави для арбітражу.",
    type: "software",
    baseCost: 2800000,
    power: 4500,
    levelRequired: 8,
    icon: "Scale",
  },
  {
    id: "contract_drainer",
    name: "Universal EVM Permit2 Drainer",
    nameEn: "Universal EVM Permit2 Drainer",
    nameUa: "Універсальний EVM Drainer",
    description: "Tricks users into gasless infinite signature approvals.",
    descEn: "Tricks users into gasless infinite signature approvals.",
    descUa: "Експлуатує небезпечні Permit2 та approve-підписи гаманців.",
    type: "software",
    baseCost: 18000000,
    power: 24000,
    levelRequired: 9,
    icon: "Terminal",
  },
  {
    id: "zero_day",
    name: "Zero-Day Exploit Broker",
    nameEn: "Zero-Day Exploit Broker",
    nameUa: "Zero-day брокер вразливостей",
    description: "Trades compiler bugs and cross-contract reentrancy vulnerabilities.",
    descEn: "Trades compiler bugs and cross-contract reentrancy vulnerabilities.",
    descUa: "Знаходить reentrancy та помилки компілятора Solidity/Vyper.",
    type: "software",
    baseCost: 120000000,
    power: 130000,
    levelRequired: 11,
    icon: "Binary",
  },
  {
    id: "ai_agent",
    name: "Autonomous LLM Hack Agent",
    nameEn: "Autonomous LLM Hack Agent",
    nameUa: "Автономний AI-агент зламу бірж",
    description: "AI continuously decompiles and exploits smart contracts in real time.",
    descEn: "AI continuously decompiles and exploits smart contracts in real time.",
    descUa: "Шукає розсинхрон цін та дефекти ліквідації через LLM.",
    type: "software",
    baseCost: 850000000,
    power: 750000,
    levelRequired: 12,
    icon: "BrainCircuit",
  },
  {
    id: "global_exploit_grid",
    name: "Global Shadow Exploit Grid",
    nameEn: "Global Shadow Exploit Grid",
    nameUa: "Глобальна тіньова нейромережа",
    description: "Hundreds of cloud nodes executing coordinated 51% reorganization attacks.",
    descEn: "Hundreds of cloud nodes executing coordinated 51% reorganization attacks.",
    descUa: "Сотні серверів координують атаки 51% на молоді мережі.",
    type: "software",
    baseCost: 6000000000,
    power: 4200000,
    levelRequired: 14,
    icon: "Globe",
  },
  {
    id: "skynet_web3",
    name: "Skynet Web3 Syndicate",
    nameEn: "Skynet Web3 Syndicate",
    nameUa: "Квантовий синдикат «Skynet Web3»",
    description: "Deploys entire synthetic DEXs, pumps tokens, and drains liquidity automatically.",
    descEn: "Deploys entire synthetic DEXs, pumps tokens, and drains liquidity automatically.",
    descUa: "Сам створює біржі, пампить токени й сам же забирає ліквідність.",
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
  titleEn: string;
  titleUa: string;
  reference: string;
  referenceEn: string;
  referenceUa: string;
  requiredLevel: number;
  loot: number;
  heat: number;
  cooldownSec: number;
  rounds: number;
  seqLength: number;
  timeSec: number;
  hidden: boolean;
}

export function getTargetTitle(t: TargetDef, lang: Lang): string {
  return lang === "ua" ? t.titleUa : t.titleEn;
}

export function getTargetRef(t: TargetDef, lang: Lang): string {
  return lang === "ua" ? t.referenceUa : t.referenceEn;
}

export const TARGETS: TargetDef[] = [
  {
    id: "discord_drainer",
    title: "Discord Web3 Drainer",
    titleEn: "Discord Web3 Drainer",
    titleUa: "Спам-дрейнер Discord",
    reference: "Inferno Drainer mass phishing campaigns",
    referenceEn: "Inferno Drainer mass phishing campaigns",
    referenceUa: "Inferno Drainer (масовий фішинг)",
    requiredLevel: 2,
    loot: 2500,
    heat: 12,
    cooldownSec: 90,
    rounds: 1,
    seqLength: 3,
    timeSec: 12,
    hidden: false,
  },
  {
    id: "seed_phish",
    title: "Fake Mobile App Store Wallet",
    titleEn: "Fake Mobile App Store Wallet",
    titleUa: "Фейковий гаманець у App Store",
    reference: "Harvesting seed phrases from mobile users",
    referenceEn: "Harvesting seed phrases from mobile users",
    referenceUa: "Фішинг seed-фраз мобільних юзерів",
    requiredLevel: 3,
    loot: 18000,
    heat: 16,
    cooldownSec: 180,
    rounds: 2,
    seqLength: 4,
    timeSec: 12,
    hidden: false,
  },
  {
    id: "vanity",
    title: "Vanity Address Entropy Crack",
    titleEn: "Vanity Address Entropy Crack",
    titleUa: "Злам генератора адрес",
    reference: "Wintermute / Profanity $160M exploit",
    referenceEn: "Wintermute / Profanity $160M exploit",
    referenceUa: "Wintermute / Profanity, $160M",
    requiredLevel: 4,
    loot: 150000,
    heat: 22,
    cooldownSec: 300,
    rounds: 2,
    seqLength: 4,
    timeSec: 11,
    hidden: true,
  },
  {
    id: "euler",
    title: "DeFi Liquidation eToken Inversion",
    titleEn: "DeFi Liquidation eToken Inversion",
    titleUa: "Збій ліквідації DeFi",
    reference: "Euler Finance eToken/dToken bug ($197M)",
    referenceEn: "Euler Finance eToken/dToken bug ($197M)",
    referenceUa: "Euler Finance eToken баг, $197M",
    requiredLevel: 6,
    loot: 1.2e6,
    heat: 28,
    cooldownSec: 500,
    rounds: 3,
    seqLength: 5,
    timeSec: 11,
    hidden: true,
  },
  {
    id: "curve",
    title: "Vyper Compiler Reentrancy Lock",
    titleEn: "Vyper Compiler Reentrancy Lock",
    titleUa: "Баг компілятора Vyper",
    reference: "Curve Finance pools exploit ($73M)",
    referenceEn: "Curve Finance pools exploit ($73M)",
    referenceUa: "Curve Finance reentrancy, $73M",
    requiredLevel: 7,
    loot: 8.5e6,
    heat: 34,
    cooldownSec: 800,
    rounds: 3,
    seqLength: 5,
    timeSec: 10,
    hidden: true,
  },
  {
    id: "ronin",
    title: "Sidechain Validator Key Compromise",
    titleEn: "Sidechain Validator Key Compromise",
    titleUa: "Ключі валідаторів сайдчейну",
    reference: "Ronin Network (Lazarus, 5/9 keys, $620M)",
    referenceEn: "Ronin Network (Lazarus, 5/9 keys, $620M)",
    referenceUa: "Ronin Network (Lazarus, 5/9 валідаторів, $620M)",
    requiredLevel: 9,
    loot: 6.5e7,
    heat: 42,
    cooldownSec: 1200,
    rounds: 3,
    seqLength: 6,
    timeSec: 10,
    hidden: true,
  },
  {
    id: "wormhole",
    title: "Bridge Signature Forgery",
    titleEn: "Bridge Signature Forgery",
    titleUa: "Підробка підпису мосту Solana",
    reference: "Wormhole Bridge Solana exploit ($320M)",
    referenceEn: "Wormhole Bridge Solana exploit ($320M)",
    referenceUa: "Wormhole Bridge exploit, $320M",
    requiredLevel: 10,
    loot: 4.5e8,
    heat: 50,
    cooldownSec: 1800,
    rounds: 4,
    seqLength: 6,
    timeSec: 9,
    hidden: true,
  },
  {
    id: "bybit",
    title: "Treasury Blind Signing Injection",
    titleEn: "Treasury Blind Signing Injection",
    titleUa: "Сліпе підписання казначейства",
    reference: "Bybit Historic Safe Heist ($1.5B, 2025)",
    referenceEn: "Bybit Historic Safe Heist ($1.5B, 2025)",
    referenceUa: "Bybit Historic Safe Heist, $1.5B (2025)",
    requiredLevel: 12,
    loot: 4e9,
    heat: 62,
    cooldownSec: 2500,
    rounds: 4,
    seqLength: 7,
    timeSec: 9,
    hidden: true,
  },
  {
    id: "poly_network",
    title: "Cross-Chain Keeper Keeper Override",
    titleEn: "Cross-Chain Keeper Override",
    titleUa: "Підміна списку зберігачів",
    reference: "Poly Network cross-chain hack ($611M)",
    referenceEn: "Poly Network cross-chain hack ($611M)",
    referenceUa: "Poly Network cross-chain хак, $611M",
    requiredLevel: 13,
    loot: 2.5e10,
    heat: 70,
    cooldownSec: 3600,
    rounds: 5,
    seqLength: 7,
    timeSec: 8,
    hidden: true,
  },
  {
    id: "satoshi",
    title: "Satoshi Nakamoto Genesis Vaults",
    titleEn: "Satoshi Nakamoto Genesis Vaults",
    titleUa: "Гаманці Сатоші Накамото",
    reference: "1.1 million Bitcoins from the Genesis block era",
    referenceEn: "1.1 million Bitcoins from the Genesis block era",
    referenceUa: "1.1 мільйона біткоїнів ери Genesis",
    requiredLevel: 15,
    loot: 1.5e11,
    heat: 85,
    cooldownSec: 5400,
    rounds: 5,
    seqLength: 8,
    timeSec: 8,
    hidden: true,
  },
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

// Lifetime earnings needed for each level (15 ranks)
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

export const LEVEL_TITLES_EN = [
  "Mom's Script Kiddie",
  "Airdrop Tap Farmer",
  "Discord Phishing Spammer",
  "School Wi-Fi Menace",
  "Basement Crypto Miner",
  "IoT Botnet Overlord",
  "GitHub Secret Hunter",
  "Vyper DeFi Bug Hunter",
  "MEV Sandwich Predator",
  "Tornado Cash VIP Client",
  "Cross-Chain Bridge Exploiter",
  "Shadow Market Maker",
  "Interpol Red Notice Phantom",
  "State-Sponsored Lazarus Syndicate",
  "Genesis Ghost of Satoshi",
];

export const LEVEL_TITLES_UA = [
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

export const LEVEL_TITLES = LEVEL_TITLES_EN;

export const LEVEL_DESCRIPTIONS_EN = [
  "Googling 'how to hack the pentagon in notepad without viruses'.",
  "Spamming Telegram groups with referral links and tapping the hamster all day.",
  "Sending fake 'Free 3 Months Discord Nitro' links into private DMs.",
  "Sniffing classmate passwords using an ancient Wireshark build in computer class.",
  "Mining Monero on an old microwave, utterly baffled by the electric bill.",
  "Enslaved 10,000 smart kettles, robot vacuums & IP cameras into a silent army.",
  "Scraping public GitHub repos for accidentally committed .env files and private keys.",
  "Exploited a $10M smart contract reentrancy bug and insisted it was an intentional feature.",
  "Frontrunning retail memepool orders by 0.002 seconds for fat sandwich profits.",
  "Permanent VIP client of crypto mixers, holds 4 offshore passports and a Dubai penthouse.",
  "Compromised 5 of 9 validator keys and bridged out 300,000 ETH during lunch break.",
  "Controls Ethereum gas prices and crashes entire altcoins with a single 2-word tweet.",
  "On Interpol's Red Notice list, yet casually sipping coconut water on a Bali beach.",
  "Intelligence agencies from three continents accuse each other of backing his operations.",
  "Holds the keys to the Genesis block and could crash global fiat with a single signature.",
];

export const LEVEL_DESCRIPTIONS_UA = [
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

export const LEVEL_DESCRIPTIONS = LEVEL_DESCRIPTIONS_EN;

export function getLevelTitle(level: number, lang: Lang): string {
  const titles = lang === "ua" ? LEVEL_TITLES_UA : LEVEL_TITLES_EN;
  return titles[level - 1] ?? (lang === "ua" ? "Сатоші" : "Satoshi");
}

export function getLevelDesc(level: number, lang: Lang): string {
  const descs = lang === "ua" ? LEVEL_DESCRIPTIONS_UA : LEVEL_DESCRIPTIONS_EN;
  return descs[level - 1] ?? "";
}

export interface PerkDef {
  id: string;
  name: string;
  nameEn: string;
  nameUa: string;
  description: string;
  descEn: string;
  descUa: string;
  maxLevel: number;
  baseCost: number; // credibility
}

export function getPerkName(p: PerkDef, lang: Lang): string {
  return lang === "ua" ? p.nameUa : p.nameEn;
}

export function getPerkDesc(p: PerkDef, lang: Lang): string {
  return lang === "ua" ? p.descUa : p.descEn;
}

export const PERKS: PerkDef[] = [
  {
    id: "income",
    name: "Wider Network",
    nameEn: "Wider Network",
    nameUa: "Ширша мережа",
    description: "+15% passive income per level",
    descEn: "+15% passive income per level",
    descUa: "+15% пасивного доходу за рівень",
    maxLevel: 10,
    baseCost: 1,
  },
  {
    id: "tap",
    name: "Rapid Fingers",
    nameEn: "Rapid Fingers",
    nameUa: "Швидкі пальці",
    description: "+25% tap power per level",
    descEn: "+25% tap power per level",
    descUa: "+25% сили тапу за рівень",
    maxLevel: 10,
    baseCost: 1,
  },
  {
    id: "laundry",
    name: "Personal Mixer",
    nameEn: "Personal Mixer",
    nameUa: "Свій міксер",
    description: "−2.5% Tornado Cash laundering fee per level",
    descEn: "−2.5% Tornado Cash laundering fee per level",
    descUa: "−2.5% комісії відмивання через Tornado",
    maxLevel: 5,
    baseCost: 2,
  },
  {
    id: "stealth",
    name: "Shadow Proxy",
    nameEn: "Shadow Proxy",
    nameUa: "Тіньовий проксі",
    description: "−12% FBI threat generated from operations per level",
    descEn: "−12% FBI threat generated from operations per level",
    descUa: "−12% загрози FBI від усіх операцій",
    maxLevel: 5,
    baseCost: 2,
  },
  {
    id: "cooling",
    name: "Cryo Optimization",
    nameEn: "Cryo Optimization",
    nameUa: "Кріо-оптимізація",
    description: "+20% cooling efficiency from all coolers per level",
    descEn: "+20% cooling efficiency from all coolers per level",
    descUa: "+20% ефективності всіх систем охолодження",
    maxLevel: 5,
    baseCost: 2,
  },
  {
    id: "offline",
    name: "Botnet Autopilot",
    nameEn: "Botnet Autopilot",
    nameUa: "Автопілот ботнету",
    description: "+1.5h offline earnings duration per level",
    descEn: "+1.5h offline earnings duration per level",
    descUa: "+1.5 год офлайн-доходу за рівень",
    maxLevel: 6,
    baseCost: 2,
  },
  {
    id: "hacker",
    name: "Cold Head",
    nameEn: "Cold Head",
    nameUa: "Холодна голова",
    description: "+1.5s per minigame hack round per level",
    descEn: "+1.5s per minigame hack round per level",
    descUa: "+1.5с на кожен раунд міні-гри злому",
    maxLevel: 5,
    baseCost: 3,
  },
];

export interface AchievementDef {
  id: string;
  title: string;
  titleEn: string;
  titleUa: string;
  description: string;
  descEn: string;
  descUa: string;
  reward: number; // credibility
}

export function getAchTitle(a: AchievementDef, lang: Lang): string {
  return lang === "ua" ? a.titleUa : a.titleEn;
}

export function getAchDesc(a: AchievementDef, lang: Lang): string {
  return lang === "ua" ? a.descUa : a.descEn;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "tap_1", title: "First Transaction", titleEn: "First Transaction", titleUa: "Перша транзакція", description: "Make your very first terminal tap", descEn: "Make your very first terminal tap", descUa: "Зробіть перший тап по терміналу", reward: 0 },
  { id: "tap_1k", title: "Calloused Fingers", titleEn: "Calloused Fingers", titleUa: "Мозолі на пальцях", description: "1,000 successful taps", descEn: "1,000 successful taps", descUa: "1 000 успішних тапів", reward: 1 },
  { id: "tap_10k", title: "Living Botnet", titleEn: "Living Botnet", titleUa: "Живий ботнет", description: "10,000 taps executed", descEn: "10,000 taps executed", descUa: "10 000 тапів", reward: 3 },
  { id: "earn_10k", title: "First Stash", titleEn: "First Stash", titleUa: "Перші гроші", description: "Earn $10K all-time", descEn: "Earn $10K all-time", descUa: "Заробіть $10K за весь час", reward: 0 },
  { id: "earn_1m", title: "Crypto Millionaire", titleEn: "Crypto Millionaire", titleUa: "Крипто-мільйонер", description: "Earn $1M all-time", descEn: "Earn $1M all-time", descUa: "Заробіть $1M за весь час", reward: 2 },
  { id: "earn_1b", title: "Shadow Billionaire", titleEn: "Shadow Billionaire", titleUa: "Тіньовий мільярдер", description: "Earn $1B all-time", descEn: "Earn $1B all-time", descUa: "Заробіть $1B за весь час", reward: 5 },
  { id: "hack_1", title: "First Infiltration", titleEn: "First Infiltration", titleUa: "Перший злам", description: "Successfully execute a target operation", descEn: "Successfully execute a target operation", descUa: "Успішно виконайте операцію з рейдів", reward: 1 },
  { id: "hack_25", title: "Serial Cyber Infiltrator", titleEn: "Serial Cyber Infiltrator", titleUa: "Серійний кіберзломщик", description: "25 successful operations", descEn: "25 successful operations", descUa: "25 успішних операцій", reward: 3 },
  { id: "wash_1", title: "Clean Hands", titleEn: "Clean Hands", titleUa: "Чисті руки", description: "Wash dirty crypto through Tornado Cash", descEn: "Wash dirty crypto through Tornado Cash", descUa: "Відмийте брудні гроші через Tornado Cash", reward: 1 },
  { id: "raid_survive", title: "Evaded the Raid", titleEn: "Evaded the Raid", titleUa: "Втік від облави", description: "Survive a cyber police raid", descEn: "Survive a cyber police raid", descUa: "Переживіть рейд кіберполіції", reward: 1 },
  { id: "trade_profit", title: "Profitable Trader", titleEn: "Profitable Trader", titleUa: "Успішний трейдер", description: "Sell cryptocurrency at the peak with profit", descEn: "Sell cryptocurrency at the peak with profit", descUa: "Продайте крипту на піку з прибутком", reward: 1 },
  { id: "contract_10", title: "Trusted Contractor", titleEn: "Trusted Contractor", titleUa: "Надійний підрядник", description: "Complete 10 darknet contracts", descEn: "Complete 10 darknet contracts", descUa: "Виконайте 10 контрактів даркнету", reward: 2 },
  { id: "milestone", title: "Industrial Scaling", titleEn: "Industrial Scaling", titleUa: "Промислове масштабування", description: "Own 25 units of any single upgrade", descEn: "Own 25 units of any single upgrade", descUa: "Купіть 25 одиниць будь-якого апгрейду", reward: 1 },
  { id: "level_10", title: "Darknet VIP", titleEn: "Darknet VIP", titleUa: "VIP Даркнету", description: "Reach Hacker Rank 10", descEn: "Reach Hacker Rank 10", descUa: "Досягніть 10-го рівня хакера", reward: 4 },
  { id: "level_15", title: "Ghost of Satoshi", titleEn: "Ghost of Satoshi", titleUa: "Привид Сатоші", description: "Reach maximum Hacker Rank 15", descEn: "Reach maximum Hacker Rank 15", descUa: "Досягніть максимального 15-го рівня", reward: 10 },
];
