import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/upgrade_item.dart';
import '../models/hack_target.dart';
import '../models/crypto_market.dart';
import '../models/achievement.dart';
import '../models/crisis_event.dart';

class GameState extends ChangeNotifier {
  // Core Currencies
  double _cash = 0.0; // Clean USD
  double _dirtyCash = 0.0; // Unlaundered crypto stolen in attacks
  double _darknetCredibility = 0.0; // Prestige currency
  double _totalEarnedLifetime = 0.0;
  
  // Threat / Police Heat (0% to 100%)
  double _heat = 0.0;
  bool _isRaidTriggered = false;
  String _lastRaidMessage = '';

  // Hardware Thermals & Network Gas
  double _hardwareTemperature = 40.0; // in Celsius (35°C to 105°C)
  int _gasGwei = 35; // Ethereum Gas (15 to 350 Gwei)

  // Dynamic Crisis Event (Whitehat attack, Cooling failure, Police raid countdown)
  CrisisEvent? _currentCrisis;

  // Stats
  int _tapsCount = 0;
  int _hacksCount = 0;
  DateTime _lastSaveTime = DateTime.now();
  DateTime _lastTickTime = DateTime.now();
  int _crisisCheckTicks = 0;
  double _crisisTickAccumulator = 0.0;

  void _safeHaptic(VoidCallback action) {
    try {
      action();
    } catch (_) {}
  }

  // Terminal Log Stream
  final List<String> _terminalLogs = [
    '[*] ANTIGRAVITY CYBER TERMINAL v4.2 INITIALIZED',
    '[*] Connected to TOR hidden service .onion',
    '[*] Target environment: Web3 / EVM / Bitcoin Network',
    '[*] Ready for user commands. TAP to brute-force hashes...',
  ];

  // Upgrades List
  late List<UpgradeItem> _upgrades;
  late List<HackTarget> _targets;
  late List<CryptoCoin> _marketCoins;
  late List<Achievement> _achievements;

  Timer? _gameLoopTimer;
  Timer? _marketTimer;
  Timer? _autoSaveTimer;

  GameState() {
    _initUpgrades();
    _initTargets();
    _initMarket();
    _initAchievements();
    _loadState();
    _startGameLoop();
  }

  // Getters
  double get cash => _cash;
  double get dirtyCash => _dirtyCash;
  double get totalCash => _cash + _dirtyCash;
  double get darknetCredibility => _darknetCredibility;
  double get totalEarnedLifetime => _totalEarnedLifetime;
  double get heat => _heat;
  bool get isRaidTriggered => _isRaidTriggered;
  String get lastRaidMessage => _lastRaidMessage;
  double get hardwareTemperature => _hardwareTemperature;
  bool get isThermalThrottling => _hardwareTemperature >= 85.0;
  int get gasGwei => _gasGwei;
  CrisisEvent? get currentCrisis => _currentCrisis;
  int get tapsCount => _tapsCount;
  int get hacksCount => _hacksCount;
  List<String> get terminalLogs => List.unmodifiable(_terminalLogs);
  List<UpgradeItem> get upgrades => _upgrades;
  List<HackTarget> get targets => _targets;
  List<CryptoCoin> get marketCoins => _marketCoins;
  List<Achievement> get achievements => _achievements;

  int get playerLevel {
    if (_totalEarnedLifetime < 500) return 1; // Script Kiddie
    if (_totalEarnedLifetime < 25000) return 2; // Dark Web Broker
    if (_totalEarnedLifetime < 500000) return 3; // DeFi Exploiter
    if (_totalEarnedLifetime < 50000000) return 4; // Bridge Breaker
    return 5; // Lazarus APT Sovereign Threat
  }

  String get playerLevelTitle {
    switch (playerLevel) {
      case 1: return 'Гаражний скрипт-кідді';
      case 2: return 'Оператор ботнету';
      case 3: return 'DeFi експлойт-архітектор';
      case 4: return 'Міжланцюговий диверсант';
      case 5: return 'Глобальний кіберсиндикат (APT)';
      default: return 'Анонім';
    }
  }

  /// Prestige Multiplier: Each Darknet Credibility adds +5% boost to ALL earnings
  double get prestigeMultiplier => 1.0 + (_darknetCredibility * 0.05);

  /// Tap Power (Earnings per Click). Starts grittier at $0.25!
  double get tapPower {
    double base = 0.25;
    for (var up in _upgrades) {
      if (up.type == UpgradeType.hardware) {
        base += up.totalPower;
      }
    }
    double power = base * prestigeMultiplier;
    // Thermal Throttling penalty
    if (isThermalThrottling) {
      power *= 0.4; // 60% penalty if overheating!
    }
    return max(0.05, power);
  }

