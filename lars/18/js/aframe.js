import { supa } from './setup_supabase.js';
import { main } from './overlay.js';

const roomColor = "white";
const warpPointColor = "#61b0b1";
const warpPointColorActive = "#abdcdd";

const imageWidth = 1.5;
const gapWidth = 2.5;
const segmentSize = imageWidth + gapWidth;
const segmentHeight = 4;
let light = true;

let imageData = [];

const homePositionOfCamera = "0 0 0";

let bigdata = {};





document.querySelector('a-scene').addEventListener('loaded', async function () {
  const expoHash = getExpoHashFromURL();

  if (Array.isArray(expoHash)) {
    for (let hash of expoHash) {
        bigdata = await processExpoHash(hash);
    }
  } else {
    bigdata = await processExpoHash(expoHash);
  }
  
  // const    expoID = await getExpoIDFromHash(expoHash);
  // const   bigdata = await getImagesFromSupabase(expoID);

  async function processExpoHash(hash) {
    const expoID = await getExpoIDFromHash(hash);
    bigdata = await getImagesFromSupabase(expoID);
    // Processing the data for each expo hash...
    // Include the logic to handle the data returned by getImagesFromSupabase
    return bigdata;
  }
    

  console.log("bigdata: ", bigdata);
  // aufteilung der daten
  let data = bigdata.imageData;
  const expoData = bigdata.expoData;
  const expoOrganizerData = bigdata.expoOrganizerData;
  console.log("expoData: ", expoData);
  const numberOfElements = bigdata.numberOfElements;
  // aufteilung der daten 

  // erstellen der logischen daten
  const anzahlBilderProWand = Math.ceil(numberOfElements / 4);
  const roomSize = numberOfElements / 4 * segmentSize; 
  const halfRoomSize = roomSize / 2;
  // erstellen der logischen daten 

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////// Things that happen for each image ///////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  for (let i = 1; i <= numberOfElements; i++) {
    const { positionX, rotationY, positionZ } = createRotationAndPosition(i, numberOfElements, anzahlBilderProWand, segmentSize, halfRoomSize);
                                         data = createSegment(i, data, positionX, rotationY, positionZ);
                                                createImage(i, data, segmentSize, segmentHeight);
                                                createWallBehindImage(i, segmentSize, segmentHeight);
                                                createFloorAndRoof(i, segmentSize, segmentHeight, roomColor);
                                                createWarpPoint(i, data, warpPointColor);
                                                // createLabel(i, data, segmentSize, segmentHeight);
                                                // createNavigationButtons(i, data);
  }


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// Things that happen no matter how many images //////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  createBasicRoomLight(segmentHeight, light);
  finishTheRoom(roomSize, segmentHeight, halfRoomSize, segmentSize, roomColor, light);

  connectingTheOverlays(expoData, homePositionOfCamera);

console.log("expoData: ", expoData);
console.log("expoOrganizerData: ", expoOrganizerData[0].orgaName);
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////// Calling the Js file for styling overlay ////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  main(expoData[0].expoName, expoOrganizerData[0].orgaName, expoData[0].expoDate);
});





/////////////////////////////////////////////////// get images from supabase ///////////////////////////////////////////////
async function getImagesFromSupabase(expoID) {
  //get all IDs for the expo
  let { data, error } = await supa
    .from('ArtworkExposition')
    .select('*')
    .eq('expo_id', expoID);


  if (error) {
    console.error('Error fetching files:', error);
    return;
  }


  //get all images from the IDs
  for (let i = 0; i < data.length; i++) {
    let { data: publicUrlData, error: publicUrlError } = await supa
      .from('Artwork')
      .select('*')
      .eq('id', data[i].artwork_id)

    if (publicUrlError) {
      console.error(`Error getting public URL for ${data[i].name}:`, publicUrlError);
      return;
    }
    imageData.push(publicUrlData[0]);
  }


  // get expo data from expoID
  let { data: expoData, error: expoError } = await supa
    .from('Exposition')
    .select('*')
    .eq('id', expoID);

  if (expoError) {
    console.error('Error fetching files:', expoError);
    return;
  }

  let { data: expoOrganizerData, error: expoOrganizerError } = await supa
    .from('Organisation')
    .select('*')
    .eq('id', expoData[0].orga_id);
  if (expoOrganizerError) {
    console.error('Error fetching files:', expoOrganizerError);
    return;
  }

  const dataLength = imageData.length;
  const numberOfElements = Math.max(4 * Math.ceil(dataLength / 4), dataLength);
  // console.log("numberOfElements: ", numberOfElements)
  // console.log("data", data);
  return {imageData, numberOfElements, expoData, expoOrganizerData};
}////////////////////////////////////////////////// get all images from supabase ende -------------------------------------

