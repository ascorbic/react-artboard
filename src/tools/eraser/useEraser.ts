import { useCallback } from "react";
import { ToolHandlers } from "../../components/Artboard";
import { Point } from "../../utils/pointUtils";
import { circleCursor } from "../../utils/cursors";
export interface UseEraserProps {
  color?: string;
  strokeWidth?: number;
}

export function useEraser({ strokeWidth = 25 }: UseEraserProps): ToolHandlers {
  const startStroke = useCallback(
    (point: Point, context: CanvasRenderingContext2D) => {
      context.globalCompositeOperation = "source-over";

      context.lineWidth = strokeWidth;
      context.strokeStyle = "#ffffff";
      context.lineJoin = context.lineCap = "round";
      context.moveTo(point[0], point[1]);
      context.beginPath();
    },
    [strokeWidth]
  );

  const continueStroke = useCallback(
    (point: Point, context: CanvasRenderingContext2D) => {
      context.lineTo(point[0], point[1]);
      context.stroke();
    },
    []
  );

  const cursor = circleCursor(strokeWidth);

  return { name: "Eraser", startStroke, continueStroke, cursor };
}