  /// Passive CPS (Earnings per Second)
  double get cashPerSecond {
    double total = 0.0;
    for (var up in _upgrades) {
      if (up.type == UpgradeType.software) {
        total += up.totalPower;
      }
    }
    double result = total * prestigeMultiplier;
    // Thermal Throttling penalty
    if (isThermalThrottling) {
      result *= 0.4;
    }
    return result;
  }

  /// Total Hashrate (for mining simulation)
  double get totalHashrate {
    double h = 5.0;
    for (var up in _upgrades) {
      if (up.type == UpgradeType.hardware) {
        h += up.count * 120.0;
      }
    }
    double rate = h * prestigeMultiplier;
    if (isThermalThrottling) rate *= 0.4;
    return rate;
  }

  /// Total Cooling Power (°C/s reduction)
  double get totalCoolingPower {
    double power = 2.0; // Ambient cooling
    for (var up in _upgrades) {
      if (up.type == UpgradeType.cooling) {
        power += up.totalPower;
      }
    }
    return power;
  }

  /// Potential Prestige gain on reset: sqrt(lifetime / 20,000)
  int get potentialPrestigeGain {
    if (_totalEarnedLifetime < 20000) return 0;
    final gain = (sqrt(_totalEarnedLifetime / 20000)).floor();
    return max(0, gain - _darknetCredibility.toInt());
  }

  /// Gas cost required for executing a target heist
  double getGasCostForTarget(HackTarget target) {
    return (_gasGwei * 0.45) * target.requiredLevel;
  }

  // --- ACTIONS ---

  /// Main Tap Action
  void tapTerminal() {
    final reward = tapPower;
    _cash += reward;
    _totalEarnedLifetime += reward;
    _tapsCount++;

    // Small heat increase for active noise on network
    if (_heat < 100.0) {
      _heat = min(100.0, _heat + 0.05);
    }

    // Tapping generates a tiny amount of CPU heat
    _hardwareTemperature = min(105.0, _hardwareTemperature + 0.04);

    _safeHaptic(() => HapticFeedback.lightImpact());

    if (_tapsCount % 7 == 0) {
      _addRandomTerminalLog(reward);
    }

    _checkAchievements();
    notifyListeners();
  }

  void _addRandomTerminalLog(double amount) {
    const logs = [
      '[OK] SHA-256 collision discovered: nonce 0x8f2a1b9',
      '[+] RPC Endpoint leaked private keys via 0xdeadbeef',
      '[!] Injected EVM opcode: DELEGATECALL to malicious contract',
      '[OK] Brute-forced vanity address: 0x777...0001',
      '[+] Clipper Trojan intercepted transfer of USDT',
      '[+] Unchecked return value exploited in withdraw()',
      '[!] Flashed \$10M liquidity from Aave V3 lending pool',
      '[OK] Bypassed multisig signature check on testnet',
    ];
    final log = logs[Random().nextInt(logs.length)];
    _pushTerminalLog('$log (+\$${amount.toStringAsFixed(2)})');
  }

  void _pushTerminalLog(String message) {
    _terminalLogs.add(message);
    if (_terminalLogs.length > 40) {
      _terminalLogs.removeAt(0);
    }
  }

  /// Buy an Upgrade
  bool buyUpgrade(String upgradeId) {
    final up = _upgrades.firstWhere((element) => element.id == upgradeId);
    final cost = up.currentCost;
    if (_cash >= cost) {
      _cash -= cost;
      up.count++;
      _safeHaptic(() => HapticFeedback.mediumImpact());
      _pushTerminalLog('[+] Апгрейд придбано: ${up.name} x${up.count}');
      _checkAchievements();
      notifyListeners();
      return true;
    }
    return false;
  }

  /// Emergency Fan Purge (Cools hardware down by 15°C)
  void purgeCoolingFans() {
    _hardwareTemperature = max(35.0, _hardwareTemperature - 18.0);
    _pushTerminalLog('❄️ ЕКСТРЕНА ПРОДУВКА: Кулери на 100%! Температуру знижено на -18°C!');
    _safeHaptic(() => HapticFeedback.mediumImpact());
    notifyListeners();
  }

  /// Start a Target Attack (Deducts gas fee and sets cooldown)
  bool prepareTargetAttack(String targetId) {
    final target = _targets.firstWhere((element) => element.id == targetId);
    if (target.isInCooldown) return false;
    if (playerLevel < target.requiredLevel) return false;

    final gasCost = getGasCostForTarget(target);
    if (_cash < gasCost) {
      _pushTerminalLog('❌ НЕ ВИСТАЧАЄ ГАЗУ! Потрібно \$${gasCost.toStringAsFixed(1)} на комісію Gwei!');
      return false;
    }

    _cash -= gasCost;
    target.cooldownEndsAt = DateTime.now().add(Duration(seconds: target.durationSeconds));
    _pushTerminalLog('⛽ Сплачено \$${gasCost.toStringAsFixed(1)} газу ($_gasGwei Gwei). Початок ін\'єкції...');
    notifyListeners();
    return true;
  }

