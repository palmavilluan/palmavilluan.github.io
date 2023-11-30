console.log("fileLoaded: upload_supabase.js");

//ABSCHNITT variabeln ==================================================================================================

import { supa } from './setup_supabase.js';
import {currentUser} from './auth_supabase.js';

let inputArtworkUpload = document.getElementById("inputArtworkUpload");

let buttonArtworkUpload = document.getElementById("buttonArtworkUpload");






//ABSCHNITT funktionen aufruf==================================================================================================




eventButtonUpload();


//ABSCHNITT funktionen definition==================================================================================================

//FUNKTION eventButtonUpload

function eventButtonUpload() {

    console.log("functionExecuted: eventButtonUpload()");

    buttonArtworkUpload.addEventListener("click", function() {

        console.log("elementClicked: buttonArtworkUpload");

        let file = inputArtworkUpload.files[0];

        console.log("file: ", file);

        let fileName = file.name;

        console.log("fileName: ", fileName);

        uploadArtworkFolder();

    });



}//ENDE FUNKTION eventButtonUpload


//FUNKTION uploadArtwork
async function uploadArtworkSingle(file) {
    console.log("functionExecuted: uploadArtwork()");


    const { data, error } = await supa.storage
    .from('Artwork')
    .upload('Public/' + file.name, file)

    console.log(data);

    if (error) {
      
        console.log("error: ", error);

    } else {
      // Handle success
    }
  }//ENDE FUNKTION uploadArtwork





//FUNKTION uploadArtworkToUserFolder
async function uploadArtworkToUserFolder(file) {

    console.log("functionExecuted: uploadArtwork2()");

    console.log(currentUser);

    let idCurrentUser = currentUser.id;

  
    const { data, error } = await supa.storage
    .from('Artwork')
    .upload('/'+ idCurrentUser + '/' + file.name, file)

    console.log(data);

    if (error) {
      
        console.log("error: ", error);

    } else {
      // Handle success
    }
  }//ENDE FUNKTION uploadArtworkToUserFolder


//FUNKTION uploadArtworkFolder

async function uploadArtworkFolder() {

    console.log("functionExecuted: uploadArtwork3()");

    let files = inputArtworkUpload.files;

    if (files.length === 0) {
        alert('Please select files to upload.');
        return;
      }
    
      const filePromises = [];
    
      for (const file of files) {
        const filePath = 'Public/' + file.name; // Adjust the destination path as needed
        const filePromise = supa.storage
          .from('Artwork')
          .upload(filePath, file);
    
        filePromises.push(filePromise);
      }
    
      try {
        const results = await Promise.all(filePromises);
        console.log('Upload success:', results);
      } catch (error) {
        console.error('Upload error:', error);
      }

}//ENDE FUNKTION uploadArtworkFolder
