// const apiUrl = 'https://api.nasa.gov/planetary/apod?api_key=exnozthVjEihRRmUTmevz2rWuo65827mxbwoacVR&count=2';
const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/random.php'

const max = 5;
const imageWidth = 5;
const gapWidth = 0.5;

for (let i = 0; i <= max; i++) {
  fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // console.log(data);
    // console.log(data.drinks[0].strDrinkThumb);
    // bild = document.createElement("img");
    // bild.setAttribute("src", data.drinks[0].strDrinkThumb);

    // document.getElementById("bilder").appendChild(bild);
    // i++;
    const imageUrl = data.drinks[0].strDrinkThumb;
    const positionX = (i - (max + 1) / 2) * (imageWidth + gapWidth);


    const newImg = document.createElement("a-box");
    newImg.setAttribute("src", imageUrl);
    newImg.setAttribute("id", "image" + i);
    newImg.setAttribute("position", positionX + " 3 -9.8");
    newImg.setAttribute("color", "white");
    newImg.setAttribute("class", "image");
    newImg.setAttribute("width", imageWidth);
    newImg.setAttribute("height", 5);
    newImg.setAttribute("depth", "0.01%");
    newImg.setAttribute("shadow", "cast: true; receive: true");
    newImg.setAttribute("shader", "flat");

    // create a wall behind the image
    const wall = document.createElement("a-box");
    wall.setAttribute("id", "wall" + i);
    wall.setAttribute("position", positionX + " 3 -10");
    wall.setAttribute("color", "red");
    wall.setAttribute("class", "wall");
    wall.setAttribute("width", imageWidth + gapWidth);
    wall.setAttribute("height", 5);


    document.getElementById("aScene").appendChild(wall);
    document.getElementById("aScene").appendChild(newImg);
  })
  .then(data => {
    i = i;
    console.log("raum teil " + i);
  })

  .catch(error => {
    // Handle any errors that occur during the fetch
    console.error('Something went wrong with fetching the data', error);
});
};





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
