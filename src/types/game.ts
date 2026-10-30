export type UpgradeType = 'hardware' | 'cooling' | 'software' | 'security';

export interface UpgradeItem {
  id: string;
  name: string;
  description: string;
  type: UpgradeType;
  baseCost: number;
  costMultiplier: number;
  basePower: number;
  icon: string;
  levelRequired: number;
  count: number;
}

export interface HackTarget {
  id: string;
  title: string;
  subtitle: string;
  realWorldReference: string;
  requiredLevel: number;
  potentialLoot: number;
  heatGenerated: number;
  durationSeconds: number;
  baseSuccessRate: number;
  cooldownEndsAt: number | null;
  isCompletedOnce: boolean;
}

export interface CryptoCoin {
  symbol: string;
  name: string;
  algorithm: string;
  isMineable: boolean;
  price: number;
  change24h: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardPrestige: number;
  isUnlocked: boolean;
}

export type CrisisType = 'whitehatDrain' | 'overheatingRigs' | 'policeWarrant' | 'gasSpike';

export interface CrisisEvent {
  id: string;
  title: string;
  description: string;
  type: CrisisType;
  timeLimitSeconds: number;
  remainingSeconds: number;
  actionButtonText: string;
}
