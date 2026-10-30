import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/hack_target.dart';
import '../../providers/game_state.dart';
import '../../utils/number_formatter.dart';
import '../theme/hacker_theme.dart';
import '../widgets/hack_minigame_dialog.dart';

class TargetsScreen extends StatelessWidget {
  const TargetsScreen({super.key});

  void _launchAttack(BuildContext context, GameState state, HackTarget target) {
    final canStart = state.prepareTargetAttack(target.id);
    if (!canStart) return;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => HackMinigameDialog(
        target: target,
        onComplete: (isSuccess) {
          state.applyTargetResult(target.id, isSuccess);
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<GameState>();

    return ListView(
      padding: const EdgeInsets.all(12),
      children: [
        // Heat Management / Laundry Section
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: HackerTheme.card,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: HackerTheme.neonAmber.withOpacity(0.5)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.waves, color: HackerTheme.neonAmber, size: 20),
                      SizedBox(width: 8),
                      Text(
                        'ВІДМИВАННЯ ТА БЕЗПЕКА',
                        style: TextStyle(
                          color: HackerTheme.neonAmber,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                          letterSpacing: 0.8,
                        ),
                      ),
                    ],
                  ),
                  Text(
                    'Брудні: ${NumberFormatter.formatCurrency(state.dirtyCash)}',
                    style: const TextStyle(color: HackerTheme.neonAmber, fontWeight: FontWeight.bold, fontSize: 11),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              const Text(
                'Після зламів ви отримуєте "брудну" криптовалюту. Її потрібно відмивати через Tornado Cash, інакше під час рейду поліція конфіскує до 85% невідмитих коштів!',
                style: TextStyle(color: HackerTheme.textMuted, fontSize: 11, height: 1.3),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: state.dirtyCash > 0
                            ? HackerTheme.neonAmber
                            : HackerTheme.surface,
                        foregroundColor: state.dirtyCash > 0 ? Colors.black : HackerTheme.textMuted,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                      ),
                      icon: const Icon(Icons.cyclone, size: 16),
                      label: const Text(
                        'TORNADO CASH (-12%)',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                      onPressed: state.dirtyCash > 0 ? () => state.washDirtyCrypto(state.dirtyCash) : null,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        foregroundColor: HackerTheme.neonCyan,
                        side: const BorderSide(color: HackerTheme.neonCyan),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                      ),
                      icon: const Icon(Icons.shield_outlined, size: 16),
                      label: const Text(
                        'ЗМІНИТИ VPN/IP',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                      onPressed: state.heat > 0 ? () => state.emergencyCoolOff() : null,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Section Title
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 4, vertical: 4),
          child: Text(
            'ЦІЛЬОВІ КІБЕРАТАКИ (МІНІ-ГРА ШЕЛЛКОДУ)',
            style: TextStyle(
              color: HackerTheme.textMuted,
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.0,
            ),
          ),
        ),
        const SizedBox(height: 8),

        // Targets List
        ...state.targets.map((target) {
          final isLocked = state.playerLevel < target.requiredLevel;
          final isInCooldown = target.isInCooldown;
          final gasCost = state.getGasCostForTarget(target);
          final hasGas = state.cash >= gasCost;

          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            decoration: BoxDecoration(
              color: HackerTheme.card,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: isLocked
                    ? HackerTheme.border
                    : target.isCompletedOnce
                        ? HackerTheme.neonGreen.withOpacity(0.5)
                        : HackerTheme.border,
              ),
            ),
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          target.title,
                          style: TextStyle(
                            color: isLocked ? HackerTheme.textMuted : HackerTheme.textWhite,
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                      ),
                      if (target.isCompletedOnce)
                        const Row(
                          children: [
                            Icon(Icons.check_circle, color: HackerTheme.neonGreen, size: 14),
                            SizedBox(width: 4),
                            Text('HACKED', style: TextStyle(color: HackerTheme.neonGreen, fontSize: 10, fontWeight: FontWeight.bold)),
                          ],
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    target.subtitle,
                    style: TextStyle(
                      color: isLocked ? HackerTheme.textMuted : HackerTheme.neonCyan,
                      fontSize: 11,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Аналог у реальності: ${target.realWorldReference}',
                    style: const TextStyle(
                      color: HackerTheme.textMuted,
                      fontSize: 10,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Куш: ~${NumberFormatter.formatCurrency(target.potentialLoot)}',
                            style: const TextStyle(color: HackerTheme.neonGreen, fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 2),
                          Row(
                            children: [
                              Text(
                                'Загроза: +${target.heatGenerated.toInt()}% Heat',
                                style: const TextStyle(color: HackerTheme.neonRed, fontSize: 10),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Газ: \$${gasCost.toStringAsFixed(1)}',
                                style: TextStyle(
                                  color: hasGas ? HackerTheme.neonCyan : HackerTheme.neonRed,
                                  fontSize: 10,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: !isLocked && !isInCooldown && hasGas
                              ? HackerTheme.neonRed
                              : HackerTheme.surface,
                          foregroundColor: !isLocked && !isInCooldown && hasGas
                              ? Colors.white
                              : HackerTheme.textMuted,
                          side: BorderSide(
                            color: !isLocked && !isInCooldown && hasGas
                                ? HackerTheme.neonRed
                                : HackerTheme.border,
                          ),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        ),
                        onPressed: !isLocked && !isInCooldown && hasGas
                            ? () => _launchAttack(context, state, target)
                            : null,
                        child: Text(
                          isLocked
                              ? 'РІВЕНЬ ${target.requiredLevel}'
                              : isInCooldown
                                  ? 'КД ${target.remainingCooldownSeconds}s'
                                  : !hasGas
                                      ? 'НЕМАЄ ГАЗУ'
                                      : 'ЗЛАМАТИ (ШЕЛЛКОД)',
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }
}
