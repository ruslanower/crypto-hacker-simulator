import React from 'react';
import { formatCurrency, formatHashrate } from '../utils/formatters';
import { Shield, Flame, AlertTriangle, Fuel, Snowflake } from 'lucide-react';
import { CrisisEvent } from '../types/game';

interface Props {
  level: number;
  levelTitle: string;
  cash: number;
  dirtyCash: number;
  cashPerSecond: number;
  tapPower: number;
  totalHashrate: number;
  heat: number;
  temp: number;
  isThrottling: boolean;
  gasGwei: number;
  prestigePoints: number;
  prestigeMultiplier: number;
  crisis: CrisisEvent | null;
  onEmergencyCoolOff: () => void;
  onPurgeFans: () => void;
  onResolveCrisis: () => void;
}

export const StatHeader: React.FC<Props> = ({
  level,
  levelTitle,
  cash,
  dirtyCash,
  cashPerSecond,
  tapPower,
  totalHashrate,
  heat,
  temp,
  isThrottling,
  gasGwei,
  prestigePoints,
  prestigeMultiplier,
  crisis,
  onEmergencyCoolOff,
  onPurgeFans,
  onResolveCrisis,
}) => {
  const isHeatCritical = heat >= 75;

  return (
    <div className="flex flex-col border-b border-borderDark bg-surface">
      {/* Crisis Banner */}
      {crisis && (
        <div className="flex items-center justify-between bg-neonRed px-4 py-2 text-white">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 animate-bounce" />
            <div>
              <div className="text-xs font-bold">{crisis.title}</div>
              <div className="text-[10px] opacity-90">Залишилось: {crisis.remainingSeconds}s</div>
            </div>
          </div>
          <button
            onClick={onResolveCrisis}
            className="rounded bg-white px-2.5 py-1 text-xs font-black text-neonRed hover:bg-slate-100"
          >
            {crisis.actionButtonText}
          </button>
        </div>
      )}

      <div className="p-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-2">
            <span className="rounded border border-neonGreen/40 bg-neonGreen/10 px-2 py-0.5 font-bold tracking-wider text-neonGreen">
              LVL {level} • {levelTitle.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded border border-borderDark bg-card px-2 py-0.5 font-bold text-neonCyan">
              <Fuel className="h-3 w-3" />
              {gasGwei} Gwei
            </span>
            {prestigePoints > 0 && (
              <span className="flex items-center gap-1 rounded border border-neonAmber/40 bg-neonAmber/10 px-2 py-0.5 font-bold text-neonAmber">
                <Shield className="h-3 w-3" />
                REP: {prestigePoints} (+{((prestigeMultiplier - 1) * 100).toFixed(0)}%)
              </span>
            )}
          </div>
        </div>

        {/* Balances */}
        <div className="mt-2 flex items-baseline justify-between">
          <div>
            <div className="text-[10px] tracking-wider text-slate-400">ЧИСТИЙ БАЛАНС</div>
            <div className="text-2xl font-black text-neonGreen tracking-tight">
              {formatCurrency(cash)}
            </div>
          </div>

          {dirtyCash > 0 && (
            <div className="rounded border border-neonAmber/40 bg-neonAmber/10 px-2.5 py-1 text-right">
              <div className="text-[9px] font-bold text-neonAmber">БРУДНІ АКТИВИ</div>
              <div className="text-sm font-bold text-neonAmber">{formatCurrency(dirtyCash)}</div>
            </div>
          )}
        </div>

        {/* Live Metrics */}
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className={`font-semibold ${isThrottling ? 'text-neonAmber' : 'text-neonCyan'}`}>
            ⚡ {formatCurrency(cashPerSecond)}/s
          </span>
          <span className="text-slate-300">
            🖱️ {formatCurrency(tapPower)}/tap
          </span>

          {/* Temperature button */}
          <button
            onClick={onPurgeFans}
            className={`flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-bold ${
              isThrottling
                ? 'border-neonRed bg-neonRed/20 text-neonRed animate-pulse'
                : 'border-borderDark bg-card text-slate-200 hover:border-neonCyan'
            }`}
          >
            <Snowflake className="h-3 w-3 text-neonCyan" />
            {temp.toFixed(1)}°C {isThrottling && '(ТРОТЛІНГ -60%)'}
          </button>
        </div>

        {/* Heat Meter */}
        <div className="mt-2.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className={`flex items-center gap-1 font-bold ${isHeatCritical ? 'text-neonRed animate-pulse' : 'text-slate-400'}`}>
              <Flame className="h-3.5 w-3.5" />
              РІВЕНЬ ЗАГРОЗИ (FBI HEAT): {heat.toFixed(1)}%
            </span>

            {heat > 0 && (
              <button
                onClick={onEmergencyCoolOff}
                className="rounded border border-neonCyan/50 bg-neonCyan/10 px-1.5 py-0.5 font-bold text-neonCyan hover:bg-neonCyan/20"
              >
                ЗМІНИТИ VPN/IP
              </button>
            )}
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded bg-card">
            <div
              className={`h-full transition-all duration-300 ${
                heat > 75 ? 'bg-neonRed' : heat > 40 ? 'bg-neonAmber' : 'bg-neonCyan'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, heat))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
