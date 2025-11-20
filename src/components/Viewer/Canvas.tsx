import { Drawing, GPUBackend, Blueprint, DrawOp, Instances, Texture, Uniforms, Vertices } from 'pinsandcurves-engine';
import AssetStore from '../../AssetStore';
import { useRef, useEffect, useState, useImperativeHandle } from 'react';
import useRaf from './useRaf';
import blueprint from '../../graphics/lissajousRenderer/blueprint';
import type { GradientRendererProps } from '../../graphics/lissajousRenderer/blueprint';
import useStore from '../../store/useStore';
import styles from './Canvas.module.css';
import type VideoExporter from './VideoExporter';
import computeTotalFrames from './computeTotalFrames';
import { FPS } from '../../const';

const assetStore = new AssetStore();

function Canvas({ scaledWidth, scaledHeight, width, height,
    renderObject,
    screenshotRef
}: {
    scaledWidth: number, scaledHeight: number, width: number, height: number, renderObject: {
        renderingInProgress?: boolean;
        targetRenderFrame: number;
        setTargetRenderFrame: (n: number) => void;
        videoExporter: VideoExporter | null;

    },
    screenshotRef: React.RefObject;
}) {
    const state = useStore((state) => state);
    const {
        renderingInProgress,
        targetRenderFrame,
        setTargetRenderFrame,
        videoExporter,
    } = renderObject;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const blueprintRef = useRef<Blueprint | null>(new Blueprint());

    useImperativeHandle(screenshotRef, () => {
        return {
            takeScreenshot: () => {
                if (!drawingRef.current) {
                    console.error("Drawing not initialized yet");
                    return;
                }
                const drawing = drawingRef.current;
                const pixels = drawing.capture("renderTexture");
                const width = state.width;
                const height = state.height;
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                if (!ctx) throw new Error("Unable to create 2D context for image saving");
                const imageData = ctx.createImageData(width, height);
                imageData.data.set(pixels);
                ctx.putImageData(imageData, 0, 0);
                const link = document.createElement("a");
                link.download = 'frame.png';
                link.href = canvas.toDataURL();
                link.click();
            }
        }
    })

    function updateDrawing(time: number) {
        const props: GradientRendererProps = {
            time,
            lissajousParams: {
                a: [state.lissajousParams.a, state.lissajousParams.a_delta],
                b: [state.lissajousParams.b, state.lissajousParams.b_delta],
                c: [state.lissajousParams.c, state.lissajousParams.c_delta],
            },
            colors: state.particleColors.map(c => ({ r: c[0], g: c[1], b: c[2] })),
            general: {
                canvasDimensions: [width, height],
                showLissajousFigure: state.showLissajousFigure,
            },
            mixingIntensity: 1 - state.mixingIntensity,
            xyRotation: [state.rotateHorizontal / 360, state.rotateVertical / 360],
            enableNoise: state.noiseEnabled,
            noiseIntensity: state.noiseIntensity,
        };
        const gfx = blueprintRef.current!;
        const { addedAssets, deletedAssetIds, graphId } = gfx.update(blueprint(props));
        assetStore.transaction(addedAssets, deletedAssetIds, graphId);
    }
    const drawingRef = useRef<Drawing | null>(null);
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
        drawingRef.current = new Drawing(backend);
        const unsubscribe = assetStore.subscribe((store, graphId) => {
            const storeObj = Object.fromEntries(store);
            drawingRef.current.submit(graphId, storeObj);
            drawingRef.current.draw("outputTexture");
        });
    }, []);

    const anchorTime = useRef<number>(Date.now());

    function getCurrentFrame() {
        if (renderingInProgress) {
            return targetRenderFrame;
        } else {
            const currentTime = Date.now();
            const delta = (currentTime - anchorTime.current) / 1000;
            const framesElapsed = Math.floor(delta * FPS);
            return framesElapsed % computeTotalFrames(state);
        }
    }

    useRaf(() => {
        const currentTime = getCurrentFrame() / computeTotalFrames(state);
        updateDrawing(currentTime);
        if (renderingInProgress && videoExporter) {
            const totalFrames = computeTotalFrames(state);
            const exportCutoffTime = state.exportPerfectLoop ? 1 : (state.exportDuration * FPS) / totalFrames;
            if (currentTime >= exportCutoffTime) {
                videoExporter.finishExport();
            } else {
                videoExporter.addFrame(drawingRef.current!, getCurrentFrame() / FPS, 1 / FPS, () => setTargetRenderFrame(targetRenderFrame + 1));
            }
        }
    }, true)

    return <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={renderingInProgress ? styles.boxRendering : ''}
        style={{
            width: `${Math.floor(scaledWidth)}px`,
            height: `${Math.floor(scaledHeight)}px`,
            borderRadius: 'var(--borderRadiusSmall)',
        }}></canvas>
}
export default Canvas;