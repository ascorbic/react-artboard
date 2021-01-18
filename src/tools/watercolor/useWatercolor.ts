import { useCallback, useRef } from "react";
import { ToolHandlers } from "../../components/Artboard";
import { Point } from "../../utils/pointUtils";
import { circleCursor } from "../../utils/cursors";
import { splodgeTrail } from "./watercolor";

export interface UseWatercolorProps {
  color?: string;
  strokeWidth?: number;
}

export function useWatercolor({
  color = "#000000",
  strokeWidth = 25,
}: UseWatercolorProps): ToolHandlers {
  const points = useRef<Array<Point>>([]);

  const startStroke = useCallback(
    (point: Point, context: CanvasRenderingContext2D) => {
      context.fillStyle = color;
      context.shadowColor = color;
      context.globalAlpha = 0.01;
      points.current = [point];
      splodgeTrail(points.current, strokeWidth * 1.1, 1, context);
    },
    [color, strokeWidth]
  );

  const endStroke = useCallback(() => {
    points.current = [];
  }, []);

  const continueStroke = useCallback(
    (point: Point, context: CanvasRenderingContext2D) => {
      points.current.push(point);
      splodgeTrail(points.current, strokeWidth, 5, context);
    },
    [strokeWidth]
  );

  const cursor = circleCursor(strokeWidth);

  return { name: "Watercolor", startStroke, continueStroke, endStroke, cursor };
}