  /// Called when player completes or fails the interactive Bytecode Minigame
  void applyTargetResult(String targetId, bool isSuccess) {
    final target = _targets.firstWhere((element) => element.id == targetId);

    if (isSuccess) {
      // SUCCESS!
      final loot = target.potentialLoot * (0.85 + Random().nextDouble() * 0.35);
      _dirtyCash += loot;
      _totalEarnedLifetime += loot;
      _hacksCount++;
      _heat = min(100.0, _heat + target.heatGenerated);
      target.isCompletedOnce = true;

      _pushTerminalLog('🔥 УСПІХ ХАКУ! [${target.title}] приніс +\$${loot.toStringAsFixed(0)} (Брудна крипта)');
      _safeHaptic(() => HapticFeedback.heavyImpact());
    } else {
      // FAILED - caught by WAF / honeypot!
      _heat = min(100.0, _heat + (target.heatGenerated * 1.5));
      _pushTerminalLog('❌ ПРОВАЛ АТАКИ! [${target.title}] заблоковано фаєрволом! Загроза різко зросла!');
      _safeHaptic(() => HapticFeedback.vibrate());
    }

    _checkRaidCondition();
    _checkAchievements();
    notifyListeners();
  }

  /// Wash Dirty Cash through Virtual Tornado Cash / Mixer
  bool washDirtyCrypto(double amount) {
    if (amount <= 0 || _dirtyCash < amount) return false;

    // High gas increases mixer cut slightly
    final feeRate = 0.12 + (_gasGwei > 150 ? 0.04 : 0.0);
    final cleanReceived = amount * (1.0 - feeRate);
    _dirtyCash -= amount;
    _cash += cleanReceived;

    // Washing reduces heat
    final heatReduction = (amount / max(1.0, _totalEarnedLifetime)) * 50.0;
    _heat = max(0.0, _heat - max(5.0, heatReduction));

    _pushTerminalLog('🌪️ Відмито \$${amount.toStringAsFixed(0)} через Tornado Cash. Отримано \$${cleanReceived.toStringAsFixed(0)}. Рівень загрози знижено!');
    _safeHaptic(() => HapticFeedback.mediumImpact());
    notifyListeners();
    return true;
  }

  /// Emergency Burner Phone / VPN Switch
  bool emergencyCoolOff() {
    final cost = max(80.0, _cash * 0.18);
    if (_cash >= cost && _heat > 0) {
      _cash -= cost;
      _heat = max(0.0, _heat - 35.0);
      _pushTerminalLog('🛡️ Знищено робочі пристрої, змінено IP/MAC. Рівень загрози впав на -35%!');
      _safeHaptic(() => HapticFeedback.mediumImpact());
      notifyListeners();
      return true;
    }
    return false;
  }

  /// Resolve an active Crisis Event
  void resolveCrisis() {
    if (_currentCrisis == null) return;

    final crisis = _currentCrisis!;
    _currentCrisis = null;

    if (crisis.type == CrisisType.whitehatDrain) {
      _pushTerminalLog('🛡️ БЕКДОР ЗАКРИТО! Білий капелюх не зміг зламати ваш ботнет!');
    } else if (crisis.type == CrisisType.overheatingRigs) {
      _hardwareTemperature = 45.0;
      _pushTerminalLog('❄️ АВАРІЙНЕ ОХОЛОДЖЕННЯ СПРАЦЮВАЛО! Ферми в безпеці!');
    } else if (crisis.type == CrisisType.policeWarrant) {
      _heat = max(0.0, _heat - 40.0);
      _pushTerminalLog('🔥 ЛОГИ ЗНИЩЕНО! ФБР прийшло з ордером на порожній сервер!');
    } else if (crisis.type == CrisisType.gasSpike) {
      _gasGwei = 25;
      _pushTerminalLog('⚡ ПЕРЕМКНУТО НА L2 ARBITRUM! Комісії впали до норми!');
    }

    _safeHaptic(() => HapticFeedback.heavyImpact());
    notifyListeners();
  }

  /// Failed Crisis handler
  void _failCrisis(CrisisEvent crisis) {
    _currentCrisis = null;

    if (crisis.type == CrisisType.whitehatDrain) {
      final lost = _cash * 0.22;
      _cash -= lost;
      _pushTerminalLog('🚨 КРИЗУ ПРОВАЛЕНО! Whitehat бот забрав \$${lost.toStringAsFixed(0)} через відкриту діру!');
    } else if (crisis.type == CrisisType.overheatingRigs) {
      _hardwareTemperature = 98.0;
      _pushTerminalLog('🚨 КРИЗУ ПРОВАЛЕНО! Ферми закипіли! Тротлінг 60% активовано!');
    } else if (crisis.type == CrisisType.policeWarrant) {
      _heat = 100.0;
      _checkRaidCondition();
    } else if (crisis.type == CrisisType.gasSpike) {
      _gasGwei = 340;
      _pushTerminalLog('🚨 МЕРЕЖА ПЕРЕВАНТАЖЕНА! Комісії Gwei зашкалюють!');
    }

    _safeHaptic(() => HapticFeedback.vibrate());
    notifyListeners();
  }

