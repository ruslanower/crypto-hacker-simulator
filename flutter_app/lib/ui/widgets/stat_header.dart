import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/game_state.dart';
import '../../utils/number_formatter.dart';
import '../theme/hacker_theme.dart';

class StatHeader extends StatelessWidget {
  const StatHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<GameState>(
      builder: (context, state, child) {
        final heat = state.heat;
        final isHeatCritical = heat >= 75.0;
        final temp = state.hardwareTemperature;
        final isOverheating = state.isThermalThrottling;
        final crisis = state.currentCrisis;

        return Column(
          children: [
            // Active Emergency Crisis Banner (if crisis is ongoing)
            if (crisis != null)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                color: HackerTheme.neonRed,
                child: Row(
                  children: [
                    const Icon(Icons.emergency, color: Colors.white, size: 22),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            crisis.title,
                            style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                          Text(
                            'Часу залишилось: ${crisis.remainingSeconds}s',
                            style: const TextStyle(color: Colors.white70, fontSize: 10),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: HackerTheme.neonRed,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      ),
                      onPressed: () => state.resolveCrisis(),
                      child: Text(
                        crisis.actionButtonText,
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900),
                      ),
                    ),
                  ],
                ),
              ),

            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: BoxDecoration(
                color: HackerTheme.surface,
                border: Border(
                  bottom: BorderSide(
                    color: isHeatCritical || isOverheating ? HackerTheme.neonRed : HackerTheme.border,
                    width: isHeatCritical || isOverheating ? 2.0 : 1.0,
                  ),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Top Row: Level Title, Gas & Prestige badge
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: HackerTheme.neonGreen.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(4),
                          border: Border.all(color: HackerTheme.neonGreen.withOpacity(0.3)),
                        ),
                        child: Text(
                          'LVL ${state.playerLevel} • ${state.playerLevelTitle.toUpperCase()}',
                          style: const TextStyle(
                            color: HackerTheme.neonGreen,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.8,
                          ),
                        ),
                      ),
                      Row(
                        children: [
                          // Gas Indicator
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                            decoration: BoxDecoration(
                              color: HackerTheme.card,
                              borderRadius: BorderRadius.circular(4),
                              border: Border.all(color: HackerTheme.border),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  Icons.local_gas_station,
                                  size: 11,
                                  color: state.gasGwei > 150 ? HackerTheme.neonRed : HackerTheme.neonCyan,
                                ),
                                const SizedBox(width: 3),
                                Text(
                                  '${state.gasGwei} Gwei',
                                  style: TextStyle(
                                    color: state.gasGwei > 150 ? HackerTheme.neonRed : HackerTheme.neonCyan,
                                    fontSize: 9,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 6),
                          if (state.darknetCredibility > 0)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                              decoration: BoxDecoration(
                                color: HackerTheme.neonAmber.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(4),
                                border: Border.all(color: HackerTheme.neonAmber.withOpacity(0.3)),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.security, size: 11, color: HackerTheme.neonAmber),
                                  const SizedBox(width: 3),
                                  Text(
                                    'REP: ${state.darknetCredibility.toInt()}',
                                    style: const TextStyle(
                                      color: HackerTheme.neonAmber,
                                      fontSize: 9,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // Balances Display
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'ЧИСТИЙ БАЛАНС',
                              style: TextStyle(color: HackerTheme.textMuted, fontSize: 10, letterSpacing: 0.5),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              NumberFormatter.formatCurrency(state.cash),
                              style: const TextStyle(
                                color: HackerTheme.neonGreen,
                                fontSize: 22,
                                fontWeight: FontWeight.w900,
                                letterSpacing: -0.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (state.dirtyCash > 0)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: HackerTheme.neonAmber.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: HackerTheme.neonAmber.withOpacity(0.4)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              const Text(
                                'БРУДНІ АКТИВИ',
                                style: TextStyle(color: HackerTheme.neonAmber, fontSize: 9, fontWeight: FontWeight.bold),
                              ),
                              Text(
                                NumberFormatter.formatCurrency(state.dirtyCash),
                                style: const TextStyle(
                                  color: HackerTheme.neonAmber,
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // Rate details (CPS, Tap Power, Thermal Status)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '⚡ ${NumberFormatter.formatCurrency(state.cashPerSecond)}/s',
                        style: TextStyle(
                          color: isOverheating ? HackerTheme.neonAmber : HackerTheme.neonCyan,
                          fontSize: 11,
                        ),
                      ),
                      Text(
                        '🖱️ ${NumberFormatter.formatCurrency(state.tapPower)}/tap',
                        style: const TextStyle(color: HackerTheme.textWhite, fontSize: 11),
                      ),
                      // Thermals button
                      GestureDetector(
                        onTap: () => state.purgeCoolingFans(),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: isOverheating
                                ? HackerTheme.neonRed.withOpacity(0.2)
                                : HackerTheme.card,
                            borderRadius: BorderRadius.circular(4),
                            border: Border.all(
                              color: isOverheating ? HackerTheme.neonRed : HackerTheme.border,
                            ),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                Icons.thermostat,
                                size: 12,
                                color: isOverheating ? HackerTheme.neonRed : HackerTheme.neonCyan,
                              ),
                              const SizedBox(width: 2),
                              Text(
                                '${temp.toStringAsFixed(1)}°C${isOverheating ? ' (ТРОТЛІНГ -60%)' : ''}',
                                style: TextStyle(
                                  color: isOverheating ? HackerTheme.neonRed : HackerTheme.textWhite,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // Police Threat / Heat Bar
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Icon(
                                isHeatCritical ? Icons.warning_amber_rounded : Icons.radar,
                                size: 13,
                                color: isHeatCritical ? HackerTheme.neonRed : HackerTheme.textMuted,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                'РІВЕНЬ ЗАГРОЗИ (FBI HEAT): ${heat.toStringAsFixed(1)}%',
                                style: TextStyle(
                                  color: isHeatCritical ? HackerTheme.neonRed : HackerTheme.textMuted,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          if (heat > 0)
                            GestureDetector(
                              onTap: () => state.emergencyCoolOff(),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: HackerTheme.neonCyan.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(4),
                                  border: Border.all(color: HackerTheme.neonCyan.withOpacity(0.5)),
                                ),
                                child: const Text(
                                  'ЗМІНИТИ IP/VPN',
                                  style: TextStyle(color: HackerTheme.neonCyan, fontSize: 9, fontWeight: FontWeight.bold),
                                ),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(2),
                        child: LinearProgressIndicator(
                          value: (heat / 100.0).clamp(0.0, 1.0),
                          minHeight: 5,
                          backgroundColor: HackerTheme.card,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            heat > 75.0
                                ? HackerTheme.neonRed
                                : heat > 40.0
                                    ? HackerTheme.neonAmber
                                    : HackerTheme.neonCyan,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }
}
