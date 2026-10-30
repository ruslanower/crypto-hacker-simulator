import { useState, useEffect, useRef } from 'react';
import { UpgradeItem, HackTarget, CryptoCoin, Achievement, CrisisEvent } from '../types/game';

const INITIAL_UPGRADES: UpgradeItem[] = [
  // HARDWARE
  { id: 'mouse_macro', name: 'Офісна мишка з макросом', description: 'Автоматизує подвійні кліки. +0.5 до сили тапу.', type: 'hardware', baseCost: 15, costMultiplier: 1.18, basePower: 0.5, icon: 'Mouse', levelRequired: 1, count: 0 },
  { id: 'mech_keyboard', name: 'Кастомна механічна клавіатура', description: 'Швидке введення шеллкодів. +3.5 до сили тапу.', type: 'hardware', baseCost: 180, costMultiplier: 1.18, basePower: 3.5, icon: 'Keyboard', levelRequired: 1, count: 0 },
  { id: 'cpu_multicore', name: 'Серверний 64-ядерний CPU', description: 'Швидкий підбір хешів RandomX (Monero). +18 до сили тапу.', type: 'hardware', baseCost: 1600, costMultiplier: 1.18, basePower: 18, icon: 'Cpu', levelRequired: 2, count: 0 },
  { id: 'gpu_mining_rig', name: 'Ферма з 8x RTX 5090', description: 'Розгін алгоритмів KawPow та Blake3. +95 до сили тапу.', type: 'hardware', baseCost: 12000, costMultiplier: 1.18, basePower: 95, icon: 'LayoutGrid', levelRequired: 2, count: 0 },
  { id: 'asic_container', name: 'ASIC-контейнер Antminer S21', description: 'Промисловий майнінг Bitcoin SHA-256. +500 до сили тапу.', type: 'hardware', baseCost: 85000, costMultiplier: 1.18, basePower: 500, icon: 'Server', levelRequired: 3, count: 0 },
  { id: 'quantum_emulator', name: 'Квантовий емулятор Shor', description: 'Факторинг ключів ECDSA secp256k1. +3,500 до сили тапу.', type: 'hardware', baseCost: 750000, costMultiplier: 1.18, basePower: 3500, icon: 'Zap', levelRequired: 4, count: 0 },

  // COOLING
  { id: 'case_fans', name: '120mm RGB Вентилятори', description: 'Базовий продув корпусу. Охолодження -3.5°C/s.', type: 'cooling', baseCost: 60, costMultiplier: 1.18, basePower: 3.5, icon: 'Fan', levelRequired: 1, count: 0 },
  { id: 'water_cooling', name: 'Кастомний контур СВО', description: 'Мідні водоблоки для відеокарт. Охолодження -15°C/s.', type: 'cooling', baseCost: 650, costMultiplier: 1.18, basePower: 15, icon: 'Droplets', levelRequired: 2, count: 0 },
  { id: 'immersion_tank', name: 'Імерсійна ванна з діелектриком', description: 'Занурення ригів у мінеральну оливу. Охолодження -55°C/s.', type: 'cooling', baseCost: 6500, costMultiplier: 1.18, basePower: 55, icon: 'Waves', levelRequired: 3, count: 0 },
  { id: 'cryo_nitrogen', name: 'Кріогенна станція (Рідкий Азот)', description: 'Екстремальне охолодження до -196°C. Охолодження -220°C/s.', type: 'cooling', baseCost: 55000, costMultiplier: 1.18, basePower: 220, icon: 'Snowflake', levelRequired: 4, count: 0 },

  // SOFTWARE (Passive CPS)
  { id: 'phishing_bot', name: 'Telegram Phishing Спамер', description: 'Розсилає фейкові ейрдропи мамонтам. +$1.8/сек пасивно.', type: 'software', baseCost: 65, costMultiplier: 1.18, basePower: 1.8, icon: 'Bot', levelRequired: 1, count: 0 },
  { id: 'clipper_malware', name: 'Clipper Trojan у буфер', description: 'Підміняє криптоадреси жертв на ваші. +$12/сек пасивно.', type: 'software', baseCost: 450, costMultiplier: 1.18, basePower: 12, icon: 'Copy', levelRequired: 1, count: 0 },
  { id: 'cryptojacking_botnet', name: 'Ботнет Monero (XMR)', description: 'Прихований майнінг на чужих ПК. +$65/сек.', type: 'software', baseCost: 3200, costMultiplier: 1.18, basePower: 65, icon: 'Network', levelRequired: 2, count: 0 },
  { id: 'mev_sandwich_bot', name: 'MEV Sandwich Бот (Uniswap)', description: 'Фронтраннить трейдерів у мемпулі. +$350/сек.', type: 'software', baseCost: 24000, costMultiplier: 1.18, basePower: 350, icon: 'Flame', levelRequired: 3, count: 0 },
  { id: 'flash_loan_scanner', name: 'Flash Loan Fuzzer', description: 'Шукає розсинхрон оракулів у DeFi пулах. +$1,800/сек.', type: 'software', baseCost: 180000, costMultiplier: 1.18, basePower: 1800, icon: 'Scale', levelRequired: 4, count: 0 },
  { id: 'zero_day_broker', name: 'Zero-Day Експлойт контрактів', description: 'Свіжі експлойти логіки проксі та reentrancy. +$12,000/сек.', type: 'software', baseCost: 1500000, costMultiplier: 1.18, basePower: 12000, icon: 'Terminal', levelRequired: 4, count: 0 },
];

