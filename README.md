# react-artboard

A realistic canvas painting library for React that doesn't look like MS Paint.

react-artboard includes an `Artboard` component and one paintbrush tool. Tools
are implemented as custom hooks, so you can add your own brushes and other tools.

[Try the demo](https://react-artboard.netlify.app/)

## Installation

```shell
npm install react-artboard
```

## Usage

For a full usage example, see [this file](https://github.com/ascorbic/react-artboard/blob/main/example/App.tsx). 
The simplest usage of the component is like this:

```jsx
import React from "react";
import { useBrush, Artboard } from "react-artboard";
export function App() {
  const brush = useBrush({ color: "#663399", strokeWidth: 40 });

  return <Artboard tool={brush} style={{ width: 800, height: 600 }} />;
}
```

You probably want to allow users to change the colors and size of the brush.
Here is an example that uses native `color` and `range` inputs:

```jsx
import React, { useState } from "react";
import { useBrush, Artboard } from "react-artboard";
export function App() {
  const [color, setColor] = useState("#993366");
  const [strokeWidth, setStrokeWidth] = useState(40);
  const brush = useBrush({ color, strokeWidth });

  return (
    <main>
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
      </div>
      <Artboard tool={brush} style={{ width: 800, height: 600 }} />
    </main>
  );
}
```

You could use a custom component instead of these inputs if you want more
control over them, as long as they return a number for the brush size and a
string for the color.

If you want to export your creations or clear the canvas, you can use the ref
like this:

```jsx
import React, { useState } from "react";
import { useBrush, Artboard } from "react-artboard";
export function App() {
  const [color, setColor] = useState("#993366");
  const [strokeWidth, setStrokeWidth] = useState(40);
  const brush = useBrush({ color, strokeWidth });

  const [artboardRef, setArtboardRef] = useState();

  return (
    <main>
      <div>
        <button onClick={() => artboardRef?.download()}>Download</button>
        <button onClick={() => artboardRef?.clear()}>Clear</button>
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
      </div>
      <Artboard tool={brush} style={{ width: 800, height: 600 }} />
    </main>
  );
}
```

## API

### `Artboard`

#### Props

- **`tool`**

  This is the tool returned by the `useBrush()` hook. You can also implement your own tools and pass them in here.

- **`ref`**

  This accepts a callback that will be passed a ref that you can use to make the following calls:

    - **`download`**: `(filename: string, type: string) => void`
      
      Downloads the canvas as an image. You can pass in a filename (default "image.png"), and a mimetype (default "image/png"). If you pass an unsupported type it will fallback to PNG.
    - **`getImageAsDataUri`**: `(type: string) => string | undefined`

      Returns the image as a data URI, which can be displayed in an `<img>` tag for example.
    - **`clear`**: `() => void`
        
      Clears the image

### `useBrush(options)`

This is currently the only included tool, which emulates a paintbrush. 

#### Options
- **`color`** A CSS string color.
- **`strokeWidth`** The width of the brush

## Custom brushes

See the source for `useBrush` to see how to create a brush. It must return an object, with the following optional callbacks:

- **`startStroke?`**: `(point: Point, context: CanvasRenderingContext2D) => void`
- **`continueStroke?`**: `(point: Point, context: CanvasRenderingContext2D) => void`
- **`endStroke?`**: `(context: CanvasRenderingContext2D) => void`
- **`cursor?`**: `string`
  A CSS-compatible string for the cursor to display. You can use the `circleCursor()` helper to display a resizable circle for the cursor


© Copyright [Matt Kane](https://mk.gg) 2021. MIT Licence