export declare type Point = [number, number];
export declare const getTouchPoint: (event: React.TouchEvent) => Point;
export declare const getMousePoint: (event: React.MouseEvent) => Point;
export declare const mouseButtonIsDown: (buttons: number) => boolean;