const INITIAL_TARGETS: HackTarget[] = [
  { id: 'target_phish_run', title: 'Масовий спам-дрейнер Discord', subtitle: 'Фейковий мінт безкоштовних NFT токенів', realWorldReference: 'Класичний Web3 Drainer (PinkDrainer/Inferno)', requiredLevel: 1, potentialLoot: 1200, heatGenerated: 12, durationSeconds: 15, baseSuccessRate: 0.85, cooldownEndsAt: null, isCompletedOnce: false },
  { id: 'target_vanity_bruteforce', title: 'Злам генератора красивих адрес', subtitle: 'Дефект ентропії у Profanity', realWorldReference: 'Wintermute $160M Incident (2022)', requiredLevel: 2, potentialLoot: 20000, heatGenerated: 22, durationSeconds: 30, baseSuccessRate: 0.75, cooldownEndsAt: null, isCompletedOnce: false },
  { id: 'target_euler_reentrancy', title: 'Математичний збій ліквідації DeFi', subtitle: 'Дефект eToken/dToken у пулах застави', realWorldReference: 'Euler Finance $197M Exploit (2023)', requiredLevel: 3, potentialLoot: 200000, heatGenerated: 38, durationSeconds: 60, baseSuccessRate: 0.65, cooldownEndsAt: null, isCompletedOnce: false },
  { id: 'target_ronin_bridge', title: 'Компрометація валідаторів сайдчейну', subtitle: 'Захоплення 5 із 9 приватних ключів кворуму', realWorldReference: 'Ronin Network $620M Lazarus Hack (2022)', requiredLevel: 4, potentialLoot: 1800000, heatGenerated: 60, durationSeconds: 120, baseSuccessRate: 0.50, cooldownEndsAt: null, isCompletedOnce: false },
  { id: 'target_bybit_cold_storage', title: 'Сліпе підписання казначейства CEX №2', subtitle: 'Підміна пейлоаду через UI Safe розробника', realWorldReference: 'Bybit $1.5B Historic CEX Hack (Лютий 2025)', requiredLevel: 5, potentialLoot: 22000000, heatGenerated: 88, durationSeconds: 300, baseSuccessRate: 0.35, cooldownEndsAt: null, isCompletedOnce: false },
];

