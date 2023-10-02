
const apiUrl = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=6';

i = 1;
max = 6;
imageWidth = 5;
gapWidth = 0.5;

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Handle the data returned from the API here
      while (i <= max) {
        console.log(data);
        newImg = document.createElement("a-box");

        newImg.setAttribute("src", data[i-1].url);
        newImg.setAttribute("id", "image" + i);
        newImg.setAttribute("position", (i-(max+1)/2)*(imageWidth+gapWidth) + " 3 -9.8");
        newImg.setAttribute("color", "white");
        newImg.setAttribute("class", "image");
        newImg.setAttribute("width", imageWidth);
        newImg.setAttribute("height", 5);
        newImg.setAttribute("depth", "0.01%");
        newImg.setAttribute("shadow", "cast: true; receive: true");
        newImg.setAttribute("shader", "flat");
        i++;

        document.getElementById("aScene").appendChild(newImg);

        
    };
  })
  .catch(error => {
    // Handle any errors that occur during the fetch
    console.error('Something went wrong with fetching the data', error);
});





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
