import { create } from "zustand";

type StoreState = {
    mixingIntensity: number; 
    particleColors: [number, number, number][]; 
    showLissajousFigure: boolean;
    a: number;
    b: number;
    c: number;
    a_delta: number;
    b_delta: number;
    c_delta: number;
    width: number; 
    height: number; 
    noiseIntensity: number;
    noiseEnabled: boolean;
    animationSpeed: number; 
    rotateVertical: number;
    rotateHorizontal: number;
    exportPerfectLoop: boolean; 
    exportDuration: number; 

    updateStore: (newState: Partial<StoreState>) => void;
}

const useStore = create<StoreState>((set) => ({
    mixingIntensity: 0,
    particleColors: [[0, 0, 0]],
    showLissajousFigure: false,
    a: 0,
    b: 0,
    c: 0,
    a_delta: 0,
    b_delta: 0,
    c_delta: 0,
    width: 800,
    height: 600,
    noiseIntensity: 0,
    noiseEnabled: false,
    animationSpeed: 0,
    rotateVertical: 0,
    rotateHorizontal: 0,
    exportPerfectLoop: false,
    exportDuration: 0,

    updateStore : (newState: Partial<StoreState>) => set((state) => ({ ...state, ...newState })),
}));

export default useStore;