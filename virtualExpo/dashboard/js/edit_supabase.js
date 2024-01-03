console.log("fileLoaded: edit_supabase.js");


//ABSCHNITT variabeln ==================================================================================================

import { supa } from './setup_supabase.js';
import {currentUser} from './auth_supabase.js';


//ENDE ABSCHNITT variabeln ==============================================================================================

let orgaObject;
let orga_id;

let selectedExpoID = loadFromLocalStorage("selectedExpoID");
let selectedArtworkID = loadFromLocalStorage("selectedArtworkID");

let currentExpoName;
let currentExpoStart;
let currentExpoEnd;
let currentExpoLink;


let newExpo;
let newExpoHash;
let newExpoURL;

let defaultExpoName = "untitled";
let defaultExpoStart = new Date().toISOString().slice(0, 10);
let defaultExpoEnd = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 10);

let expoName;
let expoStart;
let expoEnd;
let expoLink;

let currentArrayArtworkExpo;




let visitURL = "https://palmavilluan.github.io" + "/virtualExpo" +"/?";




let inputArtworkUploadFile = document.getElementById("inputArtworkUploadFile");
let buttonArtworkAddFile = document.getElementById("buttonArtworkAddFile");

let inputArtworkUploadFolder = document.getElementById("inputArtworkUploadFolder");
let buttonArtworkAddFolder = document.getElementById("buttonArtworkAddFolder");

let arrayArtwork = [];

let currentArtwork = 0;

let defaultArtistName = "unknown";
let defaultTitle = "untitled";
let defaultYear = "1999";
let defaultMonth = "15";
let defaultMedium = "unknown";
let defaultSurface = "unknown";
let defaultHeight = "0";
let defaultWidth = "0";
let defaultUnit = "cm";
let defaultDescription = "no description";

let storageArtworkURL = "https://jozvukgfgcazwazxxyjg.supabase.co/storage/v1/object/public/" + "Artwork/Public/";
let storageLogoURL = "https://jozvukgfgcazwazxxyjg.supabase.co/storage/v1/object/public/" + "Logo/Public/";

class Expo{
    constructor(expoName, expoStart, expoEnd, expoLink){
        this.expoName = expoName;
        this.expoStart = expoStart;
        this.expoEnd = expoEnd;
        this.expoLink = expoLink;
        this.expoHash = "";
        this.expoURL = "";
    }
      
}

class Artwork {
    constructor(
      file
    ) {
      this.file = file;
      this.artworkID = "";
      this.artworkHash = "";
      this.artworkURL = "";
      this.artistName = defaultArtistName;
      this.title = defaultTitle;
      this.year = defaultYear;
      this.month = defaultMonth;
      this.medium = defaultMedium;
      this.surface = defaultSurface;
      this.height = defaultHeight;
      this.width = defaultWidth;
      this.unit = defaultUnit;
      this.description = defaultDescription;
    }
  }
  


//ABSCHNITT funktionen aufruf============================================================================================

edit_expo_seq();

edit_artwork_seq();

add_artwork_seq();

edit_orga_seq();

//ENDE ABSCHNITT funktionen aufruf=======================================================================================


//ABSCHNITT funktionen definition========================================================================================

//ENDEN ABSCHNITT funktionen definition===================================================================================


//BEREICH edit_expo_seq--------------------------------------------------------------------------------------------------
//FUNKTION edit_expo_seq

