import { useCallback, useRef, useState } from "react";

import { Bristle, getNewAngle, rotatePoint, varyColour } from "./brushHelpers";
import { ToolHandlers } from "../../components/Artboard";
import { Point } from "../../utils/pointUtils";
import { circleCursor } from "../../utils/cursors";

export type Brush = Array<Bristle>;

function makeBrush(
  strokeWidth: number,
  colour: string,
  varyBrightness: number
): Brush {
  const brush: Brush = [];
  let bristleCount = Math.round(strokeWidth / 3);
  const gap = strokeWidth / bristleCount;
  for (let i = 0; i < bristleCount; i++) {
    const distance =
      i === 0 ? 0 : gap * i + (Math.random() * gap) / 2 - gap / 2;
    brush.push({
      distance,
      thickness: Math.random() * 2 + 2,
      colour: varyColour(colour, varyBrightness),
    });
  }
  return brush;
}

const strokeBristle = (
  origin: Point,
  destination: Point,
  bristle: Bristle,
  controlPoint: Point,
  context: CanvasRenderingContext2D
) => {
  context.beginPath();
  context.moveTo(origin[0], origin[1]);
  context.strokeStyle = bristle.colour;
  context.lineWidth = bristle.thickness;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.shadowColor = bristle.colour;
  context.shadowBlur = bristle.thickness / 2;
  context.quadraticCurveTo(
    controlPoint[0],
    controlPoint[1],
    destination[0],
    destination[1]
  );
  context.lineTo(destination[0], destination[1]);
  context.stroke();
};

const drawStroke = (
  bristles: Brush,
  origin: Point,
  destination: Point,
  oldAngle: number,
  newAngle: number,
  strokeWidth: number,
  context: CanvasRenderingContext2D
) => {
  bristles.forEach((bristle) => {
    context.beginPath();
    const bristleOrigin = rotatePoint(
      bristle.distance - strokeWidth / 2,
      oldAngle,
      origin
    );

    const bristleDestination = rotatePoint(
      bristle.distance - strokeWidth / 2,
      newAngle,
      destination
    );
    const controlPoint = rotatePoint(
      bristle.distance - strokeWidth / 2,
      newAngle,
      origin
    );

    strokeBristle(
      bristleOrigin,
      bristleDestination,
      bristle,
      controlPoint,
      context
    );
  });
};

export interface UseBrushProps {
  color?: string;
  strokeWidth?: number;
  varyBrightness?: number;
}

export function useBrush({
  color = "#000000",
  strokeWidth = 25,
  varyBrightness = 5,
}: UseBrushProps): ToolHandlers {
  const [brush, setBrush] = useState<Brush>([]);
  const currentAngle = useRef<number>();
  const lastPoint = useRef<Point>();

  const startStroke = useCallback(
    (point: Point) => {
      currentAngle.current = undefined;
      setBrush(makeBrush(strokeWidth, color, varyBrightness));
      lastPoint.current = point;
    },
    [setBrush, strokeWidth, color]
  );

  const continueStroke = useCallback(
    (newPoint: Point, context: CanvasRenderingContext2D) => {
      if (!lastPoint.current) {
        lastPoint.current = newPoint;
        return;
      }
      const newAngle = getNewAngle(
        lastPoint.current,
        newPoint,
        currentAngle.current
      );
      if (typeof currentAngle.current === "undefined") {
        currentAngle.current = newAngle % (Math.PI * 2);
      }
      drawStroke(
        brush,
        lastPoint.current,
        newPoint,
        currentAngle.current,
        newAngle,
        strokeWidth,
        context
      );
      currentAngle.current = newAngle % (Math.PI * 2);
      lastPoint.current = newPoint;
    },
    [brush, strokeWidth]
  );

  const cursor = circleCursor(strokeWidth);

  return { startStroke, continueStroke, cursor };
}
