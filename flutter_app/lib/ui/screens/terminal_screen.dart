import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/game_state.dart';
import '../../utils/number_formatter.dart';
import '../theme/hacker_theme.dart';

class TerminalScreen extends StatefulWidget {
  const TerminalScreen({super.key});

  @override
  State<TerminalScreen> createState() => _TerminalScreenState();
}

class _TerminalScreenState extends State<TerminalScreen> with SingleTickerProviderStateMixin {
  final ScrollController _scrollController = ScrollController();
  final List<_FloatingNumber> _floatingNumbers = [];
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _onTap(TapDownDetails details, GameState state) {
    state.tapTerminal();

    // Spawn floating number
    final renderBox = context.findRenderObject() as RenderBox?;
    if (renderBox != null) {
      final localPos = renderBox.globalToLocal(details.globalPosition);
      final item = _FloatingNumber(
        key: UniqueKey(),
        text: '+${NumberFormatter.formatCurrency(state.tapPower)}',
        position: localPos,
      );
      setState(() {
        _floatingNumbers.add(item);
      });

      Future.delayed(const Duration(milliseconds: 800), () {
        if (mounted) {
          setState(() {
            _floatingNumbers.remove(item);
          });
        }
      });
    }

    // Auto-scroll terminal log to bottom
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.jumpTo(_scrollController.position.maxScrollExtent);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<GameState>();

    return Stack(
      children: [
        Column(
          children: [
            // Raid Alert Banner if triggered
            if (state.isRaidTriggered)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                color: HackerTheme.neonRed,
                child: Row(
                  children: [
                    const Icon(Icons.warning, color: Colors.white, size: 24),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        state.lastRaidMessage,
                        style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.white, size: 20),
                      onPressed: () => state.dismissRaidAlert(),
                    ),
                  ],
                ),
              ),

            // Live Terminal Console Logs
            Expanded(
              flex: 4,
              child: Container(
                margin: const EdgeInsets.all(12),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF04070A),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: HackerTheme.border),
                  boxShadow: [
                    BoxShadow(
                      color: HackerTheme.neonGreen.withOpacity(0.04),
                      blurRadius: 10,
                      spreadRadius: 1,
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Terminal header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(width: 8, height: 8, decoration: const BoxDecoration(color: HackerTheme.neonRed, shape: BoxShape.circle)),
                            const SizedBox(width: 6),
                            Container(width: 8, height: 8, decoration: const BoxDecoration(color: HackerTheme.neonAmber, shape: BoxShape.circle)),
                            const SizedBox(width: 6),
                            Container(width: 8, height: 8, decoration: const BoxDecoration(color: HackerTheme.neonGreen, shape: BoxShape.circle)),
                            const SizedBox(width: 10),
                            const Text(
                              'bash: /dev/crypto_exploits.sh',
                              style: TextStyle(color: HackerTheme.textMuted, fontSize: 11),
                            ),
                          ],
                        ),
                        Text(
                          'TAPS: ${state.tapsCount}',
                          style: const TextStyle(color: HackerTheme.neonCyan, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const Divider(color: HackerTheme.border, height: 16),

                    // Log output
                    Expanded(
                      child: ListView.builder(
                        controller: _scrollController,
                        itemCount: state.terminalLogs.length,
                        itemBuilder: (context, index) {
                          final log = state.terminalLogs[index];
                          final isSuccess = log.contains('УСПІХ') || log.contains('[OK]') || log.contains('ДОСЯГНЕННЯ');
                          final isWarn = log.contains('ПРОВАЛ') || log.contains('[!]') || log.contains('ОБЛАВА');

                          return Padding(
                            padding: const EdgeInsets.symmetric(vertical: 2.0),
                            child: Text(
                              log,
                              style: TextStyle(
                                fontSize: 11,
                                height: 1.3,
                                color: isWarn
                                    ? HackerTheme.neonRed
                                    : isSuccess
                                        ? HackerTheme.neonGreen
                                        : HackerTheme.textWhite.withOpacity(0.85),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Wash Dirty Money Quick Action if dirty money exists
            if (state.dirtyCash > 0)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: HackerTheme.neonAmber.withOpacity(0.15),
                    foregroundColor: HackerTheme.neonAmber,
                    side: const BorderSide(color: HackerTheme.neonAmber),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    minimumSize: const Size.fromHeight(42),
                  ),
                  icon: const Icon(Icons.waves, size: 18),
                  label: Text(
                    'ВІДМИТИ ${NumberFormatter.formatCurrency(state.dirtyCash)} ЧЕРЕЗ TORNADO CASH',
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                  onPressed: () => state.washDirtyCrypto(state.dirtyCash),
                ),
              ),

            // Giant Clicker / Hacking Button Area
            Expanded(
              flex: 5,
              child: Center(
                child: GestureDetector(
                  onTapDown: (details) => _onTap(details, state),
                  child: AnimatedBuilder(
                    animation: _pulseController,
                    builder: (context, child) {
                      final scale = 1.0 + (_pulseController.value * 0.03);
                      return Transform.scale(
                        scale: scale,
                        child: child,
                      );
                    },
                    child: Container(
                      width: 220,
                      height: 220,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: HackerTheme.card,
                        border: Border.all(
                          color: HackerTheme.neonGreen.withOpacity(0.6),
                          width: 3,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: HackerTheme.neonGreen.withOpacity(0.25),
                            blurRadius: 28,
                            spreadRadius: 4,
                          ),
                        ],
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.terminal_rounded,
                            size: 64,
                            color: HackerTheme.neonGreen,
                          ),
                          const SizedBox(height: 10),
                          const Text(
                            'BRUTE-FORCE',
                            style: TextStyle(
                              color: HackerTheme.neonGreen,
                              fontSize: 16,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 2.0,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '+${NumberFormatter.formatCurrency(state.tapPower)}/tap',
                            style: const TextStyle(
                              color: HackerTheme.neonCyan,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 8),
          ],
        ),

        // Floating tap reward numbers
        ..._floatingNumbers.map((item) {
          return Positioned(
            left: item.position.dx - 40,
            top: item.position.dy - 60,
            child: TweenAnimationBuilder<double>(
              tween: Tween(begin: 0.0, end: 1.0),
              duration: const Duration(milliseconds: 700),
              builder: (context, val, child) {
                return Opacity(
                  opacity: (1.0 - val).clamp(0.0, 1.0),
                  child: Transform.translate(
                    offset: Offset(0, -val * 50),
                    child: Text(
                      item.text,
                      style: const TextStyle(
                        color: HackerTheme.neonGreen,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        shadows: [
                          Shadow(color: Colors.black, blurRadius: 4),
                          Shadow(color: HackerTheme.neonGreen, blurRadius: 10),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          );
        }),
      ],
    );
  }
}

class _FloatingNumber {
  final Key key;
  final String text;
  final Offset position;

  _FloatingNumber({
    required this.key,
    required this.text,
    required this.position,
  });
}
