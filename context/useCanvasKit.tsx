import type { Canvas, CanvasKit, Surface } from "canvaskit-wasm";
import CanvasKitInit from "canvaskit-wasm";
import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from "react";

export type CanvasContextData = {
  context: CanvasKit | null;
  surface: Surface | null;
  canvas: Canvas | null;
};

export const CanvasKitContext = createContext<CanvasContextData>({
  context: null,
  surface: null,
  canvas: null,
});

type CanvasProviderProps = {
    name?: string;
    canvas?: Canvas;
}

/**
 * Provider for CanvasKit. 
 * Initializes a canvas, or uses canvas provided in props
 * @param param0 
 * @returns 
 */
export const CanvasKitProvider = ({ canvas, name = 'canvaskit', children }: PropsWithChildren<CanvasProviderProps>) => {
  const [update, setUpdate] = useState(0);
  // Highest level API
  const context = useRef<CanvasKit | null>(null);
  // Surface API (mid level?)
  const surfaceRef = useRef<Surface | null>(null);
  // The actual canvas
  const canvasRef = useRef<Canvas | null>(null);

  // Sync canvas prop with ref
  useEffect(() => {
    if(canvas) {
        canvasRef.current = canvas;
        return;
    }
  }, [canvas]);

  const initializeCanvas = useCallback(async () => {
    
    const ctx: CanvasKit = await CanvasKitInit({
        locateFile: (file: string): string => `https://unpkg.com/canvaskit-wasm@0.35.0/bin/${file}`,
    })
    if (!ctx) {
      console.error('Could not make context');
      return;
    }
    context.current = ctx;

    console.log('Creating surface', ctx)

    // Make a CanvasKit "surface" (aka print to our `<canvas>` element)
    const surface = ctx.MakeWebGLCanvasSurface(name);
    if (!surface) {
      console.error('Could not make surface');
      return;
    }
    console.log('Done with surface')
    
    surfaceRef.current = surface;
    canvasRef.current = surface.getCanvas();
    console.log('Done initializing', surfaceRef.current, canvasRef.current)
    // Refs don't update React tree - so we "trick" it
    // I suppose this might make a case for either:
    // - using global state store like Zustand
    // - or using react-reconciler and an element class
    setUpdate(Number(new Date));
  },[name])
  
  // Sync canvas prop with ref
  useEffect(() => {
    if(canvasRef.current === null && !canvas) {
        console.log('Initializing canvas')
        initializeCanvas();
    }
  }, [canvas, initializeCanvas]);

  return (
    <CanvasKitContext.Provider
      value={{
        context: context.current,
        surface: surfaceRef.current,
        canvas: canvasRef.current,
      }}
    >
      {children}
    </CanvasKitContext.Provider>
  );
};

export const useCanvasKit = () => useContext(CanvasKitContext);