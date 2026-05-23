import type { Flip } from "gsap/Flip";

type FlipState = ReturnType<typeof Flip.getState> | null;

const bridge = new Map<string, FlipState>();

export const flipBridge = {
  set(id: string, state: FlipState) {
    bridge.set(id, state);
  },
  take(id: string): FlipState {
    const state = bridge.get(id) ?? null;
    bridge.delete(id);
    return state;
  },
  has(id: string) {
    return bridge.has(id);
  },
};
