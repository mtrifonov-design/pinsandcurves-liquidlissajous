import { useEffect, useReducer, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Drawing, GPUBackend, Blueprint, DrawOp, Instances, Texture, Uniforms, Vertices} from 'pinsandcurves-engine';
import AssetStore from './AssetStore';

const assetStore = new AssetStore();

function helloWorld(height: number) {
    const triangle = Vertices(
        {
            attributes: {
                pos: 'vec2',
                uv: 'vec2',
            }
        }, 
        {
            triangleCount: 1,
            vertices: () => ([
                { pos: [-1,-1],      uv: [0,0] },
                { pos: [0,height],  uv: [0,1] },
                { pos: [1,-1],       uv: [1,0] }
            ]),
            indices: () => ([0, 1, 2,])
        }, 
        [height]
    );
    const outputTexture = Texture(
        {
            width: 1920,
            height: 1080,
        }, 
        [
            DrawOp(
                triangle,
                () => `
                out vec2 v_uv;
                void main() {
                    gl_Position = vec4(pos,0.,1.);
                    v_uv = uv;
                }
                `,
                () => `
                in vec2 v_uv;
                void main() {
                    outColor = vec4(v_uv, 1.0, 1.0);
                }`
            )
        ], 
        []
    );
    return { triangle, outputTexture };
}

function App() {
  const [count, setCount] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const blueprintRef = useRef<Blueprint | null>(new Blueprint());

  function updateDrawing(inputValue: number) {
    const gfx = blueprintRef.current!;
    const { addedAssets, deletedAssetIds, graphId } = gfx.update(helloWorld(inputValue));
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
  }, [])

  useEffect(() => {
    updateDrawing((count % 10) / 10);
  }, [count])

  return (
    <>
      <div>
        <canvas ref={canvasRef} />
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
