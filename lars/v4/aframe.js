const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/random.php'

let newImg;
const max = 10;
const imageWidth = 1;
const gapWidth = 2.5;
const segmentSize = 3.5;
const segmentHeight = 8;
const light = true;

const maxElements = max;

const roomSize = max; // Adjust this value to set the size of the square room


const imageSize = imageWidth + gapWidth;
const wallThickness = segmentSize;
const halfRoomSize = roomSize / 2;

for (let i = 1; i <= max; i++) {

  fetch(apiUrl)
  .then(response => response.json())

  .then(data => {                                                                   //rotation erstellen
    if (i < maxElements / 4) {
      positionX = -halfRoomSize + i * imageSize;
      positionZ = halfRoomSize;
      rotationY = 180; // Element faces inside
    } else if (i < maxElements / 2) {
      positionX = halfRoomSize;
      positionZ = halfRoomSize - (i - maxElements / 4) * imageSize;
      rotationY = -90; // Element faces inside
    } else if (i < (3 * maxElements) / 4) {
      positionX = halfRoomSize - (i - maxElements / 2) * imageSize;
      positionZ = -halfRoomSize;
      rotationY = 0; // Element faces inside
    } else {
      positionX = -halfRoomSize;
      positionZ = -halfRoomSize + (i - (3 * maxElements) / 4) * imageSize;
      rotationY = 90;
    }
    return {data, positionX, positionZ, rotationY};
  })

  .then(data => {                                                                   //Bilder erstellen
    data = data.data; 

    newImg = document.createElement("a-box");
    newImg.setAttribute("src", data.drinks[0].strDrinkThumb);
    newImg.setAttribute("id", "image" + i);
    

    // Rest of your code remains the same, just update the position attributes
    newImg.setAttribute("position", `${positionX} 1.6 ${positionZ}`);
    newImg.setAttribute("rotation", `0 ${rotationY} 0`); // Set the rotation
    newImg.setAttribute("color", "white");
    newImg.setAttribute("class", "image");
    newImg.setAttribute("width", imageWidth);
    newImg.setAttribute("height", 1);
    newImg.setAttribute("depth", "0.01%");
    newImg.setAttribute("shadow", "cast: true; receive: false");
    document.getElementById("aScene").appendChild(newImg);
    return data;
  })

  .then(data => {                                                                   //Wand erstellen
    newWall = document.createElement("a-box");
    newWall.setAttribute("id", "wall_" + i);
    newWall.setAttribute("position", (i-(max+1)/2)*(imageWidth+gapWidth) + " " + segmentHeight/2 + " -10");
    newWall.setAttribute("color", "white");
    newWall.setAttribute("class", "Wall");
    newWall.setAttribute("width", segmentSize);
    newWall.setAttribute("height", segmentHeight);
    newWall.setAttribute("depth", "0.01%");
    newWall.setAttribute("rotation", "0 0 0");
    newWall.setAttribute("material", "shader: phong");
    newWall.setAttribute("shadow", "cast: false; receive: true");
    document.getElementById("aScene").appendChild(newWall);
    return data;
  })

  .then(data => {                                                                   //Boden erstellen
    newFloor = document.createElement("a-plane");
    newFloor.setAttribute("id", "Floor_" + i);
    newFloor.setAttribute("position", (i-(max+1)/2)*(imageWidth+gapWidth) + " 0 " + ((-10)+segmentSize/2));
    newFloor.setAttribute("color", "white");
    newFloor.setAttribute("class", "Floor");
    newFloor.setAttribute("width", segmentSize);
    newFloor.setAttribute("height", segmentSize);
    newFloor.setAttribute("depth", "0.01%");
    newFloor.setAttribute("rotation", "-90 0 0");
    newFloor.setAttribute("shadow", "receive: true");
    document.getElementById("aScene").appendChild(newFloor);
    return data;
  })

  .then(data => {                                                                   //Decke erstellen
    newRoof = document.createElement("a-plane");
    newRoof.setAttribute("id", "Roof_" + i);
    newRoof.setAttribute("position", (i-(max+1)/2)*(imageWidth+gapWidth) + " " + segmentHeight +  " " + ((-10)+segmentSize/2));
    newRoof.setAttribute("color", "white");
    newRoof.setAttribute("class", "Roof");
    newRoof.setAttribute("width", segmentSize);
    newRoof.setAttribute("height", segmentSize);
    newRoof.setAttribute("depth", "0.01%");
    newRoof.setAttribute("rotation", "90 0 0");
    newRoof.setAttribute("shadow", "receive: true");
    document.getElementById("aScene").appendChild(newRoof);
    return data;
  })

  .then(data => {                                                                   //Beschriftung erstellen
    newTitle = document.createElement("a-entity");
    newTitle.setAttribute("text", "value: " + data.drinks[0].strDrink + "; color: white; width: 5; align: center; font: https://cdn.aframe.io/fonts/Exo2Bold.fnt");
    newTitle.setAttribute("position", (i-(max+1)/2)*(imageWidth+gapWidth) + " .9 -9.8");
    document.getElementById("aScene").appendChild(newTitle);
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





// path = "img/";
// i = 1;
// max = 6;
// imageWidth = 5;
// gapWidth = 0.5;

// areaLightWidth = 5;
// areaLightHeight = 5;

// galleryCenter = (max+1)/2;


// while (i <= max) {

//   newImg = document.createElement("a-box");

//   newImg.setAttribute("src", path + "img" + i + ".jpg");
//   newImg.setAttribute("id", "image" + i);
//   newImg.setAttribute("position", (i-(max+1)/2)*(imageWidth+gapWidth) + " 3 -9.8");
//   newImg.setAttribute("color", "white");
//   newImg.setAttribute("class", "image");
//   newImg.setAttribute("width", imageWidth);
//   newImg.setAttribute("height", 5);
//   newImg.setAttribute("depth", "0.01%");
//   newImg.setAttribute("shadow", "cast: true; receive: true");
//   newImg.setAttribute("shader", "flat");
  

//   document.getElementById("aScene").appendChild(newImg);

//   i++;
// }
