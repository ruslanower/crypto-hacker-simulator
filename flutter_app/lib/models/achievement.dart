class Achievement {
  final String id;
  final String title;
  final String description;
  final double rewardPrestige;
  bool isUnlocked;

  Achievement({
    required this.id,
    required this.title,
    required this.description,
    this.rewardPrestige = 1.0,
    this.isUnlocked = false,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'isUnlocked': isUnlocked,
  };

  void loadFromJson(Map<String, dynamic> json) {
    isUnlocked = json['isUnlocked'] as bool? ?? false;
  }
}
