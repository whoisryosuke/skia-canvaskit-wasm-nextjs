import type { CanvasKit } from 'canvaskit-wasm';
import React, { useCallback, useEffect } from 'react'
import { useCanvasKit } from '../context/useCanvasKit';
type Props = {
    colors?: Partial<keyof CanvasKit>[];
}

const Test = ({colors = ['RED', 'GREEN', 'BLUE']}: Props) => {

    const { context, surface, canvas } = useCanvasKit();

    console.log('canvas kit', context, surface, canvas)

    const startCanvas = useCallback(async () => {
        if(!context || !canvas || !surface) return;

        console.log('DRAWING Paint process')
        let paint = new context.Paint();

        // See https://fiddle.skia.org/c/f48b22eaad1bb7adcc3faaa321754af6
        // for original c++ version.
        // let colors = [context.BLUE, context.YELLOW, context.RED];
        let colorMap = colors.map(color => context[color]);
        let pos =    [0, .7, 1.0];
        let transform = [2, 0, 0,
                        0, 2, 0,
                        0, 0, 1];
        let shader = context.Shader.MakeRadialGradient([150, 150], 130, colorMap,
                                pos, context.TileMode.Mirror, transform);

        paint.setShader(shader);
        const textFont = new context.Font(null, 75);
        const textBlob = context.TextBlob.MakeFromText('Radial', textFont);

        canvas.drawTextBlob(textBlob, 10, 200, paint);

        paint.delete();
        textFont.delete();
        textBlob.delete();
        surface.flush();

    }, [context, surface, canvas, colors])

    useEffect(() => {
        console.log('DRAWING TEST')
        startCanvas();
    }, [startCanvas, colors])


  return (
    <canvas id="canvaskit" width={600} height={200}></canvas>
  )
}

export default Test