/////////////////////////////////////////////////// get expoHash from URL //////////////////////////////////////////////////
function getExpoHashFromURL() {
  let url = window.location.href;
  let expoHash = url.substring(url.lastIndexOf('?') + 1);
  expoHash = expoHash.replace(/%20/g, "");

  // Überprüfe, ob die URL bereits eine Expo-ID hat
  if (expoHash == url) {
    // Prompt for user input
    let userInput = prompt("Bitte geben Sie die Nummer der gewünschten Expo ein:");

    // Wenn der Benutzer die Eingabe abbricht oder nichts eingibt
    if (userInput == null || userInput.trim() === "") {
      // Füge "?1" an die aktuelle URL an
      window.location.href = url + '?red,blue';
    } else {
      // Wenn der Benutzer eine gültige Eingabe macht, aktualisiere die URL
      window.location.href = url + '?' + userInput;
    }
  }
  if (expoHash.includes('lightoff')) {
    light = false;
    expoHash = expoHash.replace(/lightoff/g, "");
  }
  if (expoHash.includes(',')) {
    // wenn die url , enthält, dann gib beide als array zurück
    expoHash = expoHash.split(',');
  }
  
  return expoHash;
}////////////////////////////////////////////////// get expoHash from URL ende ---------------------------------------------

/////////////////////////////////////////////////// get expoID from expoHash ///////////////////////////////////////////////
async function getExpoIDFromHash(expoHash) {
  let { data: rawExpoData, error } = await supa
    .from('Exposition')
    .select('*')
    .eq('expoHash', expoHash);

  if (error) {
    console.error('Error fetching files:', error);
  }
  let expoID = rawExpoData[0].id;
  return expoID;
}////////////////////////////////////////////////// get expoID from expoHash ende ------------------------------------------

/////////////////////////////////////////////////// create rotation and position ///////////////////////////////////////////
function createRotationAndPosition(i, numberOfElements, anzahlBilderProWand, segmentSize, halfRoomSize) {
  let positionX, rotationY, positionZ; // Local variables

  // Bilder auf der ersten Wand die vor einem ist wenn man spawnt
  if (i <= numberOfElements / 4) {
    positionX = (((anzahlBilderProWand + 1) * segmentSize) / 2) - (i * segmentSize);
    positionZ = -halfRoomSize - segmentSize / 2;
    rotationY = 0;
  } 
  // Bilder auf der linken Wand
  else if (i <= numberOfElements / 2) {
    positionX = -halfRoomSize - segmentSize / 2;
    positionZ = (i * segmentSize) - ((anzahlBilderProWand + 1) * segmentSize) - (halfRoomSize - segmentSize / 2);
    rotationY = 90;
  } 
  // Bilder auf der hinteren Wand
  else if (i <= (3 * numberOfElements) / 4) {
    positionX = (segmentSize / 2) - halfRoomSize + ((i - 1) - numberOfElements / 2) * segmentSize;
    positionZ = halfRoomSize + segmentSize / 2;
    rotationY = 180;
  } 
  // Bilder auf der rechten Wand
  else if (i <= numberOfElements) {
    positionX = halfRoomSize + segmentSize / 2;
    positionZ = (halfRoomSize - segmentSize / 2) - ((i - 1) - (3 * numberOfElements) / 4) * segmentSize;
    rotationY = -90;
  }

  return { positionX, rotationY, positionZ };
}////////////////////////////////////////////////// create rotation and position ende --------------------------------------

/////////////////////////////////////////////////// create segment /////////////////////////////////////////////////////////
function createSegment(i, data, positionX, rotationY, positionZ) {
  let segment = document.createElement("a-entity");
    // // for debugging a border around the segment
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
    data["segment_" + i] = {
      x: positionX,
      y: segmentHeight / 2,
      z: positionZ
    };
    data.rotationY = rotationY;
  document.getElementById("aScene").appendChild(segment);
  return data;
}////////////////////////////////////////////////// segmente erstellen ende ------------------------------------------------

