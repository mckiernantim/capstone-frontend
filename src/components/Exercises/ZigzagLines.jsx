import { useState, useEffect } from "react";
import artwork from "../../assets/images/JarWithZigzagPanels.jpg"
import line from "../../assets/images/ZigzagOne.png"
import "./ZigzagLines.css";

//setCompleted from section
export default function ZigzagLines({ setCompleted }) {
  //state to make the lines nondraggable and set complete 
  const [linesPlaced, setLinesPlaced] = useState({
    line1: false,
    line2: false,
  });

  //whenever a line is placed check to see if all are placed, to set complete
  useEffect(() => {
    if (linesPlaced.line1 && linesPlaced.line2) {
      setCompleted(true);
    }
  }, [linesPlaced]);

  //allow the div to accept a dropped element
  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  //what to do when starting to drag
  function handleDragStart(event) {
    event.dataTransfer.setData("image", event.target.id);
    event.dataTransfer.effectAllowed = "move";
  }

  //what to do when the picture gets dropped
  function handleDrop(event) {
    const data = event.dataTransfer.getData("image");
    event.target.appendChild(document.getElementById(data));
    //change state to reflect which line was placed
    setLinesPlaced({ ...linesPlaced, [`line${data[5]}`]: true });
  }

  return (<div className="zigzag-lines">

    <div className="interactive-container">

      <div className="image-div">

        <img src={artwork} alt="The Swing" />

        {/* the box where the line can be drag and dropped into */}
        {/* once the line is dropped in, the next button will enable */}
        <div className="empty-box first-box" onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e)}>

        </div>
        <div className="empty-box second-box" onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e)}>

        </div>

      </div>

      {/* the box the contains the line at the start */}
      <div className="starting-box">
        {/* disable the draggability if the line was placed */}
        {/* remove the rotation angle and the margins when placed */}
        <img draggable={!linesPlaced.line1} src={line} alt="zigzag line" id="line-1" className="line-1 line" onDragStart={(e) => handleDragStart(e)} style={linesPlaced.line1 ? {marginTop:"160px"} : {}}/>

        <img draggable={!linesPlaced.line2} src={line} alt="zigzag line" id="line-2" className="line-2 line" onDragStart={(e) => handleDragStart(e)} style={linesPlaced.line2 ? {marginTop:"160px"} : {}}/>
      </div>

    </div>

    <div className="content">
      <h3 className="question">Place the lines above on the areas with zigzag lines in the image above.</h3>

      <div className="credit">
        <p>Jar with Zigzag Panels, ca. 3500-3300 B.C.E.</p>
        <p>Image credit to Brooklyn Museum</p>
      </div>

    </div>
  </div>)
}