  /// Police Raid Trigger when Heat reaches 100%
  void _checkRaidCondition() {
    if (_heat >= 100.0) {
      _isRaidTriggered = true;
      final lostCash = _dirtyCash * 0.85; // Seize 85% of dirty unwashed assets
      _dirtyCash -= lostCash;
      _heat = 25.0; // Cools down after raid
      _lastRaidMessage = 'ОБЛАВА КІБЕРПОЛІЦІЇ! Ваші невідмиті адреси заморожено емітентами Tether та CEX. Втрачено \$${lostCash.toStringAsFixed(0)} брудних коштів!';
      _pushTerminalLog('🚨🚨🚨 $_lastRaidMessage');
      _safeHaptic(() => HapticFeedback.vibrate());
    }
  }

  void dismissRaidAlert() {
    _isRaidTriggered = false;
    notifyListeners();
  }

  /// Prestige / Clean Slate ("Втеча в Панаму")
  bool performCleanSlate() {
    final gain = potentialPrestigeGain;
    if (gain <= 0) return false;

    _darknetCredibility += gain;
    _cash = 0.0;
    _dirtyCash = 0.0;
    _heat = 0.0;
    _hardwareTemperature = 40.0;
    _currentCrisis = null;

    // Reset upgrades
    for (var up in _upgrades) {
      up.count = 0;
    }
    for (var t in _targets) {
      t.cooldownEndsAt = null;
    }

    _pushTerminalLog('🏖️ ОПЕРАЦІЯ "ЧИСТИЙ АРКУШ": Ви змінили біометрію та осіли в Панамі. Отримано +$gain Darknet Credibility!');
    _checkAchievements();
    saveState();
    notifyListeners();
    return true;
  }

  // --- GAME LOOP & TICKS ---

  void _startGameLoop() {
    _gameLoopTimer = Timer.periodic(const Duration(milliseconds: 500), (timer) {
      final now = DateTime.now();
      final deltaSeconds = now.difference(_lastTickTime).inMilliseconds / 1000.0;
      _lastTickTime = now;

      // Add passive income
      final cps = cashPerSecond;
      if (cps > 0) {
        final generated = cps * deltaSeconds;
        _cash += generated;
        _totalEarnedLifetime += generated;
      }

      // Natural slow heat dissipation
      if (_heat > 0) {
        _heat = max(0.0, _heat - (0.06 * deltaSeconds));
      }

      // Thermals simulation: Hardware generates heat, Cooling dissipates it
      double hwThermalGen = 0.0;
      for (var up in _upgrades) {
        if (up.type == UpgradeType.hardware) {
          hwThermalGen += up.count * 0.38;
        }
      }
      final netThermalRate = hwThermalGen - totalCoolingPower;
      _hardwareTemperature = (_hardwareTemperature + (netThermalRate * deltaSeconds * 0.4)).clamp(35.0, 105.0);

      // Crisis timer handling
      if (_currentCrisis != null) {
        _crisisTickAccumulator += deltaSeconds;
        if (_crisisTickAccumulator >= 1.0) {
          final toDeduct = _crisisTickAccumulator.floor();
          _crisisTickAccumulator -= toDeduct;
          _currentCrisis!.remainingSeconds -= toDeduct;
          if (_currentCrisis!.remainingSeconds <= 0) {
            _failCrisis(_currentCrisis!);
          }
        }
      } else {
        _crisisTickAccumulator = 0.0;
      }

      // Crisis random spawn check every ~10s (20 * 500ms)
      _crisisCheckTicks++;
      if (_crisisCheckTicks >= 20) {
        _crisisCheckTicks = 0;
        _checkRandomCrisisSpawn();
      }

      notifyListeners();
    });

    // Market volatility & Gas fee fluctuations tick every 10s
    _marketTimer = Timer.periodic(const Duration(seconds: 10), (_) {
      _simulateMarketMovement();
    });

    // Autosave every 5s
    _autoSaveTimer = Timer.periodic(const Duration(seconds: 5), (_) {
      saveState();
    });
  }

