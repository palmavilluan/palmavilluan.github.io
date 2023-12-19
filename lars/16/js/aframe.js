import { supa } from './setup_supabase.js';
import { main } from './overlay.js';


const roomColor = "white";
const warpPointColor = "#61b0b1";
const warpPointColorActive = "#abdcdd";

// const anzahlBilderProWand = 3;
const imageWidth = 1.5;
// const imageToFloor = 0.9;
const gapWidth = 2.5;
const segmentSize = imageWidth + gapWidth;
const segmentHeight = 4;
const light = true;


let newImg;
let cornerPosition;

// let images = [];
let imageData = [];

let positionX;
let rotationY;
let positionZ;
let newFloor;
let newWall;





const homePositionOfCamera = "0 0 0";

// //////////////////////////////////////////////// get expoID from URL //////////////////////////////////////////////////
// let url = window.location.href;
// let expoID = url.substring(url.lastIndexOf('?') + 1);

// // Überprüfe, ob die URL bereits eine Expo-ID hat
// if (expoID == url) {
//   // Prompt for user input
//   let userInput = prompt("Bitte geben Sie die Nummer der gewünschten Expo ein:");

//   // Wenn der Benutzer die Eingabe abbricht oder nichts eingibt
//   if (userInput == null || userInput.trim() === "") {
//     // Füge "?1" an die aktuelle URL an
//     window.location.href = url + '?1';
//   } else {
//     // Wenn der Benutzer eine gültige Eingabe macht, aktualisiere die URL
//     window.location.href = url + '?' + userInput;
//   }
// }
// //////////////////////////////////////////////// get expoID from URL ende 



////////////////////////////////////////////////// get all images from supabase /////////////////////////////////////////
async function getImagesFromSupabase(expoID) {
  //get all IDs for the expo
  let { data, error } = await supa
    .from('ArtworkExposition')
    .select('*')
    .eq('expo_id', expoID);

  console.log("raw id data: ", data);

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
  console.log("expoData: ", expoData);
  if (expoError) {
    console.error('Error fetching files:', expoError);
    return;
  }

  const dataLength = imageData.length;
  const numberOfElements = Math.max(4 * Math.ceil(dataLength / 4), dataLength);
  // console.log("numberOfElements: ", numberOfElements)
  // console.log("data", data);
  return {imageData, numberOfElements, expoData};
}

