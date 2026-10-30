class HackTarget {
  final String id;
  final String title;
  final String subtitle;
  final String realWorldReference; // e.g. "Bybit $1.5B Heist", "Euler Finance Exploit"
  final int requiredLevel;
  final double potentialLoot;
  final double heatGenerated;
  final int durationSeconds;
  final double baseSuccessRate; // 0.0 to 1.0
  DateTime? cooldownEndsAt;
  bool isCompletedOnce;

  HackTarget({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.realWorldReference,
    required this.requiredLevel,
    required this.potentialLoot,
    required this.heatGenerated,
    required this.durationSeconds,
    required this.baseSuccessRate,
    this.cooldownEndsAt,
    this.isCompletedOnce = false,
  });

  bool get isInCooldown => cooldownEndsAt != null && DateTime.now().isBefore(cooldownEndsAt!);

  int get remainingCooldownSeconds {
    if (cooldownEndsAt == null) return 0;
    final diff = cooldownEndsAt!.difference(DateTime.now()).inSeconds;
    return diff > 0 ? diff : 0;
  }
}
