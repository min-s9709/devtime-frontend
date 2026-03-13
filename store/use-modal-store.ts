import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  type: string | null;
  payload: Record<string, unknown> | null;
  open: (type: string, payload?: Record<string, unknown>) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  type: null,
  payload: null,
  open: (type, payload) => set({ isOpen: true, type, payload: payload ?? null }),
  close: () => set({ isOpen: false, type: null, payload: null }),
}));
