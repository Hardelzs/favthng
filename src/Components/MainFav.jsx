import MainList from "./MainList";
import { useState } from "react";

const MainFav = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [position, setPosition] = useState(() => {
    const savedPosition = localStorage.getItem('position')
    return savedPosition ? JSON.parse(savedPosition) : { x: 0, y: 0}
  })
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newPosition = {
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      }
      setPosition(newPosition);
      localStorage.setItem('position', JSON.stringify(newPosition))
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (id) => {
    setSelectedId(id);
    console.log("Clicked", id);
  };

  const renderHeading = () => {
    switch (selectedId) {
      case 1:
        return <h1> THis is id 1</h1>;
      case 2:
        return <h1> THis is id 2</h1>;
      case 3:
        return <h1> THis is id 3</h1>;
      case 4:
        return (
          <div>
            <div
            className="cursor-move"
              onMouseDown={handleMouseDown}
              style={{
                width: "100px",
                height: "100px",
                background: "blue",
                color: "white",
                textAlign: "center",
                lineHeight: "100px",
                cursor: "grab",
                position: "absolute",
                left: `${position.x}px`,
                top: `${position.y}px`,
              }}
            >
              Drag me!
            </div>
          </div>
        );
      case 5:
        return <h1> THis is id 5</h1>;
      default:
        return null;
    }
  };
  return (
    // no touch this code p-7
    <div className="p-7">
      <div className="flex justify-between items-center shadow-sm shadow-black p-1 rounded-lg design">
        <div
          className="absolute top-40 left-20"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp} // Stop dragging if the mouse leaves the container
        >
          <h1>hello</h1>
          {renderHeading()}
        </div>
        <div className="flex items-center justify-center rounded-lg p-5 ml-[20%] gap-10 mt-[500px] bg-white">
          {MainList.map((item) => (
            <div
              key={item.id}
              className=""
              onClick={() => handleClick(item.id)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-32 h-28 hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer hover:-mt-10 "
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainFav;


