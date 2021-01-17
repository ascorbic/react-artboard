import { useCallback, useRef } from "react";
import tinycolor from "tinycolor2";

import { ToolHandlers } from "../../components/Artboard";
import { Point } from "../../utils/pointUtils";
export interface UseNeighbourProps {
  color?: string;
  neighbourColor?: string;
  neighbourStrokeWidth?: number;
  strokeWidth?: number;
  distanceThreshold?: number;
  spreadFactor?: number;
}

export function useNeighbourBrush({
  color = "#000000",
  strokeWidth = 25,
  neighbourColor,
  distanceThreshold = 1000,
  neighbourStrokeWidth = 1,
  spreadFactor = 0.8,
}: UseNeighbourProps): ToolHandlers {
  neighbourColor ||= tinycolor(color).setAlpha(0.2).toPercentageRgbString();
  const points = useRef<Array<Point>>([]);

  const startStroke = useCallback(
    (point: Point, context: CanvasRenderingContext2D) => {
      console.log({ spreadFactor });

      context.globalCompositeOperation = "darken";
      context.lineWidth = 1;
      context.lineJoin = context.lineCap = "round";
      points.current = [point];
    },
    [color, spreadFactor]
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

        if (
          distance < distanceThreshold &&
          Math.random() > distance / distanceThreshold
        ) {
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
    [strokeWidth, color, spreadFactor, distanceThreshold, neighbourColor]
  );

  const endStroke = useCallback((context: CanvasRenderingContext2D) => {
    context.globalCompositeOperation = "source-over";
  }, []);
  const cursor = "crosshair";

  return { name: "Sketch", startStroke, continueStroke, endStroke, cursor };
}
