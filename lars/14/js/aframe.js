// key in url noch einbinden
import { supa } from './setup_supabase.js';


const roomColor = "white";
const warpPointColor = "#61b0b1";
const warpPointColorActive = "#abdcdd";

let newImg;
let cornerPosition;
const anzahlBilderProWand = 1;
const numberOfElements = anzahlBilderProWand * 4;
const imageWidth = 1.5;
const imageToFloor = 0.9;
const gapWidth = 2.5;
const segmentSize = imageWidth + gapWidth;
const segmentHeight = 4;
const light = true;

const roomSize = numberOfElements / 4 * segmentSize; // Adjust this value to set the size of the square room
const wallThickness = segmentSize;
const halfRoomSize = roomSize / 2;
let images = [];

let positionX;
let rotationY;
let positionZ;
let segmentPosition;
let newFloor;
let newWall;
let bigdata;

// get end of url
let url = window.location.href;
let expoID = url.substring(url.lastIndexOf('?') + 1);

console.log("expoID: ", expoID);

////////////////////////////////////////////////////////////////////////// download all image IDs for this expo from supabase
async function downloadFromFolder() {

  let { data, error } = await supa
    .from('ArtworkExposition')
    .select('*')
    .eq('expo_id', expoID);

  console.log("raw data: ", data);

  if (error) {
    console.error('Error fetching files:', error);
    return;
  }


////////////////////////////////////////////////////////////////////////// download all images from the IDs
  for (let i = 0; i < data.length; i++) {
    let { data: publicUrlData, error: publicUrlError } = await supa
      .from('Artwork')
      .select('*')
      .eq('id', data[i].artwork_id)

    if (publicUrlError) {
      console.error(`Error getting public URL for ${data[i].name}:`, publicUrlError);
      return;
    }
    images.push(publicUrlData[0].artworkURL);
  }

  bigdata = images;
  return bigdata;
}






