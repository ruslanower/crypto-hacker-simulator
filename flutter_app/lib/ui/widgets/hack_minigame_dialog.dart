import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../models/hack_target.dart';
import '../theme/hacker_theme.dart';

class HackMinigameDialog extends StatefulWidget {
  final HackTarget target;
  final Function(bool isSuccess) onComplete;

  const HackMinigameDialog({
    super.key,
    required this.target,
    required this.onComplete,
  });

  @override
  State<HackMinigameDialog> createState() => _HackMinigameDialogState();
}

class _HackMinigameDialogState extends State<HackMinigameDialog> {
  static const List<String> _opcodes = [
    '0xDE', '0xAD', '0xBE', '0xEF',
    '0xCA', '0xFE', '0xBA', '0xBE',
    '0x13', '0x37', '0x8F', '0x00',
    '0xC0', '0xFF', '0xEE', '0x42',
  ];

  late List<String> _targetSequence;
  late List<String> _availableButtons;
  final List<String> _currentInput = [];
  int _strikes = 0;
  static const int _maxStrikes = 2;

  late int _totalDurationMs;
  int _remainingMs = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    // Duration scales with target level (higher level = faster required reaction)
    _totalDurationMs = max(5000, 10000 - (widget.target.requiredLevel * 900));
    _remainingMs = _totalDurationMs;

    _generateSequence();
    _startTimer();
  }

  void _generateSequence() {
    final rand = Random();
    final shuffled = List<String>.from(_opcodes)..shuffle(rand);
    
    // Sequence length: 3 for level 1-2, 4 for level 3-4, 5 for level 5
    final seqLen = widget.target.requiredLevel >= 4 ? 5 : (widget.target.requiredLevel >= 2 ? 4 : 3);
    _targetSequence = shuffled.take(seqLen).toList();

    // Fill grid with target items + random distractors
    final gridItems = Set<String>.from(_targetSequence);
    while (gridItems.length < 12) {
      gridItems.add(_opcodes[rand.nextInt(_opcodes.length)]);
    }
    _availableButtons = gridItems.toList()..shuffle(rand);
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(milliseconds: 100), (t) {
      if (!mounted) return;
      setState(() {
        _remainingMs -= 100;
        if (_remainingMs <= 0) {
          _timer?.cancel();
          _finish(false);
        }
      });
    });
  }

  void _onButtonTap(String code) {
    if (_remainingMs <= 0) return;

    final nextExpected = _targetSequence[_currentInput.length];
    if (code == nextExpected) {
      HapticFeedback.lightImpact();
      setState(() {
        _currentInput.add(code);
      });

      if (_currentInput.length == _targetSequence.length) {
        // SOLVED!
        _timer?.cancel();
        HapticFeedback.heavyImpact();
        _finish(true);
      }
    } else {
      // MISTAKE
      HapticFeedback.vibrate();
      setState(() {
        _strikes++;
        _remainingMs = max(0, _remainingMs - 1200); // Penalty: -1.2 sec
      });

      if (_strikes >= _maxStrikes) {
        _timer?.cancel();
        _finish(false);
      }
    }
  }

  void _finish(bool success) {
    widget.onComplete(success);
    if (mounted) {
      Navigator.of(context).pop();
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final progress = (_remainingMs / _totalDurationMs).clamp(0.0, 1.0);
    final isCriticalTime = progress < 0.3;

    return Dialog(
      backgroundColor: HackerTheme.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
        side: BorderSide(
          color: isCriticalTime ? HackerTheme.neonRed : HackerTheme.neonCyan,
          width: 2,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(
                      Icons.terminal,
                      color: isCriticalTime ? HackerTheme.neonRed : HackerTheme.neonCyan,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      "ІН'ЄКЦІЯ ШЕЛЛКОДУ",
                      style: TextStyle(
                        color: HackerTheme.neonCyan,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.0,
                      ),
                    ),
                  ],
                ),
                Text(
                  'ПОМИЛКИ: $_strikes/$_maxStrikes',
                  style: TextStyle(
                    color: _strikes > 0 ? HackerTheme.neonRed : HackerTheme.textMuted,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),

            Text(
              'Ціль: ${widget.target.title}',
              style: const TextStyle(color: HackerTheme.textWhite, fontSize: 13, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Text(
              'Введіть послідовність байт-коду до спрацювання фаєрволу IDS:',
              style: const TextStyle(color: HackerTheme.textMuted, fontSize: 10),
            ),
            const SizedBox(height: 12),

            // Target Sequence Display
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
              decoration: BoxDecoration(
                color: HackerTheme.card,
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: HackerTheme.border),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: _targetSequence.asMap().entries.map((entry) {
                  final idx = entry.key;
                  final code = entry.value;
                  final isEntered = idx < _currentInput.length;
                  final isCurrent = idx == _currentInput.length;

                  return Container(
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: isEntered
                          ? HackerTheme.neonGreen.withOpacity(0.2)
                          : isCurrent
                              ? HackerTheme.neonCyan.withOpacity(0.2)
                              : HackerTheme.surface,
                      borderRadius: BorderRadius.circular(4),
                      border: Border.all(
                        color: isEntered
                            ? HackerTheme.neonGreen
                            : isCurrent
                                ? HackerTheme.neonCyan
                                : HackerTheme.border,
                      ),
                    ),
                    child: Text(
                      code,
                      style: TextStyle(
                        color: isEntered
                            ? HackerTheme.neonGreen
                            : isCurrent
                                ? HackerTheme.neonCyan
                                : HackerTheme.textMuted,
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                        fontFamily: 'monospace',
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 10),

            // Time bar
            Row(
              children: [
                Icon(
                  Icons.timer_outlined,
                  size: 14,
                  color: isCriticalTime ? HackerTheme.neonRed : HackerTheme.neonCyan,
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(3),
                    child: LinearProgressIndicator(
                      value: progress,
                      minHeight: 6,
                      backgroundColor: HackerTheme.card,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        isCriticalTime ? HackerTheme.neonRed : HackerTheme.neonCyan,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  '${(_remainingMs / 1000).toStringAsFixed(1)}s',
                  style: TextStyle(
                    color: isCriticalTime ? HackerTheme.neonRed : HackerTheme.textWhite,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // 3x4 Grid of Hex Buttons
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 4,
                childAspectRatio: 1.5,
                crossAxisSpacing: 6,
                mainAxisSpacing: 6,
              ),
              itemCount: _availableButtons.length,
              itemBuilder: (context, index) {
                final code = _availableButtons[index];
                return ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: HackerTheme.card,
                    foregroundColor: HackerTheme.neonGreen,
                    side: const BorderSide(color: HackerTheme.border),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                    padding: EdgeInsets.zero,
                  ),
                  onPressed: () => _onButtonTap(code),
                  child: Text(
                    code,
                    style: const TextStyle(
                      fontFamily: 'monospace',
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 12),

            // Cancel button
            OutlinedButton(
              style: OutlinedButton.styleFrom(
                foregroundColor: HackerTheme.textMuted,
                side: const BorderSide(color: HackerTheme.border),
              ),
              onPressed: () {
                _timer?.cancel();
                _finish(false);
              },
              child: const Text('ВІДСТУПИТИ / ПЕРЕРВАТИ СЕСІЮ', style: TextStyle(fontSize: 10)),
            ),
          ],
        ),
      ),
    );
  }
}
