import React from 'react';
import { HackTarget } from '../types/game';
import { formatCurrency } from '../utils/formatters';
import { Waves, Shield, CheckCircle } from 'lucide-react';

interface Props {
  targets: HackTarget[];
  dirtyCash: number;
  cash: number;
  gasGwei: number;
  playerLevel: number;
  heat: number;
  onWashDirty: () => void;
  onEmergencyCoolOff: () => void;
  onSelectTarget: (target: HackTarget) => void;
}

export const TargetsScreen: React.FC<Props> = ({
  targets,
  dirtyCash,
  cash,
  gasGwei,
  playerLevel,
  heat,
  onWashDirty,
  onEmergencyCoolOff,
  onSelectTarget,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-3">
      {/* Laundry & Security Card */}
      <div className="mb-3 rounded border border-neonAmber/50 bg-card p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-neonAmber">
            <Waves className="h-4 w-4" />
            <span>ВІДМИВАННЯ ТА БЕЗПЕКА</span>
          </div>
          <span className="text-[11px] font-bold text-neonAmber">
            Брудні: {formatCurrency(dirtyCash)}
          </span>
        </div>

        <div className="mt-1.5 text-[10px] text-slate-400 leading-relaxed">
          Після зламів ви отримуєте "брудну" криптовалюту. Її необхідно відмивати через Tornado Cash (-12%), інакше під час рейду поліція заморозить до 85% активів!
        </div>

        <div className="mt-2.5 flex gap-2">
          <button
            onClick={onWashDirty}
            disabled={dirtyCash <= 0}
            className={`flex-1 rounded py-2 text-[10px] font-bold transition-all ${
              dirtyCash > 0
                ? 'bg-neonAmber text-black hover:bg-neonAmber/80'
                : 'border border-borderDark bg-surface text-slate-500 cursor-not-allowed'
            }`}
          >
            TORNADO CASH (-12%)
          </button>
          <button
            onClick={onEmergencyCoolOff}
            disabled={heat <= 0}
            className={`flex-1 rounded border border-neonCyan bg-neonCyan/10 py-2 text-[10px] font-bold text-neonCyan hover:bg-neonCyan/20 ${
              heat <= 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            ЗМІНИТИ VPN/IP
          </button>
        </div>
      </div>

      {/* Target Heists List */}
      <div className="mb-2 text-[10px] font-bold tracking-wider text-slate-400">
        🎯 ЦІЛЬОВІ КІБЕРАТАКИ (РЕАЛЬНІ ПРЕЦЕДЕНТИ ТА МІНІ-ГРА)
      </div>

      {targets.map(target => {
        const isLocked = playerLevel < target.requiredLevel;
        const cooldownRemaining = target.cooldownEndsAt ? Math.max(0, Math.ceil((target.cooldownEndsAt - Date.now()) / 1000)) : 0;
        const isInCooldown = cooldownRemaining > 0;
        const gasCost = (gasGwei * 0.45) * target.requiredLevel;
        const hasGas = cash >= gasCost;

        return (
          <div
            key={target.id}
            className={`mb-2.5 rounded border bg-card p-3 ${
              isLocked
                ? 'border-borderDark opacity-75'
                : target.isCompletedOnce
                ? 'border-neonGreen/50'
                : 'border-borderDark'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-100">{target.title}</span>
                  {target.isCompletedOnce && (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-neonGreen">
                      <CheckCircle className="h-3 w-3" /> HACKED
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-neonCyan">{target.subtitle}</div>
                <div className="mt-0.5 text-[9px] italic text-slate-400">
                  Аналог: {target.realWorldReference}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-borderDark/60 pt-2 text-[10px]">
              <div>
                <div className="font-bold text-neonGreen">
                  Куш: ~{formatCurrency(target.potentialLoot)}
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-neonRed">Загроза: +{target.heatGenerated}% Heat</span>
                  <span>•</span>
                  <span className={hasGas ? 'text-neonCyan' : 'text-neonRed font-bold'}>
                    Газ: {formatCurrency(gasCost)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onSelectTarget(target)}
                disabled={isLocked || isInCooldown || !hasGas}
                className={`rounded px-3 py-1.5 text-[10px] font-black transition-all ${
                  !isLocked && !isInCooldown && hasGas
                    ? 'bg-neonRed text-white hover:bg-neonRed/80 shadow-[0_0_15px_rgba(255,42,85,0.4)]'
                    : 'border border-borderDark bg-surface text-slate-500 cursor-not-allowed'
                }`}
              >
                {isLocked
                  ? `РІВЕНЬ ${target.requiredLevel}`
                  : isInCooldown
                  ? `КД ${cooldownRemaining}s`
                  : !hasGas
                  ? 'НЕМАЄ ГАЗУ'
                  : 'ЗЛАМАТИ (ШЕЛЛКОД)'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
