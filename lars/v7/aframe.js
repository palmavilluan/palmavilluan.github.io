const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/random.php'

const roomColor = "white";
const warpPointColor = "grey";
const warpPointColorActive = "#61b0b1";

let newImg;
let cornerPosition;
let rotationY;
const anzahlBilderProWand = 3;
const numberOfElements = anzahlBilderProWand * 4;
const imageWidth = 1.5;
const imageToFloor = 0.9;
const gapWidth = 2.5;
const segmentSize = imageWidth + gapWidth;
const segmentHeight = 4;
const light = true;

const roomSize = numberOfElements/4 * segmentSize; // Adjust this value to set the size of the square room



const wallThickness = segmentSize;
const halfRoomSize = roomSize / 2;




for (let i = 1; i <= numberOfElements; i++) {

  fetch(apiUrl)
  .then(response => response.json())

  .then(data => {                                                                   //rotation erstellen
    if (i <= numberOfElements / 4) {                                                //Bilder auf der ersten Wand die vor einem ist wenn man spawnt
      positionX = (((anzahlBilderProWand+1) * segmentSize)/2) - (i * segmentSize) ;
      positionZ = -halfRoomSize-segmentSize/2;
      rotationY = 0;
    } else if (i <= numberOfElements / 2) {                                         //Bilder auf der linken Wand
      positionX = -halfRoomSize - segmentSize/2;
      positionZ = (i * segmentSize) - ((anzahlBilderProWand+1) * segmentSize) - (halfRoomSize-segmentSize/2);
      rotationY = 90;
    } else if (i <= (3 * numberOfElements) / 4) {                                   //Bilder auf der hinteren Wand
      positionX = (segmentSize/2)-halfRoomSize + ((i-1) - numberOfElements / 2) * segmentSize;
      positionZ = halfRoomSize+segmentSize/2;
      rotationY = 180;
    } else if (i <= numberOfElements){                                              //Bilder auf der rechten Wand
      positionX = halfRoomSize+segmentSize/2;
      positionZ = (halfRoomSize-segmentSize/2) - ((i-1) - (3 * numberOfElements) / 4) * segmentSize;
      rotationY = -90;
    }
    return {data, positionX, positionZ, rotationY};
  })

  

  .then(data => {                                                                   //segmente erstellen
    data = data.data; 

    segment = document.createElement("a-entity");
    // segment.setAttribute("geometry",`
    //                       primitive: box;
    //                       width: ${segmentSize};
    //                       height: ${segmentHeight};
    //                       depth: ${segmentSize};
    // `);
    // segment.setAttribute("material", "wireframe: true; color: white; wireframeLinewidth: 1;"); // Wireframe
    segment.setAttribute("position", `${positionX} ${segmentHeight/2} ${positionZ}`);
    segment.setAttribute("rotation", `0 ${rotationY} 0`); // Set the rotation
    segment.setAttribute("id", "segment_" + i);
    data.segmentPosition = {
      x: positionX,
      y: segmentHeight / 2,
      z: positionZ
    };
    data.rotationY = rotationY;

  
    document.getElementById("aScene").appendChild(segment);
    return data;
  })


  .then(data => {                                                                   //Bilder erstellen

    newImg = document.createElement("a-box");
    newImg.setAttribute("src", data.drinks[0].strDrinkThumb);
    newImg.setAttribute("id", "image" + i);
    

    // Rest of your code remains the same, just update the position attributes
    newImg.setAttribute("position", `0 -${(segmentHeight/2)-(imageWidth/2)-imageToFloor} -${(segmentSize/2)-0.1}`);
    newImg.setAttribute("rotation", `0 0 0`); // Set the rotation
    newImg.setAttribute("color", "white");
    newImg.setAttribute("class", "image");
    newImg.setAttribute("width", imageWidth);
    newImg.setAttribute("height", imageWidth);
    newImg.setAttribute("depth", "0.01%");
    newImg.setAttribute("shader", "flat");
    newImg.setAttribute("shadow", "cast: true; receive: false");
    document.getElementById("segment_" + i).appendChild(newImg);
    return data;
  })

  .then(data => {                                                                   //Wand erstellen
    newWall = document.createElement("a-box");
    newWall.setAttribute("id", "wall_" + i);
    newWall.setAttribute("position", `0 0 -${segmentSize/2}`);
    newWall.setAttribute("color", roomColor);
    newWall.setAttribute("width", segmentSize);
    newWall.setAttribute("height", segmentHeight);
    newWall.setAttribute("depth", "0.01%");
    newWall.setAttribute("shadow", "cast: false; receive: true");
    document.getElementById("segment_" + i).appendChild(newWall);
    return data;
  })

  .then(data => {                                                                   //Boden erstellen
    newFloor = document.createElement("a-plane");
    newFloor.setAttribute("id", "Floor_" + i);
    newFloor.setAttribute("position", `0 -${segmentHeight/2} 0`);
    newFloor.setAttribute("color", roomColor);
    newFloor.setAttribute("width", segmentSize);
    newFloor.setAttribute("height", segmentSize);
    newFloor.setAttribute("depth", "0.01%");
    newFloor.setAttribute("rotation", "-90 0 0");
    document.getElementById("segment_" + i).appendChild(newFloor);
    return data;
  })

  .then(data => {                                                                   //Warppoint erstellen
    warpPoint = document.createElement("a-sphere");
    warpPoint.setAttribute("id", "warpPoint" + i);
    warpPoint.setAttribute("position", `0 0 0.1`);
    warpPoint.setAttribute("scale", "1 1 0.2");
    warpPoint.setAttribute("color", warpPointColor);
    warpPoint.setAttribute("radius", "0.5");
    warpPoint.setAttribute("depth", "0.01%");
    warpPoint.setAttribute("opacity", "0.5");
    warpPoint.setAttribute("visible", "false");
    warpPoint.setAttribute("event-set__enter", `
                          _event: mouseenter; 
                          color: ${warpPointColorActive};
                          visible: true`);
    warpPoint.setAttribute("event-set__leave", `
                          _event: mouseleave; 
                          color: ${warpPointColor};
                          visible: false`);
    
    warpPoint.setAttribute("event-set__click", `_event: click; _target: #pawn; position: ${data.segmentPosition.x} 1.6 ${data.segmentPosition.z};`);
    document.getElementById("Floor_" + i).appendChild(warpPoint);
    return data;
  })

  .then(data => {                                                                   //Decke erstellen
    newRoof = document.createElement("a-plane");
    newRoof.setAttribute("id", "Roof_" + i);
    newRoof.setAttribute("position", `0 ${segmentHeight/2} 0`);
    newRoof.setAttribute("color", roomColor);
    newRoof.setAttribute("width", segmentSize);
    newRoof.setAttribute("height", segmentSize);
    newRoof.setAttribute("depth", "0.01%");
    newRoof.setAttribute("rotation", "90 0 0");
    document.getElementById("segment_" + i).appendChild(newRoof);
    return data;
  })

  .then(data => {                                                                   //Beschriftung erstellen
    newTitle = document.createElement("a-entity");
    newTitle.setAttribute("text", "value: " + data.drinks[0].strDrink + "\n" + i + "; color: gray; width: 5; align: center;");
    newTitle.setAttribute("position", `0 -${(segmentHeight/2)-.5} -${(segmentSize/2)-.01}`);
    document.getElementById("segment_" + i).appendChild(newTitle);
    return data;
  })

  .then(data => {                                                                   
    newWall.setAttribute("event-set__enter", `
                          _event: mouseenter; 
                          _target: #${"warpPoint"+i}; 
                          color: ${warpPointColor};
                          visible: true`);
    newWall.setAttribute("event-set__leave", `
                          _event: mouseleave; 
                          _target: #${"warpPoint"+i}; 
                          color: ${warpPointColor};
                          visible: false`);
    newImg.setAttribute("event-set__enter", `
                          _event: mouseenter; 
                          _target: #${"warpPoint"+i}; 
                          color: ${warpPointColor};
                          visible: true`);
    newImg.setAttribute("event-set__leave", `
                          _event: mouseleave; 
                          _target: #${"warpPoint"+i}; 
                          color: ${warpPointColor};
                          visible: false`);

    //update the segment element 
    newWall.setAttribute("data-raycastable", true);
    newImg.setAttribute("data-raycastable", true);

    return data;
  })



  .then(data => {                                                                   //Debugging  
    console.log({
      id: "Segment " + i,
      strDrink: data.drinks[0].strDrink,
      size: {
        width: newWall.getAttribute("width"),
        height: newWall.getAttribute("height"),
        depth: newWall.getAttribute("depth"),
        position: newWall.getAttribute("position"),
        scale: newWall.getAttribute("scale"),
      }
    });
  })

  .catch(error => {
    // Handle any errors that occur during the fetch
    console.error('Something went wrong somewhere', error);
  });
};




