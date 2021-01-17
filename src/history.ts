import { useCallback, useMemo, useRef, useState } from "react";

async function applyImage(context: CanvasRenderingContext2D, blob: Blob) {
  const img = new Image();
  img.onload = () => {
    context.canvas.width = img.width;
    context.canvas.height = img.height;
    context.drawImage(img, 0, 0);
    URL.revokeObjectURL(img.src);
  };
  img.src = URL.createObjectURL(blob);
}

export interface History {
  setContext: (context: CanvasRenderingContext2D) => void;
  pushState: (canvas: HTMLCanvasElement) => Promise<boolean>;
}
export interface HistoryHook {
  history: History;

  undo: () => Promise<boolean>;
  redo: () => Promise<boolean>;
  clear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function useHistory(size?: number): HistoryHook {
  const stack = useRef<Array<Blob>>([]);
  const crs = useRef(0);
  const [context, setContext] = useState<CanvasRenderingContext2D>();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const pushState = useCallback(
    async (canvas: HTMLCanvasElement) => {
      const undoCursor = crs.current;
      if (!context) {
        console.error("Context not initialised");
        return false;
      }
      if (undoCursor !== 0) {
        stack.current = stack.current.slice(0, -undoCursor);
        crs.current = 0;
      }
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve)
      );
      if (blob) {
        stack.current.push(blob);
      }
      if (size && stack.current.length > size) {
        stack.current = stack.current.slice(-size);
      }
      setCanUndo(stack.current.length > 1);
      setCanRedo(false);
      return true;
    },
    [crs, stack, context]
  );
  const undo = useCallback(async () => {
    const undoCursor = crs.current;

    if (!context) {
      console.error("Context not initialised");
      return false;
    }
    if (undoCursor + 1 >= stack.current.length) {
      console.log("nope");
      return false;
    }

    await applyImage(
      context,
      stack.current[stack.current.length - (undoCursor + 2)]
    );
    crs.current++;
    setCanUndo(crs.current + 1 < stack.current.length);
    setCanRedo(true);
    return true;
  }, [crs, stack, context]);

  const redo = useCallback(async () => {
    const undoCursor = crs.current;

    if (!context) {
      console.error("Context not initialised");
      return false;
    }
    if (undoCursor <= 0) {
      return false;
    }

    await applyImage(context, stack.current[stack.current.length - undoCursor]);
    crs.current--;
    setCanUndo(crs.current + 1 < stack.current.length);
    setCanRedo(crs.current > 0);
    return true;
  }, [stack, crs, context]);

  const clear = useCallback(() => {
    stack.current = [];
  }, [stack]);

  const history = useMemo<History>(
    () => ({
      setContext: (context: CanvasRenderingContext2D) => {
        setContext(context);
      },
      pushState,
    }),
    [setContext, pushState]
  );

  return { history, undo, redo, clear, canUndo, canRedo };
}
