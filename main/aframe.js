path = "img/";
i = 1;
max = 6;
imageWidth = 5;
gapWidth = 0.5;

areaLightWidth = 5;
areaLightHeight = 5;

galleryCenter = (max+1)/2;


while (i <= max) {

  newImg = document.createElement("a-box");

  newImg.setAttribute("src", path + "img" + i + ".jpg");
  newImg.setAttribute("id", "image" + i);
  newImg.setAttribute("position", (i-(max+1)/2)*(imageWidth+gapWidth) + " 3 -9.8");
  newImg.setAttribute("color", "white");
  newImg.setAttribute("class", "image");
  newImg.setAttribute("width", imageWidth);
  newImg.setAttribute("height", 5);
  newImg.setAttribute("depth", "0.01%");
  newImg.setAttribute("shadow", "cast: true; receive: true");
  newImg.setAttribute("shader", "flat");
  

  document.getElementById("aScene").appendChild(newImg);


// individual light for each image
// newLight = document.createElement("a-entity");

// newLight.setAttribute("area-light", "color: white; intensity: 0.5; castShadow: true; target: #image"+i+"; angle: 20; width: " + areaLightWidth + "; height:" + areaLightHeight + ";");
// newLight.setAttribute("position", (i-(max+1)/2)*(imageWidth+gapWidth)-(areaLightWidth/2) + " 3 -9.79");
// newLight.setAttribute("id", "light"+i);

// document.getElementById("aScene").appendChild(newLight);

  // <a-entity
  // id="deckenlicht" 
  // area-light="
  // intensity: 1;
  // width: 40; 
  // height: 1; 
  // color: white; 
  // penumbra: 1;" 
  // position="-20 5.99 -9.9" 
  // rotation="-90 0 0"
  // ></a-entity>






// individual light for each image
  // newLight = document.createElement("a-entity");

  // newLight.setAttribute("light", "type: spot; penumbra: 0.1; color: white; intensity: 1; castShadow: true; target: #image"+i+"; angle: 20;");
  // newLight.setAttribute("position", (i-(max+1)/2)*(imageWidth+gapWidth) + " 6 -3");

  // document.getElementById("aScene").appendChild(newLight);

  i++;

}

// newLight = document.createElement("a-entity");

// newLight.setAttribute("light", "type: spot; penumbra: 0.1; color: white; intensity: 1; castShadow: true; target: #image3; angle: 20;");
// newLight.setAttribute("position", "0 10 0");

// document.getElementById("aScene").appendChild(newLight);

// <a-entity
// light="
// type: spot;
// color: white;
// intensity: 1;
// castShadow: true;
// target: #image2;
// penumbra: 0.1;"
// position="0 1 2"
// >
// </a-entity>

