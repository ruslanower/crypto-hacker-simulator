import React from 'react';
import { UpgradeItem } from '../types/game';
import { formatCurrency } from '../utils/formatters';
import { Snowflake, Lock, Mouse, Keyboard, Cpu, LayoutGrid, Server, Zap, Fan, Droplets, Waves } from 'lucide-react';

interface Props {
  upgrades: UpgradeItem[];
  cash: number;
  playerLevel: number;
  temp: number;
  totalCoolingPower: number;
  isThrottling: boolean;
  onBuyUpgrade: (id: string) => void;
  onPurgeFans: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Mouse: <Mouse className="h-5 w-5" />,
  Keyboard: <Keyboard className="h-5 w-5" />,
  Cpu: <Cpu className="h-5 w-5" />,
  LayoutGrid: <LayoutGrid className="h-5 w-5" />,
  Server: <Server className="h-5 w-5" />,
  Zap: <Zap className="h-5 w-5" />,
  Fan: <Fan className="h-5 w-5" />,
  Droplets: <Droplets className="h-5 w-5" />,
  Waves: <Waves className="h-5 w-5" />,
  Snowflake: <Snowflake className="h-5 w-5" />,
};

export const HardwareShopScreen: React.FC<Props> = ({
  upgrades,
  cash,
  playerLevel,
  temp,
  totalCoolingPower,
  isThrottling,
  onBuyUpgrade,
  onPurgeFans,
}) => {
  const hardwareItems = upgrades.filter(u => u.type === 'hardware');
  const coolingItems = upgrades.filter(u => u.type === 'cooling');

  const renderCard = (item: UpgradeItem, color: string) => {
    const cost = item.baseCost * Math.pow(item.costMultiplier, item.count);
    const canAfford = cash >= cost;
    const isLocked = playerLevel < item.levelRequired;

    return (
      <div
        key={item.id}
        className="mb-2.5 flex items-center justify-between rounded border border-borderDark bg-card p-2.5"
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded border ${
              isLocked
                ? 'border-borderDark bg-surface text-slate-500'
                : `border-${color}/30 bg-${color}/10 text-${color}`
            }`}
          >
            {isLocked ? <Lock className="h-5 w-5" /> : ICON_MAP[item.icon] || <Zap className="h-5 w-5" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${isLocked ? 'text-slate-500' : 'text-slate-100'}`}>
                {item.name}
              </span>
              <span className="rounded border border-borderDark bg-surface px-1.5 py-0.2 text-[10px] font-bold text-neonCyan">
                x{item.count}
              </span>
            </div>

            <div className="text-[10px] text-slate-400">
              {isLocked ? `Потрібен рівень ${item.levelRequired}` : item.description}
            </div>

            <div className="mt-1 text-[10px] font-semibold text-neonGreen">
              {item.type === 'cooling'
                ? `Охолодження: -${(item.count * item.basePower).toFixed(1)}°C/s`
                : `Внесок: +${formatCurrency(item.count * item.basePower)}/tap`}
            </div>
          </div>
        </div>

        <button
          onClick={() => onBuyUpgrade(item.id)}
          disabled={!canAfford || isLocked}
          className={`ml-2 flex flex-col items-center rounded px-3 py-1.5 text-[10px] font-black transition-all ${
            canAfford && !isLocked
              ? 'bg-neonGreen text-black hover:bg-neonGreen/80'
              : 'border border-borderDark bg-surface text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>КУПИТИ</span>
          <span className="font-bold">{formatCurrency(cost)}</span>
        </button>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-3">
      {/* Thermal Control Banner */}
      <div
        className={`mb-3 rounded border p-3 bg-card ${
          isThrottling ? 'border-neonRed animate-pulse' : 'border-neonCyan/40'
        }`}
      >
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-100">
            <Snowflake className="h-4 w-4 text-neonCyan" />
            <span>ТЕМПЕРАТУРА ФЕРМ: {temp.toFixed(1)}°C</span>
          </div>
          <span className="text-[10px] font-bold text-neonCyan">
            Охолодження: -{totalCoolingPower.toFixed(1)}°C/s
          </span>
        </div>

        <div className="mt-2 h-1.5 w-full rounded bg-surface overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isThrottling ? 'bg-neonRed' : temp > 65 ? 'bg-neonAmber' : 'bg-neonCyan'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, ((temp - 35) / 70) * 100))}%` }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px]">
          <span className={isThrottling ? 'text-neonRed font-bold' : 'text-slate-400'}>
            {isThrottling
              ? '🔥 КРИТИЧНИЙ ПЕРЕГРІВ! Тротлінг -60% до всього прибутку!'
              : 'При перевищенні 85°C вмикається тротлінг (-60%).'}
          </span>
          <button
            onClick={onPurgeFans}
            className="rounded border border-neonCyan bg-surface px-2 py-1 font-bold text-neonCyan hover:bg-neonCyan/20"
          >
            ПРОДУТИ (-18°C)
          </button>
        </div>
      </div>

      {/* Hardware Section */}
      <div className="mb-2 text-[10px] font-bold tracking-wider text-slate-400">
        ⚡ МАЙНІНГ ТА ЗАЛІЗО (ГЕНЕРУЄ ТЕПЛО)
      </div>
      {hardwareItems.map(item => renderCard(item, 'neonGreen'))}

      {/* Cooling Section */}
      <div className="mb-2 mt-4 text-[10px] font-bold tracking-wider text-slate-400">
        ❄️ СИСТЕМИ ОХОЛОДЖЕННЯ (ЗНИЖУЮТЬ ТЕМПЕРАТУРУ)
      </div>
      {coolingItems.map(item => renderCard(item, 'neonCyan'))}
    </div>
  );
};