document.querySelector('a-scene').addEventListener('loaded', async function () {
  console.log("A-Frame loaded");

  let data = await downloadFromFolder();

  console.log("data: ", data);
  for (let i = 1; i <= numberOfElements; i++) {
    //rotation erstellen
    // console.log("data ",i,": ", data[i-1]);
    if (i <= numberOfElements / 4) {                                                //Bilder auf der ersten Wand die vor einem ist wenn man spawnt
      positionX = (((anzahlBilderProWand + 1) * segmentSize) / 2) - (i * segmentSize);
      positionZ = -halfRoomSize - segmentSize / 2;
      rotationY = 0;
    } else if (i <= numberOfElements / 2) {                                         //Bilder auf der linken Wand
      positionX = -halfRoomSize - segmentSize / 2;
      positionZ = (i * segmentSize) - ((anzahlBilderProWand + 1) * segmentSize) - (halfRoomSize - segmentSize / 2);
      rotationY = 90;
    } else if (i <= (3 * numberOfElements) / 4) {                                   //Bilder auf der hinteren Wand
      positionX = (segmentSize / 2) - halfRoomSize + ((i - 1) - numberOfElements / 2) * segmentSize;
      positionZ = halfRoomSize + segmentSize / 2;
      rotationY = 180;
    } else if (i <= numberOfElements) {                                              //Bilder auf der rechten Wand
      positionX = halfRoomSize + segmentSize / 2;
      positionZ = (halfRoomSize - segmentSize / 2) - ((i - 1) - (3 * numberOfElements) / 4) * segmentSize;
      rotationY = -90;
    }


    ////////////////////////////////////////////////////////////////////////// segmente erstellen
    let segment = document.createElement("a-entity");
    // segment.setAttribute("geometry",`
    //                       primitive: box;
    //                       width: ${segmentSize};
    //                       height: ${segmentHeight};
    //                       depth: ${segmentSize};
    // `);
    // segment.setAttribute("material", "wireframe: true; color: white; wireframeLinewidth: 1;"); // Wireframe
    segment.setAttribute("position", `${positionX} ${segmentHeight / 2} ${positionZ}`);
    segment.setAttribute("rotation", `0 ${rotationY} 0`); // Set the rotation
    segment.setAttribute("id", "segment_" + i);
    data.segmentPosition = {
      x: positionX,
      y: segmentHeight / 2,
      z: positionZ
    };
    data.rotationY = rotationY;
    document.getElementById("aScene").appendChild(segment);


    ////////////////////////////////////////////////////////////////////////// Bilder erstellen
    if (data[i - 1]){
    // get image size and calculate the with to height ratio
    let image = new Image();
    image.src = data[i - 1];
    let ratio = image.width / image.height;
    let newHeight = imageWidth / ratio;

    newImg = document.createElement("a-box");
    newImg.setAttribute("src", data[i - 1]);
    newImg.setAttribute("id", "image" + i);
    newImg.setAttribute("position", `0 -${(segmentHeight / 2) - (imageWidth / 2) - imageToFloor} -${(segmentSize / 2) - 0.1}`);
    newImg.setAttribute("rotation", `0 0 0`); // Set the rotation
    newImg.setAttribute("class", "image");
    
    if (image.height > image.width) {
      newImg.setAttribute("width", (segmentHeight-imageToFloor)*ratio);
      newImg.setAttribute("height", segmentHeight-imageToFloor);
    }
    else {
      newImg.setAttribute("width", newHeight*ratio);
      newImg.setAttribute("height", newHeight);
    }

    newImg.setAttribute("depth", "0.01%");
    newImg.setAttribute("shader", "flat");
    newImg.setAttribute("shadow", "cast: true; receive: false");
    newImg.setAttribute("event-set__click", `_event: click; _target: #pawn; position: ${data.segmentPosition.x} 1.6 ${data.segmentPosition.z};`);
    document.getElementById("segment_" + i).appendChild(newImg);
    }

    ////////////////////////////////////////////////////////////////////////// Wand erstellen
    newWall = document.createElement("a-box");
    newWall.setAttribute("id", "wall_" + i);
    newWall.setAttribute("position", `0 0 -${segmentSize / 2}`);
    newWall.setAttribute("color", roomColor);
    newWall.setAttribute("width", segmentSize);
    newWall.setAttribute("height", segmentHeight);
    newWall.setAttribute("depth", "0.01%");
    newWall.setAttribute("shadow", "cast: false; receive: true");
    document.getElementById("segment_" + i).appendChild(newWall);


    ////////////////////////////////////////////////////////////////////////// Boden erstellen
    newFloor = document.createElement("a-plane");
    newFloor.setAttribute("id", "Floor_" + i);
    newFloor.setAttribute("position", `0 -${segmentHeight / 2} 0`);
    newFloor.setAttribute("color", roomColor);
    newFloor.setAttribute("width", segmentSize);
    newFloor.setAttribute("height", segmentSize);
    newFloor.setAttribute("depth", "0.01%");
    newFloor.setAttribute("rotation", "-90 0 0");
    document.getElementById("segment_" + i).appendChild(newFloor);


    ////////////////////////////////////////////////////////////////////////// WarpPoint erstellen
    if (data[i - 1]){
    let warpPoint = document.createElement("a-sphere");
    warpPoint.setAttribute("id", "warpPoint" + i);
    warpPoint.setAttribute("position", `0 0 0.1`);
    warpPoint.setAttribute("scale", "1 1 0.2");
    warpPoint.setAttribute("color", warpPointColor);
    warpPoint.setAttribute("radius", "0.5");
    warpPoint.setAttribute("depth", "0.01%");
    // warpPoint.setAttribute("opacity", "0.5");
    warpPoint.setAttribute("visible", "false");
    warpPoint.setAttribute("event-set__enter", `
                            _event: mouseenter; 
                            color: ${warpPointColorActive};
                            visible: true`);
    warpPoint.setAttribute("event-set__leave", `
                            _event: mouseleave; 
                            color: ${warpPointColor};
                            visible: false`);
    warpPoint.setAttribute("event-set__click", `
                            _event: click; 
                            _target: #pawn; 
                            position: ${data.segmentPosition.x} 1.6 ${data.segmentPosition.z};`);
    document.getElementById("Floor_" + i).appendChild(warpPoint);
    }

    ////////////////////////////////////////////////////////////////////////// Decke erstellen
    let newRoof = document.createElement("a-plane");
    newRoof.setAttribute("id", "Roof_" + i);
    newRoof.setAttribute("position", `0 ${segmentHeight / 2} 0`);
    newRoof.setAttribute("color", roomColor);
    newRoof.setAttribute("width", segmentSize);
    newRoof.setAttribute("height", segmentSize);
    newRoof.setAttribute("depth", "0.01%");
    newRoof.setAttribute("rotation", "90 0 0");
    document.getElementById("segment_" + i).appendChild(newRoof);


    ////////////////////////////////////////////////////////////////////////// Beschriftung erstellen
    // .then(data => {                                                                   
    //   let newTitle = document.createElement("a-entity");
    //   newTitle.setAttribute("text", "value: " + data.drinks[0].strDrink + "\n" + i + "; color: gray; width: 5; align: center;");
    //   newTitle.setAttribute("position", `0 -${(segmentHeight/2)-.5} -${(segmentSize/2)-.01}`);
    //   document.getElementById("segment_" + i).appendChild(newTitle);
    //   return data;
    // })


    ////////////////////////////////////////////////////////////////////////// eventlistener
    newWall.setAttribute("event-set__enter", `
                            _event: mouseenter; 
                            _target: #${"warpPoint" + i}; 
                            color: ${warpPointColor};
                            visible: true`);
    newWall.setAttribute("event-set__leave", `
                            _event: mouseleave; 
                            _target: #${"warpPoint" + i}; 
                            color: ${warpPointColor};
                            visible: false`);
    newImg.setAttribute("event-set__enter", `
                            _event: mouseenter; 
                            _target: #${"warpPoint" + i}; 
                            color: ${warpPointColorActive};
                            visible: true`);
    newImg.setAttribute("event-set__leave", `
                            _event: mouseleave; 
                            _target: #${"warpPoint" + i}; 
                            color: ${warpPointColor};
                            visible: false`);
    // newFloor.setAttribute("event-set__enter", `
    //                       _event: mouseenter; 
    //                       _target: #${"warpPoint"+i}; 
    //                       color: ${warpPointColor};
    //                       visible: true`);
    // newFloor.setAttribute("event-set__leave", `
    //                       _event: mouseleave; 
    //                       _target: #${"warpPoint"+i}; 
    //                       color: ${warpPointColor};
    //                       visible: false`);

    ////////////////////////////////////////////////////////////////////////// update the segment element 
    newWall.setAttribute("data-raycastable", true);
    newImg.setAttribute("data-raycastable", true);





    ////////////////////////////////////////////////////////////////////////// Debugging  
    console.log({
      id: "Segment " + i,
      size: {
        width:    newWall.getAttribute("width"),
        height:   newWall.getAttribute("height"),
        depth:    newWall.getAttribute("depth"),
        position: newWall.getAttribute("position"),
        scale:    newWall.getAttribute("scale"),
      }
    });
  }



  ////////////////////////////////////////////////////////////////////////// Licht erstellen
  while (light == true) {       
    let newLight = document.createElement("a-light");
    newLight.setAttribute("type", "ambient");
    newLight.setAttribute("light", "type: point; intensity: .5; castShadow: true");
    newLight.setAttribute("color", "white");
    newLight.setAttribute("intensity", "0.5");
    newLight.setAttribute("position", `0 ${segmentHeight/2} 0`);
    document.getElementById("aScene").appendChild(newLight);

    let areaLight = document.createElement("a-light");
    areaLight.setAttribute("type", "ambient");
    areaLight.setAttribute("color", "white");
    areaLight.setAttribute("intensity", "0.3");
    document.getElementById("aScene").appendChild(areaLight);
    break;
  }

  ////////////////////////////////////////////////////////////////////////// create middle floor
  let middleFloor = document.createElement("a-plane");
  middleFloor.setAttribute("id", "middleFloor");
  middleFloor.setAttribute("position", `0 0 0`);
  middleFloor.setAttribute("color", roomColor);
  middleFloor.setAttribute("width", roomSize);
  middleFloor.setAttribute("height", roomSize);
  middleFloor.setAttribute("rotation", "-90 0 0");
  document.getElementById("aScene").appendChild(middleFloor);
  ////////////////////////////////////////////////////////////////////////// create middle roof
  let middleRoof = document.createElement("a-plane");
  middleRoof.setAttribute("id", "middleRoof");
  middleRoof.setAttribute("position", `0 ${segmentHeight} 0`);
  middleRoof.setAttribute("color", roomColor);
  middleRoof.setAttribute("width", roomSize);
  middleRoof.setAttribute("height", roomSize);
  middleRoof.setAttribute("rotation", "90 0 0");
  document.getElementById("aScene").appendChild(middleRoof);

  ////////////////////////////////////////////////////////////////////////// create camera rig
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




  ////////////////////////////////////////////////////////////////////////// create corners
  for (let i = 1; i <= 4; i++) {
    if (i == 1) {
      cornerPosition = `${halfRoomSize + segmentSize / 2} ${segmentHeight / 2} -${halfRoomSize + segmentSize / 2}`;
      rotationY = 0;
    } else if (i == 2) {
      cornerPosition = `-${halfRoomSize + segmentSize / 2} ${segmentHeight / 2} -${halfRoomSize + segmentSize / 2}`;
      rotationY = 90;
    } else if (i == 3) {
      cornerPosition = `-${halfRoomSize + segmentSize / 2} ${segmentHeight / 2} ${halfRoomSize + segmentSize / 2}`;
      rotationY = 180;
    } else if (i == 4) {
      cornerPosition = `${halfRoomSize + segmentSize / 2} ${segmentHeight / 2} ${halfRoomSize + segmentSize / 2}`;
      rotationY = -90;
    }

    let cornerEntity = document.createElement("a-entity");
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


    let cornerWall = document.createElement("a-box");
    cornerWall.setAttribute("id", "cornerWallLeft_" + i);
    cornerWall.setAttribute("position", `0 0 -${segmentSize / 2}`);
    cornerWall.setAttribute("color", roomColor);
    cornerWall.setAttribute("width", segmentSize);
    cornerWall.setAttribute("height", segmentHeight);
    cornerWall.setAttribute("depth", "0.01%");
    cornerWall.setAttribute("shadow", "cast: false; receive: true");
    document.getElementById("corner_" + i).appendChild(cornerWall);

    let secondCornerWall = document.createElement("a-box");
    // secondCornerWall.setAttribute("id", "secondCornerWall_" + i);
    secondCornerWall.setAttribute("position", `${segmentSize / 2} 0 0`);
    secondCornerWall.setAttribute("rotation", "0 90 0");
    secondCornerWall.setAttribute("color", roomColor);
    secondCornerWall.setAttribute("width", segmentSize);
    secondCornerWall.setAttribute("height", segmentHeight);
    secondCornerWall.setAttribute("depth", "0.01%");
    secondCornerWall.setAttribute("shadow", "cast: false; receive: true");
    document.getElementById("corner_" + i).appendChild(secondCornerWall);

    let cornerFloor = document.createElement("a-plane");
    // cornerFloor.setAttribute("id", "cornerFloor_" + i);
    cornerFloor.setAttribute("position", `0 -${segmentHeight / 2} 0`);
    cornerFloor.setAttribute("rotation", "-90 0 0");
    cornerFloor.setAttribute("color", roomColor);
    cornerFloor.setAttribute("width", segmentSize);
    cornerFloor.setAttribute("height", segmentSize);
    cornerFloor.setAttribute("depth", "0.01%");
    cornerFloor.setAttribute("shadow", "cast: false; receive: true");
    document.getElementById("corner_" + i).appendChild(cornerFloor);

    let cornerRoof = document.createElement("a-plane");
    // cornerRoof.setAttribute("id", "cornerRoof_" + i);
    cornerRoof.setAttribute("position", `0 ${segmentHeight / 2} 0`);
    cornerRoof.setAttribute("rotation", "90 0 0");
    cornerRoof.setAttribute("color", roomColor);
    cornerRoof.setAttribute("width", segmentSize);
    cornerRoof.setAttribute("height", segmentSize);
    cornerRoof.setAttribute("depth", "0.01%");
    cornerRoof.setAttribute("shadow", "cast: false; receive: true");
    document.getElementById("corner_" + i).appendChild(cornerRoof);
  }


});




