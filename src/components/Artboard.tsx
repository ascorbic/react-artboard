import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import {
  getMousePoint,
  getTouchPoint,
  mouseButtonIsDown,
  Point,
} from "../utils/pointUtils";

export interface ArtboardProps
  extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  tool: ToolHandlers;
}

export interface ArtboardRef {
  download: (filename?: string, type?: string) => void;
  getImageAsDataUri: (type?: string) => string | undefined;
  clear: () => void;
}

export interface ToolHandlers {
  name: string;
  startStroke?: (point: Point, context: CanvasRenderingContext2D) => void;
  continueStroke?: (point: Point, context: CanvasRenderingContext2D) => void;
  endStroke?: (context: CanvasRenderingContext2D) => void;
  cursor?: string;
}

export const Artboard = forwardRef(function Artboard(
  { tool, style, ...props }: ArtboardProps,
  ref: ForwardedRef<ArtboardRef>
) {
  const [context, setContext] = useState<CanvasRenderingContext2D | null>();
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [drawing, setDrawing] = useState(false);

  const startStroke = useCallback(
    (point: Point) => {
      if (!context) {
        return;
      }
      setDrawing(true);
      console.log("setdrawing");
      tool.startStroke?.(point, context);
    },
    [setDrawing, tool, context]
  );

  const continueStroke = useCallback(
    (newPoint: Point) => {
      if (!context) {
        return;
      }
      tool.continueStroke?.(newPoint, context);
    },
    [tool, context]
  );

  const endStroke = useCallback(() => {
    setDrawing(false);
    if (context) {
      tool.endStroke?.(context);
    }
  }, [tool, context]);

  const mouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (!drawing) {
        return;
      }
      continueStroke(getMousePoint(event));
    },
    [continueStroke, drawing]
  );

  const touchMove = useCallback(
    (event: React.TouchEvent) => {
      if (!drawing) {
        return;
      }
      continueStroke(getTouchPoint(event));
    },
    [continueStroke]
  );

  const mouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (drawing) {
        return;
      }
      event.preventDefault();
      startStroke(getMousePoint(event));
    },
    [drawing, startStroke]
  );

  const touchStart = useCallback(
    (event: React.TouchEvent) => {
      if (drawing) {
        return;
      }
      event.preventDefault();
      startStroke(getTouchPoint(event));
    },
    [drawing, startStroke]
  );

  const clear = useCallback(() => {
    if (!context || !canvas) {
      return;
    }
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, [context, canvas]);

  const gotRef = useCallback((canvasRef: HTMLCanvasElement) => {
    if (!canvasRef) {
      return;
    }
    canvasRef.width = canvasRef.offsetWidth;
    canvasRef.height = canvasRef.offsetHeight;
    const ctx = canvasRef.getContext("2d");
    setCanvas(canvasRef);
    setContext(ctx);
    if (ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvasRef.width, canvasRef.height);
    }
  }, []);

  const mouseEnter = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (mouseButtonIsDown(event.buttons)) {
        mouseDown(event);
      } else if (drawing) {
        endStroke();
      }
    },
    [mouseMove, drawing]
  );

  const mouseLeave = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (!drawing) {
        return;
      }
      continueStroke(getMousePoint(event));
      endStroke();
    },
    [drawing]
  );

  useImperativeHandle(
    ref,
    () => ({
      download: (filename: string = "image.png", type?: string) => {
        if (!canvas) {
          return;
        }
        const a = document.createElement("a");
        a.href = canvas.toDataURL(type);
        a.download = filename;
        a.click();
      },
      clear,
      getImageAsDataUri: (type?: string) => canvas?.toDataURL(type),
    }),
    [canvas]
  );

  return (
    <canvas
      style={{ cursor: tool?.cursor, touchAction: "none", ...style }}
      onTouchStart={touchStart}
      onMouseDown={mouseDown}
      onMouseEnter={mouseEnter}
      onMouseMove={drawing ? mouseMove : undefined}
      onTouchMove={drawing ? touchMove : undefined}
      onMouseUp={endStroke}
      onMouseOut={mouseLeave}
      onTouchEnd={endStroke}
      ref={gotRef}
      {...props}
    />
  );
});
