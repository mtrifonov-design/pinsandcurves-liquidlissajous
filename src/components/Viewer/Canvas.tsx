import { Drawing, GPUBackend, Blueprint, DrawOp, Instances, Texture, Uniforms, Vertices} from 'pinsandcurves-engine';
import AssetStore from '../../AssetStore';
import { useRef, useEffect } from 'react';
import useRaf from './useRaf';
import blueprint from '../../graphics/lissajousRenderer/blueprint';
import type { GradientRendererProps } from '../../graphics/lissajousRenderer/blueprint';
import useStore from '../../store/useStore';

const assetStore = new AssetStore();

function Canvas({ scaledWidth, scaledHeight, width, height }: { scaledWidth: number, scaledHeight: number, width: number, height: number }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const blueprintRef = useRef<Blueprint | null>(new Blueprint());
    const state = useStore(state => state);

    function updateDrawing(time: number) {
        const props : GradientRendererProps = {
            time,
            lissajousParams: {
                a: [state.a, state.a_delta],
                b: [state.b, state.b_delta],
                c: [state.c, state.c_delta],
            },
            colors: state.particleColors.map(c => ({ r: c[0], g: c[1], b: c[2] })),
            general: {
                canvasDimensions: [width, height],
            }
        };
        const gfx = blueprintRef.current!;
        const { addedAssets, deletedAssetIds, graphId } = gfx.update(blueprint(props));
        assetStore.transaction(addedAssets, deletedAssetIds, graphId);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl2', {
            antialias: false,
        });
        if (!gl) {
            console.error('WebGL2 is not supported in this browser.');
            return;
        }

        const backend = new GPUBackend(gl);
        const drawing = new Drawing(backend);
        const unsubscribe = assetStore.subscribe((store, graphId) => {
            const storeObj = Object.fromEntries(store);
            drawing.submit(graphId, storeObj);
            drawing.draw("outputTexture");
        });
    }, []);

    const time = useRef<number>(Date.now());
    useRaf(() => {
        const now = Date.now();
        const delta = (now - time.current) / 1000;
        const framesElapsed = Math.floor(delta * 30);
        const lifeCycle = 300;
        const currentTime = (framesElapsed % lifeCycle) / lifeCycle;
        updateDrawing(currentTime);
    }, true)



    return <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
            border: '1px solid var(--gray2)',
            width: `${Math.floor(scaledWidth)}px`,
            height: `${Math.floor(scaledHeight)}px`,
            borderRadius: 'var(--borderRadiusSmall)',
        }}></canvas>
}
export default Canvas;