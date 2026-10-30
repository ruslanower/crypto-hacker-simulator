import React from 'react';
import { Achievement } from '../types/game';
import { Trophy, CheckCircle, Lock, X } from 'lucide-react';

interface Props {
  achievements: Achievement[];
  onClose: () => void;
}

export const AchievementsModal: React.FC<Props> = ({ achievements, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-lg border border-borderDark bg-surface p-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-borderDark pb-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-neonAmber">
            <Trophy className="h-4 w-4" />
            <span>ДОСЯГНЕННЯ ТА ТИТУЛИ</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 max-h-80 overflow-y-auto space-y-2">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className={`flex items-center justify-between rounded border p-2.5 ${
                ach.isUnlocked
                  ? 'border-neonGreen/40 bg-card'
                  : 'border-borderDark bg-surface/50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {ach.isUnlocked ? (
                  <CheckCircle className="h-5 w-5 text-neonGreen" />
                ) : (
                  <Lock className="h-5 w-5 text-slate-500" />
                )}

                <div>
                  <div className={`text-xs font-bold ${ach.isUnlocked ? 'text-slate-100' : 'text-slate-400'}`}>
                    {ach.title}
                  </div>
                  <div className="text-[10px] text-slate-400">{ach.description}</div>
                </div>
              </div>

              <span className="text-[10px] font-bold text-neonAmber">
                +{ach.rewardPrestige} Rep
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 text-center">
          <button
            onClick={onClose}
            className="w-full rounded border border-borderDark py-2 text-xs font-bold text-slate-300 hover:bg-card"
          >
            ЗАКРИТИ
          </button>
        </div>
      </div>
    </div>
  );
};
