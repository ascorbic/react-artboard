import { useCallback, useRef } from "react";

import { ToolHandlers } from "../../components/Artboard";
import { Point } from "../../utils/pointUtils";
import { circleCursor } from "../../utils/cursors";
export interface UseMarkerProps {
  color?: string;
  strokeWidth?: number;
}

export function useMarker({
  color = "#000000",
  strokeWidth = 25,
}: UseMarkerProps): ToolHandlers {
  const lastPoint = useRef<Point>();

  const startStroke = useCallback(
    (point: Point, context: CanvasRenderingContext2D) => {
      context.lineWidth = 3;
      context.lineJoin = context.lineCap = "round";
      lastPoint.current = point;
      context.strokeStyle = color;
    },
    [color]
  );

  const continueStroke = useCallback(
    (newPoint: Point, context: CanvasRenderingContext2D) => {
      if (!lastPoint.current) {
        lastPoint.current = newPoint;
        return;
      }
      if (
        lastPoint.current[0] === newPoint[0] &&
        lastPoint.current[1] === newPoint[1]
      ) {
        return;
      }
      context.beginPath();

      for (let i = 0; i < strokeWidth; i += 2) {
        const offset = Math.round(strokeWidth / 2 - i);
        context.globalAlpha = (1 / strokeWidth) * (strokeWidth - i);
        context.moveTo(
          lastPoint.current[0] - offset,
          lastPoint.current[1] - offset
        );
        context.lineTo(newPoint[0] - offset, newPoint[1] - offset);
        context.stroke();
      }
      context.beginPath();

      lastPoint.current = newPoint;
    },
    [strokeWidth, lastPoint]
  );

  const cursor = circleCursor(strokeWidth);

  return { startStroke, continueStroke, cursor };
}
