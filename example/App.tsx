import React, { useState } from "react";
import {
  useBrush,
  useMarker,
  useAirbrush,
  Artboard,
  ArtboardRef,
  useShadingBrush,
} from "../src/";
import { useHistory } from "../src/history";
import "./style.css";
export function App() {
  const [color, setColor] = useState("#333333");
  const [strokeWidth, setStrokeWidth] = useState(40);
  const [artboardRef, setArtboardRef] = useState<ArtboardRef | null>();
  const brush = useBrush({ color, strokeWidth });
  const marker = useMarker({ color, strokeWidth });
  const airbrush = useAirbrush({ color, strokeWidth });
  const shading = useShadingBrush({
    color,
    spreadFactor: (1 / 45) * strokeWidth,
    distanceThreshold: 100,
  });
  const tools = [shading, brush, marker, airbrush];
  const [currentTool, setCurrentTool] = useState(0);

  const { undo, redo, history, canUndo, canRedo } = useHistory();

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 20px)",
        touchAction: "none",
        maxWidth: "calc(100vw - 20px)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 5,
          overflow: "scroll",
        }}
      >
        <h1>
          <a href="https://github.com/ascorbic/react-artboard">
            react-artboard
          </a>
        </h1>
        <label>
          Color:
          <input
            type="color"
            value={color}
            onInput={(evt) => setColor(evt.currentTarget.value)}
          />
        </label>
        <label>
          Size:
          <input
            type="range"
            min={5}
            max={100}
            value={strokeWidth}
            onInput={(evt) => setStrokeWidth(parseInt(evt.currentTarget.value))}
          />
          <span>{strokeWidth}</span>
        </label>
        <button onClick={undo} disabled={!canUndo}>
          Undo
        </button>
        <button onClick={redo} disabled={!canRedo}>
          Redo
        </button>

        <div style={{ display: "flex" }}>
          {tools.map((tool, index) => (
            <label key={tool.name} style={{ cursor: "pointer" }}>
              <input
                type="radio"
                checked={index === currentTool}
                onChange={() => setCurrentTool(index)}
              />{" "}
              {tool.name}{" "}
            </label>
          ))}
        </div>
        <button onClick={() => artboardRef?.download()}>Download</button>
        <button onClick={() => artboardRef?.clear()}>Clear</button>
      </div>
      <Artboard
        tool={tools[currentTool]}
        ref={setArtboardRef}
        history={history}
        style={{ border: "1px gray solid", flex: 1 }}
      />
    </main>
  );
}
