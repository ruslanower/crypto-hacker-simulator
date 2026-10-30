import React, { useState } from 'react';
import { CryptoCoin } from '../types/game';
import { Plane, TrendingUp, TrendingDown, Shield } from 'lucide-react';

interface Props {
  coins: CryptoCoin[];
  potentialPrestigeGain: number;
  prestigeMultiplier: number;
  onCleanSlate: () => void;
}

export const MarketScreen: React.FC<Props> = ({
  coins,
  potentialPrestigeGain,
  prestigeMultiplier,
  onCleanSlate,
}) => {
  const [showPrestigeConfirm, setShowPrestigeConfirm] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto p-3">
      {/* Panama Prestige Card */}
      <div className="mb-3 rounded border border-neonAmber/60 bg-card p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-neonAmber">
            <Plane className="h-4 w-4" />
            <span>ВТЕЧА В ПАНАМУ (ПРЕСТИЖ)</span>
          </div>
          <span className="text-[10px] font-bold text-neonAmber">
            Бонус: +{((prestigeMultiplier - 1) * 100).toFixed(0)}%
          </span>
        </div>

        <div className="mt-1 text-[10px] text-slate-400 leading-relaxed">
          Скиньте накопичений кеш та залізо в обмін на "Darknet Credibility". Кожен бал дає перманентний бонус +5% до всіх майбутніх прибутків назавжди!
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className={`text-[10px] font-bold ${potentialPrestigeGain > 0 ? 'text-neonGreen' : 'text-slate-500'}`}>
            {potentialPrestigeGain > 0
              ? `Доступно: +${potentialPrestigeGain} Credibility`
              : 'Потрібно більше заробітку для втечі'}
          </span>

          <button
            onClick={() => setShowPrestigeConfirm(true)}
            disabled={potentialPrestigeGain <= 0}
            className={`rounded px-3 py-1.5 text-[10px] font-bold ${
              potentialPrestigeGain > 0
                ? 'bg-neonAmber text-black hover:bg-neonAmber/80 shadow-[0_0_15px_rgba(255,184,0,0.4)]'
                : 'border border-borderDark bg-surface text-slate-500 cursor-not-allowed'
            }`}
          >
            ЧИСТИЙ АРКУШ
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showPrestigeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded border border-neonAmber bg-surface p-4 text-center">
            <div className="text-sm font-bold text-neonAmber">СПАЛИТИ ПАСПОРТИ?</div>
            <div className="mt-2 text-xs text-slate-300">
              Ви скинете поточні накопичення та залізо, але отримаєте +{potentialPrestigeGain} Darknet Credibility (+{(potentialPrestigeGain * 5)}% буст назавжди). Продовжити?
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowPrestigeConfirm(false)}
                className="flex-1 rounded border border-borderDark py-2 text-xs text-slate-400 hover:bg-card"
              >
                СКАСУВАТИ
              </button>
              <button
                onClick={() => {
                  setShowPrestigeConfirm(false);
                  onCleanSlate();
                }}
                className="flex-1 rounded bg-neonAmber py-2 text-xs font-bold text-black hover:bg-neonAmber/80"
              >
                ВТЕКТИ В ПАНАМУ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Market Coins */}
      <div className="mb-2 text-[10px] font-bold tracking-wider text-slate-400">
        📊 РИНОК КРИПТОВАЛЮТ (СИМУЛЯЦІЯ В РЕАЛЬНОМУ ЧАСІ)
      </div>

      {coins.map(coin => {
        const isPos = coin.change24h >= 0;

        return (
          <div
            key={coin.symbol}
            className="mb-2 flex items-center justify-between rounded border border-borderDark bg-card p-2.5"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-100">{coin.symbol}</span>
                <span
                  className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                    coin.isMineable
                      ? 'bg-neonGreen/10 text-neonGreen border border-neonGreen/30'
                      : 'bg-neonCyan/10 text-neonCyan border border-neonCyan/30'
                  }`}
                >
                  {coin.isMineable ? 'PoW MAYH' : 'PoS STAKE'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                {coin.name} • {coin.algorithm}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-slate-100 font-mono">
                {coin.price > 1 ? `$${coin.price.toFixed(2)}` : `$${coin.price.toFixed(6)}`}
              </div>
              <div
                className={`flex items-center justify-end gap-0.5 text-[10px] font-bold ${
                  isPos ? 'text-neonGreen' : 'text-neonRed'
                }`}
              >
                {isPos ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {isPos ? '+' : ''}{coin.change24h.toFixed(2)}%
              </div>
            </div>
          </div>
        );
      })}

      {/* Top 10 Exchanges Reference Info */}
      <div className="mb-2 mt-4 text-[10px] font-bold tracking-wider text-slate-400">
        🏦 ТОП-10 БІРЖ (АНАЛІТИКА ТА TRUST SCORE)
      </div>

      <div className="rounded border border-borderDark bg-surface p-2.5 text-[11px] space-y-1.5">
        {[
          { rank: '1', name: 'Binance', type: 'CEX', trust: '10/10', share: '37.0% споту' },
          { rank: '2', name: 'Bybit', type: 'CEX', trust: '9/10', share: 'Ф\'ючерси лідер' },
          { rank: '3', name: 'Coinbase', type: 'CEX', trust: '10/10', share: 'Кастодія 800k BTC' },
          { rank: '4', name: 'OKX', type: 'CEX', trust: '10/10', share: 'Web3 гаманець #1' },
          { rank: '5', name: 'Kraken', type: 'CEX', trust: '10/10', share: 'Найвищий захист' },
          { rank: '6', name: 'Hyperliquid', type: 'DEX', trust: 'On-chain', share: 'OI > $2 млрд' },
          { rank: '7', name: 'Gate.io', type: 'CEX', trust: '9/10', share: '1,700+ альткоїнів' },
          { rank: '8', name: 'MEXC', type: 'CEX', trust: '9/10', share: '0% комісія Maker' },
          { rank: '9', name: 'Bitget', type: 'CEX', trust: '10/10', share: 'Копітрейдинг #1' },
          { rank: '10', name: 'Uniswap', type: 'DEX', trust: 'On-chain', share: 'AMM стандарт L1/L2' },
        ].map(ex => (
          <div key={ex.rank} className="flex items-center justify-between py-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-neonGreen">#{ex.rank}</span>
              <span className="font-semibold text-slate-100">{ex.name}</span>
              <span className="text-[10px] text-slate-500">({ex.type})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-neonCyan">{ex.trust}</span>
              <span className="text-[10px] text-slate-400">{ex.share}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