async function edit_expo_seq() {

    console.log("functionExecuted: edit_expo_seq()");

    console.log("selectedExpoID: ", selectedExpoID);

    eventButtonEditExpo();

    eventButtonSaveExpo();

    eventButtonCreateExpo();

    eventInputExpoName();
    eventInputExpoStart();
    eventInputExpoEnd();
    eventInputExpoLink();

}//ENDE FUNKTION edit_expo_seq   

            
            //FUNKTION eventButtonEditExpo()
            function eventButtonEditExpo(){
                            
                    console.log("functionExecuted: eventButtonEditExpo()");

                        buttonEditExpo.addEventListener("click", function(){

                            console.log("elementClicked: buttonEditExpo");

                            enablePointerEvents(infoExpo);

                            buttonEditExpo.style.display = "none";

                            buttonSaveExpo.style.display = "block";


                        
                        })

                    
            }//ENDE FUNKTION eventButtonEditExpo()

            //FUNKTION eventButtonSaveExpo()
            function eventButtonSaveExpo(){

                console.log("functionExecuted: eventButtonSaveExpo()");

                buttonSaveExpo.addEventListener("click", function(){

                    console.log("elementClicked: buttonSaveExpo");

                    disablePointerEvents(infoExpo);

                    buttonEditExpo.style.display = "block";

                    buttonSaveExpo.style.display = "none";

                    updateExpo();

                

                })


            }//ENDE FUNKTION eventButtonSaveExpo()

            //FUNKTION updateExpo()
            async function updateExpo(){

                console.log("functionExecuted: updateExpo()");

                let expoName = inputExpoName.value;
                let expoStart = inputExpoStart.value;
                let expoEnd = inputExpoEnd.value;
                let expoLink = inputExpoLink.value;

                console.log("expoName: ", expoName);

                selectedExpoID = await loadFromLocalStorage("selectedExpoID");
                console.log("selectedExpoID!!!!: ", selectedExpoID);


                let { data, error } = await supa
                .from('Exposition')
                .update({ expoName: expoName, expoStart: expoStart, expoEnd: expoEnd, expoLink: expoLink })
                .eq('id', selectedExpoID)

                if (error) {
                    console.log("error: ", error);
                }

                console.log("data: ", data);

            }//ENDE FUNKTION updateExpo()


            //FUNKTION createNewExpoObject()
            async function createNewExpoObject(){

                console.log("functionExecuted: createNewExpoObject()");

                inputExpoName.value = defaultExpoName;
                inputExpoStart.value = defaultExpoStart;
                inputExpoEnd.value = defaultExpoEnd;

                expoName = inputExpoName.value;
                expoStart = inputExpoStart.value;
                expoEnd = inputExpoEnd.value;
                expoLink = inputExpoLink.value;


                newExpo = new Expo(expoName, expoStart, expoEnd, expoLink);

                await createExpoHash();

                createExpoURL();

                orga_id = await loadFromLocalStorage("currentOrgaID");

                console.log("orga_id:", orga_id);


            }//ENDE FUNKTION createNewExpoObject()

            //FUNKTION createExpoHash()
            async function createExpoHash(){
            
                let { data, error } = await supa
                .from('Exposition')
                .select('expoHash')
            
                if (error) {
                    console.log("error: ", error);
                }
            
                console.log("data: ", data);
            
                let arrayExpoHash = data;
            
                newExpoHash = generateHash(8);
                
                //test the loop
                //newExpoHash = "d23a41ea";
            
                //check if hash already exists
            
                if (arrayExpoHash.length !== 0) {
                    console.log("arrayExpoHash isnot empty");
                
            
                for (let i = 0; i < arrayExpoHash.length; i++) {
                    
                    if (arrayExpoHash[i].expoHash == newExpoHash) {
                        console.log("expoHash already exists");
                        createExpoHash();
                    }
                }
            
                }
            
            
                newExpo.expoHash = newExpoHash;
            
            
            
            }//ENDE FUNKTION createExpoHash()
            
            //FUNKTION createExpoURL()
            function createExpoURL(){
            
                console.log("functionExecuted: createExpoURL()");
            
                newExpoURL = visitURL + newExpo.expoHash;
            
                newExpo.expoURL = newExpoURL
            
            }//ENDE FUNKTION createExpoURL()
            
            //FUNKTION generateHash
            // Function to generate a hash with a given number of characters
            function generateHash(length) {
                // Generate a random string
                const randomString = Math.random().toString(36).substring(2);
            
                // Use SHA-256 from crypto-js
                const hash = CryptoJS.SHA256(randomString).toString(CryptoJS.enc.Hex);
            
                // Truncate the hash to the desired length
                const truncatedHash = hash.substring(0, length);
            
                return truncatedHash;
            }//ENDE FUNKTION generateHash
        
            //FUNKTION eventButtonCreateExpo()
            function eventButtonCreateExpo(){

                console.log("functionExecuted: eventButtonCreateExpo()");

                buttonCreateExpo.addEventListener("click", function(){

                    console.log("elementClicked: buttonCreateExpo");

                    createExpo();

                    inputExpoName.value = "";
                    inputExpoStart.value = "";
                    inputExpoEnd.value = "";
                    inputExpoLink.value = "";

                    buttonCreateExpo.style.display = "none";
                    buttonEditExpo.style.display = "block";
                    buttonSaveExpo.style.display = "none";

                    //delete newExpo in local storage

                    localStorage.removeItem("newExpo");

                })

            }//ENDE FUNKTION eventButtonCreateExpo()

            //FUNKTION createExpo()
            async function createExpo(){
                console.log("functionExecuted: createExpo()");

                let expoName = inputExpoName.value;
                let expoStart = inputExpoStart.value;
                let expoEnd = inputExpoEnd.value;
                let expoLink = inputExpoLink.value;

                newExpo.expoName = expoName;
                newExpo.expoStart = expoStart;
                newExpo.expoEnd = expoEnd;
                newExpo.expoLink = expoLink;
            
                orga_id = await loadFromLocalStorage("currentOrgaID");
            
                console.log("orga_id:", orga_id);
            
                await insertExpo();

                disablePointerEvents(infoExpo);

                //delete selectedExpoID in local storage

                localStorage.removeItem("selectedExpoID");
                localStorage.removeItem("selectedArtworkID");

                //reload page
                //location.reload();

                
            
            }//ENDE FUNKTION createExpo()

            //FUNKTION insertExpo()
            async function insertExpo(){

                let expoHash = newExpo.expoHash;
                let expoURL = newExpo.expoURL;
                let expoName = newExpo.expoName;
                let expoStart = newExpo.expoStart;
                let expoEnd = newExpo.expoEnd;
                let expoLink = newExpo.expoLink;
            
                let { data, error } = await supa
                .from('Exposition')
                .insert([
                    {   expoHash: expoHash,
                        expoURL: expoURL,
                        expoName: expoName,
                        expoStart: expoStart, 
                        expoEnd: expoEnd,
                        expoLink: expoLink,
                        orga_id: orga_id
            
                }
                ]);
            
                if (error) {
                    console.log("error: ", error);
                }
                
            
            
            }//ENDE FUNKTION insertExpo()

            //FUNKTION eventInputExpoName()
            function eventInputExpoName(){

                console.log("functionExecuted: eventInputExpoName()");

                inputExpoName.addEventListener("change", function(){

                    console.log("elementChanged: inputExpoName");

                    currentExpoName = inputExpoName.value;

                    let currentExpo = loadFromLocalStorage("currentExpo");

                    currentExpo.expoName = currentExpoName;

                    saveToLocalStorage("currentExpo" , currentExpo);

                })

            }//ENDE FUNKTION eventInputExpoName()

            //FUNKTION eventInputExpoStart()
            function eventInputExpoStart(){

                console.log("functionExecuted: eventInputExpoStart()");

                inputExpoStart.addEventListener("change", function(){

                    console.log("elementChanged: inputExpoStart");

                    currentExpoStart = inputExpoStart.value;

                    let currentExpo = loadFromLocalStorage("currentExpo");

                    currentExpo.expoStart = currentExpoStart;

                    saveToLocalStorage("currentExpo" , currentExpo);

                })  

            }//ENDE FUNKTION eventInputExpoStart()

            //FUNKTION eventInputExpoEnd()
            function eventInputExpoEnd(){

                console.log("functionExecuted: eventInputExpoEnd()");

                inputExpoEnd.addEventListener("change", function(){

                    console.log("elementChanged: inputExpoEnd");

                    currentExpoEnd = inputExpoEnd.value;


                    let currentExpo = loadFromLocalStorage("currentExpo");

                    currentExpo.expoEnd = currentExpoEnd;

                    saveToLocalStorage("currentExpo" , currentExpo);

                })

            }//ENDE FUNKTION eventInputExpoEnd()

            //FUNKTION eventInputExpoLink()
            function eventInputExpoLink(){

                console.log("functionExecuted: eventInputExpoLink()");

                inputExpoLink.addEventListener("change", function(){

                    console.log("elementChanged: inputExpoLink");

                    currentExpoLink = inputExpoLink.value;

                    let currentExpo = loadFromLocalStorage("currentExpo");

                    currentExpo.expoLink = currentExpoLink;

                    saveToLocalStorage("currentExpo" , currentExpo);

                })

            }//ENDE FUNKTION eventInputExpoLink()

