import MainList from "./MainList";
import { useState, useRef } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoCameraOutline } from "react-icons/io5";

const MainFav = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [position, setPosition] = useState(() => {
    const savedPosition = localStorage.getItem('position')
    return savedPosition ? JSON.parse(savedPosition) : { x: 0, y: 0}
  })
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [savedImage, setImage] = useState(() => {
    const savedImage = localStorage.getItem('userImage');
    return savedImage||null;
  })

  const fileInputRef = useRef(null)

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onloadend = () => {
      setImage(reader.result);
      localStorage.setItem('userImage', reader.result);
      }   
      reader.readAsDataUrl(file);
    };
 
  }

  const handleCameraCapture = async () => {
    try{
      const stream = await navigator.mediaDevices.getUserMedia({video: true});
      const videoTrack = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(videoTrack);

      const blob = await imageCapture.takePhoto();
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        localStorage.setItem('userImage', reader.result);
      };
      reader.readAsDataURL(blob);

      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  }

  const renderHeading = () => {
    switch (selectedId) {
      case 1:
        return <h1> THis is id 1</h1>;
      case 2:
        return (
          <div className="p-4 bg-white rounded-lg shadow-md">
            {savedImage ? (
              <div className="relative">
                <img 
                  src={savedImage} 
                  alt="User uploaded" 
                  className="w-32 h-32 object-cover rounded-full"
                />
                <button 
                  onClick={() => {
                    setImage(null);
                    localStorage.removeItem('userImage');
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="p-5">
                <h1 className="font-mono ">Add a Photo</h1>
                <div className="flex gap-10 p-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="w-full bg-gray-100 rounded-md text-white px-16 py-10 hover:bg-gray-300"
                >
                  <MdOutlineFileUpload  className="text-5xl text-gray-500"/>
                  {/* <p className="">Choose file</p> */}
                </button>
                <button 
                  onClick={handleCameraCapture}
                  className="w-full bg-gray-300 text-white px-16 py-10 rounded hover:bg-gray-100"
                >
                 <IoCameraOutline className="text-5xl" />
                 {/* <p>Take Picture</p> */}
                </button>
                </div>
              </div>
            )}
          </div>
        ); 
      case 3:
        return <h1> THis is id 3</h1>;
      case 4:
        return (
          <div>
            <div
            className="cursor-move "
              onMouseDown={handleMouseDown}
              style={{
                width: "100px",
                height: "100px",
                background: "blue",
                color: "black",
                textAlign: "center",
                lineHeight: "px",
                cursor: "drag",
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
          {savedImage && <img src={savedImage} alt="user uploaded" />}
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