  void _checkRandomCrisisSpawn() {
    if (_currentCrisis != null || playerLevel < 2) return;

    final rand = Random();
    // 25% chance every 10 seconds if conditions met
    if (rand.nextDouble() < 0.25) {
      if (_hardwareTemperature > 75.0 && rand.nextBool()) {
        _currentCrisis = CrisisEvent(
          id: 'crisis_cooling',
          title: '🔥 АВАРІЯ СИСТЕМИ ОХОЛОДЖЕННЯ!',
          description: 'Помпа перегрілася! Ферми закипають! Увімкніть аварійний вентилятор!',
          type: CrisisType.overheatingRigs,
          timeLimitSeconds: 12,
          actionButtonText: 'ЗАПУСТИТИ АВАРІЙНИЙ ВЕНТИЛЯТОР',
        );
      } else if (_heat > 60.0 && rand.nextBool()) {
        _currentCrisis = CrisisEvent(
          id: 'crisis_fbi',
          title: '🚨 ОРДЕР НА ОБШУК ФБР (ALERT)!',
          description: 'Спецслужби виявили ваш вузол! Знищіть логи терміналу негайно!',
          type: CrisisType.policeWarrant,
          timeLimitSeconds: 14,
          actionButtonText: 'СПАЛИТИ ЛОГИ СЕРВЕРА',
        );
      } else {
        _currentCrisis = CrisisEvent(
          id: 'crisis_whitehat',
          title: '⚠️ АТАКА WHITEHAT АУДИТОРІВ!',
          description: 'Снайпер-бот виявив витік у вашому пулі! Закрийте бекдор!',
          type: CrisisType.whitehatDrain,
          timeLimitSeconds: 10,
          actionButtonText: 'ЗАКРИТИ БЕКДОР',
        );
      }
      _safeHaptic(() => HapticFeedback.vibrate());
      _pushTerminalLog('⚠️ УВАГА: ${_currentCrisis!.title}');
    }
  }

  void _simulateMarketMovement() {
    final rand = Random();
    // Gas fluctuates between 18 and 280 Gwei
    _gasGwei = 18 + rand.nextInt(262);

    for (var coin in _marketCoins) {
      final change = (rand.nextDouble() * 8.5) - 4.0;
      coin.change24h = change;
      coin.price = max(0.0001, coin.price * (1.0 + (change / 100.0)));
    }
    notifyListeners();
  }

  // --- INITIALIZERS ---

