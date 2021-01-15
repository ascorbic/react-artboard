import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import React from "react";
import {
  Brush,
  drawStroke,
  getMousePoint,
  getNewAngle,
  getTouchPoint,
  makeBrush,
  mouseButtonIsDown,
  Point,
} from "../helpers";

export interface Props extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  color?: string;
  strokeWidth?: number;
}

export function Artboard({
  color = "#000000",
  strokeWidth = 25,
  ...props
}: Props) {
  const [brush, setBrush] = useState<Brush>([]);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>();

  const [drawing, setDrawing] = useState(false);

  const currentAngle = useRef<number>();
  const latestPoint = useRef<Point>();

  const startStroke = useCallback(
    (point: Point) => {
      setDrawing(true);
      currentAngle.current = undefined;
      setBrush(makeBrush(strokeWidth, color, 5));
      latestPoint.current = point;
    },
    [setBrush, setDrawing, strokeWidth, color]
  );

  const continueStroke = useCallback(
    (newPoint: Point) => {
      if (!latestPoint.current || !context) {
        return;
      }
      const newAngle = getNewAngle(
        latestPoint.current,
        newPoint,
        currentAngle.current
      );
      if (typeof currentAngle.current === "undefined") {
        currentAngle.current = newAngle % (Math.PI * 2);
      }
      drawStroke(
        brush,
        latestPoint.current,
        newPoint,
        currentAngle.current,
        newAngle,
        strokeWidth,
        context
      );
      currentAngle.current = newAngle % (Math.PI * 2);
      latestPoint.current = newPoint;
    },
    [brush, strokeWidth, context]
  );

  const mouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (!drawing) {
        return;
      }
      continueStroke(getMousePoint(event));
    },
    [continueStroke]
  );

  const touchMove = useCallback(
    (event: React.TouchEvent) => {
      if (!drawing) {
        return;
      }
      event.preventDefault();
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

  const gotRef = useCallback((canvas: HTMLCanvasElement) => {
    if (!canvas) {
      return;
    }
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setContext(canvas.getContext("2d"));
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

  const endStroke = useCallback(() => {
    setDrawing(false);
  }, []);

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
  return (
    <canvas
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
}
