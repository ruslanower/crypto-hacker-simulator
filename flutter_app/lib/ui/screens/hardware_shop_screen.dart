import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/upgrade_item.dart';
import '../../providers/game_state.dart';
import '../../utils/number_formatter.dart';
import '../theme/hacker_theme.dart';

class HardwareShopScreen extends StatelessWidget {
  const HardwareShopScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<GameState>();
    final hardwareItems = state.upgrades.where((u) => u.type == UpgradeType.hardware).toList();
    final coolingItems = state.upgrades.where((u) => u.type == UpgradeType.cooling).toList();
    final temp = state.hardwareTemperature;
    final isThrottling = state.isThermalThrottling;

    return ListView(
      padding: const EdgeInsets.all(12),
      children: [
        // Thermal Control Panel
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: HackerTheme.card,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: isThrottling ? HackerTheme.neonRed : HackerTheme.neonCyan.withOpacity(0.4),
              width: isThrottling ? 2 : 1,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        Icon(
                          Icons.thermostat,
                          color: isThrottling ? HackerTheme.neonRed : HackerTheme.neonCyan,
                          size: 20,
                        ),
                        const SizedBox(width: 8),
                        Flexible(
                          child: Text(
                            'ТЕМПЕРАТУРА ФЕРМ: ${temp.toStringAsFixed(1)}°C',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              color: isThrottling ? HackerTheme.neonRed : HackerTheme.textWhite,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    'Охолодження: -${state.totalCoolingPower.toStringAsFixed(1)}°C/s',
                    style: const TextStyle(color: HackerTheme.neonCyan, fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              ClipRRect(
                borderRadius: BorderRadius.circular(3),
                child: LinearProgressIndicator(
                  value: ((temp - 35.0) / 70.0).clamp(0.0, 1.0),
                  minHeight: 6,
                  backgroundColor: HackerTheme.surface,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    isThrottling
                        ? HackerTheme.neonRed
                        : temp > 65.0
                            ? HackerTheme.neonAmber
                            : HackerTheme.neonCyan,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      isThrottling
                          ? '🔥 КРИТИЧНИЙ ПЕРЕГРІВ! Тротлінг -60% до всього прибутку!'
                          : 'Якщо температура перевищить 85°C, ферми тротлитимуть (-60%).',
                      style: TextStyle(
                        color: isThrottling ? HackerTheme.neonRed : HackerTheme.textMuted,
                        fontSize: 10,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: HackerTheme.surface,
                      foregroundColor: HackerTheme.neonCyan,
                      side: const BorderSide(color: HackerTheme.neonCyan),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    ),
                    icon: const Icon(Icons.mode_fan_off, size: 14),
                    label: const Text('ПРОДУТИ (-18°C)', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                    onPressed: () => state.purgeCoolingFans(),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // SECTION 1: Hardware Rigs
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 4, vertical: 4),
          child: Text(
            '⚡ МАЙНІНГ ТА ЗАЛІЗО (ГЕНЕРУЄ ТЕПЛО)',
            style: TextStyle(
              color: HackerTheme.textMuted,
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.0,
            ),
          ),
        ),
        const SizedBox(height: 6),

        ...hardwareItems.map((item) => _buildUpgradeCard(context, state, item, HackerTheme.neonGreen)),

        const SizedBox(height: 14),

        // SECTION 2: Cooling Upgrades
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 4, vertical: 4),
          child: Text(
            '❄️ СИСТЕМИ ОХОЛОДЖЕННЯ (ЗНИЖУЮТЬ ТЕМПЕРАТУРУ)',
            style: TextStyle(
              color: HackerTheme.textMuted,
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.0,
            ),
          ),
        ),
        const SizedBox(height: 6),

        ...coolingItems.map((item) => _buildUpgradeCard(context, state, item, HackerTheme.neonCyan)),
      ],
    );
  }

  Widget _buildUpgradeCard(BuildContext context, GameState state, UpgradeItem item, Color accentColor) {
    final cost = item.currentCost;
    final canAfford = state.cash >= cost;
    final isLocked = state.playerLevel < item.levelRequired;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: HackerTheme.card,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: isLocked ? HackerTheme.border : HackerTheme.border.withOpacity(0.8),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Row(
          children: [
            // Icon box
            Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                color: isLocked ? HackerTheme.surface : accentColor.withOpacity(0.12),
                borderRadius: BorderRadius.circular(6),
                border: Border.all(
                  color: isLocked ? HackerTheme.border : accentColor.withOpacity(0.3),
                ),
              ),
              child: Icon(
                isLocked ? Icons.lock_outline : item.icon,
                color: isLocked ? HackerTheme.textMuted : accentColor,
                size: 24,
              ),
            ),
            const SizedBox(width: 12),

            // Details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Flexible(
                        child: Text(
                          item.name,
                          style: TextStyle(
                            color: isLocked ? HackerTheme.textMuted : HackerTheme.textWhite,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: HackerTheme.surface,
                          borderRadius: BorderRadius.circular(4),
                          border: Border.all(color: HackerTheme.border),
                        ),
                        child: Text(
                          'x${item.count}',
                          style: TextStyle(
                            color: accentColor,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 3),
                  Text(
                    isLocked ? 'Потрібен рівень ${item.levelRequired}' : item.description,
                    style: TextStyle(
                      color: isLocked ? HackerTheme.neonRed : HackerTheme.textMuted,
                      fontSize: 10,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    item.type == UpgradeType.cooling
                        ? 'Охолодження: -${item.totalPower.toStringAsFixed(1)}°C/s'
                        : 'Внесок: +${NumberFormatter.formatCurrency(item.totalPower)}/tap',
                    style: TextStyle(color: accentColor, fontSize: 10, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 10),

            // Buy Button
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: canAfford && !isLocked ? accentColor : HackerTheme.surface,
                foregroundColor: canAfford && !isLocked ? Colors.black : HackerTheme.textMuted,
                elevation: 0,
                side: BorderSide(
                  color: canAfford && !isLocked ? accentColor : HackerTheme.border,
                ),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
              ),
              onPressed: canAfford && !isLocked ? () => state.buyUpgrade(item.id) : null,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'КУПИТИ',
                    style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900),
                  ),
                  Text(
                    NumberFormatter.formatCurrency(cost),
                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