/////////////////////////////////////////////////// Bilder erstellen ///////////////////////////////////////////////////////
function createImage(i, data, segmentSize, segmentHeight) {

  if (data[i - 1]){
    let image = new Image();
    image.src = data[i - 1].artworkURL;
    let ratio = image.width / image.height;

    let newImg = document.createElement("a-box");
      newImg.setAttribute("src", image.src);
      newImg.setAttribute("id", "image" + i);
      newImg.setAttribute("rotation", `0 0 0`);
      newImg.setAttribute("class", "image target");
      
      if (image.height > image.width) { //hochformat
        newImg.setAttribute("position", `0 0 -${(segmentSize / 2) - 0.03}`);
        newImg.setAttribute("width", (segmentHeight/1.5)*ratio);
        newImg.setAttribute("height", segmentHeight/1.5);
      }
      else {                            //querformat
        newImg.setAttribute("position", `0 0 -${(segmentSize / 2) - 0.03}`);
        newImg.setAttribute("width", (segmentSize*0.8));
        newImg.setAttribute("height", (segmentSize*0.8)/ratio);
      }
      newImg.setAttribute("depth", "0.001");
      newImg.setAttribute("shader", "flat");
      newImg.setAttribute("shadow", "cast: true; receive: false");
      newImg.setAttribute("data-raycastable", true);
      // newImg.addEventListener('click', function() {
      //   // Get the current value of the 'active' attribute
      //   let RigCamera = document.querySelector('#pawn').getAttribute('active');
      //   let imageCamActive = document.querySelector('#camera_'+i).getAttribute('active');
      //   let newPosition = document.querySelector('#segment_'+i).getAttribute('position');
      
      //   // Switch the boolean value to its opposite
      //   RigCamera = RigCamera === 'true' ? 'false' : 'true';
      //   imageCamActive = imageCamActive === 'true' ? 'false' : 'true';

      //   console.log("this: ", this, '\n', "RigCamera: ", RigCamera, '\n', "imageCamActive: ", imageCamActive, '\n', "newPosition: ", newPosition);
        
      //   if (imageCamActive == 'true') {
      //     let infoBox = document.querySelector('#currentImageInfo');
      //     infoBox.style.display = 'block';
      //     infoBox.innerHTML = `
      //       <h1>${data[i-1].title}</h1>
      //       <h6>${data[i-1].artistName}</h6>
      //       <p>${data[i-1].description}</p>
      //     `;

      //   } else {
      //     document.querySelector('#currentImageInfo').style.display = 'none';
      //   }
      
      //   // Set the new value of the 'active' attribute
      //   document.querySelector('#pawn').setAttribute('active', RigCamera);
      //   document.querySelector('#camera_'+i).setAttribute('active', imageCamActive);
      //   document.querySelector('#pawn').setAttribute('position', `${newPosition.x} 0 ${newPosition.z}`);
      
      // });
    document.getElementById("segment_" + i).appendChild(newImg);

    //////////////////////////////////////////////// Bildkamera erstellen //////////////////////////////////////////////////
    let newCamera = document.createElement("a-camera");
      newCamera.setAttribute("id", "camera_" + i);
      newCamera.setAttribute("position", `0 0 0.5`);
      newCamera.setAttribute("rotation", `0 0 0`);
      newCamera.setAttribute("active", "false");
      newCamera.setAttribute("fov", "145");
      newCamera.setAttribute("raycaster", "objects: .target;");
      newCamera.setAttribute("wasd-controls", "enabled: false");
      newCamera.setAttribute("look-controls", "enabled: false");
      newCamera.setAttribute("cursor", "rayOrigin: mouse; fuse: false;");
    document.getElementById("image" + i).appendChild(newCamera);
    //////////////////////////////////////////////// Bildkamera erstellen ende ---------------------------------------------


    let nextButton = document.createElement("img");
      nextButton.setAttribute("id", "nextImage_"+i);
      nextButton.setAttribute("class", "arrow");
      nextButton.setAttribute("title", "To the next image");
      nextButton.setAttribute("style", "display: none;");
      nextButton.setAttribute("style", "pointer-events: auto;");
      nextButton.setAttribute("src", "../00_media/04_svg/right_icon.svg");
      nextButton.addEventListener('mouseenter', () => {
        nextButton.style.opacity = "0.5";
      });
      
      // Mouse leaves the element
      nextButton.addEventListener('mouseleave', () => {
        nextButton.style.opacity = "1";
      });



    document.getElementById("overlayMain").appendChild(nextButton);

    let lastButton = document.createElement("img");
      lastButton.setAttribute("id", "lastImage_"+i);
      lastButton.setAttribute("class", "arrow left");
      lastButton.setAttribute("title", "To the next image");
      lastButton.setAttribute("style", "display: none; pointer-events: auto; opacity: 1;");
      // lastButton.setAttribute("style", "right: auto; left: 0;");
      // lastButton.setAttribute("style", "pointer-events: auto;");
      lastButton.setAttribute("src", "../00_media/04_svg/right_icon.svg");
      lastButton.addEventListener('mouseenter', () => {
        lastButton.style.opacity = "0.5";
      });
      
      // Mouse leaves the element
      lastButton.addEventListener('mouseleave', () => {
        lastButton.style.opacity = "1";
      });
    document.getElementById("overlayMain").appendChild(lastButton);

    lastButton.addEventListener('click', () => handleImageClick(i + 1, data, true));
    nextButton.addEventListener('click', () => handleImageClick(i - 1, data, true));
    newImg.addEventListener('click', () => handleImageClick(i, data));
  }

}////////////////////////////////////////////////// Bilder erstellen ende --------------------------------------------------

