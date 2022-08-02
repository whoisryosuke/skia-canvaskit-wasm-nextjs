import { CanvasKit, Canvas } from 'canvaskit-wasm';
import React from 'react'
const CanvasKitInit = require('canvaskit-wasm/bin/canvaskit.js')
type Props = {}

const Test = (props: Props) => {
    console.log('CanvasKitInit', CanvasKitInit)

    const startCanvas = async () => {
        const ctx: CanvasKit = await CanvasKitInit({
            locateFile: (file: string): string => `https://unpkg.com/canvaskit-wasm@0.35.0/bin/${file}`,
        })
    
        // console.log('surface', ctx.MakeWebGLCanvasSurface, Object.keys(ctx))

    const surface = ctx.MakeWebGLCanvasSurface('paths');
    if (!surface) {
      console.error('Could not make surface');
      return;
    }
    const canvas = surface.getCanvas();
    let paint = new ctx.Paint();

    // See https://fiddle.skia.org/c/f48b22eaad1bb7adcc3faaa321754af6
    // for original c++ version.
    let colors = [ctx.BLUE, ctx.YELLOW, ctx.RED];
    let pos =    [0, .7, 1.0];
    let transform = [2, 0, 0,
                     0, 2, 0,
                     0, 0, 1];
    let shader = ctx.Shader.MakeRadialGradient([150, 150], 130, colors,
                              pos, ctx.TileMode.Mirror, transform);

    paint.setShader(shader);
    const textFont = new ctx.Font(null, 75);
    const textBlob = ctx.TextBlob.MakeFromText('Radial', textFont);

    canvas.drawTextBlob(textBlob, 10, 200, paint);
    paint.delete();
    textFont.delete();
    textBlob.delete();
    surface.flush();

    }

    startCanvas();


  return (
    <canvas id="paths" width={200} height={200}></canvas>
  )
}

export default Test