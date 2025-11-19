import { LISSAJOUS_CURVES } from "./lissajousCurves";
import type { StoreState } from "../../store/useStore";

const presets : {
    [key: string]: StoreState
} = {
    pastelDream: {
        particleColors: [
            [255, 45, 209],
            [253, 255, 184],
            [77, 255, 190],
            [99, 200, 255],
        ],
        mixingIntensity: 0.3,
        noiseEnabled: true,
        noiseIntensity: 0.1,
        lissajousParams: LISSAJOUS_CURVES[0].params,
        lissajousIntegral: LISSAJOUS_CURVES[0].integral,
        animationSpeed: 4,
        rotateVertical: 0,
        rotateHorizontal: 0,
    },
    burningSunset: {
        particleColors: [
            [59, 6, 10],
            [138, 0, 0],
            [200, 63, 18],
            [255, 242, 135],
        ],
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
    },
    oceanBlues: {
        particleColors: [
            [84, 9, 218],
            [78, 113, 255],
            [187, 251, 255],
        ],
        mixingIntensity: 0.5,
        width: 1920,
        height: 1080,
        noiseEnabled: true,
        noiseIntensity: 0.1,
        lissajousParams: LISSAJOUS_CURVES[5].params,
        lissajousIntegral: LISSAJOUS_CURVES[5].integral,
        animationSpeed: 1.5,
        rotateVertical: 0,
        rotateHorizontal: 0,
    },
    hotPink: {
        particleColors: [
            [172, 23, 84],
            [229, 56, 136],
            [243, 113, 153],
            [247, 168, 196],
        ],
        mixingIntensity: 1,
        width: 1920,
        height: 1080,
        noiseEnabled: true,
        noiseIntensity: 0.1,
        lissajousParams: LISSAJOUS_CURVES[2].params,
        lissajousIntegral: LISSAJOUS_CURVES[2].integral,
        animationSpeed: 2,
        rotateVertical: 0,
        rotateHorizontal: 0,
    },
    forestGreens: {
        particleColors: [
            [47, 82, 73],
            [151, 176, 103],
            [227, 222, 97],
        ],
        mixingIntensity: 0.45,
        width: 1920,
        height: 1080,
        noiseEnabled: true,
        noiseIntensity: 0.3,
        lissajousParams: LISSAJOUS_CURVES[0].params,
        lissajousIntegral: LISSAJOUS_CURVES[0].integral,
        animationSpeed: 1.2,
        rotateVertical: 0,
        rotateHorizontal: 34,
    },
    tropicalDisco: {
        particleColors: [
            [24, 1, 97],
            [79, 23, 135],
            [235, 54, 120],
            [251, 119, 60],
        ],
        mixingIntensity: 0.3,
        width: 1920,
        height: 1080,
        noiseEnabled: true,
        noiseIntensity: 0.7,
        lissajousParams: LISSAJOUS_CURVES[5].params,
        lissajousIntegral: LISSAJOUS_CURVES[5].integral,
        animationSpeed: 1.5,
        rotateVertical: 0,
        rotateHorizontal: 0,
    },

};

export default presets;

