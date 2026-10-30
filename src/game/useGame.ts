import { useCallback, useEffect, useRef, useState } from "react";
import { applyOffline, createInitialState, marketTick, SAVE_VERSION, tick, type GameState } from "./engine";

const SAVE_KEY = "shadow-terminal-save";

export interface OfflineReport {
  earned: number;
  seconds: number;
}

export function useGame() {
  const [state, setState] = useState<GameState | null>(null);
  const [offline, setOffline] = useState<OfflineReport | null>(null);
  const ref = useRef<GameState | null>(null);
  ref.current = state;

  // Load from storage (client only)
  useEffect(() => {
    const now = Date.now();
    let loaded: GameState | null = null;
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GameState;
        if (parsed.version === SAVE_VERSION) loaded = { ...createInitialState(now), ...parsed };
      }
    } catch {
      loaded = null;
    }
    if (loaded) {
      const res = applyOffline(loaded, now);
      if (res.earned > 0) setOffline({ earned: res.earned, seconds: res.seconds });
      setState(res.state);
    } else {
      setState(createInitialState(now));
    }
  }, []);

  const save = useCallback(() => {
    if (!ref.current) return;
    const s = { ...ref.current, lastSaved: Date.now() };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(s));
    } catch {
      /* storage full or blocked */
    }
  }, []);

  const ready = state !== null;
  useEffect(() => {
    if (!ready) return;
    let last = Date.now();
    const loop = setInterval(() => {
      const now = Date.now();
      const dt = Math.min(5, (now - last) / 1000);
      last = now;
      setState((s) => (s ? tick(s, dt, now) : s));
    }, 100);
    const market = setInterval(() => setState((s) => (s ? marketTick(s) : s)), 5000);
    const saver = setInterval(save, 5000);
    window.addEventListener("beforeunload", save);
    return () => {
      clearInterval(loop);
      clearInterval(market);
      clearInterval(saver);
      window.removeEventListener("beforeunload", save);
    };
  }, [ready, save]);

  const act = useCallback((fn: (s: GameState) => GameState) => {
    setState((s) => (s ? fn(s) : s));
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setState(createInitialState(Date.now()));
  }, []);

  return { state, act, offline, dismissOffline: () => setOffline(null), reset };
}
