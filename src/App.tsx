import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { StatHeader } from './components/StatHeader';
import { TerminalScreen } from './components/TerminalScreen';
import { HardwareShopScreen } from './components/HardwareShopScreen';
import { ExploitsScreen } from './components/ExploitsScreen';
import { TargetsScreen } from './components/TargetsScreen';
import { MarketScreen } from './components/MarketScreen';
import { HackMinigameModal } from './components/HackMinigameModal';
import { AchievementsModal } from './components/AchievementsModal';
import { Terminal, Cpu, Bot, Target, Coins, Trophy, Shield } from 'lucide-react';
import { HackTarget } from './types/game';

export default function App() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'hardware' | 'exploits' | 'targets' | 'market'>('terminal');
  const [showAchievements, setShowAchievements] = useState(false);
  const [activeMinigameTarget, setActiveMinigameTarget] = useState<HackTarget | null>(null);

  const gameState = useGameState();

  const handleSelectTarget = (target: HackTarget) => {
    const canStart = gameState.prepareTargetAttack(target.id);
    if (canStart) {
      setActiveMinigameTarget(target);
    }
  };

  const handleMinigameComplete = (isSuccess: boolean) => {
    if (activeMinigameTarget) {
      gameState.applyTargetResult(activeMinigameTarget.id, isSuccess);
      setActiveMinigameTarget(null);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-background text-slate-100 max-w-md mx-auto shadow-2xl relative overflow-hidden border-x border-borderDark/40">
      {/* Top Header */}
      <header className="flex h-12 items-center justify-between border-b border-borderDark bg-background px-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-neonGreen animate-pulse" />
          <span className="text-sm font-extrabold tracking-wider text-neonGreen drop-shadow-[0_0_8px_rgba(0,255,102,0.5)]">
            CRYPTO HACKER
          </span>
        </div>

        <button
          onClick={() => setShowAchievements(true)}
          className="rounded p-1.5 text-neonAmber hover:bg-card transition-colors"
          title="Досягнення"
        >
          <Trophy className="h-5 w-5" />
        </button>
      </header>

      {/* Persistent Stats Header */}
      <StatHeader
        level={gameState.playerLevel}
        levelTitle={gameState.playerLevelTitle}
        cash={gameState.cash}
        dirtyCash={gameState.dirtyCash}
        cashPerSecond={gameState.cashPerSecond}
        tapPower={gameState.tapPower}
        totalHashrate={gameState.totalHashrate}
        heat={gameState.heat}
        temp={gameState.hardwareTemperature}
        isThrottling={gameState.isThermalThrottling}
        gasGwei={gameState.gasGwei}
        prestigePoints={gameState.darknetCredibility}
        prestigeMultiplier={gameState.prestigeMultiplier}
        crisis={gameState.currentCrisis}
        onEmergencyCoolOff={gameState.emergencyCoolOff}
        onPurgeFans={gameState.purgeCoolingFans}
        onResolveCrisis={gameState.resolveCrisis}
      />

      {/* Main Screen Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {activeTab === 'terminal' && (
          <TerminalScreen
            logs={gameState.terminalLogs}
            tapPower={gameState.tapPower}
            dirtyCash={gameState.dirtyCash}
            tapsCount={gameState.tapsCount}
            isRaidTriggered={gameState.isRaidTriggered}
            lastRaidMessage={gameState.lastRaidMessage}
            onTap={gameState.tapTerminal}
            onWashDirty={() => gameState.washDirtyCrypto(gameState.dirtyCash)}
            onDismissRaid={gameState.dismissRaidAlert}
          />
        )}

        {activeTab === 'hardware' && (
          <HardwareShopScreen
            upgrades={gameState.upgrades}
            cash={gameState.cash}
            playerLevel={gameState.playerLevel}
            temp={gameState.hardwareTemperature}
            totalCoolingPower={gameState.totalCoolingPower}
            isThrottling={gameState.isThermalThrottling}
            onBuyUpgrade={gameState.buyUpgrade}
            onPurgeFans={gameState.purgeCoolingFans}
          />
        )}

        {activeTab === 'exploits' && (
          <ExploitsScreen
            upgrades={gameState.upgrades}
            cash={gameState.cash}
            playerLevel={gameState.playerLevel}
            onBuyUpgrade={gameState.buyUpgrade}
          />
        )}

        {activeTab === 'targets' && (
          <TargetsScreen
            targets={gameState.targets}
            dirtyCash={gameState.dirtyCash}
            cash={gameState.cash}
            gasGwei={gameState.gasGwei}
            playerLevel={gameState.playerLevel}
            heat={gameState.heat}
            onWashDirty={() => gameState.washDirtyCrypto(gameState.dirtyCash)}
            onEmergencyCoolOff={gameState.emergencyCoolOff}
            onSelectTarget={handleSelectTarget}
          />
        )}

        {activeTab === 'market' && (
          <MarketScreen
            coins={gameState.marketCoins}
            potentialPrestigeGain={gameState.potentialPrestigeGain}
            prestigeMultiplier={gameState.prestigeMultiplier}
            onCleanSlate={gameState.performCleanSlate}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="flex h-14 items-center justify-around border-t border-borderDark bg-surface text-[10px]">
        <button
          onClick={() => setActiveTab('terminal')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'terminal' ? 'text-neonGreen font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="h-5 w-5" />
          <span>Термінал</span>
        </button>

        <button
          onClick={() => setActiveTab('hardware')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'hardware' ? 'text-neonGreen font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="h-5 w-5" />
          <span>Залізо</span>
        </button>

        <button
          onClick={() => setActiveTab('exploits')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'exploits' ? 'text-neonGreen font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="h-5 w-5" />
          <span>Софт</span>
        </button>

        <button
          onClick={() => setActiveTab('targets')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'targets' ? 'text-neonGreen font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="h-5 w-5" />
          <span>Операції</span>
        </button>

        <button
          onClick={() => setActiveTab('market')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'market' ? 'text-neonGreen font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Coins className="h-5 w-5" />
          <span>Ринок</span>
        </button>
      </nav>

      {/* Modals */}
      {activeMinigameTarget && (
        <HackMinigameModal
          target={activeMinigameTarget}
          onComplete={handleMinigameComplete}
          onClose={() => setActiveMinigameTarget(null)}
        />
      )}

      {showAchievements && (
        <AchievementsModal
          achievements={gameState.achievements}
          onClose={() => setShowAchievements(false)}
        />
      )}
    </div>
  );
}
