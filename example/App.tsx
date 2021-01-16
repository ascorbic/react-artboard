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
      <div>
        <input
          type="color"
          value={color}
          onInput={(evt) => setColor(evt.currentTarget.value)}
        />
        <input
          type="range"
          min={5}
          max={50}
          value={strokeWidth}
          onInput={(evt) => setStrokeWidth(parseInt(evt.currentTarget.value))}
        />
        {setStrokeWidth}
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