document.querySelector('a-scene').addEventListener('loaded', async function () {
  
    
  ////////////////////////////////////////////////// get expoHash from URL //////////////////////////////////////////////////
  let url = window.location.href;
  let expoHash = url.substring(url.lastIndexOf('?') + 1);

  console.log("expoHash: ", expoHash);

  // Überprüfe, ob die URL bereits eine Expo-ID hat
  if (expoHash == url) {
    // Prompt for user input
    let userInput = prompt("Bitte geben Sie die Nummer der gewünschten Expo ein:");

    // Wenn der Benutzer die Eingabe abbricht oder nichts eingibt
    if (userInput == null || userInput.trim() === "") {
      // Füge "?1" an die aktuelle URL an
      window.location.href = url + '?1';
    } else {
      // Wenn der Benutzer eine gültige Eingabe macht, aktualisiere die URL
      window.location.href = url + '?' + userInput;
    }
  }
  ////////////////////////////////////////////////// get expoHash from URL ende 

  ////////////////////////////////////////////////// get expoID from expoHash //////////////////////////////////////////////////
  let { data: rawExpoData, error } = await supa
    .from('Exposition')
    .select('*')
    .eq('expoHash', expoHash);
    console.log("rawExpoData: ", rawExpoData[0]);  
  if (error) {
    console.error('Error fetching files:', error);
  }
  let expoID = rawExpoData[0].id;
  console.log("expoID: ", expoID);
  ////////////////////////////////////////////////// get expoID from expoHash ende



  const bigdata = await getImagesFromSupabase(expoID);
  const numberOfElements = bigdata.numberOfElements;
  const data = bigdata.imageData;
  const expoData = bigdata.expoData;

  console.log("data: ", data);
  // ////////////////////////////////////////////////// create Title //////////////////////////////////////////////////
  // if (expoData[0].expoName) {
  //   document.getElementById("expoName_text").innerHTML = expoData[0].expoName;
  // } else {
  //   document.getElementById("expoName_text").innerHTML = "Unnamed Expo&nbsp;";
  // }
  // if (expoData[0].expoOrganizer) {
  //   document.getElementById("orgaName_text").innerHTML = expoData[0].expoOrganizer;
  // } else {
  //   document.getElementById("orgaName_text").innerHTML = "@unknown&nbsp;";
  // }
  // if (expoData[0].expoDate) {
  //   document.getElementById("expoDate_text").innerHTML = expoData[0].expoDate;
  // } else {
  //   document.getElementById("expoDate_text").innerHTML = "";
  // }

  ////////////////////////////////////////////////// create Title ende

  // console.log("data: ", data);
  // console.log("numberOfElements: ", numberOfElements);
  



  const anzahlBilderProWand = Math.ceil(numberOfElements / 4);
  const roomSize = numberOfElements / 4 * segmentSize; // Adjust this value to set the size of the square room
  const halfRoomSize = roomSize / 2;
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


    ////////////////////////////////////////////////// segmente erstellen
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


    ////////////////////////////////////////////////// Bilder erstellen //////////////////////////////////////////////////
    if (data[i - 1]){
      let image = new Image();
      image.src = data[i - 1].artworkURL;
      let ratio = image.width / image.height;

      newImg = document.createElement("a-box");
      newImg.setAttribute("src", image.src);
      // newImg.setAttribute("position", `0 -${(segmentHeight / 2) - (imageWidth / 2) - imageToFloor} -${(segmentSize / 2) - 0.1}`);
      newImg.setAttribute("id", "image" + i);
      newImg.setAttribute("rotation", `0 0 0`); // Set the rotation
      newImg.setAttribute("class", "image");
      
      if (image.height > image.width) { //hochformat
        newImg.setAttribute("position", `0 0 -${(segmentSize / 2) - 0.1}`);
        newImg.setAttribute("width", (segmentHeight/1.5)*ratio);
        newImg.setAttribute("height", segmentHeight/1.5);
      }
      else {                            //querformat
        newImg.setAttribute("position", `0 0 -${(segmentSize / 2) - 0.1}`);
        newImg.setAttribute("width", (segmentSize*0.8));
        newImg.setAttribute("height", (segmentSize*0.8)/ratio);
      }
      // console.log("newImg data: ", data);
      newImg.setAttribute("depth", "0.01%");
      newImg.setAttribute("shader", "flat");
      newImg.setAttribute("shadow", "cast: true; receive: false");

                      
      document.getElementById("segment_" + i).appendChild(newImg);


      //////////////////////////////////////////////// Bildkamera erstellen //////////////////////////////////////////////////
      let newCamera = document.createElement("a-camera");
      newCamera.setAttribute("id", "camera_" + i);
      newCamera.setAttribute("position", `0 0 11.260`);
      newCamera.setAttribute("rotation", `0 0 0`);
      newCamera.setAttribute("active", "false");
      newCamera.setAttribute("fov", "16");
      newCamera.setAttribute("wasd-controls", "enabled: false");
      newCamera.setAttribute("look-controls", "enabled: false");
      newCamera.setAttribute("cursor", "rayOrigin: mouse; fuse: false;");
      document.getElementById("image" + i).appendChild(newCamera);
      //////////////////////////////////////////////// Bildkamera erstellen ende
    }
    ////////////////////////////////////////////////// Bilder erstellen ende

    ////////////////////////////////////////////////// Wand erstellen //////////////////////////////////////////////////
    newWall = document.createElement("a-box");
    newWall.setAttribute("id", "wall_" + i);
    newWall.setAttribute("position", `0 0 -${segmentSize / 2}`);
    newWall.setAttribute("rotation", "0 0 0");
    newWall.setAttribute("color", roomColor);
    newWall.setAttribute("width", segmentSize);
    newWall.setAttribute("height", segmentHeight);
    newWall.setAttribute("depth", "0.01%");
    newWall.setAttribute("shadow", "cast: false; receive: true");
    document.getElementById("segment_" + i).appendChild(newWall);


    ////////////////////////////////////////////////// Boden erstellen
    newFloor = document.createElement("a-plane");
    newFloor.setAttribute("id", "Floor_" + i);
    newFloor.setAttribute("position", `0 -${segmentHeight / 2} 0`);
    newFloor.setAttribute("color", roomColor);
    newFloor.setAttribute("width", segmentSize);
    newFloor.setAttribute("height", segmentSize);
    newFloor.setAttribute("depth", "0.01%");
    newFloor.setAttribute("rotation", "-90 0 0");
    document.getElementById("segment_" + i).appendChild(newFloor);


    ////////////////////////////////////////////////// WarpPoint erstellen
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
    //   warpPoint.addEventListener('mouseenter', function () {
    //     warpPoint.setAttribute('visible', true);
    //     warpPoint.setAttribute('color', warpPointColorActive);
    // });
    //   warpPoint.setAttribute("event-set__leave", `
    //                           _event: mouseleave; 
    //                           color: ${warpPointColor};
    //                           visible: false`);
    //   warpPoint.setAttribute("event-set__click", `
    //                           _event: click; 
    //                           _target: #pawn; 
    //                           position: ${data.segmentPosition.x} 0 ${data.segmentPosition.z};`);
      document.getElementById("Floor_" + i).appendChild(warpPoint);
    }

    ////////////////////////////////////////////////// Decke erstellen
    let newRoof = document.createElement("a-plane");
    newRoof.setAttribute("id", "Roof_" + i);
    newRoof.setAttribute("position", `0 ${segmentHeight / 2} 0`);
    newRoof.setAttribute("color", roomColor);
    newRoof.setAttribute("width", segmentSize);
    newRoof.setAttribute("height", segmentSize);
    newRoof.setAttribute("depth", "0.01%");
    newRoof.setAttribute("rotation", "90 0 0");
    document.getElementById("segment_" + i).appendChild(newRoof);


    ////////////////////////////////////////////////// Beschriftung erstellen
    // .then(data => {                                                                   
    //   let newTitle = document.createElement("a-entity");
    //   newTitle.setAttribute("text", "value: " + data.drinks[0].strDrink + "\n" + i + "; color: gray; width: 5; align: center;");
    //   newTitle.setAttribute("position", `0 -${(segmentHeight/2)-.5} -${(segmentSize/2)-.01}`);
    //   document.getElementById("segment_" + i).appendChild(newTitle);
    //   return data;
    // })


    ////////////////////////////////////////////////// eventlistener
    // newWall.setAttribute("event-set__enter", `
    //                         _event: mouseenter; 
    //                         _target: #${"warpPoint" + i}; 
    //                         color: ${warpPointColor};
    //                         visible: true`);
    // newWall.setAttribute("event-set__leave", `
    //                         _event: mouseleave; 
    //                         _target: #${"warpPoint" + i}; 
    //                         color: ${warpPointColor};
    //                         visible: false`);
    // newImg.setAttribute("event-set__enter", `
    //                         _event: mouseenter; 
    //                         _target: #${"warpPoint" + i}; 
    //                         color: ${warpPointColorActive};
    //                         visible: true`);
    // newImg.setAttribute("event-set__leave", `
    //                         _event: mouseleave; 
    //                         _target: #${"warpPoint" + i}; 
    //                         color: ${warpPointColor};
    //                         visible: false`);



    ////////////////////////////////////////////////// click event für die Einzelansichten
    newImg.addEventListener('click', function() {
      // Get the current value of the 'active' attribute
      let RigCamera = document.querySelector('#pawn').getAttribute('active');
      let imageCamActive = document.querySelector('#camera_'+i).getAttribute('active');
      let newPosition = document.querySelector('#segment_'+i).getAttribute('position');
    
      // Switch the boolean value to its opposite
      RigCamera = RigCamera === 'true' ? 'false' : 'true';
      imageCamActive = imageCamActive === 'true' ? 'false' : 'true';

      console.log("this: ", this, '\n', "RigCamera: ", RigCamera, '\n', "imageCamActive: ", imageCamActive, '\n', "newPosition: ", newPosition);
      
      if (imageCamActive == 'true') {
        let infoBox = document.querySelector('#currentImageInfo');
        infoBox.style.display = 'block';
        infoBox.innerHTML = `
          <h1>${data[i-1].title}</h1>
          <h6>${data[i-1].artistName}</h6>
          <p>${data[i-1].description}</p>
        `;

      } else {
        document.querySelector('#currentImageInfo').style.display = 'none';
      }
    
      // Set the new value of the 'active' attribute
      document.querySelector('#pawn').setAttribute('active', RigCamera);
      document.querySelector('#camera_'+i).setAttribute('active', imageCamActive);
      document.querySelector('#pawn').setAttribute('position', `${newPosition.x} 0 ${newPosition.z}`);
    
    });

    ////////////////////////////////////////////////// update the segment element 
    newWall.setAttribute("data-raycastable", true);
    newImg.setAttribute("data-raycastable", true);





    ////////////////////////////////////////////////// Debugging /////////////////////////////////////////////////
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



  ////////////////////////////////////////////////// Licht erstellen //////////////////////////////////////////////////
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

  ////////////////////////////////////////////////// create middle floor //////////////////////////////////////////////////
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

  ////////////////////////////////////////////////// create camera rig
  // Rig = document.createElement("a-entity");
  // Rig.setAttribute("id", "Rig");
  // Rig.setAttribute("position", `0 0 0`);
  // Rig.setAttribute("rotation", `0 180 0`);
  // document.getElementById("aScene").appendChild(Rig);
  //create camera in rig
  // pawn = document.createElement("a-camera");
  // pawn.setAttribute("id", "pawn");

  // pawn.setAttribute("position", `0 1.6 0`);
  // document.getElementById("Rig").appendChild(pawn);




  ////////////////////////////////////////////////// create corners
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



  ////////////////////////////////////////////////// create exit button /////////////////////////////////
  const overlayButton = document.getElementById('virtualExpo_icon');
  overlayButton.addEventListener('click', () => {
    document.getElementById("pawn").setAttribute('wasd-controls', 'enabled: true');
  });
  ////////////////////////////////////////////////// create exit button ende

  ////////////////////////////////////////////////// create home button /////////////////////////////////
  const cameraButton = document.getElementById('home_icon');
  const cameraEntity = document.getElementById('pawn'); // Die ID Ihrer Kamera-Entity
  console.log("cameraEntity: ", cameraEntity);
  cameraButton.addEventListener('click', () => {
      cameraEntity.setAttribute('position', homePositionOfCamera); // Beispielkoordinaten
  });
  ////////////////////////////////////////////////// create home button ende

  ////////////////////////////////////////////////// create exit button /////////////////////////////////
  const exitButton = document.getElementById('exit_icon');
  exitButton.addEventListener('click', () => {
    document.getElementById("pawn").setAttribute('wasd-controls', 'enabled: false');
  });
  ////////////////////////////////////////////////// create exit button ende
  console.log("expoData: ", expoData);
  main(expoData[0].expoName, expoData[0].expoOrganizer, expoData[0].expoDate);

  document.getElementById("pawn").setAttribute('raycaster', "objects: .image;");
});


