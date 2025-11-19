import { BufferTarget, CanvasSource, Mp4OutputFormat, Output, QUALITY_MEDIUM } from 'mediabunny';
import { Drawing } from 'pinsandcurves-engine';


class VideoExporter {

    constructor(private onFinishCallback: () => void) {
    }


    output: Output | null = null;
    canvas: HTMLCanvasElement | null = null;
    canvasSource: CanvasSource | null = null;
    async startExport(props: {
        width: number;
        height: number;
    }) {
        this.output = new Output({
            format: new Mp4OutputFormat(),
            target: new BufferTarget()
        });
        this.canvas = document.createElement('canvas');
        this.canvas.width = props.width;
        this.canvas.height = props.height;
        this.canvasSource = new CanvasSource(this.canvas, {
            codec: 'avc',
            bitrate: QUALITY_MEDIUM,
        });
        this.output.addVideoTrack(this.canvasSource);
        await this.output.start();

    }

    working = false;
    async addFrame(drawing: Drawing, time: number, duration: number, onFrameReady: () => void) {
        if (this.working) return;
        this.working = true;

        if (!this.canvas || !this.output || !this.canvasSource) {
            console.error("VideoExporter: output or canvas not initialized");
            return;
        }
        const pixels = drawing.capture("outputTexture");
        const width = this.canvas.width;
        const height = this.canvas.height;
        const ctx = this.canvas.getContext("2d");
        if (!ctx) throw new Error("Unable to create 2D context for rendering");
        const imageData = ctx.createImageData(width, height);
        imageData.data.set(pixels);
        ctx.putImageData(imageData, 0, 0);
        await this.canvasSource.add(time, duration);

        onFrameReady();
        this.working = false;
    }

    done: boolean = false;
    async finishExport() {
        if (!this.output) return;
        if (this.done) return;
        if (this.working) return;
        this.working = true;
        await this.output?.finalize();
        this.onFinishCallback();
        this.done = true;
        this.working = false;

        const buffer = this.output.target.buffer;
        if (buffer) {
            const blob = new Blob([buffer], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'liquidlissajous.mp4';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        }
    }
}

export default VideoExporter;