  void _initUpgrades() {
    _upgrades = [
      // HARDWARE (Boosts Click / Mining)
      UpgradeItem(
        id: 'mouse_macro',
        name: 'Офісна мишка з макросом',
        description: 'Автоматизує подвійні кліки по скриптах. +0.5 до сили тапу.',
        type: UpgradeType.hardware,
        baseCost: 15.0,
        costMultiplier: 1.18,
        basePower: 0.5,
        icon: Icons.mouse,
        levelRequired: 1,
      ),
      UpgradeItem(
        id: 'mech_keyboard',
        name: 'Кастомна механічна клавіатура',
        description: 'Прискорює введення шеллкодів. +3.5 до сили тапу.',
        type: UpgradeType.hardware,
        baseCost: 180.0,
        costMultiplier: 1.18,
        basePower: 3.5,
        icon: Icons.keyboard,
        levelRequired: 1,
      ),
      UpgradeItem(
        id: 'cpu_multicore',
        name: 'Серверний 64-ядерний CPU',
        description: 'Блискавичний підбір хешів RandomX (Monero). +18 до сили тапу.',
        type: UpgradeType.hardware,
        baseCost: 1600.0,
        costMultiplier: 1.18,
        basePower: 18.0,
        icon: Icons.memory,
        levelRequired: 2,
      ),
      UpgradeItem(
        id: 'gpu_mining_rig',
        name: 'Ферма з 8x RTX 5090',
        description: 'Розгін алгоритмів KawPow та Blake3. +95 до сили тапу.',
        type: UpgradeType.hardware,
        baseCost: 12000.0,
        costMultiplier: 1.18,
        basePower: 95.0,
        icon: Icons.developer_board,
        levelRequired: 2,
      ),
      UpgradeItem(
        id: 'asic_container',
        name: 'ASIC-контейнер Antminer S21',
        description: 'Промисловий майнінг Bitcoin SHA-256. +500 до сили тапу.',
        type: UpgradeType.hardware,
        baseCost: 85000.0,
        costMultiplier: 1.18,
        basePower: 500.0,
        icon: Icons.dns,
        levelRequired: 3,
      ),
      UpgradeItem(
        id: 'quantum_emulator',
        name: 'Квантовий емулятор Shor-алгоритму',
        description: 'Факторинг ключів ECDSA secp256k1. +3,500 до сили тапу.',
        type: UpgradeType.hardware,
        baseCost: 750000.0,
        costMultiplier: 1.18,
        basePower: 3500.0,
        icon: Icons.science,
        levelRequired: 4,
      ),

      // COOLING SYSTEMS (Prevents Overheat & Throttling)
      UpgradeItem(
        id: 'case_fans',
        name: '120mm RGB Вентилятори',
        description: 'Базовий продув корпусу. Охолодження -3.5°C/s.',
        type: UpgradeType.cooling,
        baseCost: 60.0,
        costMultiplier: 1.18,
        basePower: 3.5,
        icon: Icons.mode_fan_off,
        levelRequired: 1,
      ),
      UpgradeItem(
        id: 'water_cooling',
        name: 'Кастомний контур СВО',
        description: 'Мідні водоблоки для процесорів та карт. Охолодження -15°C/s.',
        type: UpgradeType.cooling,
        baseCost: 650.0,
        costMultiplier: 1.18,
        basePower: 15.0,
        icon: Icons.water_drop,
        levelRequired: 2,
      ),
      UpgradeItem(
        id: 'immersion_tank',
        name: 'Імерсійна ванна з діелектриком',
        description: 'Повне занурення ригів у мінеральну оливу. Охолодження -55°C/s.',
        type: UpgradeType.cooling,
        baseCost: 6500.0,
        costMultiplier: 1.18,
        basePower: 55.0,
        icon: Icons.waves,
        levelRequired: 3,
      ),
      UpgradeItem(
        id: 'cryo_nitrogen',
        name: 'Кріогенна станція (Рідкий Азот)',
        description: 'Екстремальне охолодження промислових контейнерів. Охолодження -220°C/s.',
        type: UpgradeType.cooling,
        baseCost: 55000.0,
        costMultiplier: 1.18,
        basePower: 220.0,
        icon: Icons.ac_unit,
        levelRequired: 4,
      ),

      // SOFTWARE (Passive CPS)
      UpgradeItem(
        id: 'phishing_bot',
        name: 'Telegram Phishing Спамер',
        description: 'Розсилає фейкові ейрдропи мамонтам. +\$1.8/сек пасивно.',
        type: UpgradeType.software,
        baseCost: 65.0,
        costMultiplier: 1.18,
        basePower: 1.8,
        icon: Icons.bug_report,
        levelRequired: 1,
      ),
      UpgradeItem(
        id: 'clipper_malware',
        name: 'Clipper Trojan у буфер обміну',
        description: 'Підміняє криптоадреси жертв на ваші. +\$12/сек пасивно.',
        type: UpgradeType.software,
        baseCost: 450.0,
        costMultiplier: 1.18,
        basePower: 12.0,
        icon: Icons.content_copy,
        levelRequired: 1,
      ),
      UpgradeItem(
        id: 'cryptojacking_botnet',
        name: 'Прихований ботнет Monero (XMR)',
        description: 'Інфікує комп\'ютери для фонового майнінгу. +\$65/сек.',
        type: UpgradeType.software,
        baseCost: 3200.0,
        costMultiplier: 1.18,
        basePower: 65.0,
        icon: Icons.hub,
        levelRequired: 2,
      ),
      UpgradeItem(
        id: 'mev_sandwich_bot',
        name: 'MEV Sandwich Бот (Uniswap v3)',
        description: 'Фронтраннить трейдерів у мемпулі через PGA. +\$350/сек.',
        type: UpgradeType.software,
        baseCost: 24000.0,
        costMultiplier: 1.18,
        basePower: 350.0,
        icon: Icons.bolt,
        levelRequired: 3,
      ),
      UpgradeItem(
        id: 'flash_loan_scanner',
        name: 'Автономний Flash Loan Fuzzer',
        description: 'Шукає розсинхрон цінових оракулів у lending-пулах. +\$1,800/сек.',
        type: UpgradeType.software,
        baseCost: 180000.0,
        costMultiplier: 1.18,
        basePower: 1800.0,
        icon: Icons.account_balance,
        levelRequired: 4,
      ),
      UpgradeItem(
        id: 'zero_day_broker',
        name: 'Zero-Day Експлойт смарт-контрактів',
        description: 'Свіжі експлойти логіки проксі та reentrancy. +\$12,000/сек.',
        type: UpgradeType.software,
        baseCost: 1500000.0,
        costMultiplier: 1.18,
        basePower: 12000.0,
        icon: Icons.terminal,
        levelRequired: 4,
      ),
    ];
  }