/////////////////////////////////////////////////// handle image click /////////////////////////////////////////////////////
function handleImageClick(i, data, navigation = false) {
  console.log("data: ", data);
  if (i == 0) {
    i = data.length;
  } else if (i == data.length + 1) {
    i = 1;
  }
  // Get the current value of the 'active' attribute
  let RigCamera = document.querySelector('#pawn').getAttribute('active');
  let imageCamActive = document.querySelector('#camera_'+i).getAttribute('active');
  let newPosition = document.querySelector('#segment_'+i).getAttribute('position');
  
  let lastNavButton = document.querySelector('#lastImage_'+i);
  let nextNavButton = document.querySelector('#nextImage_'+i);

  for (let j = 1; j <= data.length; j++) {
    if (j != i) {
      document.querySelector('#camera_'+j).setAttribute('active', 'false');
      document.querySelector('#nextImage_'+j).style.display = 'none';
      document.querySelector('#image'+j).setAttribute('visible', 'false');
      document.querySelector('#lastImage_'+j).style.display = 'none';
    }
  }


  // Switch the boolean value to its opposite
  if (navigation == false) {
    RigCamera = RigCamera === 'true' ? 'false' : 'true';
  }
  imageCamActive = imageCamActive === 'true' ? 'false' : 'true';

  if (imageCamActive == 'true') {
    let infoBox = document.querySelector('#currentImageInfo');
    
    document.querySelector('#image'+i).setAttribute('visible', 'true');
    infoBox.style.display = 'block';

    infoBox.innerHTML = `
      <h1>${data[i-1].title}</h1>
      <h6>${data[i-1].artistName}</h6>
      <p>${data[i-1].description}</p>
    `;
  
    nextNavButton.style.display = 'block';
    lastNavButton.style.display = 'block';
    
  } else {
    document.querySelector('#currentImageInfo').style.display = 'none';
    nextNavButton.style.display = 'none';
    lastNavButton.style.display = 'none';
    for (let j = 1; j <= data.length; j++) {
      document.querySelector('#image'+j).setAttribute('visible', 'true');
    }
  }



  // Set the new value of the 'active' attribute
  document.querySelector('#pawn').setAttribute('active', RigCamera);
  document.querySelector('#camera_'+i).setAttribute('active', imageCamActive);
  document.querySelector('#pawn').setAttribute('position', `${newPosition.x} 0 ${newPosition.z}`);

  // for (let j = 1; j <= data.length; j++) {
  //   console.log("camera_"+j, "active: ", document.querySelector('#camera_'+j).getAttribute('active'));
  // }
  // console.log("pawn", "active: ", document.querySelector('#pawn').getAttribute('active'));
}////////////////////////////////////////////////// handle image click ende ------------------------------------------------