//ENDEN BEREICH edit_expo_seq---------------------------------------------------------------------------------------------  


//BEREICH edit_artwork_seq-----------------------------------------------------------------------------------------------

        //FUNKTION edit_artwork_seq()
        async function edit_artwork_seq(){

            console.log("functionExecuted: edit_artwork_seq()");

            eventButtonEditArtwork();

            eventButtonSaveArtwork();

        }//ENDE FUNKTION edit_artwork_seq()

                //FUNKTION eventButtonEditArtwork()
                function eventButtonEditArtwork(){

                    console.log("functionExecuted: eventButtonEditArtwork()");

                    let buttonEditArtwork = document.getElementById("buttonEditArtwork");

                    buttonEditArtwork.addEventListener("click", function(){

                        console.log("elementClicked: buttonEditArtwork");

                        enablePointerEvents(infoArtwork);

                        buttonEditArtwork.style.display = "none";

                        buttonSaveArtwork.style.display = "block";

                    })

                }//ENDE FUNKTION eventButtonEditArtwork()

                //FUNKTION eventButtonSaveArtwork()
                function eventButtonSaveArtwork(){

                    console.log("functionExecuted: eventButtonSaveArtwork()");

                    let buttonSaveArtwork = document.getElementById("buttonSaveArtwork");

                    buttonSaveArtwork.addEventListener("click", function(){

                        console.log("elementClicked: buttonSaveArtwork");

                        disablePointerEvents(infoArtwork);

                        buttonEditArtwork.style.display = "block";

                        buttonSaveArtwork.style.display = "none";

                        console.log("selectedArtworkID: ", selectedArtworkID);

                        updateArtwork();

                    })

                }//ENDE FUNKTION eventButtonSaveArtwork()

                //FUNKTION updateArtwork()
                async function updateArtwork(){

                    console.log("functionExecuted: updateArtwork()");

                    selectedArtworkID = await loadFromLocalStorage("selectedArtworkID");

                    let artistName = inputArtistName.value;
                    let artworkTitle = inputArtworkTitle.value;
                    let artworkYear = inputArtworkYear.value;
                    let artworkMonth = inputArtworkMonth.value;
                    let artworkMedium = inputArtworkMedium.value;
                    let artworkSurface = inputArtworkSurface.value;
                    let artworkHeight = inputArtworkHeight.value;
                    let artworkWidth = inputArtworkWidth.value;
                    let artworkUnit = inputArtworkUnit.value;
                    let artworkDescription = inputArtworkDescription.value;

                    console.log("artistName: ", artistName);

                    let { data, error } = await supa
                    .from('Artwork')
                    .update({ artistName: artistName, title: artworkTitle, year: artworkYear, month: artworkMonth, medium: artworkMedium, surface: artworkSurface, height: artworkHeight, width: artworkWidth, unit: artworkUnit, description: artworkDescription })
                    .eq('id', selectedArtworkID)

                    if (error) {
                        console.log("error: ", error);
                    }

                    console.log("data: ", data);

                }//ENDE FUNKTION updateArtwork()