  void _initTargets() {
    _targets = [
      HackTarget(
        id: 'target_phish_run',
        title: 'Масовий спам-дрейнер Discord',
        subtitle: 'Фейковий мінт безкоштовних NFT токенів',
        realWorldReference: 'Класичний Web3 Drainer (PinkDrainer/Inferno)',
        requiredLevel: 1,
        potentialLoot: 1200.0,
        heatGenerated: 12.0,
        durationSeconds: 15,
        baseSuccessRate: 0.85,
      ),
      HackTarget(
        id: 'target_vanity_bruteforce',
        title: 'Злам генератора красивих адрес',
        subtitle: 'Експлуатація дефекту ентропії у Profanity',
        realWorldReference: 'Wintermute \$160M Incident (2022)',
        requiredLevel: 2,
        potentialLoot: 20000.0,
        heatGenerated: 22.0,
        durationSeconds: 30,
        baseSuccessRate: 0.75,
      ),
      HackTarget(
        id: 'target_euler_reentrancy',
        title: 'Математичний збій ліквідації DeFi',
        subtitle: 'Дефект eToken/dToken у пулах застави',
        realWorldReference: 'Euler Finance \$197M Exploit (2023)',
        requiredLevel: 3,
        potentialLoot: 200000.0,
        heatGenerated: 38.0,
        durationSeconds: 60,
        baseSuccessRate: 0.65,
      ),
      HackTarget(
        id: 'target_ronin_bridge',
        title: 'Компрометація валідаторів сайдчейну',
        subtitle: 'Захоплення 5 із 9 приватних ключів кворуму',
        realWorldReference: 'Ronin Network \$620M Lazarus Hack (2022)',
        requiredLevel: 4,
        potentialLoot: 1800000.0,
        heatGenerated: 60.0,
        durationSeconds: 120,
        baseSuccessRate: 0.50,
      ),
      HackTarget(
        id: 'target_bybit_cold_storage',
        title: 'Сліпе підписання казначейства CEX №2',
        subtitle: 'Підміна пейлоаду через UI Safe розробника',
        realWorldReference: 'Bybit \$1.5B Historic CEX Hack (Лютий 2025)',
        requiredLevel: 5,
        potentialLoot: 22000000.0,
        heatGenerated: 88.0,
        durationSeconds: 300,
        baseSuccessRate: 0.35,
      ),
    ];
  }

  void _initMarket() {
    _marketCoins = [
      CryptoCoin(symbol: 'BTC', name: 'Bitcoin', algorithm: 'SHA-256 (ASIC)', isMineable: true, price: 92450.0, change24h: 3.2),
      CryptoCoin(symbol: 'ETH', name: 'Ethereum', algorithm: 'PoS (Staking)', isMineable: false, price: 3420.0, change24h: 1.8),
      CryptoCoin(symbol: 'XMR', name: 'Monero', algorithm: 'RandomX (CPU)', isMineable: true, price: 185.0, change24h: 5.6),
      CryptoCoin(symbol: 'KAS', name: 'Kaspa', algorithm: 'kHeavyHash (ASIC)', isMineable: true, price: 0.16, change24h: -2.1),
      CryptoCoin(symbol: 'SOL', name: 'Solana', algorithm: 'PoH / PoS', isMineable: false, price: 198.5, change24h: 8.4),
      CryptoCoin(symbol: 'DOGE', name: 'Dogecoin', algorithm: 'Scrypt (Merged)', isMineable: true, price: 0.19, change24h: 12.5),
      CryptoCoin(symbol: 'RVN', name: 'Ravencoin', algorithm: 'KawPow (GPU)', isMineable: true, price: 0.024, change24h: 4.1),
      CryptoCoin(symbol: 'PEPE', name: 'Pepe Meme', algorithm: 'ERC-20 (DEX)', isMineable: false, price: 0.000012, change24h: -7.3),
    ];
  }

  void _initAchievements() {
    _achievements = [
      Achievement(id: 'ach_first_tap', title: 'Перша транзакція', description: 'Зробіть свій перший клік у терміналі.', rewardPrestige: 1.0),
      Achievement(id: 'ach_1k_cash', title: 'Скрипт-кідді з района', description: 'Накопичіть \$1,000 чистих коштів.', rewardPrestige: 2.0),
      Achievement(id: 'ach_cryptojacker', title: 'Таємний криптомайнер', description: 'Запустіть прихований ботнет Monero.', rewardPrestige: 3.0),
      Achievement(id: 'ach_first_wash', title: 'Мильний міксер', description: 'Відмийте свої перші брудні монети через Tornado Cash.', rewardPrestige: 4.0),
      Achievement(id: 'ach_flash_master', title: 'Володар флеш-позик', description: 'Придбайте автономний сканер оракулів.', rewardPrestige: 5.0),
      Achievement(id: 'ach_clean_slate', title: 'Новий паспорт', description: 'Здійсніть перший Престиж (Втеча в Панаму).', rewardPrestige: 10.0),
      Achievement(id: 'ach_bybit_heist', title: 'Абсолютний хакер (Lazarus)', description: 'Успішно проведіть атаку рівня Bybit CEX.', rewardPrestige: 25.0),
    ];
  }

