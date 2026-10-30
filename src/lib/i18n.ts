// Internationalization (i18n) system for Crypto Hacker Simulator
// Default language: English ("en")

export type Lang = "en" | "ua";

export const DEFAULT_LANG: Lang = "en";

export const DICT = {
  en: {
    // Header & Meta
    appTitle: "Crypto Hacker Simulator — Cyber Clicker",
    connectingTor: "Connecting to secure TOR network...",
    cleanBalance: "Clean Cash",
    dirtyCrypto: "Dirty Crypto",
    reputation: "Reputation",
    throttlingAlert: "THROTTLED ×0.4",
    fbiThreat: "FBI Threat",
    maxLevel: "MAX",
    rankPrefix: "Rank",

    // Tabs
    tabTerminal: "Terminal",
    tabShop: "Black Market",
    tabOps: "Operations",
    tabContracts: "Contracts",
    tabMarket: "Exchange",
    tabDarknet: "Darknet",

    // Mobile nav (short)
    navTerminal: "Terminal",
    navShop: "Shop",
    navOps: "Ops",
    navContracts: "Quests",
    navMarket: "DEX",
    navDarknet: "Darknet",

    // Terminal Tab
    tapPowerWithCombo: "Tap Power (with combo)",
    constantBaseTap: "Permanent Base:",
    comboSpeed: "Combo Speed",
    comboHint: "Base power never drops! Rapid taps multiply it exponentially.",
    criticalOverheat: "CRITICAL OVERHEAT (>92°C)! Hardware may burn out!",
    throttlingNotice: "Throttling (>85°C): profits slashed by 60%!",
    coolingStable: "Cooling Stable",
    nitrogenPurge: "Purge",
    thermalBalance: "Balance:",
    dirtyCryptoWarning: "Dirty Crypto (seizure risk!)",
    threatNotice: "FBI Threat:",
    washViaTornado: "Wash via Tornado Cash",
    rootTerminal: "root@shadow:~# tail -f ops.log",

    // Shop Tab
    blackMarketTitle: "Black Market Hardware",
    milestoneHint: "Every 25 owned units doubles output",
    tabSoftware: "Software · Passive",
    tabHardware: "Hardware · Tap",
    tabCooling: "Cooling · Temp",
    unitTap: "+{val} to tap power",
    unitSoftware: "+{val}/s passive",
    unitCooling: "−{val}°C/s cooling",
    thermalBalanceLabel: "Server Temp · Heat balance:",
    burnoutDanger: "CRITICAL HEAT! Hardware will burn out without cooling!",
    throttledState: "THROTTLED: frequencies dropped, all revenue cut by 60%!",
    coolingFine: "Temperature nominal. Cooling handles the thermal load.",
    coolingFaq: "Why cooling matters: Rigs generate heat. At 85°C, income drops 2.5x. Above 92°C, top hardware can burn out!",
    buyBtn: "Buy",
    lockedBtn: "Locked",
    eachUnit: "each",
    toDoubling: "to ×2",
    unlockAtLvl: "Unlocks at Hacker Level {lvl}",

    // Operations Tab
    operationsTitle: "Target Heists",
    gasLabel: "Gas:",
    fbiPoliceThreat: "Cyber Police Threat",
    raid100Warning: "At 100% — Police Raid: −75% dirty and −15% clean funds.",
    wipeTraces: "Wipe Traces & Burners",
    washAllTornado: "Wash via Tornado Cash",
    mixerFeeDesc: "Mixer fee {fee}%. Washing drops FBI threat by 25%.",
    lootLabel: "Loot",
    threatLabel: "Threat",
    hackTypeLabel: "Hack",
    attackBtn: "Infiltrate · Gas {val}",
    levelRequiredBtn: "Level {lvl}",

    // Contracts Tab
    contractsTitle: "Darknet Contracts",
    refreshIn: "Refresh in {time}",
    contractsSubtitle: "Underground bounties. Refresh every 15 minutes — claim rewards before they expire.",
    contractProgress: "Progress",
    rewardLabel: "Reward:",
    completedStatus: "Completed",
    claimBtn: "Claim",
    goalTaps: "Perform {goal} terminal taps",
    goalEarn: "Earn {goal} in cash",
    goalHacks: "Successfully infiltrate {goal} {targets}",
    goalWash: "Wash {goal} through mixer",
    goalBuy: "Purchase {goal} upgrades",
    targetWordSingle: "target",
    targetWordPlural: "targets",

    // Market Tab
    exchangeTitle: "Crypto Exchange",
    marketUpdateHint: "Prices update every 5s",
    exchangeSubtitle: "Buy the dip, sell the rip. Memecoins can moon or crash violently.",
    positionLabel: "Holding {val}",
    pnlLabel: "PnL {val}",
    btn25: "25%",
    btnAll: "100%",
    btnSell: "Sell",

    // Darknet Tab
    darknetRepTitle: "Darknet Reputation",
    permanentBonusHint: "Permanent income bonus: +{val}%",
    cleanSlateTitle: "Operation «Clean Slate» — Burn passports & flee offshore",
    reputationFaq: "Why reputation matters: Each 1 reputation point grants a permanent +5% boost to ALL revenue (taps and botnets) forever, even after resetting! Also used to purchase shadow perks.",
    spendableRep: "Available to spend:",
    totalRep: "Total accumulated:",
    multiplierLabel: "multiplier ×{val}",
    nextRepAt: "Next reputation point at {next} run earnings (current: {cur}).",
    fleeOffshoreBtn: "+{val} reputation",
    fleeReq: "Requires {val}",
    ranksTitle: "Shadow Hierarchy (15 Ranks)",
    ranksSubtitle: "Your street cred grows with total run earnings. Each rank unlocks deadlier exploits and elite rigs.",
    currentRankBadge: "★ Current Rank",
    perksTitle: "Shadow Perks (Permanent Upgrades)",
    maxPerkLevel: "Max Level",
    upgradePerkBtn: "Upgrade · {cost} rep",
    achievementsTitle: "Achievements",
    saveStatsTitle: "Local Storage & Stats",
    statTaps: "Taps:",
    statHacks: "Hacks:",
    statRaids: "Police Raids:",
    statContracts: "Contracts:",
    statEarned: "All-time Earned:",
    statPrestiges: "Offshore Escapes:",
    statRank: "Current Rank:",
    statSaved: "Auto-saved locally",
    copySaveBtn: "Copy Save to Clipboard",
    wipeSaveBtn: "Wipe save & start from scratch",
    saveCopiedAlert: "✅ Game save copied to clipboard! Keep it in a safe place.",
    confirmWipe: "WARNING! Are you sure you want to erase all progress and restart from scratch?",
    confirmPrestige: "Execute Operation «Clean Slate»?\n\nYour cash, rigs, and software will reset, but you will permanently gain +{gain} Darknet Reputation (+{pct}% to all earnings forever)!",

    // Crises
    crisisPoliceTitle: "Search Warrant!",
    crisisPoliceDesc: "Cyber police traced the IP. Bribe an insider or face a devastating raid.",
    crisisPoliceBtn: "Bribe · {cost}",
    crisisOverheatTitle: "Server Room Fire!",
    crisisOverheatDesc: "Cables are melting! Dispatch a technician before rigs burn out.",
    crisisOverheatBtn: "Call Tech · {cost}",
    crisisWhaleTitle: "Memepool Whale Sighted!",
    crisisWhaleDesc: "Unprotected massive transaction detected. Sandwich attack it now!",
    crisisWhaleBtn: "Frontrun +{val}",

    // Offline Modal
    offlineTitle: "While You Were Offline",
    offlineDesc: "Your stealth botnet mined in the shadows for {time}",
    offlineClaimBtn: "Collect Crypto",

    // Minigame
    minigameTitle: "SHELLCODE INJECTION",
    minigameStrikes: "STRIKES",
    minigameRound: "Round {cur}/{total}",
  },
  ua: {
    // Header & Meta
    appTitle: "Crypto Hacker Simulator — кібер-клікер",
    connectingTor: "Підключення до захищеної мережі TOR...",
    cleanBalance: "Чистий баланс",
    dirtyCrypto: "Брудні",
    reputation: "Репутація",
    throttlingAlert: "ТРОТЛІНГ ×0.4",
    fbiThreat: "Загроза FBI",
    maxLevel: "МАКСИМУМ",
    rankPrefix: "Ранг",

    // Tabs
    tabTerminal: "Термінал",
    tabShop: "Чорний ринок",
    tabOps: "Операції",
    tabContracts: "Контракти",
    tabMarket: "Біржа",
    tabDarknet: "Даркнет",

    // Mobile nav (short)
    navTerminal: "Термінал",
    navShop: "Ринок",
    navOps: "Атаки",
    navContracts: "Квести",
    navMarket: "DEX",
    navDarknet: "Даркнет",

    // Terminal Tab
    tapPowerWithCombo: "Сила тапу (з комбо)",
    constantBaseTap: "Постійна базова:",
    comboSpeed: "Комбо-швидкість",
    comboHint: "Базова сила ніколи не зникає! Швидкі тапи множать її в рази.",
    criticalOverheat: "КРИТИЧНИЙ ЖАР (>92°C)! Залізо може згоріти!",
    throttlingNotice: "Тротлінг (>85°C): дохід урізано ×0.4!",
    coolingStable: "Охолодження стабільне",
    nitrogenPurge: "Продувка",
    thermalBalance: "Баланс:",
    dirtyCryptoWarning: "Брудна крипта (ризик конфіскації!)",
    threatNotice: "Загроза FBI:",
    washViaTornado: "Відмити через Tornado Cash",
    rootTerminal: "root@shadow:~# tail -f ops.log",

    // Shop Tab
    blackMarketTitle: "Чорний ринок обладнання",
    milestoneHint: "Кожні 25 одиниць одного типу подвоюють віддачу",
    tabSoftware: "Софт · Пасив",
    tabHardware: "Залізо · Тап",
    tabCooling: "Охолодження",
    unitTap: "+{val} до сили тапу",
    unitSoftware: "+{val}/с пасив",
    unitCooling: "−{val}°C/с охолодження",
    thermalBalanceLabel: "Температура серверної · Баланс:",
    burnoutDanger: "КРИТИЧНИЙ ПЕРЕГРІВ! Без охолодження залізо починає згоряти!",
    throttledState: "ТРОТЛІНГ: частоти скинуто, весь прибуток урізано на 60%!",
    coolingFine: "Температура в нормі. Охолодження повністю справляється з жаром.",
    coolingFaq: "Навіщо охолодження: Залізо гріється. Від 85°C дохід падає в 2.5 рази. Вище 92°C залізо згорає!",
    buyBtn: "Купити",
    lockedBtn: "Блок",
    eachUnit: "кожен",
    toDoubling: "до ×2",
    unlockAtLvl: "Відкривається на {lvl}-му рівні хакера",

    // Operations Tab
    operationsTitle: "Цільові операції",
    gasLabel: "Газ:",
    fbiPoliceThreat: "Загроза кіберполіції",
    raid100Warning: "На 100% — облава: −75% брудних і −15% чистих грошей.",
    wipeTraces: "Замести сліди",
    washAllTornado: "Відмити через Tornado Cash",
    mixerFeeDesc: "Комісія міксера {fee}%. Відмивання знижує загрозу на 25%.",
    lootLabel: "Здобич",
    threatLabel: "Загроза",
    hackTypeLabel: "Злом",
    attackBtn: "Атакувати · газ {val}",
    levelRequiredBtn: "Рівень {lvl}",

    // Contracts Tab
    contractsTitle: "Контракти",
    refreshIn: "Нові через {time}",
    contractsSubtitle: "Замовлення з даркнету. Оновлюються кожні 15 хвилин — забирай нагороду до оновлення.",
    contractProgress: "Прогрес",
    rewardLabel: "Нагорода:",
    completedStatus: "Виконано",
    claimBtn: "Забрати",
    goalTaps: "Зробити {goal} тапів",
    goalEarn: "Заробити {goal}",
    goalHacks: "Успішно зламати {goal} {targets}",
    goalWash: "Відмити {goal}",
    goalBuy: "Купити {goal} апгрейдів",
    targetWordSingle: "ціль",
    targetWordPlural: "цілей",

    // Market Tab
    exchangeTitle: "Біржа",
    marketUpdateHint: "Ціни оновлюються кожні 5с",
    exchangeSubtitle: "Купуй на просадці, продавай на піку. Мем-коїни можуть злетіти або обвалитись у рази.",
    positionLabel: "Позиція {val}",
    pnlLabel: "PnL {val}",
    btn25: "25%",
    btnAll: "Все",
    btnSell: "Продати",

    // Darknet Tab
    darknetRepTitle: "Репутація в Даркнеті",
    permanentBonusHint: "Постійний бонус доходу: +{val}%",
    cleanSlateTitle: "Операція «Чистий аркуш» — спалити паспорти та зникнути в офшорах",
    reputationFaq: "Навіщо потрібна репутація: Кожен 1 бал репутації дає +5% перманентного бусту до всього доходу (кліки та ботнети) назавжди! Також це валюта для перків.",
    spendableRep: "Доступно до витрат:",
    totalRep: "Загалом накопичено:",
    multiplierLabel: "множник ×{val}",
    nextRepAt: "Наступний бал на {next} заробітку (зараз {cur}).",
    fleeOffshoreBtn: "+{val} репутації",
    fleeReq: "Потрібно {val}",
    ranksTitle: "Тіньова ієрархія (15 рангів)",
    ranksSubtitle: "Твій авторитет зростає разом із заробітком. Кожен ранг відкриває нові операції та залізо.",
    currentRankBadge: "★ Поточний статус",
    perksTitle: "Тіньові перки (постійні бонуси)",
    maxPerkLevel: "Максимальний рівень",
    upgradePerkBtn: "Покращити · {cost} реп.",
    achievementsTitle: "Досягнення",
    saveStatsTitle: "Локальне збереження та статистика",
    statTaps: "Тапів:",
    statHacks: "Зламів:",
    statRaids: "Облав поліції:",
    statContracts: "Контрактів:",
    statEarned: "Усього зароблено:",
    statPrestiges: "Зникнень в офшори:",
    statRank: "Поточний рівень:",
    statSaved: "Збережено автоматично",
    copySaveBtn: "Скопіювати сейв у буфер",
    wipeSaveBtn: "Стерти весь прогрес і почати спочатку",
    saveCopiedAlert: "✅ Збереження скопійовано в буфер обміну! Збережіть його в надійному місці.",
    confirmWipe: "УВАГА! Ви впевнені, що хочете стерти збереження та почати все спочатку?",
    confirmPrestige: "Виконати операцію «Чистий аркуш»?\n\nВаші гроші та залізо будуть скинуті, але ви назавжди отримаєте +{gain} репутації (+{pct}% доходу назавжди)!",

    // Crises
    crisisPoliceTitle: "Ордер на обшук!",
    crisisPoliceDesc: "Кіберполіція вийшла на слід. Підкупи інформатора, або буде облава.",
    crisisPoliceBtn: "Підкупити · {cost}",
    crisisOverheatTitle: "Пожежа в серверній!",
    crisisOverheatDesc: "Проводка плавиться. Виклич техніка, або залізо згорить.",
    crisisOverheatBtn: "Викликати техніка · {cost}",
    crisisWhaleTitle: "Кит у мемпулі!",
    crisisWhaleDesc: "Величезна транзакція без захисту. Встигни перехопити сендвічем!",
    crisisWhaleBtn: "Перехопити +{val}",

    // Offline Modal
    offlineTitle: "Поки ти був офлайн",
    offlineDesc: "Ботнет непомітно працював у фоні {time}",
    offlineClaimBtn: "Забрати крипту",

    // Minigame
    minigameTitle: "ІН'ЄКЦІЯ ШЕЛЛКОДУ",
    minigameStrikes: "ПОМИЛКИ",
    minigameRound: "Раунд {cur}/{total}",
  },
} as const;

export type DictKey = keyof typeof DICT["en"];

export function getLang(): Lang {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return DEFAULT_LANG;
  }
  try {
    const saved = localStorage.getItem("app_lang") as Lang;
    return saved === "ua" ? "ua" : "en";
  } catch {
    return DEFAULT_LANG;
  }
}

export function setLang(lang: Lang): void {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      localStorage.setItem("app_lang", lang);
    } catch {}
  }
}

export function t(key: DictKey, lang: Lang, vars?: Record<string, string | number>): string {
  const dict = DICT[lang] || DICT.en;
  let str = (dict[key] || DICT.en[key] || key) as string;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return str;
}
