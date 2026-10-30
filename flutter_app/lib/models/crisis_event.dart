enum CrisisType {
  whitehatDrain,     // Whitehat hacker probing your contract
  overheatingRigs,    // Cooling failed, rigs throttling
  policeWarrant,      // FBI raid imminent
  gasSpike,          // Network gas price skyrocketed
}

class CrisisEvent {
  final String id;
  final String title;
  final String description;
  final CrisisType type;
  final int timeLimitSeconds;
  final String actionButtonText;
  int remainingSeconds;
  bool isResolved;

  CrisisEvent({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.timeLimitSeconds,
    required this.actionButtonText,
    int? remaining,
    this.isResolved = false,
  }) : remainingSeconds = remaining ?? timeLimitSeconds;

  double get progress => (remainingSeconds / timeLimitSeconds).clamp(0.0, 1.0);
}
