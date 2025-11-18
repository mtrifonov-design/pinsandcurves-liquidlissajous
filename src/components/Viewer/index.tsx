import { useEffect, useRef, useState } from "react";
import useStore from "../../store/useStore";
import { Button } from "@mtrifonov-design/pinsandcurves-design";
import Canvas from "./Canvas";

function Component() {
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
            padding: '1rem',
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
                width: 'calc(100vw - 700px - 2rem)',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Canvas
                scaledWidth={scaledWidth}
                scaledHeight={scaledHeight}
                width={w}
                height={h}
            />

        </div>
    </div>;
}

export default Component;