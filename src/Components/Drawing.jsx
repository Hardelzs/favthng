import { useRef, useState, useEffect } from 'react';

const DrawingApp = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [savedDrawing, setSavedDrawing] = useState(() => {
    const savedImage = localStorage.getItem('userDrawing');
    return savedImage||null;
  });

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.stroke();
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.closePath();
    setIsDrawing(false);
    setSavedDrawing(canvas.toDataURL());
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    setSavedDrawing(null);
    localStorage.removeItem('savedDrawing');
  };

  const pasteDrawing = () => {
    if (!savedDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const image = new Image();
    image.onload = () => {
      context.drawImage(image, 0, 0);
      setSavedDrawing(canvas.toDataURL());
    };
    image.src = savedDrawing;
  };

  // const savedDrawing = () => {
  //   if (!savedDrawing) return;

  //   const link = document.createElement('a');
  //   link.href = savedDrawing;
  //   link.download = 'drawing.png';
  //   link.click();
  // };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false);
  }

  useEffect(() => {
    localStorage.setItem('savedDrawing', JSON.stringify(savedDrawing));
  }, [savedDrawing]); 

    



  return (
    <div className="drawing-app">
      <div className="controls">
        <label>
          Color:
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
        <label>
          Line Width:
          <input type="number" value={lineWidth} min="1" max="50" onChange={(e) => setLineWidth(e.target.value)} />
        </label>
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={pasteDrawing}>Paste</button>
        <button                   onClick={() => {
                    setSavedDrawing(null);
                    localStorage.removeItem('userDrawing');
                  }}>Save</button>
      </div>
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        style={{ border: '1px solid black', cursor: 'crosshair' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      {savedDrawing && (
              <img src={savedDrawing} alt="" style={{
                position: "absolute",
                left: `${position.x}px`,
                top: `${position.y}px`,
                cursor: "move",
                width: "auto",
                height: "auto",
                display: "inline-block",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              />
      )}
    </div>
  );
};

export default DrawingApp;