while(light == true){                                                           //Licht erstellen        
  newLight = document.createElement("a-light");
  newLight.setAttribute("type", "ambient");
  newLight.setAttribute("light", "type: point; intensity: .5; castShadow: true");
  newLight.setAttribute("color", "white");
  newLight.setAttribute("intensity", "0.5");
  newLight.setAttribute("position", "0 5 0");
  document.getElementById("aScene").appendChild(newLight);

  areaLight = document.createElement("a-light");
  areaLight.setAttribute("type", "ambient");
  areaLight.setAttribute("color", "white");
  areaLight.setAttribute("intensity", "0.3");
  document.getElementById("aScene").appendChild(areaLight);
  break;
}

//create middle floor
middleFloor = document.createElement("a-plane");
middleFloor.setAttribute("id", "middleFloor");
middleFloor.setAttribute("position", `0 0 0`);
middleFloor.setAttribute("color", roomColor);
middleFloor.setAttribute("width", roomSize);
middleFloor.setAttribute("height", roomSize);
middleFloor.setAttribute("rotation", "-90 0 0");
document.getElementById("aScene").appendChild(middleFloor);
//create middle roof
middleRoof = document.createElement("a-plane");
middleRoof.setAttribute("id", "middleRoof");
middleRoof.setAttribute("position", `0 ${segmentHeight} 0`);
middleRoof.setAttribute("color", roomColor);
middleRoof.setAttribute("width", roomSize);
middleRoof.setAttribute("height", roomSize);
middleRoof.setAttribute("rotation", "90 0 0");
document.getElementById("aScene").appendChild(middleRoof);

