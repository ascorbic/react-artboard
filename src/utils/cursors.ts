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
