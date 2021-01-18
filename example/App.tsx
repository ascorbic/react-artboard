import React, { useState } from "react";
import {
  useBrush,
  useMarker,
  useAirbrush,
  Artboard,
  ArtboardRef,
  useShadingBrush,
  useWatercolor,
  ToolHandlers,
} from "../src/";

import {
  FaPencilAlt,
  FaPaintBrush,
  FaMarker,
  FaSprayCan,
  FaDownload,
  FaTrash,
  FaUndo,
  FaRedo,
  FaGithub,
} from "react-icons/fa";

import { IoMdWater } from "react-icons/io";

import { useHistory } from "../src/history";
import "./style.css";
import type { IconType } from "react-icons/lib";
export function App(): JSX.Element {
  const [color, setColor] = useState("#531B93");
  const [strokeWidth, setStrokeWidth] = useState(40);
  const [artboardRef, setArtboardRef] = useState<ArtboardRef | null>();
  const brush = useBrush({ color, strokeWidth });
  const marker = useMarker({ color, strokeWidth });
  const watercolor = useWatercolor({ color, strokeWidth });
  const airbrush = useAirbrush({ color, strokeWidth });
  const shading = useShadingBrush({
    color,
    spreadFactor: (1 / 45) * strokeWidth,
    distanceThreshold: 100,
  });
  const tools: Array<[ToolHandlers, IconType]> = [
    [shading, FaPencilAlt],
    [watercolor, IoMdWater],
    [brush, FaPaintBrush],
    [marker, FaMarker],
    [airbrush, FaSprayCan],
  ];
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
      <div className="toolbar" style={{ justifyContent: "flex-start" }}>
        <h1>
          <a href="https://github.com/ascorbic/react-artboard">
            react-artboard <FaGithub />
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
      </div>
      <div className="toolbar">
        <div className="toolbarSection">
          {tools.map(([tool, Icon], index) => (
            <button
              aria-label={tool.name}
              key={tool.name}
              title={tool.name}
              style={{
                backgroundColor: currentTool === index ? "#aaaaff" : "#eeeeee",
              }}
              onClick={() => setCurrentTool(index)}
            >
              {<Icon title={tool.name} />}
            </button>
          ))}
        </div>
        <div className="toolbarSection">
          <button onClick={undo} disabled={!canUndo}>
            <FaUndo title="Undo" />
          </button>
          <button onClick={redo} disabled={!canRedo}>
            <FaRedo title="Redo" />
          </button>
          <button onClick={() => artboardRef?.download()}>
            <FaDownload title="Download" />
          </button>
          <button onClick={() => artboardRef?.clear()}>
            <FaTrash title="Clear" />
          </button>
        </div>
      </div>
      <Artboard
        tool={tools[currentTool][0]}
        ref={setArtboardRef}
        history={history}
        style={{ border: "1px gray solid", flex: 1 }}
      />
    </main>
  );
}
