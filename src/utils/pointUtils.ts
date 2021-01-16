export type Point = [number, number];

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
