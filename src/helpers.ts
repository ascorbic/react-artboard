import tinycolor from "tinycolor2";

export function varyColour(sourceColour: string, varyBrightness: number) {
  const amount = Math.round(Math.random() * varyBrightness);
  const alpha = 1 - Math.random() / 4;
  const colour = tinycolor(sourceColour);
  const varied = colour.darken(amount).setAlpha(alpha);
  return varied.toPercentageRgbString();
}

export type Point = [number, number];

export interface Bristle {
  distance: number;
  thickness: number;
  colour: string;
}
export type Brush = Array<Bristle>;

export function makeBrush(
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

export const rotatePoint = (
  distance: number,
  angle: number,
  origin: Point
): Point => [
  origin[0] + distance * Math.cos(angle),
  origin[1] + distance * Math.sin(angle),
];

export const getBearing = (origin: Point, destination: Point) =>
  (Math.atan2(destination[1] - origin[1], destination[0] - origin[0]) -
    Math.PI / 2) %
  (Math.PI * 2);

export const getNewAngle = (
  origin: Point,
  destination: Point,
  oldAngle?: number
): number => {
  const bearing = getBearing(origin, destination);
  if (typeof oldAngle === "undefined") {
    return bearing;
  }
  return oldAngle - angleDiff(oldAngle, bearing);
};

export const angleDiff = (angleA: number, angleB: number) => {
  const twoPi = Math.PI * 2;
  const diff =
    ((angleA - (angleB > 0 ? angleB : angleB + twoPi) + Math.PI) % twoPi) -
    Math.PI;
  return diff < -Math.PI ? diff + twoPi : diff;
};

export const strokeBristle = (
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

export const drawStroke = (
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

export const getTouchPoint = (event: React.TouchEvent): Point => {
  if (!event.currentTarget) {
    return [0, 0];
  }
  const rect = event.currentTarget.getBoundingClientRect();
  const touch = event.targetTouches[0];
  return [touch.clientX - rect.left, touch.clientY - rect.top];
};

export const getMousePoint = (event: React.MouseEvent): Point => [
  event.nativeEvent.offsetX,
  event.nativeEvent.offsetY,
];

const BUTTON = 0b01;
export const mouseButtonIsDown = (buttons: number) =>
  (BUTTON & buttons) === BUTTON;

export function circleSVG(diameter: number) {
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${diameter}' height='${diameter}' viewBox='0 0 ${diameter} ${diameter}'><circle r='${
    diameter / 2
  }' cy='${diameter / 2}' cx='${
    diameter / 2
  }' stroke-width='1' stroke='rgba(0,0,0,0.5)' fill='none'/></svg>`;
}

export function circleDataUri(diameter: number) {
  return `data:image/svg+xml;base64,${btoa(circleSVG(diameter))}`;
}

export function circleCursor(diameter: number) {
  return `url(${circleDataUri(diameter)}) ${diameter / 2} ${
    diameter / 2
  }, crosshair`;
}
