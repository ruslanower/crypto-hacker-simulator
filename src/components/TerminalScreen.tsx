import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { Terminal, Waves, AlertOctagon, X } from 'lucide-react';

interface Props {
  logs: string[];
  tapPower: number;
  dirtyCash: number;
  tapsCount: number;
  isRaidTriggered: boolean;
  lastRaidMessage: string;
  onTap: () => void;
  onWashDirty: () => void;
  onDismissRaid: () => void;
}

interface FloatingNum {
  id: number;
  text: string;
  x: number;
  y: number;
}

export const TerminalScreen: React.FC<Props> = ({
  logs,
  tapPower,
  dirtyCash,
  tapsCount,
  isRaidTriggered,
  lastRaidMessage,
  onTap,
  onWashDirty,
  onDismissRaid,
}) => {
  const [floatingNums, setFloatingNums] = useState<FloatingNum[]>([]);

  const handleTap = (e: React.MouseEvent<HTMLButtonElement>) => {
    onTap();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newId = Date.now() + Math.random();
    const item: FloatingNum = {
      id: newId,
      text: `+${formatCurrency(tapPower)}`,
      x,
      y,
    };

    setFloatingNums(prev => [...prev, item]);
    setTimeout(() => {
      setFloatingNums(prev => prev.filter(n => n.id !== newId));
    }, 700);
  };

  return (
    <div className="flex flex-1 flex-col p-3 overflow-hidden">
      {/* Raid Banner */}
      {isRaidTriggered && (
        <div className="mb-2 flex items-center justify-between rounded bg-neonRed p-2.5 text-white">
          <div className="flex items-center gap-2 text-xs font-bold">
            <AlertOctagon className="h-5 w-5" />
            <span>{lastRaidMessage}</span>
          </div>
          <button onClick={onDismissRaid} className="text-white hover:opacity-75">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Terminal Shell */}
      <div className="flex h-44 flex-col rounded border border-borderDark bg-[#04070A] p-2.5 shadow-lg">
        <div className="flex items-center justify-between border-b border-borderDark pb-1.5 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-neonRed" />
            <span className="h-2 w-2 rounded-full bg-neonAmber" />
            <span className="h-2 w-2 rounded-full bg-neonGreen" />
            <span className="ml-2 text-slate-400 font-mono">bash: /dev/crypto_exploits.sh</span>
          </div>
          <span className="font-bold text-neonCyan">TAPS: {tapsCount}</span>
        </div>

        <div className="flex-1 overflow-y-auto pt-2 text-[11px] leading-relaxed">
          {logs.map((log, idx) => {
            const isSuccess = log.includes('УСПІХ') || log.includes('[OK]') || log.includes('ДОСЯГНЕННЯ');
            const isWarn = log.includes('ПРОВАЛ') || log.includes('[!]') || log.includes('ОБЛАВА');

            return (
              <div
                key={idx}
                className={
                  isWarn
                    ? 'text-neonRed font-semibold'
                    : isSuccess
                    ? 'text-neonGreen'
                    : 'text-slate-300'
                }
              >
                {log}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Wash Button */}
      {dirtyCash > 0 && (
        <button
          onClick={onWashDirty}
          className="mt-2.5 flex items-center justify-center gap-2 rounded border border-neonAmber bg-neonAmber/15 py-2 text-xs font-bold text-neonAmber hover:bg-neonAmber/25 transition-colors"
        >
          <Waves className="h-4 w-4" />
          ВІДМИТИ {formatCurrency(dirtyCash)} ЧЕРЕЗ TORNADO CASH
        </button>
      )}

      {/* Giant Tapping Button Area */}
      <div className="relative flex flex-1 items-center justify-center py-4">
        <button
          onClick={handleTap}
          className="relative flex h-48 w-48 flex-col items-center justify-center rounded-full border-4 border-neonGreen/60 bg-card shadow-[0_0_30px_rgba(0,255,102,0.3)] active:scale-95 transition-transform"
        >
          <Terminal className="h-14 w-14 text-neonGreen" />
          <div className="mt-2 text-base font-black tracking-widest text-neonGreen">
            BRUTE-FORCE
          </div>
          <div className="text-xs font-bold text-neonCyan">
            +{formatCurrency(tapPower)}/tap
          </div>

          {/* Floating numbers */}
          {floatingNums.map(item => (
            <div
              key={item.id}
              className="pointer-events-none absolute font-bold text-neonGreen text-lg animate-float-up"
              style={{ left: item.x, top: item.y }}
            >
              {item.text}
            </div>
          ))}
        </button>
      </div>
    </div>
  );
};
