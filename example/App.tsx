import React, { useState } from "react";
import { useBrush, Artboard, ArtboardRef } from "../src/";
import "./style.css";
export function App() {
  const [color, setColor] = useState("#993366");
  const [strokeWidth, setStrokeWidth] = useState(40);
  const [artboardRef, setArtboardRef] = useState<ArtboardRef | null>();
  const brush = useBrush({ color, strokeWidth });

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 20px)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 5,
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
          Brush size:
          <input
            type="range"
            min={5}
            max={100}
            value={strokeWidth}
            onInput={(evt) => setStrokeWidth(parseInt(evt.currentTarget.value))}
          />
          <span>{strokeWidth}</span>
        </label>
        <button onClick={() => artboardRef?.download()}>Download</button>
        <button onClick={() => artboardRef?.clear()}>Clear</button>
      </div>
      <Artboard
        tool={brush}
        ref={setArtboardRef}
        style={{ border: "1px gray solid", flex: 1 }}
      />
    </main>
  );
}
