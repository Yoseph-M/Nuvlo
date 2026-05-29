import { create } from "zustand";

export type Filters = {
  minPrice: number;
  maxPrice: number;
  guests: number;
  neighborhoods: string[];
};

type FiltersState = Filters & {
  set: (p: Partial<Filters>) => void;
  reset: () => void;
};

const DEFAULT_FILTERS: Filters = {
  minPrice: 0,
  maxPrice: 10000, // ETB
  guests: 1,
  neighborhoods: [],
};

export const useFilters = create<FiltersState>((set) => ({
  ...DEFAULT_FILTERS,
  set: (p) => set(p),
  reset: () => set(DEFAULT_FILTERS),
}));

type HoverState = {
  hoveredId: string | null;
  setHover: (id: string | null) => void;
};

export const useHover = create<HoverState>((set) => ({
  hoveredId: null,
  setHover: (id) => set({ hoveredId: id }),
}));
