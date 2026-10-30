import 'package:intl/intl.dart';

class NumberFormatter {
  static final NumberFormat _currencyFormat = NumberFormat('#,##0.00', 'en_US');
  static final NumberFormat _simpleFormat = NumberFormat('#,##0', 'en_US');

  static const List<String> _suffixes = [
    '',
    'K',   // 10^3
    'M',   // 10^6
    'B',   // 10^9
    'T',   // 10^12
    'Qa',  // 10^15
    'Qi',  // 10^18
    'Sx',  // 10^21
    'Sp',  // 10^24
    'Oc',  // 10^27
    'No',  // 10^30
    'Dc',  // 10^33
  ];

  /// Formats currency with nice compact notations
  static String formatCurrency(double amount) {
    if (amount.isNaN || amount.isInfinite) return '\$0.00';
    if (amount < 0) return '-\$${formatCurrency(-amount).replaceAll('\$', '')}';
    
    if (amount < 1000) {
      return '\$${_currencyFormat.format(amount)}';
    }

    int tier = 0;
    double reduced = amount;
    while (reduced >= 1000 && tier < _suffixes.length - 1) {
      reduced /= 1000;
      tier++;
    }

    if (tier >= _suffixes.length - 1 && reduced >= 1000) {
      return '\$${amount.toStringAsExponential(2)}';
    }

    return '\$${reduced.toStringAsFixed(2)} ${_suffixes[tier]}';
  }

  /// Formats raw numbers (hashrate, taps, etc.)
  static String formatCompact(double number, {String unit = ''}) {
    if (number.isNaN || number.isInfinite) return '0 $unit'.trim();
    if (number < 0) return '-${formatCompact(-number, unit: unit)}';
    
    if (number < 1000) {
      return '${number.toStringAsFixed(number % 1 == 0 ? 0 : 1)} $unit'.trim();
    }

    int tier = 0;
    double reduced = number;
    while (reduced >= 1000 && tier < _suffixes.length - 1) {
      reduced /= 1000;
      tier++;
    }

    if (tier >= _suffixes.length - 1 && reduced >= 1000) {
      return '${number.toStringAsExponential(2)} $unit'.trim();
    }

    final suffix = _suffixes[tier];
    return '${reduced.toStringAsFixed(2)} $suffix $unit'.trim();
  }

  /// Format hashrate specifically (H/s, KH/s, MH/s, GH/s, TH/s, PH/s, EH/s)
  static String formatHashrate(double hashesPerSec) {
    if (hashesPerSec < 1000) return '${hashesPerSec.toStringAsFixed(1)} H/s';
    if (hashesPerSec < 1e6) return '${(hashesPerSec / 1e3).toStringAsFixed(2)} KH/s';
    if (hashesPerSec < 1e9) return '${(hashesPerSec / 1e6).toStringAsFixed(2)} MH/s';
    if (hashesPerSec < 1e12) return '${(hashesPerSec / 1e9).toStringAsFixed(2)} GH/s';
    if (hashesPerSec < 1e15) return '${(hashesPerSec / 1e12).toStringAsFixed(2)} TH/s';
    if (hashesPerSec < 1e18) return '${(hashesPerSec / 1e15).toStringAsFixed(2)} PH/s';
    return '${(hashesPerSec / 1e18).toStringAsFixed(2)} EH/s';
  }
}
