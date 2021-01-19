import { Point } from "../../utils/pointUtils";

let spareRandom: number | null = null;

// https://gist.github.com/bluesmoon/7925696
function normalRandom() {
  let val, u, v, s, mul;
  if (spareRandom !== null) {
    val = spareRandom;
    spareRandom = null;
  } else {
    do {
      u = Math.random() * 2 - 1;
      v = Math.random() * 2 - 1;
      s = u * u + v * v;
    } while (s === 0 || s >= 1);
    mul = Math.sqrt((-2 * Math.log(s)) / s);
    val = u * mul;
    spareRandom = v * mul;
  }
  return val;
}
export function makePolygon(
  centre: Point,
  sides: number,
  radius: number
): Array<Point> {
  const increment = (Math.PI * 2) / sides;
  const result: Array<Point> = [];
  for (let i = 1; i <= sides; i++) {
    result.push([
      radius * Math.cos(increment * i) + centre[0],
      radius * Math.sin(increment * i) + centre[1],
    ]);
  }
  return result;
}

export function deformPolygon(
  points: Array<Point>,
  depth: number,
  variance: number,
  vdiv: number
): Array<Point> {
  const newPoints: Array<Point> = [];
  for (let i = 0; i < points.length; i++) {
    const currentPoint = points[i];
    const nextPoint = points[(i + 1) % points.length];
    newPoints.push(currentPoint);
    newPoints.push(
      ...subdivideVertex(currentPoint, nextPoint, depth, variance, vdiv)
    );
  }
  return newPoints;
}

function subdivideVertex(
  currentPoint: Point,
  nextPoint: Point,
  depth: number,
  variance: number,
  vdiv: number
): Array<Point> {
  if (depth < 0) {
    return [];
  }
  //   Find the midpoint
  const midX = (currentPoint[0] + nextPoint[0]) / 2;
  const midY = (currentPoint[1] + nextPoint[1]) / 2;

  //   Nudge the midpoint
  const newMidpoint: Point = [
    midX + normalRandom() * variance,
    midY + normalRandom() * variance,
  ];

  const newPoints = subdivideVertex(
    currentPoint,
    newMidpoint,
    depth - 1,
    variance / vdiv,
    vdiv
  );

  newPoints.push(newMidpoint);
  newPoints.push(
    ...subdivideVertex(newMidpoint, nextPoint, depth - 1, variance / vdiv, vdiv)
  );
  return newPoints;
}

export function getSplodge(
  point: Point,
  sides: number,
  radius: number
): Array<Point> {
  return deformPolygon(makePolygon(point, sides, radius), 5, radius / 10, 2);
}

export function splodgeAtPoint(
  point: Point,
  context: CanvasRenderingContext2D,
  width: number
): void {
  context.beginPath();
  getSplodge(point, Math.round(width / 5), width).forEach((point) => {
    context.lineTo(...point);
  });
  context.closePath();
  context.fill();
}

export function splodgeTrail(
  points: Array<Point>,
  width: number,
  trail: number,
  context: CanvasRenderingContext2D
): void {
  const count = Math.min(trail, points.length / 3);
  for (let i = 0; i < count; i++) {
    context.globalAlpha = 0.01 - (0.009 / count) * i;
    splodgeAtPoint(
      points[points.length - i * 3 - 1],
      context,
      width + (width / count) * i
    );
  }
  context.globalAlpha = 0.1;
}
