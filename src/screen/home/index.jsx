import { useRef, useState, useEffect } from "react";
// import {SWATCHES} from 'constants'
import { ColorSwatch, Group } from "@mantine/core";
import { Button } from "@mantine/core";
import axios from "axios";

export default function Home() {
  const SWATCHS = [
    "#FFFFFF", // White
    "#FF0000", // Red
    "#FFC0CB", // Pink
    "#800080", // Purple
    "#A52A2A", // Brown
    "#0000FF", // Blue
    "#000080", // Dark Blue
    "#008000", // Green
    "#006400", // Dark Green
    "#FFFF00", // Yellow
    "#FFA500", // Orange
  ];
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [Color, setColor] = useState("rgb(255,255,255)");
  const [reset, setreset] = useState(false);
  const [result, setresult] = useState(null);
  const [dictOfVars, setdictOfVars] = useState({});
  useEffect(() => {
    if (reset) {
      resetConvas();
      setreset(false);
    }
  }, [reset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - canvas.offsetTop;
        ctx.lineCap = "round";
        ctx.lineWidth = 3;
        canvas.style.background = "black"; // Set the background initially
      }
    }
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) {
      return;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = Color;
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
      }
    }
  };
  const resetConvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const sendData = async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const formData = new FormData();
      formData.append("image", canvas.toDataURL("image/png"));
      formData.append("dictOfVars", JSON.stringify(dictOfVars));

      const response = await axios({
        method: "post",
        url: "http://127.0.0.1:3000/calculate",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const resp = await response.data;
      console.log(resp);
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-2 z-20 ">
        <Button
          onClick={() => setreset(true)}
          className="default z-20"
          variant="default"
          color="black"
        >
          Reset
        </Button>
        <Group className="z-20 ">
          {SWATCHS.map((swatchColor) => {
            return (
              <ColorSwatch
                key={swatchColor}
                color={swatchColor}
                onClick={() => setColor(swatchColor)}
              />
            );
          })}
        </Group>
        <Button
          onClick={sendData}
          className="default z-20"
          variant="default"
          color="black"
        >
          Calculate
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        id="canvas"
        className="absolute top-0 left-0 w-full h-full"
        onMouseDown={startDrawing}
        onMouseMove={draw} // Attach the draw handler here
        onMouseOut={stopDrawing}
        onMouseUp={stopDrawing}
      />
    </>
  );
}
