import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

export type AuthTab = "login" | "register" | "forgot";

interface AuthModalState {
  isOpen: boolean;
  activeTab: AuthTab;
  defaultTab: AuthTab;

  // Actions
  open: (tab?: AuthTab) => void;
  close: () => void;
  setTab: (tab: AuthTab) => void;
  reset: () => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  activeTab: "login",
  defaultTab: "login",

  open: (tab = "login") =>
    set({ isOpen: true, activeTab: tab, defaultTab: tab }),
  close: () => set({ isOpen: false }),
  setTab: (tab) => set({ activeTab: tab }),
  reset: () =>
    set((state) => ({
      activeTab: state.defaultTab,
      // Сброс форм лучше делать в компоненте, но можно добавить колбэк
    })),
}));

// Селекторы для оптимизации ре-рендеров
export const useAuthModalOpen = () =>
  useAuthModalStore((state) => state.isOpen);
export const useAuthModalTab = () =>
  useAuthModalStore((state) => state.activeTab);

export const useAuthModalActions = () =>
  useAuthModalStore(
    useShallow((state) => ({
      open: state.open,
      close: state.close,
      setTab: state.setTab,
      reset: state.reset,
    })),
  );

export const useOpenAuthModal = () => {
  const { open } = useAuthModalActions();
  return { open };
};

export const useIsAuthModalOpen = () => useAuthModalOpen();
export const useCurrentAuthTab = () => useAuthModalTab();