// //create camera rig
// Rig = document.createElement("a-entity");
// Rig.setAttribute("id", "Rig");
// Rig.setAttribute("position", `0 0 0`);
// Rig.setAttribute("rotation", `0 180 0`);
// document.getElementById("aScene").appendChild(Rig);
// //create camera in rig
// pawn = document.createElement("a-camera");
// pawn.setAttribute("id", "pawn");
// pawn.setAttribute("position", `0 1.6 0`);
// document.getElementById("Rig").appendChild(pawn);



AFRAME.registerComponent('change-color-on-hover', {
  schema: {
    color: {default: 'blue'}
  },

  init: function () {
    var data = this.data;
    var el = this.el;  // <a-box>
    var defaultColor = el.getAttribute('material').color;

    el.addEventListener('mouseenter', function () {
      el.setAttribute('color', data.color);
    });

    el.addEventListener('mouseleave', function () {
      el.setAttribute('color', defaultColor);
    });

    el.addEventListener('click', function () {
      const oldcameraEntity = document.getElementById("pawn");
      const oldcameraPosition = oldcameraEntity.object3D.position;
      console.log("old Camera Position:", oldcameraPosition.x, oldcameraPosition.y, oldcameraPosition.z);
      el.setAttribute('color', "red");
      pawn.setAttribute("position", "0 1.6 0");
      const cameraEntity = document.getElementById("pawn");
      const cameraPosition = cameraEntity.object3D.position;
      console.log("Camera Position:", cameraPosition.x, cameraPosition.y, cameraPosition.z);
    } );
  }
});