  void _checkAchievements() {
    for (var ach in _achievements) {
      if (ach.isUnlocked) continue;

      if (ach.id == 'ach_first_tap' && _tapsCount >= 1) {
        _unlockAchievement(ach);
      } else if (ach.id == 'ach_1k_cash' && _cash >= 1000) {
        _unlockAchievement(ach);
      } else if (ach.id == 'ach_cryptojacker') {
        final bnet = _upgrades.firstWhere((u) => u.id == 'cryptojacking_botnet');
        if (bnet.count >= 1) _unlockAchievement(ach);
      } else if (ach.id == 'ach_first_wash' && _cash >= 500 && _dirtyCash > 0) {
        _unlockAchievement(ach);
      } else if (ach.id == 'ach_flash_master') {
        final fl = _upgrades.firstWhere((u) => u.id == 'flash_loan_scanner');
        if (fl.count >= 1) _unlockAchievement(ach);
      } else if (ach.id == 'ach_clean_slate' && _darknetCredibility > 0) {
        _unlockAchievement(ach);
      } else if (ach.id == 'ach_bybit_heist') {
        final bybit = _targets.firstWhere((t) => t.id == 'target_bybit_cold_storage');
        if (bybit.isCompletedOnce) _unlockAchievement(ach);
      }
    }
  }

  void _unlockAchievement(Achievement ach) {
    ach.isUnlocked = true;
    _darknetCredibility += ach.rewardPrestige;
    _pushTerminalLog('🏆 ДОСЯГНЕННЯ РОЗБЛОКОВАНО: [${ach.title}] (+${ach.rewardPrestige.toInt()} Credibility)');
    _safeHaptic(() => HapticFeedback.heavyImpact());
  }

  // --- SAVE / LOAD SYSTEM ---

  Future<void> _loadState() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _cash = prefs.getDouble('cash') ?? 0.0;
      _dirtyCash = prefs.getDouble('dirtyCash') ?? 0.0;
      _darknetCredibility = prefs.getDouble('darknetCredibility') ?? 0.0;
      _totalEarnedLifetime = prefs.getDouble('totalEarnedLifetime') ?? 0.0;
      _heat = prefs.getDouble('heat') ?? 0.0;
      _hardwareTemperature = prefs.getDouble('hardwareTemperature') ?? 40.0;
      _tapsCount = prefs.getInt('tapsCount') ?? 0;
      _hacksCount = prefs.getInt('hacksCount') ?? 0;

      for (var up in _upgrades) {
        up.count = prefs.getInt('upgrade_${up.id}') ?? 0;
      }

      for (var ach in _achievements) {
        ach.isUnlocked = prefs.getBool('ach_${ach.id}') ?? false;
      }

      final lastSavedEpoch = prefs.getInt('lastSavedEpoch');
      if (lastSavedEpoch != null) {
        final lastSaved = DateTime.fromMillisecondsSinceEpoch(lastSavedEpoch);
        final offlineSeconds = DateTime.now().difference(lastSaved).inSeconds;
        final cappedSeconds = min(28800, max(0, offlineSeconds));
        if (cappedSeconds > 5 && cashPerSecond > 0) {
          final offlineGain = cashPerSecond * cappedSeconds * 0.70;
          _cash += offlineGain;
          _totalEarnedLifetime += offlineGain;
          _pushTerminalLog('💤 ОФЛАЙН ДОХІД: За час офлайну (${(cappedSeconds / 60).toStringAsFixed(0)} хв) нараховано +\$${offlineGain.toStringAsFixed(2)}!');
        }
      }

      WidgetsBinding.instance.addPostFrameCallback((_) {
        notifyListeners();
      });
    } catch (e) {
      debugPrint('Error loading game state: $e');
    }
  }

  Future<void> saveState() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setDouble('cash', _cash);
      await prefs.setDouble('dirtyCash', _dirtyCash);
      await prefs.setDouble('darknetCredibility', _darknetCredibility);
      await prefs.setDouble('totalEarnedLifetime', _totalEarnedLifetime);
      await prefs.setDouble('heat', _heat);
      await prefs.setDouble('hardwareTemperature', _hardwareTemperature);
      await prefs.setInt('tapsCount', _tapsCount);
      await prefs.setInt('hacksCount', _hacksCount);
      await prefs.setInt('lastSavedEpoch', DateTime.now().millisecondsSinceEpoch);

      for (var up in _upgrades) {
        await prefs.setInt('upgrade_${up.id}', up.count);
      }
      for (var ach in _achievements) {
        await prefs.setBool('ach_${ach.id}', ach.isUnlocked);
      }
    } catch (e) {
      debugPrint('Error saving game state: $e');
    }
  }

  @override
  void dispose() {
    _gameLoopTimer?.cancel();
    _marketTimer?.cancel();
    _autoSaveTimer?.cancel();
    super.dispose();
  }
}