/////////////////////////////////////////////////// Wand erstellen /////////////////////////////////////////////////////////
function createWallBehindImage(i, segmentSize, segmentHeight) {
  let newWall = document.createElement("a-box");
    newWall.setAttribute("id", "wall_" + i);
    newWall.setAttribute("class", "target");
    newWall.setAttribute("position", `0 0 -${segmentSize / 2}`);
    newWall.setAttribute("rotation", "0 0 0");
    newWall.setAttribute("color", roomColor);
    newWall.setAttribute("width", segmentSize);
    newWall.setAttribute("height", segmentHeight);
    newWall.setAttribute("depth", "0.01%");
    newWall.setAttribute("shadow", "cast: false; receive: true");
    newWall.setAttribute("data-raycastable", true);
  document.getElementById("segment_" + i).appendChild(newWall);
}////////////////////////////////////////////////// Wand erstellen ende ----------------------------------------------------

/////////////////////////////////////////////////// Boden und Decke erstellen //////////////////////////////////////////////
function createFloorAndRoof(i, segmentSize, segmentHeight, roomColor) {
  let newFloor = document.createElement("a-plane");
    newFloor.setAttribute("id", "Floor_" + i);
    newFloor.setAttribute("class", "target");
    newFloor.setAttribute("position", `0 -${segmentHeight / 2} 0`);
    newFloor.setAttribute("color", roomColor);
    newFloor.setAttribute("width", segmentSize);
    newFloor.setAttribute("height", segmentSize);
    newFloor.setAttribute("depth", "0.01%");
    newFloor.setAttribute("rotation", "-90 0 0");
  document.getElementById("segment_" + i).appendChild(newFloor);

  let newRoof = document.createElement("a-plane");
    newRoof.setAttribute("id", "Roof_" + i);
    newRoof.setAttribute("position", `0 ${segmentHeight / 2} 0`);
    newRoof.setAttribute("color", roomColor);
    newRoof.setAttribute("width", segmentSize);
    newRoof.setAttribute("height", segmentSize);
    newRoof.setAttribute("depth", "0.01%");
    newRoof.setAttribute("rotation", "90 0 0");
  document.getElementById("segment_" + i).appendChild(newRoof);
}////////////////////////////////////////////////// Boden und Decke erstellen ende -----------------------------------------

/////////////////////////////////////////////////// WarpPoint erstellen XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
function createWarpPoint(i, data, warpPointColor) {
  if (data[i - 1]){
    let warpPoint = document.createElement("a-sphere");
      warpPoint.setAttribute("id", "warpPoint" + i);
      warpPoint.setAttribute("class", "target");
      warpPoint.setAttribute("visible", "false");
      warpPoint.setAttribute("position", `0 0 0.1`);
      warpPoint.setAttribute("scale", "1 1 0.2");
      warpPoint.setAttribute("color", warpPointColor);
      warpPoint.setAttribute("radius", "0.5");
      warpPoint.setAttribute("shader", "flat");
      warpPoint.setAttribute("depth", "0.01%");
      // warpPoint.setAttribute("opacity", "0.5");
      
      warpPoint.setAttribute("event-set__enter", `
                              _event: mouseenter;
                              color: ${warpPointColorActive};
                              `);

      warpPoint.setAttribute("event-set__leave", `
                              _event: mouseleave; 
                              color: ${warpPointColor};
                              `);

    document.getElementById("Floor_" + i).appendChild(warpPoint);

    warpPoint.addEventListener('click', () => 
      {
        console.log(data[i]);
        document.getElementById("pawn").setAttribute('position', `${data["segment_" + i].x} 0 ${data["segment_" + i].z}`);
      }
    );

  }



  ////////////////////////////////////////////////// eventlistener
  if (data[i - 1]){
    let floor = document.getElementById("Floor_" + i);
    let wall = document.getElementById("wall_" + i);
    floor.setAttribute("event-set__enter", `
                            _event: mouseenter;
                            _target: #${"warpPoint" + i};
                            visible: true`);

    floor.setAttribute("event-set__leave", `
                            _event: mouseleave;
                            _target: #${"warpPoint" + i};
                            visible: false`);
    
    wall.setAttribute("event-set__enter", `
                            _event: mouseenter;
                            _target: #${"warpPoint" + i};
                            visible: true`);

    wall.setAttribute("event-set__leave", `
                            _event: mouseleave;
                            _target: #${"warpPoint" + i};
                            visible: false`);
  }


}////////////////////////////////////////////////// WarpPoint erstellen ende -----------------------------------------------

