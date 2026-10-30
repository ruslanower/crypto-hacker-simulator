import React, { useState, useEffect } from 'react';
import { HackTarget } from '../types/game';
import { Terminal, AlertTriangle, X } from 'lucide-react';

interface Props {
  target: HackTarget;
  onComplete: (isSuccess: boolean) => void;
  onClose: () => void;
}

const OPCODES = [
  '0xDE', '0xAD', '0xBE', '0xEF',
  '0xCA', '0xFE', '0xBA', '0xBE',
  '0x13', '0x37', '0x8F', '0x00',
  '0xC0', '0xFF', '0xEE', '0x42',
];

export const HackMinigameModal: React.FC<Props> = ({ target, onComplete, onClose }) => {
  const [targetSequence, setTargetSequence] = useState<string[]>([]);
  const [availableButtons, setAvailableButtons] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState<string[]>([]);
  const [strikes, setStrikes] = useState<number>(0);

  const totalDurationMs = Math.max(5000, 10000 - target.requiredLevel * 900);
  const [remainingMs, setRemainingMs] = useState<number>(totalDurationMs);

  useEffect(() => {
    // Generate sequence
    const shuffled = [...OPCODES].sort(() => Math.random() - 0.5);
    const seqLen = target.requiredLevel >= 4 ? 5 : target.requiredLevel >= 2 ? 4 : 3;
    const seq = shuffled.slice(0, seqLen);
    setTargetSequence(seq);

    const grid = new Set(seq);
    while (grid.size < 12) {
      grid.add(OPCODES[Math.floor(Math.random() * OPCODES.length)]);
    }
    setAvailableButtons(Array.from(grid).sort(() => Math.random() - 0.5));
  }, [target]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMs(prev => {
        if (prev <= 100) {
          clearInterval(interval);
          onComplete(false);
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleTap = (code: string) => {
    if (remainingMs <= 0) return;

    const nextExpected = targetSequence[currentInput.length];
    if (code === nextExpected) {
      const nextInput = [...currentInput, code];
      setCurrentInput(nextInput);

      if (nextInput.length === targetSequence.length) {
        // SUCCESS!
        onComplete(true);
      }
    } else {
      // MISTAKE
      const nextStrikes = strikes + 1;
      setStrikes(nextStrikes);
      setRemainingMs(prev => Math.max(0, prev - 1200));

      if (nextStrikes >= 2) {
        onComplete(false);
      }
    }
  };

  const progress = Math.min(1, Math.max(0, remainingMs / totalDurationMs));
  const isCritical = progress < 0.3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`w-full max-w-sm rounded-lg border-2 bg-surface p-4 shadow-2xl ${
        isCritical ? 'border-neonRed animate-pulse' : 'border-neonCyan'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-borderDark pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-neonCyan">
            <Terminal className="h-4 w-4" />
            <span>ІН'ЄКЦІЯ ШЕЛЛКОДУ</span>
          </div>
          <div className="text-[10px] font-bold text-neonRed">
            ПОМИЛКИ: {strikes}/2
          </div>
        </div>

        <div className="mt-2.5">
          <div className="text-xs font-bold text-slate-100">{target.title}</div>
          <div className="text-[10px] text-slate-400">
            Введіть байти у правильному порядку до спрацювання фаєрволу IDS:
          </div>
        </div>

        {/* Target Sequence Display */}
        <div className="mt-3 flex items-center justify-center gap-1.5 rounded border border-borderDark bg-card p-2">
          {targetSequence.map((code, idx) => {
            const isEntered = idx < currentInput.length;
            const isCurrent = idx === currentInput.length;

            return (
              <span
                key={idx}
                className={`rounded border px-2 py-1 text-xs font-bold font-mono ${
                  isEntered
                    ? 'border-neonGreen bg-neonGreen/20 text-neonGreen'
                    : isCurrent
                    ? 'border-neonCyan bg-neonCyan/20 text-neonCyan animate-pulse'
                    : 'border-borderDark bg-surface text-slate-500'
                }`}
              >
                {code}
              </span>
            );
          })}
        </div>

        {/* Timer Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] font-bold">
            <span className={isCritical ? 'text-neonRed' : 'text-neonCyan'}>
              ЧАС ДО ТРИВОГИ IDS:
            </span>
            <span className={isCritical ? 'text-neonRed font-black' : 'text-slate-300'}>
              {(remainingMs / 1000).toFixed(1)}s
            </span>
          </div>
          <div className="mt-1 h-2 w-full rounded bg-card overflow-hidden">
            <div
              className={`h-full transition-all duration-100 ${
                isCritical ? 'bg-neonRed' : 'bg-neonCyan'
              }`}
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* 4x3 Grid of Buttons */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {availableButtons.map((code, idx) => (
            <button
              key={idx}
              onClick={() => handleTap(code)}
              className="rounded border border-borderDark bg-card py-2 text-xs font-mono font-bold text-neonGreen hover:border-neonCyan hover:bg-neonCyan/10 active:scale-90 transition-transform"
            >
              {code}
            </button>
          ))}
        </div>

        {/* Abort button */}
        <div className="mt-3 text-center">
          <button
            onClick={onClose}
            className="text-[10px] text-slate-400 hover:text-slate-200"
          >
            ВІДСТУПИТИ / ПЕРЕРВАТИ СЕСІЮ
          </button>
        </div>
      </div>
    </div>
  );
};
