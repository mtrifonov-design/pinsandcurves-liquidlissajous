import { FPS, LONGEST_LOOP_DURATION_SECONDS } from "../../const";
import type { StoreState } from "../../store/useStore";
import { LISSAJOUS_CURVES_MAX_INTEGRAL } from "../Controls/lissajousCurves";

function computeTotalFrames(state: StoreState): number {
    const baseSpeed = LISSAJOUS_CURVES_MAX_INTEGRAL / (LONGEST_LOOP_DURATION_SECONDS * FPS);
    const speed = baseSpeed * state.animationSpeed;
    const duration = Math.floor(state.lissajousIntegral / speed);
    return duration;
}

export default computeTotalFrames;