import { useState, useRef } from "react";
import { LuAudioLines } from "react-icons/lu";
const MediaPlayer = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
    } else {
      alert("Please upload a valid audio file.");
    }           
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          ref={fileInputRef}
          style={{ margin: "20px 0" }}
          className="hidden"
        />

        <button onClick={() => fileInputRef.current.click()}>
            <LuAudioLines className="text-5xl border-2 border-gray-500 hover:bg-gray-500 hover:text-white rounded-full p-2 text-gray-500" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}/>
        </button>
      </div>

      {audioUrl && (
        <div
        style={{
            position: "absolute",
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: "move",
            width: "auto",
            height: "auto",
            padding: "10px",
            backgroundColor: "white",
            display: "inline-block",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        >

          <audio controls src={audioUrl}></audio>
        </div>
      )}

      {audioFile && <div style={{ marginTop: "20px" }}></div>}
    </div>
  );
};

export default MediaPlayer;
