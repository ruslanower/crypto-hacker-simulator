import { useCallback, useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Terminal } from "lucide-react";
import type { TargetDef } from "@/game/data";
import { cn } from "@/lib/utils";
import { sound } from "@/lib/audio";

const OPCODES = ["DE", "AD", "BE", "EF", "CA", "FE", "BA", "13", "37", "8F", "00", "C0", "FF", "EE", "42", "69", "A7", "5C"];
const MAX_STRIKES = 3;
const PREVIEW_MS = 2600;

function makeRound(len: number) {
  const shuffled = [...OPCODES].sort(() => Math.random() - 0.5);
  const seq = shuffled.slice(0, len);
  const grid = new Set(seq);
  for (const op of shuffled) {
    if (grid.size >= 12) break;
    grid.add(op);
  }
  return { seq, grid: [...grid].sort(() => Math.random() - 0.5) };
}

export function HackModal({ target, bonusSec, onDone }: { target: TargetDef; bonusSec: number; onDone: (ok: boolean) => void }) {
  const roundMs = (target.timeSec + bonusSec) * 1000;
  const [round, setRound] = useState(1);
  const [data, setData] = useState(() => makeRound(target.seqLength));
  const [input, setInput] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [left, setLeft] = useState(roundMs);
  const [preview, setPreview] = useState(target.hidden);
  const [shake, setShake] = useState(false);
  const done = useRef(false);

  const finish = useCallback((ok: boolean) => {
    if (done.current) return;
    done.current = true;
    if (ok) sound.playSuccess();
    else sound.playOverheat();
    onDone(ok);
  }, [onDone]);

  useEffect(() => {
    if (!preview) return;
    const t = setTimeout(() => setPreview(false), PREVIEW_MS);
    return () => clearTimeout(t);
  }, [preview, round]);

  useEffect(() => {
    if (preview) return;
    const iv = setInterval(() => {
      setLeft((l) => {
        if (l <= 100) {
          finish(false);
          return 0;
        }
        return l - 100;
      });
    }, 100);
    return () => clearInterval(iv);
  }, [preview, finish]);

  const press = (op: string) => {
    if (preview || done.current) return;
    if (op === data.seq[input]) {
      sound.playTap(1.3);
      const nextIn = input + 1;
      if (nextIn < data.seq.length) return setInput(nextIn);
      if (round >= target.rounds) return finish(true);
      setRound(round + 1);
      setData(makeRound(target.seqLength));
      setInput(0);
      setLeft(roundMs);
      setPreview(target.hidden);
    } else {
      sound.playOverheat();
      const st = strikes + 1;
      setStrikes(st);
      setLeft((l) => Math.max(0, l - 1500));
      setShake(true);
      setTimeout(() => setShake(false), 300);
      if (st >= MAX_STRIKES) finish(false);
    }
  };

  const pct = (left / roundMs) * 100;
  const critical = pct < 30 && !preview;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm">
      <div className={cn("panel w-full max-w-md border-2 p-5", critical ? "border-destructive glow-danger" : "border-info", shake && "animate-pulse")}>
        <div className="flex items-center justify-between border-b border-border pb-2 font-mono text-xs">
          <span className="flex items-center gap-2 font-bold text-info"><Terminal className="size-4" /> ІН'ЄКЦІЯ ШЕЛЛКОДУ</span>
          <span className="text-destructive">ПОМИЛКИ {strikes}/{MAX_STRIKES}</span>
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div>
            <div className="font-bold">{target.title}</div>
            <div className="text-[11px] text-muted-foreground">{target.reference}</div>
          </div>
          <div className="rounded bg-muted px-2 py-1 font-mono text-xs text-info">Раунд {round}/{target.rounds}</div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 rounded-md border border-border bg-background/60 p-3">
          {data.seq.map((op, i) => {
            const entered = i < input;
            const show = preview || entered || !target.hidden;
            return (
              <span
                key={i}
                className={cn(
                  "min-w-9 rounded border px-1.5 py-1 text-center font-mono text-sm font-bold",
                  entered ? "border-primary bg-primary/15 text-primary" : i === input ? "border-info text-info" : "border-border text-muted-foreground",
                )}
              >
                {show ? op : "??"}
              </span>
            );
          })}
        </div>

        <div className="mt-2 flex items-center justify-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          {preview ? <><Eye className="size-3.5 text-warning" /> Запам'ятай послідовність...</> : target.hidden ? <><EyeOff className="size-3.5" /> Введи з пам'яті</> : "Натискай байти по порядку"}
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className={cn("h-full transition-all duration-100", critical ? "bg-destructive" : "bg-info")} style={{ width: `${preview ? 100 : pct}%` }} />
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {data.grid.map((op) => (
            <button
              key={op}
              type="button"
              disabled={preview}
              onClick={() => press(op)}
              className="rounded-md border border-border bg-secondary py-3 font-mono text-sm font-bold text-foreground transition-all hover:border-info hover:text-info active:scale-90 disabled:opacity-40"
            >
              0x{op}
            </button>
          ))}
        </div>

        <button type="button" onClick={() => finish(false)} className="mt-4 w-full font-mono text-[11px] uppercase text-muted-foreground hover:text-destructive">
          Перервати атаку (провал)
        </button>
      </div>
    </div>
  );
}