/////////////////////////////////////////////////// Label erstellen ////////////////////////////////////////////////////////
function createLabel(i, data, segmentSize, segmentHeight) {     
  if (data[i - 1]){                                                
    let newTitle = document.createElement("a-entity");
      newTitle.setAttribute("text", "value: " + data[i-1].title + "\n" + i + "; color: gray; width: 5; align: center;");
      newTitle.setAttribute("position", `0 -${(segmentHeight/2)-.5} -${(segmentSize/2)-.01}`);
    document.getElementById("segment_" + i).appendChild(newTitle);
    return data;
  }
}////////////////////////////////////////////////// Label erstellen ende ---------------------------------------------------

/////////////////////////////////////////////////// Licht erstellen ////////////////////////////////////////////////////////
function createBasicRoomLight(segmentHeight, light) {
    let newLight = document.createElement("a-light");
      newLight.setAttribute("light", "type: point; castShadow: true");
      newLight.setAttribute("color", "white");
      newLight.setAttribute("intensity", "0.04");
      newLight.setAttribute("position", `0 ${segmentHeight/2} 0`);
    document.getElementById("aScene").appendChild(newLight);

    let ambientLight = document.createElement("a-light");
      ambientLight.setAttribute("type", "ambient"); 
      ambientLight.setAttribute("color", "white");
      ambientLight.setAttribute("intensity", "0.8");
    document.getElementById("aScene").appendChild(ambientLight);

    if (light == false) {
    ambientLight.setAttribute("intensity", "0.1");
    }
    // for (let i = 1; i <= data.length; i++) {
    // let imageLight = document.createElement("a-light");
    //   imageLight.setAttribute("light", "type: point; castShadow: true");
    //   imageLight.setAttribute("color", "white");
    //   imageLight.setAttribute("intensity", "0.6");
    //   imageLight.setAttribute("position", `0 0 0`);
    // document.getElementById("image"+i).appendChild(imageLight);
    // }    
    // let floorLight = document.createElement("a-entity");
    // floorLight.setAttribute("id", "bodenlicht");
    // floorLight.setAttribute("area-light", "intensity: 1; width: 40; height: 1; color: white; ");
    // floorLight.setAttribute("position", "-20 0.001 -9.5");
    // floorLight.setAttribute("rotation", "90 0 0");
    // document.getElementById("aScene").appendChild(floorLight);
    // <a-entity
    // id="bodenlicht" 
    // area-light="
    // intensity: 1;
    // width: 40; 
    // height: 1; 
    // color: white; 
    // " 
    // position="-20 0.001 -9.5" 
    // rotation="90 0 0"
    // ></a-entity>
}////////////////////////////////////////////////// Licht erstellen ende ---------------------------------------------------

