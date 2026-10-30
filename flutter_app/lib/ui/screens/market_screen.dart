import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/game_state.dart';
import '../../utils/number_formatter.dart';
import '../theme/hacker_theme.dart';

class MarketScreen extends StatelessWidget {
  const MarketScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<GameState>();
    final potentialPrestige = state.potentialPrestigeGain;

    return ListView(
      padding: const EdgeInsets.all(12),
      children: [
        // Prestige / Clean Slate Banner
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: HackerTheme.card,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: HackerTheme.neonAmber.withOpacity(0.6)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.flight_takeoff, color: HackerTheme.neonAmber, size: 20),
                      SizedBox(width: 8),
                      Text(
                        'ВТЕЧА В ПАНАМУ (ПРЕСТИЖ)',
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
                    'Поточний бонус: +${((state.prestigeMultiplier - 1.0) * 100).toStringAsFixed(0)}%',
                    style: const TextStyle(color: HackerTheme.neonAmber, fontWeight: FontWeight.bold, fontSize: 10),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              const Text(
                'Скиньте свій поточний кеш та залізо в обмін на "Darknet Credibility". Кожен бал престижу дає перманентний бонус +5% до абсолютно всіх майбутніх доходів назавжди!',
                style: TextStyle(color: HackerTheme.textMuted, fontSize: 11, height: 1.3),
              ),
              const SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    potentialPrestige > 0
                        ? 'Доступно: +$potentialPrestige Credibility'
                        : 'Потрібно більше заробітку для втечі',
                    style: TextStyle(
                      color: potentialPrestige > 0 ? HackerTheme.neonGreen : HackerTheme.textMuted,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: potentialPrestige > 0 ? HackerTheme.neonAmber : HackerTheme.surface,
                      foregroundColor: potentialPrestige > 0 ? Colors.black : HackerTheme.textMuted,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    ),
                    onPressed: potentialPrestige > 0
                        ? () {
                            showDialog(
                              context: context,
                              builder: (ctx) => AlertDialog(
                                backgroundColor: HackerTheme.card,
                                title: const Text('СПАЛИТИ ПАСПОРТИ?', style: TextStyle(color: HackerTheme.neonAmber)),
                                content: Text(
                                  'Ви скинете поточні накопичення та залізо, але отримаєте +$potentialPrestige Darknet Credibility (постійний буст +${(potentialPrestige * 5)}% до прибутку). Продовжити?',
                                  style: const TextStyle(color: HackerTheme.textWhite, fontSize: 13),
                                ),
                                actions: [
                                  TextButton(
                                    child: const Text('СКАСУВАТИ', style: TextStyle(color: HackerTheme.textMuted)),
                                    onPressed: () => Navigator.pop(ctx),
                                  ),
                                  ElevatedButton(
                                    style: ElevatedButton.styleFrom(backgroundColor: HackerTheme.neonAmber, foregroundColor: Colors.black),
                                    child: const Text('ВТЕКТИ В ПАНАМУ'),
                                    onPressed: () {
                                      Navigator.pop(ctx);
                                      state.performCleanSlate();
                                    },
                                  ),
                                ],
                              ),
                            );
                          }
                        : null,
                    child: const Text('ЧИСТИЙ АРКУШ', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Live Simulated Market Coins
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 4, vertical: 4),
          child: Text(
            'РИНОК КРИПТОВАЛЮТ (СИМУЛЯЦІЯ В РЕАЛЬНОМУ ЧАСІ)',
            style: TextStyle(
              color: HackerTheme.textMuted,
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.0,
            ),
          ),
        ),
        const SizedBox(height: 8),

        ...state.marketCoins.map((coin) {
          final isPositive = coin.change24h >= 0;

          return Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            decoration: BoxDecoration(
              color: HackerTheme.card,
              borderRadius: BorderRadius.circular(6),
              border: Border.all(color: HackerTheme.border),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          coin.symbol,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: HackerTheme.textWhite),
                        ),
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                          decoration: BoxDecoration(
                            color: coin.isMineable
                                ? HackerTheme.neonGreen.withOpacity(0.12)
                                : HackerTheme.neonCyan.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(3),
                          ),
                          child: Text(
                            coin.isMineable ? 'PoW MAYH' : 'PoS STAKE',
                            style: TextStyle(
                              color: coin.isMineable ? HackerTheme.neonGreen : HackerTheme.neonCyan,
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${coin.name} • ${coin.algorithm}',
                      style: const TextStyle(color: HackerTheme.textMuted, fontSize: 10),
                    ),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      coin.price > 1.0
                          ? '\$${coin.price.toStringAsFixed(2)}'
                          : '\$${coin.price.toStringAsFixed(6)}',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: HackerTheme.textWhite),
                    ),
                    Text(
                      '${isPositive ? '+' : ''}${coin.change24h.toStringAsFixed(2)}%',
                      style: TextStyle(
                        color: isPositive ? HackerTheme.neonGreen : HackerTheme.neonRed,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        }),

        const SizedBox(height: 16),
        // Top 10 Exchanges Reference Info
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 4, vertical: 4),
          child: Text(
            'ТОП-10 БІРЖ (CEX / DEX АНАЛІТИКА)',
            style: TextStyle(
              color: HackerTheme.textMuted,
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.0,
            ),
          ),
        ),
        const SizedBox(height: 8),

        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: HackerTheme.surface,
            borderRadius: BorderRadius.circular(6),
            border: Border.all(color: HackerTheme.border),
          ),
          child: const Column(
            children: [
              _ExchangeRow(rank: '1', name: 'Binance', type: 'CEX', trust: '10/10', share: '37.0% споту'),
              _ExchangeRow(rank: '2', name: 'Bybit', type: 'CEX', trust: '9/10', share: 'Ф\'ючерси лідер'),
              _ExchangeRow(rank: '3', name: 'Coinbase', type: 'CEX', trust: '10/10', share: 'Кастодія 800k BTC'),
              _ExchangeRow(rank: '4', name: 'OKX', type: 'CEX', trust: '10/10', share: 'Web3 гаманець #1'),
              _ExchangeRow(rank: '5', name: 'Kraken', type: 'CEX', trust: '10/10', share: 'Найвищий захист'),
              _ExchangeRow(rank: '6', name: 'Hyperliquid', type: 'DEX', trust: 'On-chain', share: 'OI > \$2 млрд'),
              _ExchangeRow(rank: '7', name: 'Gate.io', type: 'CEX', trust: '9/10', share: '1,700+ альткоїнів'),
              _ExchangeRow(rank: '8', name: 'MEXC', type: 'CEX', trust: '9/10', share: '0% комісія Maker'),
              _ExchangeRow(rank: '9', name: 'Bitget', type: 'CEX', trust: '10/10', share: 'Копітрейдинг #1'),
              _ExchangeRow(rank: '10', name: 'Uniswap', type: 'DEX', trust: 'On-chain', share: 'AMM стандарт L1/L2'),
            ],
          ),
        ),
      ],
    );
  }
}

class _ExchangeRow extends StatelessWidget {
  final String rank;
  final String name;
  final String type;
  final String trust;
  final String share;

  const _ExchangeRow({
    required this.rank,
    required this.name,
    required this.type,
    required this.trust,
    required this.share,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Text('#$rank', style: const TextStyle(color: HackerTheme.neonGreen, fontSize: 11, fontWeight: FontWeight.bold)),
              const SizedBox(width: 8),
              Text(name, style: const TextStyle(color: HackerTheme.textWhite, fontSize: 11, fontWeight: FontWeight.bold)),
              const SizedBox(width: 6),
              Text('($type)', style: const TextStyle(color: HackerTheme.textMuted, fontSize: 10)),
            ],
          ),
          Row(
            children: [
              Text(trust, style: const TextStyle(color: HackerTheme.neonCyan, fontSize: 10, fontWeight: FontWeight.bold)),
              const SizedBox(width: 8),
              Text(share, style: const TextStyle(color: HackerTheme.textMuted, fontSize: 10)),
            ],
          ),
        ],
      ),
    );
  }
}
