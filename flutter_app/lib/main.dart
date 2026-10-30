import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'providers/game_state.dart';
import 'ui/theme/hacker_theme.dart';
import 'ui/widgets/stat_header.dart';
import 'ui/screens/terminal_screen.dart';
import 'ui/screens/hardware_shop_screen.dart';
import 'ui/screens/exploits_screen.dart';
import 'ui/screens/targets_screen.dart';
import 'ui/screens/market_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => GameState()),
      ],
      child: const CryptoHackerApp(),
    ),
  );
}

class CryptoHackerApp extends StatelessWidget {
  const CryptoHackerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Crypto Hacker Simulator',
      debugShowCheckedModeBanner: false,
      theme: HackerTheme.darkTheme,
      home: const MainNavigationScreen(),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    TerminalScreen(),
    HardwareShopScreen(),
    ExploitsScreen(),
    TargetsScreen(),
    MarketScreen(),
  ];

  void _showAchievementsDialog(BuildContext context, GameState state) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: HackerTheme.surface,
        title: const Row(
          children: [
            Icon(Icons.emoji_events, color: HackerTheme.neonAmber, size: 24),
            SizedBox(width: 8),
            Text(
              'ДОСЯГНЕННЯ ТА ТИТУЛИ',
              style: TextStyle(color: HackerTheme.neonAmber, fontSize: 14, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        content: SizedBox(
          width: double.maxFinite,
          child: ListView.builder(
            shrinkWrap: true,
            itemCount: state.achievements.length,
            itemBuilder: (context, index) {
              final ach = state.achievements[index];
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: HackerTheme.card,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(
                    color: ach.isUnlocked ? HackerTheme.neonGreen.withOpacity(0.5) : HackerTheme.border,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      ach.isUnlocked ? Icons.check_circle : Icons.lock_outline,
                      color: ach.isUnlocked ? HackerTheme.neonGreen : HackerTheme.textMuted,
                      size: 22,
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            ach.title,
                            style: TextStyle(
                              color: ach.isUnlocked ? HackerTheme.textWhite : HackerTheme.textMuted,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            ach.description,
                            style: const TextStyle(color: HackerTheme.textMuted, fontSize: 10),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      '+${ach.rewardPrestige.toInt()} Rep',
                      style: const TextStyle(color: HackerTheme.neonAmber, fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
        actions: [
          TextButton(
            child: const Text('ЗАКРИТИ', style: TextStyle(color: HackerTheme.neonGreen)),
            onPressed: () => Navigator.pop(ctx),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<GameState>();

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const Icon(Icons.security, color: HackerTheme.neonGreen, size: 20),
            const SizedBox(width: 8),
            Text(
              'CRYPTO HACKER',
              style: TextStyle(
                shadows: [
                  Shadow(color: HackerTheme.neonGreen.withOpacity(0.5), blurRadius: 8),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.emoji_events_outlined, color: HackerTheme.neonAmber),
            tooltip: 'Досягнення',
            onPressed: () => _showAchievementsDialog(context, state),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            const StatHeader(),
            Expanded(
              child: IndexedStack(
                index: _currentIndex,
                children: _screens,
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.terminal),
            label: 'Термінал',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.memory),
            label: 'Залізо',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.bug_report),
            label: 'Софт',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.radar),
            label: 'Операції',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.currency_bitcoin),
            label: 'Ринок',
          ),
        ],
      ),
    );
  }
}