//ENDEN BEREICH edit_artwork_seq-----------------------------------------------------------------------------------------

//BEREICH add_artwork_seq------------------------------------------------------------------------------------------------

        //FUNKTION add_artwork_seq()
        async function add_artwork_seq(){

            console.log("functionExecuted: add_artwork_seq()");

            eventButtonAddArtwork();

            eventInputArtworkUploadFile();


            eventInputArtworkUploadFolder();

            /* eventButtonArtworkAddFile(); */

            /* eventButtonArtworkAddFolder(); */

            eventButtonUploadArtwork();

        }

                function eventButtonAddArtwork(){

                    console.log("functionExecuted: eventButtonAddArtwork()");

                    let buttonAddArtwork = document.getElementById("buttonAddArtwork");

                    buttonAddArtwork.addEventListener("click", function(){

                        console.log("elementClicked: buttonAddArtwork");

                        enablePointerEvents(inputUploadContainer);

                        buttonAddArtwork.style.display = "none";

                        buttonUploadArtwork.style.display = "block";

                    })
                        
                       
                }//ENDE FUNKTION eventButtonArtworkAdd(

                //FUNKTION eventInputArtworkUploadFile
                function eventInputArtworkUploadFile() {

                console.log("functionExecuted: eventInputArtworkUpload()");
              
                inputArtworkUploadFile.addEventListener("change", function() {
              
                  if (inputArtworkUploadFile.files.length > 0) {
              
                        console.log("inputArtworkUploadFile.files: ", inputArtworkUploadFile.files);

                        fillArrayArtwork("File");

                        inputArtworkUploadFile.value = "";
            
                        //trigger change event on inputArtworkUploadFile to hide buttonArtworkAdd
                        inputArtworkUploadFile.dispatchEvent(new Event('change'));

                        //buttonArtworkAddFile.style.display = "block";

                    } else {
              
                      console.log("inputArtworkUploadFile.files: ", inputArtworkUploadFile.files);
                        
                        //buttonArtworkAddFile.style.display = "none";
                
                      }
              
                });//ENDE FUNKTION eventInputArtworkUpload
              
                }//ENDE FUNKTION eventInputArtworkUpload
                        
                function eventInputArtworkUploadFolder() {
                        
                            console.log("functionExecuted: eventInputArtworkUpload()");
                        
                            inputArtworkUploadFolder.addEventListener("change", function() {
                        
                            if (inputArtworkUploadFolder.files.length > 0) {

                                fillArrayArtwork("Folder");

                                inputArtworkUploadFolder.value = "";
                
                                //trigger change event on inputArtworkUploadFile to hide buttonArtworkAdd
                                inputArtworkUploadFolder.dispatchEvent(new Event('change'));
                

                                
                                //buttonArtworkAddFolder.style.display = "block";
                                } else {
                        
                                //buttonArtworkAddFolder.style.display = "none";
                        
                                }
                        
                        
                            });
                        
                        
                }//ENDE FUNKTION eventInputArtworkUpload

                //FUNKTION fillArrayArtwork()
                async function fillArrayArtwork(uploadMethod) {

                    console.log("functionExecuted: createClassArtwork()");
                
                //add upload method to inputArtworkUpload
                
                console.log(uploadMethod);
                
                let files;
                
                if (uploadMethod == "File") {
                
                    files = inputArtworkUploadFile.files;
                
                    console.log("files: ", files);
                
                } else if (uploadMethod == "Folder") {
                
                    files = inputArtworkUploadFolder.files;
                
                    console.log("files: ", files);
                
                    }
                
                
                
                    for (const file of files) {
                
                    let artwork = new Artwork(file);
                
                    console.log("artwork1: ", artwork);
                
                    //create artworkHash
                
                    await createArtworkHash(artwork);
                
                    createArtworkURL(artwork);
                
                
                    arrayArtwork.push(artwork);
                
                    }
                
                    console.log("arrayArtwork: ", arrayArtwork);

                    display_list_artworkUpload();
                
                    //spanTotalArtwork.innerHTML = arrayArtwork.length;

                 }//ENDE FUNKTION createClassArtwork


                //FUNKTION display_list_artworktUpload()
                function display_list_artworkUpload() {

                    console.log("functionExecuted: display_list_artworkUpload()");


                    let listArtworkUploadContainer = document.getElementById("listArtworkUploadContainer");

                    listArtworkUploadContainer.innerHTML = "";

                    for (let artwork in arrayArtwork) {

                        console.log("artwork: ", arrayArtwork[artwork]);

                        let artworkContainer = document.createElement("div");

                        artworkContainer.classList.add("artworkContainer");

                        let artworkName = document.createElement("p");
                        artworkName.classList.add("artworkName");
                        artworkName.innerHTML = arrayArtwork[artwork].file.name;

                       /*  let artworkPreview = document.createElement("img");
                        artworkPreview.classList.add("artworkThumb");
                        artworkPreview.src = URL.createObjectURL(arrayArtwork[artwork].file); */

                        artworkContainer.appendChild(artworkName);
                        //artworkContainer.appendChild(artworkPreview);

                        listArtworkUploadContainer.appendChild(artworkContainer);



                    }





                }//ENDE FUNKTION display_list_artworkUpload()

                
                function eventButtonUploadArtwork() {

                    console.log("functionExecuted: eventButtonUploadArtwork()");

                    let buttonUploadArtwork = document.getElementById("buttonUploadArtwork");
                
                    buttonUploadArtwork.addEventListener("click", function() {
                
                    console.log("elementClicked: buttonUploadArtwork");
                
                    uploadSelectedArtwork();
                
                
                    });
                
                }//ENDE FUNKTION eventButtonUploadArtwork
                
                
                async function uploadSelectedArtwork() {
                
                    console.log("functionExecuted: uploadSelectedArtwork()");
                
                    for (let artwork in arrayArtwork) {
                
                    console.log("artwork: ", arrayArtwork[artwork]);
                
                    await uploadArtworkSingle(arrayArtwork[artwork]);
                
                    await insertArtwork(arrayArtwork[artwork]);
                
                    await getArtworkID(arrayArtwork[artwork]);
                
                    await assignArtworkToExpo(arrayArtwork[artwork]);
                
                
                    }

                    arrayArtwork = [];
                    
                    await display_list_artworkUpload();

            
                    //reload page
                    //location.reload();

                
                }//ENDE FUNKTION uploadSelectedArtwork
                
                
                //FUNKTION insertArtwork
                async function insertArtwork(artwork) {
                
                    console.log("functionExecuted: insertArtwork()");

                    
                    let file = artwork.file;
                    let fileName = file.name;
                    //remove file extension from fileName
                    fileName = fileName.split(".")[0];
                    //console.log("artwork: ", artwork);
                    //console.log("file: ", file);
                    //console.log("fileName: ", fileName);
                    
                
                    let artworkHash = artwork.artworkHash;
                    let artworkURL = artwork.artworkURL;
                    let artistName = artwork.artistName;
                    let title = fileName;
                    let year = artwork.year;
                    let month = artwork.month;
                    let medium = artwork.medium;
                    let surface = artwork.surface;
                    let height = artwork.height;
                    let width = artwork.width;
                    let unit = artwork.unit;
                    let description = artwork.description;
                    orga_id = await loadFromLocalStorage("currentOrgaID");
                
                    let { data, error } = await supa
                    .from('Artwork')
                    .insert([
                        {   artworkHash: artworkHash,
                            artworkURL: artworkURL,
                            artistName: artistName,
                            title: title,
                            year: year,
                            month: month,
                            medium: medium,
                            surface: surface,
                            height: height,
                            width: width,
                            unit: unit,
                            description: description,
                            orga_id: orga_id
                    }
                    ]);
                
                    if (error) {
                
                        console.log("error: ", error);
                
                    } else {
                
                    console.log("data: ", data);
                
                    }
                
                }//ENDE FUNKTION insertArtwork
                
                
                async function getArtworkID(artwork) {
                
                    console.log("functionExecuted: getArtworkID()");
                
                    let artworkHash = artwork.artworkHash;
                
                    console.log("artworkHash: ", artworkHash);
                
                    let { data, error } = await supa
                    .from('Artwork')
                    .select('id')
                    .eq('artworkHash', artworkHash)
                
                    if (error) {
                        
                        console.log("error: ", error);
                    
                    } else {
                
                        console.log("data: ", data);
                
                        artwork.artworkID = data[0].id;

                
                    }
                
                }
                
                
                async function assignArtworkToExpo(artwork) {
                
                    console.log("functionExecuted: assignArtworkToExpo()");
                
                    selectedExpoID = await loadFromLocalStorage("selectedExpoID");

                    console.log("selectedExpoID: ", selectedExpoID);
                
                    let expo_id = selectedExpoID;
                    let artwork_id = artwork.artworkID;
                
                    console.log("expo_id: ", expo_id);
                    console.log("artwork_id: ", artwork_id);
                
                    let { data, error } = await supa
                    .from('ArtworkExposition')
                    .insert([
                        { artwork_id: artwork_id,  
                        expo_id: expo_id
                    }
                    ]);
                
                    if (error) {
                
                        console.log("error: ", error);
                
                    } else {
                
                    console.log("data: ", data);
                
                    }
                
                }//ENDE FUNKTION assignArtworkToExpo
                
                        
                
                //FUNKTION uploadArtwork
                async function uploadArtworkSingle(artwork) {
                    console.log("functionExecuted: uploadArtwork()");
                
                    let file = artwork.file;
                
                    let fileName = artwork.artworkHash;
                
                    const { data, error } = await supa.storage
                    .from('Artwork')
                    .upload('Public/' + fileName, file)
                
                    console.log(data);
                
                    if (error) {
                    
                        console.log("error: ", error);
                
                    } else {
                    // Handle success
                    }
                }//ENDE FUNKTION uploadArtwork
                
                
                async function createArtworkHash(artwork) {
                
                    console.log("functionExecuted: createArtworkHash()");
                
                    let { data, error } = await supa
                    .from('Artwork')
                    .select('artworkHash')
                
                    if (error) {
                
                        console.log("error: ", error);
                
                
                    } else {
                
                    console.log("data: ", data);
                
                    let arrayArtworkHash = data;
                
                    let artworkHash = generateHash(8);
                
                    console.log("artworkHash: ", artworkHash);
                
                
                    if (arrayArtworkHash.length !== 0) {
                
                        console.log("arrayArtworkHash isnot empty");
                
                        for (let i = 0; i < arrayArtworkHash.length; i++) {
                
                            if (arrayArtworkHash[i].artworkHash == artworkHash) {
                                
                                console.log("artworkHash already exists");
                    
                                createArtworkHash();
                    
                            }
                
                        }
                
                    }
                
                    artwork.artworkHash = artworkHash;
                
                    console.log("artwork: ", artwork);
                
                    }
                
                }//ENDE FUNKTION createArtworkHash
                
                
                function createArtworkURL(artwork) {
                
                    console.log("functionExecuted: createArtworkURL()");
                
                    let artworkURL = storageArtworkURL + artwork.artworkHash;
                
                    artwork.artworkURL = artworkURL;
                
                    console.log("artwork: ", artwork);
                
                
                }


                /* //FUNKTION eventButtonArtworkAdd
                function eventButtonArtworkAddFile() {

                console.log("functionExecuted: eventButtonArtworkAdd()");
            
                buttonArtworkAddFile.addEventListener("click", function() {
            
                    console.log("elementClicked: buttonArtworkAdd");
            
            
                    fillArrayArtwork("File");
            
                    //togglePreviewArtwork();
            
                    //previewCurrentArtwork();
            
                    inputArtworkUploadFile.value = "";
            
                    //trigger change event on inputArtworkUploadFile to hide buttonArtworkAdd
                    inputArtworkUploadFile.dispatchEvent(new Event('change'));
            
                });
            
                }//ENDE FUNKTION eventButtonArtworkAdd
                */
                
            
                /* //FUNKTION eventButtonArtworkAdd
                function eventButtonArtworkAddFolder() {
                
                    console.log("functionExecuted: eventButtonArtworkAdd()");
                
                    buttonArtworkAddFolder.addEventListener("click", function() {
                
                        console.log("elementClicked: buttonArtworkAdd");
                
                
                        fillArrayArtwork("Folder");
                
                        togglePreviewArtwork();
                
                        previewCurrentArtwork();
                
                        inputArtworkUploadFolder.value = "";
                
                        //trigger change event on inputArtworkUploadFile to hide buttonArtworkAdd
                        inputArtworkUploadFolder.dispatchEvent(new Event('change'));
                
                    });
                
                }//ENDE FUNKTION eventButtonArtworkAdd */


