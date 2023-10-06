const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/random.php'

const roomColor = "white";

let newImg;
const anzahlBilderProWand = 3;
const numberOfElements = anzahlBilderProWand * 4;
const imageWidth = 1;
const gapWidth = 2.5;
const segmentSize = imageWidth + gapWidth;
const segmentHeight = 8;
const light = true;

const roomSize = numberOfElements/4 * segmentSize; // Adjust this value to set the size of the square room
const halfRoomSize = roomSize / 2;


function createWall(wallId, positionX, positionZ, rotationY) {
  let newWall = document.createElement("a-box");
  newWall.setAttribute("id", wallId);
  newWall.setAttribute("position", `${positionX} ${segmentHeight/2} ${positionZ-segmentSize/2}`);
  newWall.setAttribute("rotation", `0 ${rotationY} 0`);
  newWall.setAttribute("color", roomColor);
  newWall.setAttribute("width", segmentSize-.01);
  newWall.setAttribute("height", segmentHeight);
  newWall.setAttribute("depth", "0.01%");
  newWall.setAttribute("shadow", "cast: false; receive: true");
  document.getElementById("aScene").appendChild(newWall);
}

function createFloor(floorId, positionX, positionZ) {
  let newFloor = document.createElement("a-plane");
  newFloor.setAttribute("id", floorId);
  newFloor.setAttribute("position", `${positionX} 0 ${positionZ}`);
  newFloor.setAttribute("color", roomColor);
  newFloor.setAttribute("width", segmentSize);
  newFloor.setAttribute("height", segmentSize);
  newFloor.setAttribute("depth", "0.01%");
  newFloor.setAttribute("rotation", `-90 0 0`);
  document.getElementById("aScene").appendChild(newFloor);
}

function createRoof(roofId, positionX, positionZ) {
  let newRoof = document.createElement("a-plane");
  newRoof.setAttribute("id", roofId);
  newRoof.setAttribute("position", `${positionX} ${segmentHeight} ${positionZ}`);
  newRoof.setAttribute("color", roomColor);
  newRoof.setAttribute("width", segmentSize);
  newRoof.setAttribute("height", segmentSize);
  newRoof.setAttribute("depth", "0.01%");
  newRoof.setAttribute("rotation", `90 0 0`);
  document.getElementById("aScene").appendChild(newRoof);
}

function createSegment(segmentId, positionX, positionZ, rotationY, i) {
  let segment = document.createElement("a-entity");
  segment.setAttribute("position", `${positionX} ${segmentHeight / 2} ${positionZ}`);
  segment.setAttribute("rotation", `0 ${rotationY} 0`);
  segment.setAttribute("id", segmentId);
  segment.setAttribute("geometry",`
                        primitive: box;
                        width: ${segmentSize};
                        height: ${segmentHeight};
                        depth: ${segmentSize};
  `);
  segment.setAttribute("material", "wireframe: true; color: white; wireframeLinewidth: 1;"); // Wireframe
  

  // Create and add the wall
  const wallId = `${segmentId}_wall`;
  createWall(wallId, positionX, positionZ);
  
  // Create and add the floor
  const floorId = `${segmentId}_floor`;
  createFloor(floorId, positionX, positionZ); // Assuming no rotation for the floor
  
  // Create and add the roof
  const roofId = `${segmentId}_roof`;
  createRoof(roofId, positionX, positionZ); // Assuming no rotation for the roof

  document.getElementById("aScene").appendChild(segment);
}


for (let i = 1; i <= numberOfElements; i++) {

  fetch(apiUrl)
  .then(response => response.json())

  .then(data => {                                                                   //rotation erstellen
    if (i <= numberOfElements / 4) {
      positionX = halfRoomSize - ((i) - .5) * segmentSize;
      positionZ = -halfRoomSize;
      rotationY = 0;
    } else if (i <= numberOfElements / 2) {
      positionX = -halfRoomSize - segmentSize;
      positionZ = -halfRoomSize + ((i) - numberOfElements / 4) * segmentSize;
      rotationY = 90;
    } else if (i <= (3 * numberOfElements) / 4) {
      positionX = - halfRoomSize + ((i-1) - numberOfElements / 2) * segmentSize;
      positionZ = halfRoomSize+segmentSize;
      rotationY = 180;
    } else if (i <= numberOfElements){
      positionX = halfRoomSize;
      positionZ = halfRoomSize - ((i-1) - (3 * numberOfElements) / 4) * segmentSize;
      rotationY = -90;
    }
    return {data, positionX, positionZ, rotationY};
  })

  .then(({data, positionX, positionZ, rotationY}) => {                              //segment erstellen
    // createSegment("segment_" + i, positionX, positionZ, rotationY, i);
    createWall("wall_" + i, positionX, positionZ, rotationY);
    createFloor("floor_" + i, positionX, positionZ);
    createRoof("roof_" + i, positionX, positionZ);
    return data;
  })

  .catch(error => {
    // Handle any errors that occur during the fetch
    console.error('Something went wrong with fetching the data', error);
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


// corner = document.createElement("a-entity");
// cornerWall = document.createElement("a-box");
// // cornerWall.setAttribute("id", "cornerWall_" + i);
// cornerWall.setAttribute("position", `${segmentSize/2} ${segmentHeight/2} -${segmentSize}`);
// cornerWall.setAttribute("color", "red");
// cornerWall.setAttribute("width", segmentSize);
// cornerWall.setAttribute("height", segmentHeight);
// cornerWall.setAttribute("depth", "0.01%");
// cornerWall.setAttribute("shadow", "cast: false; receive: true");
// document.getElementById("aScene").appendChild(cornerWall);
