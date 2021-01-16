import { useCallback, useRef, useState } from "react";

import {
  Brush,
  circleCursor,
  drawStroke,
  getNewAngle,
  makeBrush,
  Point,
} from "../helpers";
import { ToolHandlers } from "../components/Artboard";

export interface Props {
  color?: string;
  strokeWidth?: number;
}

export interface ToolProps {
  startStroke: (point: Point, context: CanvasRenderingContext2D) => void;
  continueStroke: (point: Point, context: CanvasRenderingContext2D) => void;
  endStroke: (point: Point, context: CanvasRenderingContext2D) => void;
}

export function useBrush({
  color = "#000000",
  strokeWidth = 25,
}: Props): ToolHandlers {
  const [brush, setBrush] = useState<Brush>([]);
  const currentAngle = useRef<number>();
  const latestPoint = useRef<Point>();

  const startStroke = useCallback(
    (point: Point) => {
      currentAngle.current = undefined;
      setBrush(makeBrush(strokeWidth, color, 5));
      latestPoint.current = point;
    },
    [setBrush, strokeWidth, color]
  );

  const continueStroke = useCallback(
    (newPoint: Point, context: CanvasRenderingContext2D) => {
      if (!latestPoint.current) {
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
    [brush, strokeWidth]
  );

  const cursor = circleCursor(strokeWidth);

  return { startStroke, continueStroke, cursor };
}
