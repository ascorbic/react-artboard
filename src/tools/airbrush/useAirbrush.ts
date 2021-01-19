import { useCallback } from "react";
import tinycolor from "tinycolor2";
import { ToolHandlers } from "../../components/Artboard";
import { Point } from "../../utils/pointUtils";
import { circleCursor } from "../../utils/cursors";
export interface UseAirbrushProps {
  color?: string;
  strokeWidth?: number;
}

export function useAirbrush({
  color = "#000000",
  strokeWidth = 25,
}: UseAirbrushProps): ToolHandlers {
  const startStroke = useCallback(
    (point: Point, context: CanvasRenderingContext2D) => {
      context.globalCompositeOperation = "darken";
      context.lineWidth = strokeWidth;
      context.lineJoin = context.lineCap = "round";
      context.strokeStyle = color;
      context.shadowBlur = strokeWidth * 0.5;
      context.shadowColor = tinycolor(color)
        .setAlpha(0.5)
        .toPercentageRgbString();
      console.log(context.shadowColor);
      context.moveTo(point[0], point[1]);
      context.beginPath();
    },
    [color, strokeWidth]
  );

  const endStroke = useCallback((context: CanvasRenderingContext2D) => {
    context.globalCompositeOperation = "source-over";
  }, []);

  const continueStroke = useCallback(
    (point: Point, context: CanvasRenderingContext2D) => {
      context.lineTo(point[0], point[1]);
      context.stroke();
    },
    []
  );

  const cursor = circleCursor(strokeWidth);

  return { name: "Airbrush", startStroke, continueStroke, endStroke, cursor };
}
