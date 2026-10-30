class CryptoCoin {
  final String symbol;
  final String name;
  final String algorithm; // e.g. "SHA-256 (ASIC)", "RandomX (CPU)", "PoS (Staking)"
  final bool isMineable;
  double price;
  double change24h; // Percentage e.g. +5.4% or -12.1%
  double userBalance;

  CryptoCoin({
    required this.symbol,
    required this.name,
    required this.algorithm,
    required this.isMineable,
    required this.price,
    this.change24h = 0.0,
    this.userBalance = 0.0,
  });

  double get valueUsd => userBalance * price;

  Map<String, dynamic> toJson() => {
    'symbol': symbol,
    'price': price,
    'change24h': change24h,
    'userBalance': userBalance,
  };

  void loadFromJson(Map<String, dynamic> json) {
    price = (json['price'] as num?)?.toDouble() ?? price;
    change24h = (json['change24h'] as num?)?.toDouble() ?? change24h;
    userBalance = (json['userBalance'] as num?)?.toDouble() ?? userBalance;
  }
}
