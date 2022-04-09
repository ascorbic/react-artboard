import React, { useState } from "react";
import {
  useBrush,
  useMarker,
  useAirbrush,
  Artboard,
  ArtboardRef,
  useShadingBrush,
  useEraser,
  useWatercolor,
  ToolHandlers,
} from "../src/";

import {
  FaPencilAlt,
  FaPaintBrush,
  FaMarker,
  FaEraser,
  FaSprayCan,
  FaDownload,
  FaTrash,
  FaUndo,
  FaRedo,
  FaGithub,
} from "react-icons/fa";
import { HexColorPicker } from "react-colorful";
import { IoMdWater } from "react-icons/io";
import { useHistory } from "../src/history";
import "./style.css";
import "react-colorful/dist/index.css";
import "react-responsive-modal/styles.css";
import "react-rangeslider/lib/index.css";
import Slider from "react-rangeslider";
import { Modal } from "react-responsive-modal";
import type { IconType } from "react-icons/lib";
export function App(): JSX.Element {
  const [color, setColor] = useState("#531B93");
  const [strokeWidth, setStrokeWidth] = useState(40);
  const [colorOpen, setColorOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [artboardRef, setArtboardRef] = useState<ArtboardRef | null>();
  const brush = useBrush({ color, strokeWidth });
  const marker = useMarker({ color, strokeWidth });
  const watercolor = useWatercolor({ color, strokeWidth });
  const airbrush = useAirbrush({ color, strokeWidth });
  const eraser = useEraser({ strokeWidth });
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
    [eraser, FaEraser],
  ];
  const [currentTool, setCurrentTool] = useState(0);

  const { undo, redo, history, canUndo, canRedo } = useHistory();

  return (
    <main>
      <h1 id="name">
        <a href="https://github.com/ascorbic/react-artboard">
          react-artboard <FaGithub />
        </a>
      </h1>
      <div id="topTools" className="toolbarSection"></div>
      <div id="brushes" className="toolbarSection">
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
            {<Icon size={14} title={tool.name} />}
          </button>
        ))}
        <label>
          Color:
          <button
            onClick={() => setColorOpen(true)}
            style={{
              backgroundColor: color,
              width: 50,
              border: "2px gray solid",
              color: "transparent",
            }}
          >
            Color
          </button>
          <Modal open={colorOpen} onClose={() => setColorOpen(false)}>
            <div style={{ padding: 30 }}>
              <HexColorPicker color={color} onChange={setColor} />
            </div>
          </Modal>
        </label>
        <label>
          Size:
          <button onClick={() => setSizeOpen(true)}>{strokeWidth}</button>
          <Modal open={sizeOpen} onClose={() => setSizeOpen(false)}>
            <div
              style={{
                width: 150,
                padding: "30px 20px 10px 20px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Slider
                min={5}
                max={100}
                value={strokeWidth}
                onChange={setStrokeWidth}
              />
              <div
                style={{
                  flex: 1,
                  minHeight: 150,
                  justifyContent: "center",
                  flexDirection: "column",
                  display: "flex",
                  placeItems: "center",
                }}
              >
                <div
                  style={{
                    width: strokeWidth,
                    height: strokeWidth,
                    backgroundColor: color,
                    borderRadius: strokeWidth,
                  }}
                ></div>
              </div>
            </div>
          </Modal>
        </label>
      </div>
      <div id="controls" className="toolbarSection">
        <button onClick={undo} disabled={!canUndo}>
          <FaUndo size={12} title="Undo" />
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
      <div id="artboard">
        <Artboard
          tool={tools[currentTool][0]}
          ref={setArtboardRef}
          history={history}
          style={{ border: "1px gray solid" }}
        />
      </div>
    </main>
  );
}