//ENDE BEREICH add_artwork_seq------------------------------------------------------------------------------------------


//BEREICH edit_orga_seq-------------------------------------------------------------------------------------------------

        //FUNKTION edit_orga_seq()  

        async function edit_orga_seq(){

            console.log("functionExecuted: edit_orga_seq()");

            eventButtonEditOrga();

            

            eventButtonSaveOrga();

            eventButtonChangeLogoOrga();

            eventButtonUploadLogoOrga();

        }//ENDE FUNKTION edit_orga_seq()

                //FUNKTION eventButtonEditOrga()
                function eventButtonEditOrga(){

                    console.log("functionExecuted: eventButtonEditOrga()");

                    let buttonEditOrga = document.getElementById("buttonEditOrga");

                    buttonEditOrga.addEventListener("click", function(){

                        console.log("elementClicked: buttonEditOrga");

                        enablePointerEvents(inputOrgaContainer);

                        buttonEditOrga.style.display = "none";

                        buttonSaveOrga.style.display = "block";

                    })

                }//ENDE FUNKTION eventButtonEditOrga()


                //FUNKTION eventButtonSaveOrga()
                function eventButtonSaveOrga(){

                    console.log("functionExecuted: eventButtonSaveOrga()");

                    let buttonSaveOrga = document.getElementById("buttonSaveOrga");

                    buttonSaveOrga.addEventListener("click", function(){

                        console.log("elementClicked: buttonSaveOrga");

                        disablePointerEvents(inputOrgaContainer);

                        buttonEditOrga.style.display = "block";

                        buttonSaveOrga.style.display = "none";

                        updateOrga();

                    })

                }//ENDE FUNKTION eventButtonSaveOrga()

                function eventButtonChangeLogoOrga(){

                    console.log("functionExecuted: eventButtonChangeLogoOrga()");

                    let buttonChangeLogoOrga = document.getElementById("buttonChangeLogoOrga");

                    buttonChangeLogoOrga.addEventListener("click", function(){

                        console.log("elementClicked: buttonChangeLogoOrga");

                        let inputLogoOrga = document.getElementById("inputLogoOrga");
                        let buttonUploadLogoOrga = document.getElementById("buttonUploadLogoOrga");
                        let imgPreviewLogoOrga = document.getElementById("previewLogoOrga");

                        inputLogoOrga.click();

                        if (inputLogoOrga.files.length > 0) {

                            console.log("inputLogoOrga.files: ", inputLogoOrga.files);

                            imgPreviewLogoOrga.src = URL.createObjectURL(inputLogoOrga.files[0]);

                        }





                        buttonChangeLogoOrga.style.display = "none";
                        buttonUploadLogoOrga.style.display = "";







                    })

                }

                function eventButtonUploadLogoOrga(){

                    console.log("functionExecuted: eventButtonUploadLogoOrga()");

                    let buttonUploadLogoOrga = document.getElementById("buttonUploadLogoOrga");

                    buttonUploadLogoOrga.addEventListener("click", function(){

                        console.log("elementClicked: buttonUploadLogoOrga");

                        uploadLogoOrga();

                    })

                }


                //FUNKTION updateOrga()
                async function updateOrga(){

                    console.log("functionExecuted: updateOrga()");

                    let orgaName = inputNameOrga.value;
                    let orgaLink = inputLinkOrga.value;

                    let orga_id = await loadFromLocalStorage("currentOrgaID");

                    console.log("orgaName: ", orgaName);

                    let { data, error } = await supa

                    .from('Organisation')
                    .update({ orgaName: orgaName, orgaLink: orgaLink })
                    .eq('id', orga_id)

                    if (error) {

                        console.log("error: ", error);

                    }

                    console.log("data: ", data);

                }//ENDE FUNKTION updateOrga()

                //FUNKTION uploadLogoOrga()
                async function uploadLogoOrga(){

                    console.log("functionExecuted: uploadLogoOrga()");

                    let inputLogoOrga = document.getElementById("inputLogoOrga");

                    let file = inputLogoOrga.files[0];

                    let fileName = file.name;

                    //remove file extension from fileName

                    fileName = fileName.split(".")[0];

                    console.log("fileName: ", fileName);

                    let logoURL = storageLogoURL + fileName;

                    console.log("logoURL: ", logoURL);

                    const { data, error } = await supa.storage
                    .from('Logo')
                    .upload('Public/' + fileName, file)

                    console.log(data);

                    if (error) {

                        console.log("error: ", error);

                    } 

                    //update logoURL in database

                    let orga_id = await loadFromLocalStorage("currentOrgaID");

                    console.log("orga_id: ", orga_id);


                    let { data2, error2 } = await supa
                    .from('Organisation')
                    .update({logo: logoURL})
                    .eq('id', orga_id)

                    if (error2) {

                        console.log("error: ", error2);

                    }


                }




                
                
             



export {createNewExpoObject}
