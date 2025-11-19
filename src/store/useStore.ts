import { create } from "zustand";
import type { LissajousParams } from "../components/Controls/lissajousCurves";

type StoreState = {
    mixingIntensity: number; 
    particleColors: [number, number, number][]; 
    showLissajousFigure: boolean;
    lissajousParams: LissajousParams;
    lissajousIntegral: number;
    width: number; 
    height: number; 
    noiseIntensity: number;
    noiseEnabled: boolean;
    animationSpeed: number; 
    rotateVertical: number;
    rotateHorizontal: number;
    exportPerfectLoop: boolean; 
    exportDuration: number; 

    renderingInProgress?: boolean;

    updateStore: (newState: Partial<StoreState>) => void;
}

const useStore = create<StoreState>((set) => ({
    mixingIntensity: 0,
    particleColors: [[0, 0, 0]],
    showLissajousFigure: false,
    lissajousParams: {
        a: 1, a_delta: 0,
        b: 1, b_delta: 0,
        c: 1, c_delta: 0,
    },
    lissajousIntegral: 1,
    width: 800,
    height: 600,
    noiseIntensity: 0,
    noiseEnabled: false,
    animationSpeed: 0,
    rotateVertical: 0,
    rotateHorizontal: 0,
    exportPerfectLoop: false,
    exportDuration: 0,

    renderingInProgress: false,

    updateStore : (newState: Partial<StoreState>) => set((state) => ({ ...state, ...newState })),
}));

export type { StoreState };

export default useStore;