/////////////////////////////////////////////////// finish the room ////////////////////////////////////////////////////////
function finishTheRoom(roomSize, segmentHeight, halfRoomSize, segmentSize, roomColor, light){
  ////////////////////////////////////////////////// create middle floor 
  let middleFloor = document.createElement("a-plane");
    middleFloor.setAttribute("id", "middleFloor");
    middleFloor.setAttribute("position", `0 0 0`);
    middleFloor.setAttribute("color", roomColor);
    middleFloor.setAttribute("width", roomSize);
    middleFloor.setAttribute("height", roomSize);
    middleFloor.setAttribute("rotation", "-90 0 0");
  document.getElementById("aScene").appendChild(middleFloor);
  ////////////////////////////////////////////////// create middle roof
  let middleRoof = document.createElement("a-plane");
    middleRoof.setAttribute("id", "middleRoof");
    middleRoof.setAttribute("position", `0 ${segmentHeight} 0`);
    middleRoof.setAttribute("color", roomColor);
    middleRoof.setAttribute("width", roomSize);
    middleRoof.setAttribute("height", roomSize);
    middleRoof.setAttribute("rotation", "90 0 0");
  document.getElementById("aScene").appendChild(middleRoof);

  ////////////////////////////////////////////////// calculate corner position
  for (let i = 1; i <= 4; i++) {
    let rotationY;
    let cornerPosition;

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
    ////////////////////////////////////////////////// create corner segment
    let cornerSegment = document.createElement("a-entity");
      cornerSegment.setAttribute("id", "corner_" + i);
      cornerSegment.setAttribute("position", cornerPosition);
      cornerSegment.setAttribute("rotation", `0 ${rotationY} 0`);
      // cornerSegment.setAttribute("geometry",`
      //                     primitive: box;
      //                     width: ${segmentSize};
      //                     height: ${segmentHeight};
      //                     depth: ${segmentSize};
      // `);
      // cornerSegment.setAttribute("material", "wireframe: true; color: white; wireframeLinewidth: 1;"); // Wireframe
    document.getElementById("aScene").appendChild(cornerSegment);
    ////////////////////////////////////////////////// create first corner wall
    let cornerWall = document.createElement("a-box");
      cornerWall.setAttribute("id", "cornerWallLeft_" + i);
      cornerWall.setAttribute("position", `0 0 -${segmentSize / 2}`);
      cornerWall.setAttribute("color", roomColor);
      cornerWall.setAttribute("width", segmentSize);
      cornerWall.setAttribute("height", segmentHeight);
      cornerWall.setAttribute("depth", "0.01%");
      cornerWall.setAttribute("shadow", "cast: false; receive: true");
    document.getElementById("corner_" + i).appendChild(cornerWall);
    ////////////////////////////////////////////////// create second corner wall
    let secondCornerWall = document.createElement("a-box");
      secondCornerWall.setAttribute("id", "secondCornerWall_" + i);
      secondCornerWall.setAttribute("position", `${segmentSize / 2} 0 0`);
      secondCornerWall.setAttribute("rotation", "0 90 0");
      secondCornerWall.setAttribute("color", roomColor);
      secondCornerWall.setAttribute("width", segmentSize);
      secondCornerWall.setAttribute("height", segmentHeight);
      secondCornerWall.setAttribute("depth", "0.01%");
      secondCornerWall.setAttribute("shadow", "cast: false; receive: true");
    document.getElementById("corner_" + i).appendChild(secondCornerWall);




    let floorLightWidth = 0.5;
    let floorLight = document.createElement("a-entity");
      floorLight.setAttribute("id", "floorLight_" + i);
      floorLight.setAttribute("class", "floor-light");
      floorLight.setAttribute("area-light", `intensity: 0.6; width: ${roomSize+2*segmentSize}; height: ${floorLightWidth}; color: white; `);
      floorLight.setAttribute("position", `${segmentSize/2} ${0.001-segmentHeight/2} ${-segmentSize/2}`);
      floorLight.setAttribute("rotation", `90 -90 0`);
    document.getElementById("corner_" + i).appendChild(floorLight);

    let roofLight = document.createElement("a-entity");
      roofLight.setAttribute("id", "roofLight_" + i);
      roofLight.setAttribute("class", "floor-light");
      roofLight.setAttribute("area-light", `intensity: 0.6; width: ${roomSize+2*segmentSize}; height: ${floorLightWidth}; color: white; `);
      roofLight.setAttribute("position", `${segmentSize/2} ${-0.001+segmentHeight/2} ${-segmentSize/2}`);
      roofLight.setAttribute("rotation", `-90 -90 0`);
    document.getElementById("corner_" + i).appendChild(roofLight);

    console.log("light: ", light);
    if (light == false) {
      floorLight.setAttribute("area-light", `intensity: 1; width: ${roomSize+2*segmentSize}; height: ${floorLightWidth*2}; color: white; `);
      roofLight.setAttribute("area-light", `intensity: 1; width: ${roomSize+2*segmentSize}; height: ${floorLightWidth*2}; color: white; `);
      }




    ////////////////////////////////////////////////// create corner floor
    let cornerFloor = document.createElement("a-plane");
      cornerFloor.setAttribute("id", "cornerFloor_" + i);
      cornerFloor.setAttribute("position", `0 -${segmentHeight / 2} 0`);
      cornerFloor.setAttribute("rotation", "-90 0 0");
      cornerFloor.setAttribute("color", roomColor);
      cornerFloor.setAttribute("width", segmentSize);
      cornerFloor.setAttribute("height", segmentSize);
      cornerFloor.setAttribute("depth", "0.01%");
      cornerFloor.setAttribute("shadow", "cast: false; receive: true");
    document.getElementById("corner_" + i).appendChild(cornerFloor);
    ////////////////////////////////////////////////// create corner roof
    let cornerRoof = document.createElement("a-plane");
      cornerRoof.setAttribute("id", "cornerRoof_" + i);
      cornerRoof.setAttribute("position", `0 ${segmentHeight / 2} 0`);
      cornerRoof.setAttribute("rotation", "90 0 0");
      cornerRoof.setAttribute("color", roomColor);
      cornerRoof.setAttribute("width", segmentSize);
      cornerRoof.setAttribute("height", segmentSize);
      cornerRoof.setAttribute("depth", "0.01%");
      cornerRoof.setAttribute("shadow", "cast: false; receive: true");
    document.getElementById("corner_" + i).appendChild(cornerRoof);
  }
}////////////////////////////////////////////////// finish the room ende ---------------------------------------------------

