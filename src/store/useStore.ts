import { create } from "zustand";
import { LISSAJOUS_CURVES, type LissajousParams } from "../components/Controls/lissajousCurves";
import presets from "../components/Controls/presets";

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

    particleColors: [
        [59, 6, 10],
        [138, 0, 0],
        [200, 63, 18],
        [255, 242, 135],
    ].map(c => c.map(v => v / 255) as [number, number, number]),
    mixingIntensity: 0.6,
    width: 1920,
    height: 1080,
    noiseEnabled: true,
    noiseIntensity: 0.65,
    lissajousParams: LISSAJOUS_CURVES[1].params,
    lissajousIntegral: LISSAJOUS_CURVES[1].integral,
    animationSpeed: 1.5,
    rotateVertical: 0,
    rotateHorizontal: 138,


    // mixingIntensity: 0,
    // particleColors: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    showLissajousFigure: false,
    // lissajousParams: LISSAJOUS_CURVES[0].params,
    // lissajousIntegral: LISSAJOUS_CURVES[0].integral,
    // width: 800 * 3,
    // height: 600 * 3,
    // noiseIntensity: 0,
    // noiseEnabled: false,
    // animationSpeed: 1.5,
    // rotateVertical: 0,
    // rotateHorizontal: 0,
    exportPerfectLoop: false,
    exportDuration: 3,

    renderingInProgress: false,

    updateStore : (newState: Partial<StoreState>) => set((state) => ({ ...state, ...newState })),
}));

export type { StoreState };

export default useStore;