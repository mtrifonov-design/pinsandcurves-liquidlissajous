import { useEffect, useRef, useState } from "react";
import { Button } from "@mtrifonov-design/pinsandcurves-design";
import Canvas from "./Canvas";
import useStore from "../../store/useStore";
import VideoExporter from "./VideoExporter";
import computeTotalFrames from "./computeTotalFrames";
import { FPS } from "../../const";

function Component() {

    const renderingInProgress = useStore((state) => state.renderingInProgress);
    const [targetRenderFrame, setTargetRenderFrame] = useState<number>(0);
    const [videoExporter, setVideoExporter] = useState<VideoExporter | null>(null);
    const setState = useStore((state) => state.updateStore);
    const state = useStore((state) => state);
    const totalFrames = computeTotalFrames(state);
    const exportDurationFactor = state.exportPerfectLoop ? 1 : (state.exportDuration * FPS) / totalFrames;
    const approxRenderProgress = renderingInProgress ? (targetRenderFrame / totalFrames) / exportDurationFactor : 0;

    const w = useStore((state) => state.width);
    const h = useStore((state) => state.height);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [containerDimensions, setContainerDimensions] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
    useEffect(() => {
        function updateDimensions() {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setContainerDimensions({ width: rect.width, height: rect.height });
            }
        }
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => {
            window.removeEventListener('resize', updateDimensions);
        }
    }, []);

    const [scaledWidth, scaledHeight] = (() => {
        const scale = Math.min(
            containerDimensions.width / w,
            containerDimensions.height / h
        );
        return [w * scale, h * scale];
    })()

    return <div
        style={{
            backgroundColor: '#101214',
            width: '100%',
            height: '100%',
            padding: '2rem',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateRows: 'auto 1fr'
        }}>
        <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
        }}>
            <Button
                onClick={async () => {
                    //recordEvent({ path: "liquidlissajous-saveframe", event: true });
                    //frameSaver.saveFrame();
                    setState({ renderingInProgress: true });
                    const exporter = new VideoExporter(() => {
                        setState({ renderingInProgress: false });
                        setVideoExporter(null);
                        setTargetRenderFrame(0);
                    });
                    setVideoExporter(exporter);
                    exporter.startExport({
                        width: w,
                        height: h,
                    });
                }}
                text={"export frame"}
                iconName="camera"
            />
            <Button
                onClick={async () => {
                    // recordEvent({ path: "liquidlissajous-renderframes", event: true });
                    // setDisplayOverlay(true);

                }}
                text={"export image sequence"}
                iconName="animated_images"
            />
            {true && <Button
                onClick={async () => {
                    // recordEvent({ path: "liquidlissajous-renderframes", event: true });
                    // setDisplayOverlay(true);
                }}
                text={"export as .mp4"}
                iconName="movie"
            />}

        </div>
        <div
            ref={containerRef}
            style={{
                width: 'calc(100vw - 700px - 4rem)',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <Canvas
                scaledWidth={scaledWidth}
                scaledHeight={scaledHeight}
                width={w}
                height={h}
                renderObject={
                    {
                        renderingInProgress,
                        targetRenderFrame,
                        setTargetRenderFrame,
                        videoExporter,
                    }
                }
            />
            {renderingInProgress && <div style={{
                    color: 'var(--danger)',
                    marginTop: '1rem',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                }}>Rendering...
                {Math.floor(approxRenderProgress * 100)}%
                </div>}


        </div>
    </div>;
}

export default Component;