/////////////////////////////////////////////////// connecting the overlay /////////////////////////////////////////////////
function connectingTheOverlays(expoData, homePositionOfCamera) {
  // create home button 
  const homeButton = document.getElementById('home_icon');
  const cameraEntity = document.getElementById('pawn'); // Die ID Ihrer Kamera-Entity
  homeButton.addEventListener('click', () => {
      cameraEntity.setAttribute('position', homePositionOfCamera);
  });
  // create home button ende

  // create start button
  const overlayButton = document.getElementById('virtualExpo_icon');
  overlayButton.addEventListener('click', () => {
    document.getElementById("pawn").setAttribute('wasd-controls', 'enabled: true');
  });
  // create start button ende

  // create exit button
  const exitButton = document.getElementById('exit_icon');
  exitButton.addEventListener('click', () => {
    document.getElementById("pawn").setAttribute('wasd-controls', 'enabled: false');
    cameraEntity.setAttribute('position', homePositionOfCamera);
  });
  // create exit button ende
}////////////////////////////////////////////////// connecting the overlay ende -------------------------------------------- 

/////////////////////////////////////////////////// collision erstellen ////////////////////////////////////////////////////
AFRAME.registerComponent('check-coordinates', {
  tick: function () {
    // Get the element you want to check
    var instanceOfCamera = this.el;


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
    var currentPosition = instanceOfCamera.getAttribute('position');

    if (currentPosition.x > xRangeStart) {
      instanceOfCamera.setAttribute('position', `${xRangeStart} 0 ${currentPosition.z}`);

    }
    else if (currentPosition.x < xRangeEnd) {
      instanceOfCamera.setAttribute('position', `${xRangeEnd} 0 ${currentPosition.z}`);

    }
    if (currentPosition.z > zRangeStart) {
      instanceOfCamera.setAttribute('position', `${currentPosition.x} 0 ${zRangeStart}`);

    }
    else if (currentPosition.z < zRangeEnd) {
      instanceOfCamera.setAttribute('position', `${currentPosition.x} 0 ${zRangeEnd}`);

    }
  }
});//////////////////////////////////////////////// collision erstellen ende -----------------------------------------------


// Get the modal
var modal = document.getElementById("einstellungen");


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
      modal.style.display = "none";
  }
}

// Handle the form submission
document.getElementById("checkboxForm").onsubmit = function(event) {
  event.preventDefault();

  // Get the 'lightoff' checkbox
  var lightOffCheckbox = document.querySelector('input[name="light"][value="lightoff"]');

  // Get current URL and parameters
  var currentUrl = new URL(window.location.href);
  var baseUrl = currentUrl.href.split('%20lightoff')[0];

  // Add or remove 'lightoff' based on the checkbox state
  if (lightOffCheckbox.checked) {
    // Append 'lightoff' to the URL
    window.location.href = baseUrl + " lightoff";
  } else {
      // Use the base URL without 'lightoff'
      window.location.href = baseUrl;
  }
};