////////////////////////////////////////////////// collision erstellen //////////////////////////////////////////////////
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
      instanceOfCamera.setAttribute('position', `${currentPosition.x - 0.1} 0 ${currentPosition.z}`);
      console.log("Over range z");
    }
    else if (currentPosition.x < xRangeEnd) {
      instanceOfCamera.setAttribute('position', `${currentPosition.x + 0.1} 0 ${currentPosition.z}`);
      console.log("Under range z");
    }
    if (currentPosition.z > zRangeStart) {
      instanceOfCamera.setAttribute('position', `${currentPosition.x} 0 ${currentPosition.z - 0.1}`);
      console.log("Over range x");
    }
    else if (currentPosition.z < zRangeEnd) {
      instanceOfCamera.setAttribute('position', `${currentPosition.x} 0 ${currentPosition.z + 0.1}`);
      console.log("Under range x");
    }
    // Check if the x and z coordinates are outside the desired range
    // if (Math.abs(currentPosition.z) > zRangeStart) {
    //   // If outside the range, reset the position
    //   instanceOfCamera.setAttribute('position', `0 1.6 ${currentPosition.z+0.1}`); // Change this to your desired reset position
    //   console.log("Out of bounds");
    // }
    // console.log("current Position: ", currentPosition);
    // console.log("current rotation: ", instanceOfCamera.getAttribute('rotation'));
  }
});
////////////////////////////////////////////////// collision erstellen ende 