const INITIAL_COINS: CryptoCoin[] = [
  { symbol: 'BTC', name: 'Bitcoin', algorithm: 'SHA-256 (ASIC)', isMineable: true, price: 92450.0, change24h: 3.2 },
  { symbol: 'ETH', name: 'Ethereum', algorithm: 'PoS (Staking)', isMineable: false, price: 3420.0, change24h: 1.8 },
  { symbol: 'XMR', name: 'Monero', algorithm: 'RandomX (CPU)', isMineable: true, price: 185.0, change24h: 5.6 },
  { symbol: 'KAS', name: 'Kaspa', algorithm: 'kHeavyHash (ASIC)', isMineable: true, price: 0.16, change24h: -2.1 },
  { symbol: 'SOL', name: 'Solana', algorithm: 'PoH / PoS', isMineable: false, price: 198.5, change24h: 8.4 },
  { symbol: 'DOGE', name: 'Dogecoin', algorithm: 'Scrypt (Merged)', isMineable: true, price: 0.19, change24h: 12.5 },
  { symbol: 'RVN', name: 'Ravencoin', algorithm: 'KawPow (GPU)', isMineable: true, price: 0.024, change24h: 4.1 },
  { symbol: 'PEPE', name: 'Pepe Meme', algorithm: 'ERC-20 (DEX)', isMineable: false, price: 0.000012, change24h: -7.3 },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach_first_tap', title: 'Перша транзакція', description: 'Зробіть свій перший клік у терміналі.', rewardPrestige: 1.0, isUnlocked: false },
  { id: 'ach_1k_cash', title: 'Скрипт-кідді з района', description: 'Накопичіть $1,000 чистих коштів.', rewardPrestige: 2.0, isUnlocked: false },
  { id: 'ach_cryptojacker', title: 'Таємний криптомайнер', description: 'Запустіть прихований ботнет Monero.', rewardPrestige: 3.0, isUnlocked: false },
  { id: 'ach_first_wash', title: 'Мильний міксер', description: 'Відмийте свої перші брудні монети через Tornado Cash.', rewardPrestige: 4.0, isUnlocked: false },
  { id: 'ach_flash_master', title: 'Володар флеш-позик', description: 'Придбайте автономний сканер оракулів.', rewardPrestige: 5.0, isUnlocked: false },
  { id: 'ach_clean_slate', title: 'Новий паспорт', description: 'Здійсніть перший Престиж (Втеча в Панаму).', rewardPrestige: 10.0, isUnlocked: false },
  { id: 'ach_bybit_heist', title: 'Абсолютний хакер (Lazarus)', description: 'Успішно проведіть атаку рівня Bybit CEX.', rewardPrestige: 25.0, isUnlocked: false },
];

