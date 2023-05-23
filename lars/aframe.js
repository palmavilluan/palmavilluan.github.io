path = "img/";
i = 1;
max = 6;
imageWidth = 5;
gapWidth = 0.5;

galleryCenter = (max+1)/2;


while (i <= max) {

  // console.log(path + i);
  newImg = document.createElement("a-box");

  newImg.setAttribute("src", path + "img" + i + ".jpg");
  newImg.setAttribute("id", "image " + i);
  newImg.setAttribute("position", (i-(max+1)/2)*(imageWidth+gapWidth) + " 2 -5");
  newImg.setAttribute("color", "white");
  newImg.setAttribute("class", "image");
  newImg.setAttribute("width", imageWidth);
  newImg.setAttribute("height", 5);
  newImg.setAttribute("depth", "0.01%");

  // console.log(newImg);
  document.getElementById("aScene").appendChild(newImg);
  i++;
}


AFRAME.registerComponent('rotation-reader', {
  tick: function () {
    // `this.el` is the element.
    // `object3D` is the three.js object.

    // `rotation` is a three.js Euler using radians. `quaternion` also available.
    console.log(this.el.object3D.rotation);

    // `position` is a three.js Vector3.
    console.log(this.el.object3D.position);
  }
});