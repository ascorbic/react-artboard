import React, { useState } from "react";
import { Artboard } from "./components/Artboard";

export function App() {
  const [color, setColor] = useState("#993366");
  const [size, setSize] = useState(20);
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
          value={size}
          onInput={(evt) => setSize(parseInt(evt.currentTarget.value))}
        />
        {size}
      </div>
      <Artboard
        color={color}
        strokeWidth={size}
        style={{ border: "1px red solid", flex: 1 }}
      />
    </main>
  );
}