//create corners
for(let i=1; i <= 4; i++){
  if (i == 1) {
    cornerPosition = `${halfRoomSize+segmentSize/2} ${segmentHeight/2} -${halfRoomSize+segmentSize/2}`;
    rotationY = 0;
  } else if (i == 2) {
    cornerPosition = `-${halfRoomSize+segmentSize/2} ${segmentHeight/2} -${halfRoomSize+segmentSize/2}`;
    rotationY = 90;
  } else if (i == 3) {
    cornerPosition = `-${halfRoomSize+segmentSize/2} ${segmentHeight/2} ${halfRoomSize+segmentSize/2}`;
    rotationY = 180;
  } else if (i == 4){
    cornerPosition = `${halfRoomSize+segmentSize/2} ${segmentHeight/2} ${halfRoomSize+segmentSize/2}`;
    rotationY = -90;
  }

  cornerEntity = document.createElement("a-entity");
  cornerEntity.setAttribute("id", "corner_" + i);
  cornerEntity.setAttribute("position", cornerPosition);
  cornerEntity.setAttribute("rotation", `0 ${rotationY} 0`);
  // cornerEntity.setAttribute("geometry",`
  //                     primitive: box;
  //                     width: ${segmentSize};
  //                     height: ${segmentHeight};
  //                     depth: ${segmentSize};
  // `);
  // cornerEntity.setAttribute("material", "wireframe: true; color: white; wireframeLinewidth: 1;"); // Wireframe
  document.getElementById("aScene").appendChild(cornerEntity);


  cornerWall = document.createElement("a-box");
  cornerWall.setAttribute("id", "cornerWallLeft_" + i);
  cornerWall.setAttribute("position", `0 0 -${segmentSize/2}`);
  cornerWall.setAttribute("color", roomColor);
  cornerWall.setAttribute("width", segmentSize);
  cornerWall.setAttribute("height", segmentHeight);
  cornerWall.setAttribute("depth", "0.01%");
  cornerWall.setAttribute("shadow", "cast: false; receive: true");
  document.getElementById("corner_" + i).appendChild(cornerWall);

  cornerWall = document.createElement("a-box");
  // cornerWall.setAttribute("id", "cornerWall_" + i);
  cornerWall.setAttribute("position", `${segmentSize/2} 0 0`);
  cornerWall.setAttribute("rotation", "0 90 0");
  cornerWall.setAttribute("color", roomColor);
  cornerWall.setAttribute("width", segmentSize);
  cornerWall.setAttribute("height", segmentHeight);
  cornerWall.setAttribute("depth", "0.01%");
  cornerWall.setAttribute("shadow", "cast: false; receive: true");
  document.getElementById("corner_" + i).appendChild(cornerWall);

  cornerFloor = document.createElement("a-plane");
  // cornerFloor.setAttribute("id", "cornerFloor_" + i);
  cornerFloor.setAttribute("position", `0 -${segmentHeight/2} 0`);
  cornerFloor.setAttribute("rotation", "-90 0 0");
  cornerFloor.setAttribute("color", roomColor);
  cornerFloor.setAttribute("width", segmentSize);
  cornerFloor.setAttribute("height", segmentSize);
  cornerFloor.setAttribute("depth", "0.01%");
  cornerFloor.setAttribute("shadow", "cast: false; receive: true");
  document.getElementById("corner_" + i).appendChild(cornerFloor);

  cornerFloor = document.createElement("a-plane");
  // cornerFloor.setAttribute("id", "cornerFloor_" + i);
  cornerFloor.setAttribute("position", `0 ${segmentHeight/2} 0`);
  cornerFloor.setAttribute("rotation", "90 0 0");
  cornerFloor.setAttribute("color", roomColor);
  cornerFloor.setAttribute("width", segmentSize);
  cornerFloor.setAttribute("height", segmentSize);
  cornerFloor.setAttribute("depth", "0.01%");
  cornerFloor.setAttribute("shadow", "cast: false; receive: true");
  document.getElementById("corner_" + i).appendChild(cornerFloor);
}