////////////////////////////////////////////////////////////////////////// collision simulation
AFRAME.registerComponent('check-coordinates', {
  tick: function () {
    // Get the element you want to check
    var thing = this.el;


    // Get the element with the ID "segment_1"
    var segment1 = document.getElementById("segment_1");

    if (segment1) {
      // Get the x position of "segment_1"
      var zPosition = segment1.getAttribute('position').z;
    }
    let range = zPosition - segmentSize / 2 + 0.3;
    // Define your desired range for x and z coordinates
    var xRangeStart = -range;
    var zRangeStart = -range;
    var xRangeEnd = range;
    var zRangeEnd = range;

    // Get the current position
    var currentPosition = thing.getAttribute('position');

    if (currentPosition.x > xRangeStart) {
      thing.setAttribute('position', `${currentPosition.x - 0.1} 1.6 ${currentPosition.z}`);
      console.log("Over range z");
    }
    else if (currentPosition.x < xRangeEnd) {
      thing.setAttribute('position', `${currentPosition.x + 0.1} 1.6 ${currentPosition.z}`);
      console.log("Under range z");
    }
    if (currentPosition.z > zRangeStart) {
      thing.setAttribute('position', `${currentPosition.x} 1.6 ${currentPosition.z - 0.1}`);
      console.log("Over range x");
    }
    else if (currentPosition.z < zRangeEnd) {
      thing.setAttribute('position', `${currentPosition.x} 1.6 ${currentPosition.z + 0.1}`);
      console.log("Under range x");
    }
    // Check if the x and z coordinates are outside the desired range
    // if (Math.abs(currentPosition.z) > zRangeStart) {
    //   // If outside the range, reset the position
    //   thing.setAttribute('position', `0 1.6 ${currentPosition.z+0.1}`); // Change this to your desired reset position
    //   console.log("Out of bounds");
    // }
  }
});