export function useGameState() {
  const [cash, setCash] = useState<number>(0);
  const [dirtyCash, setDirtyCash] = useState<number>(0);
  const [darknetCredibility, setDarknetCredibility] = useState<number>(0);
  const [totalEarnedLifetime, setTotalEarnedLifetime] = useState<number>(0);

  const [heat, setHeat] = useState<number>(0);
  const [hardwareTemperature, setHardwareTemperature] = useState<number>(40);
  const [gasGwei, setGasGwei] = useState<number>(35);
  const [currentCrisis, setCurrentCrisis] = useState<CrisisEvent | null>(null);

  const [tapsCount, setTapsCount] = useState<number>(0);
  const [hacksCount, setHacksCount] = useState<number>(0);
  const [isRaidTriggered, setIsRaidTriggered] = useState<boolean>(false);
  const [lastRaidMessage, setLastRaidMessage] = useState<string>('');

  const [upgrades, setUpgrades] = useState<UpgradeItem[]>(INITIAL_UPGRADES);
  const [targets, setTargets] = useState<HackTarget[]>(INITIAL_TARGETS);
  const [marketCoins, setMarketCoins] = useState<CryptoCoin[]>(INITIAL_COINS);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[*] ANTIGRAVITY CYBER TERMINAL v4.2 INITIALIZED',
    '[*] Connected to TOR hidden service .onion',
    '[*] Target environment: Web3 / EVM / Bitcoin Network',
    '[*] Ready for user commands. TAP to brute-force hashes...',
  ]);

  const stateRef = useRef({ cash, dirtyCash, darknetCredibility, totalEarnedLifetime, heat, hardwareTemperature, upgrades, targets, gasGwei, currentCrisis });
  stateRef.current = { cash, dirtyCash, darknetCredibility, totalEarnedLifetime, heat, hardwareTemperature, upgrades, targets, gasGwei, currentCrisis };

  // Prestige Multiplier: +5% per token
  const prestigeMultiplier = 1.0 + (darknetCredibility * 0.05);

  const isThermalThrottling = hardwareTemperature >= 85.0;

  // Player Level
  const playerLevel = totalEarnedLifetime < 500 ? 1 : totalEarnedLifetime < 25000 ? 2 : totalEarnedLifetime < 500000 ? 3 : totalEarnedLifetime < 50000000 ? 4 : 5;

  const playerLevelTitle = [
    '',
    'Гаражний скрипт-кідді',
    'Оператор ботнету',
    'DeFi експлойт-архітектор',
    'Міжланцюговий диверсант',
    'Глобальний кіберсиндикат (APT)'
  ][playerLevel];

  // Tap Power
  let baseTap = 0.25;
  upgrades.filter(u => u.type === 'hardware').forEach(u => { baseTap += u.count * u.basePower; });
  let tapPower = baseTap * prestigeMultiplier;
  if (isThermalThrottling) tapPower *= 0.4;
  tapPower = Math.max(0.05, tapPower);

  // Passive CPS
  let baseCps = 0;
  upgrades.filter(u => u.type === 'software').forEach(u => { baseCps += u.count * u.basePower; });
  let cashPerSecond = baseCps * prestigeMultiplier;
  if (isThermalThrottling) cashPerSecond *= 0.4;

  // Hashrate
  let baseHashrate = 5;
  upgrades.filter(u => u.type === 'hardware').forEach(u => { baseHashrate += u.count * 120; });
  let totalHashrate = baseHashrate * prestigeMultiplier;
  if (isThermalThrottling) totalHashrate *= 0.4;

  // Cooling Power
  let totalCoolingPower = 2.0;
  upgrades.filter(u => u.type === 'cooling').forEach(u => { totalCoolingPower += u.count * u.basePower; });

  const potentialPrestigeGain = totalEarnedLifetime < 20000 ? 0 : Math.max(0, Math.floor(Math.sqrt(totalEarnedLifetime / 20000)) - Math.floor(darknetCredibility));

  function pushLog(msg: string) {
    setTerminalLogs(prev => [...prev.slice(-35), msg]);
  }

  // Tap Terminal
  function tapTerminal() {
    setCash(c => c + tapPower);
    setTotalEarnedLifetime(t => t + tapPower);
    setTapsCount(t => t + 1);
    setHeat(h => Math.min(100, h + 0.05));
    setHardwareTemperature(temp => Math.min(105, temp + 0.04));

    if ((tapsCount + 1) % 7 === 0) {
      const logs = [
        '[OK] SHA-256 collision discovered: nonce 0x8f2a1b9',
        '[+] RPC Endpoint leaked private keys via 0xdeadbeef',
        '[!] Injected EVM opcode: DELEGATECALL to malicious contract',
        '[OK] Brute-forced vanity address: 0x777...0001',
        '[+] Clipper Trojan intercepted transfer of USDT',
        '[+] Unchecked return value exploited in withdraw()',
        '[!] Flashed $10M liquidity from Aave V3 lending pool',
      ];
      pushLog(`${logs[Math.floor(Math.random() * logs.length)]} (+$${tapPower.toFixed(2)})`);
    }
  }

  // Buy Upgrade
  function buyUpgrade(id: string) {
    const up = upgrades.find(u => u.id === id);
    if (!up) return false;
    const cost = up.baseCost * Math.pow(up.costMultiplier, up.count);
    if (cash >= cost) {
      setCash(c => c - cost);
      setUpgrades(prev => prev.map(u => u.id === id ? { ...u, count: u.count + 1 } : u));
      pushLog(`[+] Апгрейд придбано: ${up.name} x${up.count + 1}`);
      return true;
    }
    return false;
  }

  // Purge Fans
  function purgeCoolingFans() {
    setHardwareTemperature(t => Math.max(35, t - 18));
    pushLog('❄️ ЕКСТРЕНА ПРОДУВКА: Кулери на 100%! Температуру знижено на -18°C!');
  }

  // Prepare Target Attack
  function prepareTargetAttack(id: string): boolean {
    const target = targets.find(t => t.id === id);
    if (!target) return false;
    if (target.cooldownEndsAt && Date.now() < target.cooldownEndsAt) return false;
    if (playerLevel < target.requiredLevel) return false;

    const gasCost = (gasGwei * 0.45) * target.requiredLevel;
    if (cash < gasCost) {
      pushLog(`❌ НЕ ВИСТАЧАЄ ГАЗУ! Потрібно $${gasCost.toFixed(1)} (${gasGwei} Gwei)!`);
      return false;
    }

    setCash(c => c - gasCost);
    const cooldownTime = Date.now() + (target.durationSeconds * 1000);
    setTargets(prev => prev.map(t => t.id === id ? { ...t, cooldownEndsAt: cooldownTime } : t));
    pushLog(`⛽ Сплачено $${gasCost.toFixed(1)} газу (${gasGwei} Gwei). Початок ін'єкції...`);
    return true;
  }

  // Apply Target Result
  function applyTargetResult(id: string, isSuccess: boolean) {
    const target = targets.find(t => t.id === id);
    if (!target) return;

    if (isSuccess) {
      const loot = target.potentialLoot * (0.85 + Math.random() * 0.35);
      setDirtyCash(d => d + loot);
      setTotalEarnedLifetime(t => t + loot);
      setHacksCount(h => h + 1);
      setHeat(h => Math.min(100, h + target.heatGenerated));
      setTargets(prev => prev.map(t => t.id === id ? { ...t, isCompletedOnce: true } : t));
      pushLog(`🔥 УСПІХ ХАКУ! [${target.title}] приніс +$${loot.toFixed(0)} (Брудна крипта)`);
    } else {
      setHeat(h => Math.min(100, h + target.heatGenerated * 1.5));
      pushLog(`❌ ПРОВАЛ АТАКИ! [${target.title}] заблоковано фаєрволом! Загроза зросла!`);
    }
  }

  // Wash Dirty Crypto
  function washDirtyCrypto(amount: number) {
    if (amount <= 0 || dirtyCash < amount) return false;
    const feeRate = 0.12 + (gasGwei > 150 ? 0.04 : 0);
    const cleanReceived = amount * (1.0 - feeRate);
    setDirtyCash(d => d - amount);
    setCash(c => c + cleanReceived);
    setHeat(h => Math.max(0, h - 35));
    pushLog(`🌪️ Відмито $${amount.toFixed(0)} через Tornado Cash. Отримано $${cleanReceived.toFixed(0)}!`);
    return true;
  }

  // Emergency Cool Off
  function emergencyCoolOff() {
    const cost = Math.max(80, cash * 0.18);
    if (cash >= cost && heat > 0) {
      setCash(c => c - cost);
      setHeat(h => Math.max(0, h - 35));
      pushLog('🛡️ Знищено робочі пристрої, змінено IP/MAC. Рівень загрози впав на -35%!');
      return true;
    }
    return false;
  }

  // Resolve Crisis
  function resolveCrisis() {
    if (!currentCrisis) return;
    pushLog(`🛡️ КРИЗУ ЛІКВІДОВАНО: [${currentCrisis.title}] успішно нейтралізовано!`);
    if (currentCrisis.type === 'overheatingRigs') setHardwareTemperature(42);
    if (currentCrisis.type === 'policeWarrant') setHeat(h => Math.max(0, h - 40));
    if (currentCrisis.type === 'gasSpike') setGasGwei(25);
    setCurrentCrisis(null);
  }

  // Clean Slate Prestige
  function performCleanSlate() {
    if (potentialPrestigeGain <= 0) return false;
    setDarknetCredibility(d => d + potentialPrestigeGain);
    setCash(0);
    setDirtyCash(0);
    setHeat(0);
    setHardwareTemperature(40);
    setCurrentCrisis(null);
    setUpgrades(prev => prev.map(u => ({ ...u, count: 0 })));
    setTargets(prev => prev.map(t => ({ ...t, cooldownEndsAt: null })));
    pushLog(`🏖️ ОПЕРАЦІЯ "ЧИСТИЙ АРКУШ": Отримано +${potentialPrestigeGain} Darknet Credibility!`);
    return true;
  }

  // Game Loop
  useEffect(() => {
    let tickCount = 0;
    const interval = setInterval(() => {
      const state = stateRef.current;
      tickCount++;

      // Passive income (10Hz)
      let currentCps = 0;
      state.upgrades.filter(u => u.type === 'software').forEach(u => { currentCps += u.count * u.basePower; });
      currentCps *= (1 + state.darknetCredibility * 0.05);
      if (state.hardwareTemperature >= 85) currentCps *= 0.4;

      if (currentCps > 0) {
        setCash(c => c + currentCps * 0.1);
        setTotalEarnedLifetime(t => t + currentCps * 0.1);
      }

      // Heat dissipation
      setHeat(h => Math.max(0, h - (0.06 * 0.1)));

      // Thermal simulation
      let hwGen = 0;
      state.upgrades.filter(u => u.type === 'hardware').forEach(u => { hwGen += u.count * 0.38; });
      let cooling = 2.0;
      state.upgrades.filter(u => u.type === 'cooling').forEach(u => { cooling += u.count * u.basePower; });
      const tempDelta = (hwGen - cooling) * 0.1 * 0.4;
      setHardwareTemperature(t => Math.min(105, Math.max(35, t + tempDelta)));

      // Crisis countdown
      if (state.currentCrisis) {
        if (tickCount % 10 === 0) {
          if (state.currentCrisis.remainingSeconds <= 1) {
            // Fail crisis
            const crisis = state.currentCrisis;
            setCurrentCrisis(null);
            if (crisis.type === 'whitehatDrain') {
              setCash(c => c * 0.78);
              pushLog('🚨 КРИЗУ ПРОВАЛЕНО! Whitehat бот забрав 22% коштів!');
            } else if (crisis.type === 'overheatingRigs') {
              setHardwareTemperature(98);
              pushLog('🚨 КРИЗУ ПРОВАЛЕНО! Ферми закипіли! Тротлінг -60%!');
            } else if (crisis.type === 'policeWarrant') {
              setHeat(100);
            }
          } else {
            setCurrentCrisis(prev => prev ? { ...prev, remainingSeconds: prev.remainingSeconds - 1 } : null);
          }
        }
      } else if (tickCount % 100 === 0 && playerLevel >= 2) {
        // Random crisis spawn check
        if (Math.random() < 0.25) {
          if (state.hardwareTemperature > 75 && Math.random() < 0.5) {
            setCurrentCrisis({ id: 'c_cool', title: '🔥 АВАРІЯ ОХОЛОДЖЕННЯ!', description: 'Ферми закипають! Запустіть кулер!', type: 'overheatingRigs', timeLimitSeconds: 12, remainingSeconds: 12, actionButtonText: 'УВІМКНУТИ КУЛЕР' });
          } else if (state.heat > 60 && Math.random() < 0.5) {
            setCurrentCrisis({ id: 'c_fbi', title: '🚨 ОРДЕР ФБР (ALERT)!', description: 'Спецслужби виявили вузол! Спаліть логи!', type: 'policeWarrant', timeLimitSeconds: 14, remainingSeconds: 14, actionButtonText: 'СПАЛИТИ ЛОГИ' });
          } else {
            setCurrentCrisis({ id: 'c_wh', title: '⚠️ АТАКА WHITEHAT!', description: 'Аудитор виявив витік! Закрийте бекдор!', type: 'whitehatDrain', timeLimitSeconds: 10, remainingSeconds: 10, actionButtonText: 'ЗАКРИТИ БЕКДОР' });
          }
        }
      }

      // Heat Raid check
      if (state.heat >= 100 && !isRaidTriggered) {
        setIsRaidTriggered(true);
        setDirtyCash(d => {
          const lost = d * 0.85;
          setLastRaidMessage(`ОБЛАВА КІБЕРПОЛІЦІЇ! Заморожено $${lost.toFixed(0)} брудних коштів!`);
          pushLog(`🚨🚨🚨 ОБЛАВА КІБЕРПОЛІЦІЇ! Втрачено $${lost.toFixed(0)} брудних коштів!`);
          return d - lost;
        });
        setHeat(25);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Market & Gas tick
  useEffect(() => {
    const interval = setInterval(() => {
      setGasGwei(18 + Math.floor(Math.random() * 260));
      setMarketCoins(prev => prev.map(c => {
        const delta = (Math.random() * 8.5) - 4.0;
        return {
          ...c,
          change24h: delta,
          price: Math.max(0.0001, c.price * (1 + delta / 100)),
        };
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return {
    cash,
    dirtyCash,
    darknetCredibility,
    totalEarnedLifetime,
    heat,
    hardwareTemperature,
    isThermalThrottling,
    gasGwei,
    currentCrisis,
    tapsCount,
    hacksCount,
    isRaidTriggered,
    lastRaidMessage,
    dismissRaidAlert: () => setIsRaidTriggered(false),
    playerLevel,
    playerLevelTitle,
    prestigeMultiplier,
    tapPower,
    cashPerSecond,
    totalHashrate,
    totalCoolingPower,
    potentialPrestigeGain,
    upgrades,
    targets,
    marketCoins,
    achievements,
    terminalLogs,
    tapTerminal,
    buyUpgrade,
    purgeCoolingFans,
    prepareTargetAttack,
    applyTargetResult,
    washDirtyCrypto,
    emergencyCoolOff,
    resolveCrisis,
    performCleanSlate,
  };
}
