import { useEffect, useRef, useState } from "react";
import Toolbar from "./Toolbar";


export default function Canvas({ canvasWidth, canvasHeight }) {

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('black');
  const [isErasing, setIsErasing] = useState(false);
  const [restoreArray, setRestoreArray] = useState([]);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;

    const canvasOffsetX = canvas.offsetLeft;
    const canvasOffsetY = canvas.offsetTop;

    canvas.width = canvasWidth - canvasOffsetX;
    canvas.height = canvasHeight - canvasOffsetY;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = brushColor;
    context.lineWidth = 5;
    contextRef.current = context;
  }, [])

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  }

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  }

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
    setRestoreArray([...restoreArray, contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)])
    // restoreArray.push(contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
    setIndex(index + 1);
    console.log(restoreArray)
    console.log(index)
  }

  const clearCanvas = () => {
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setRestoreArray([]);
    setIndex(-1);
  }

  const handleColorChange = (event) => {
    event.preventDefault();
    setBrushColor(event.target.value);
    contextRef.current.strokeStyle = event.target.value;
    setIsErasing(false);
  }

  const handleLineWidthChange = (event) => {
    event.preventDefault();
    contextRef.current.lineWidth = event.target.value;
  }

  const toggleEraseMode = () => {
    if (contextRef.current.strokeStyle != "#ffffff") {
      contextRef.current.strokeStyle = "white";
    } else {
      contextRef.current.strokeStyle = brushColor;
    }
    setIsErasing(!isErasing);
  }

  const undoAction = () => {
    if (index <= 0) {
      clearCanvas();
    } else {
      setIndex(index - 1);
      setRestoreArray([...restoreArray.slice(0, -1)]);
      contextRef.current.putImageData(restoreArray[index], 0, 0);
    }
  }

  return (
    <div>
      <Toolbar 
        clearCanvas={clearCanvas} 
        handleColorChange={handleColorChange} 
        handleLineWidthChange={handleLineWidthChange}
        toggleEraseMode={toggleEraseMode}
        isErasing={isErasing}
        undoAction={undoAction}
      />
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        ref={canvasRef}
        style={{ border: '1px solid black' }}
      />
    </div>
  )
}
