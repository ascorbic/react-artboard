import { useCallback, useRef } from "react";
import tinycolor from "tinycolor2";

import { ToolHandlers } from "../../components/Artboard";
import { Point } from "../../utils/pointUtils";
export interface UseShadingProps {
  color?: string;
  neighbourColor?: string;
  neighbourStrokeWidth?: number;
  distanceThreshold?: number;
  spreadFactor?: number;
}

export function useShadingBrush({
  color = "#000000",
  neighbourColor,
  distanceThreshold = 40,
  neighbourStrokeWidth = 1,
  spreadFactor = 0.9,
}: UseShadingProps): ToolHandlers {
  neighbourColor ||= tinycolor(color).setAlpha(0.2).toPercentageRgbString();
  const points = useRef<Array<Point>>([]);
  const threshold = distanceThreshold * distanceThreshold;

  const startStroke = useCallback(
    (point: Point, context: CanvasRenderingContext2D) => {
      context.globalCompositeOperation = "darken";
      context.lineWidth = 1;
      context.lineJoin = context.lineCap = "round";
      points.current = [point];
    },
    []
  );

  const continueStroke = useCallback(
    (newPoint: Point, context: CanvasRenderingContext2D) => {
      context.strokeStyle = color;
      context.lineWidth = 1;

      points.current.push(newPoint);
      context.beginPath();
      const [prevX, prevY] = points.current[points.current.length - 2];
      context.moveTo(prevX, prevY);
      context.lineTo(...newPoint);
      context.stroke();
      context.lineWidth = neighbourStrokeWidth;

      for (const point of points.current) {
        const dx = point[0] - newPoint[0];
        const dy = point[1] - newPoint[1];
        const distance = dx * dx + dy * dy;

        if (distance < threshold && Math.random() > distance / threshold) {
          context.beginPath();
          context.strokeStyle = neighbourColor as string;
          context.moveTo(
            newPoint[0] + dx * spreadFactor,
            newPoint[1] + dy * spreadFactor
          );
          context.lineTo(
            point[0] - dx * spreadFactor,
            point[1] - dy * spreadFactor
          );
          context.stroke();
        }
      }
    },
    [neighbourStrokeWidth, color, spreadFactor, threshold, neighbourColor]
  );

  const endStroke = useCallback((context: CanvasRenderingContext2D) => {
    context.globalCompositeOperation = "source-over";
  }, []);
  const cursor = "crosshair";

  return { name: "Shading", startStroke, continueStroke, endStroke, cursor };
}
