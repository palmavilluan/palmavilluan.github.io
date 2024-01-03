console.log("fileLoaded: display_supabase.js");


//ABSCHNITT variabeln ==================================================================================================
import { supa } from './setup_supabase.js';
import {currentUser} from './auth_supabase.js';
import {createNewExpoObject} from './edit_supabase.js';


let dashboardObject_original;
let dashboardObject_modified = loadFromLocalStorage("dashboardObject_modified");


let currentArrayExpo;
let selectedExpoID;


//ab hier abarbeiten möglichst direkt in dashboardObject_modified zwischen speichern, 
//bei save button dann dashboardObject_modified in dashboardObject_original speichern, 
//veränderte columns in supabase updaten

/*

Vorschlag für fileStruktur:

read_supabase.js = lesen der Daten aus supabase und speichern in dashboardObject_original (x), 
abspeichern currentOrgaID in localStorage (x)

display_supabase.js = Anzeigen & Auswählen der Daten aus dashboardObject_original 
in ExpoList, InfoExpo, ArtworkList, PreviewArtwork InfoArtwork
via selectedExpoID, selectedArtworkID

edit_supabase.js = editieren der Daten in dashboardObject_modified 
& schreiben der modifizierten Date in supabase, 
in InfoExpo, uploadArtwork, InfoArtwork
via selectedExpoID, selectedArtworkID


editOrga_supabase.js = editieren der Daten bezüglich Orga in dashboardObject_modified



*/

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
let selectedArtworkID;



let visitURL = "https://palmavilluan.github.io/" + "/virtualExpo/visit" +"/?";

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



//ABSCHNITT Funktionen aufruf ==================================================================================================
disablePointerEvents(infoExpo);
disablePointerEvents(infoArtwork);
disablePointerEvents(inputUploadContainer);
disablePointerEvents(inputOrgaContainer);

eventButtonNewExpo();





//display_listExpo_seq();



//ABSCHNITT Funktionen defintion ==================================================================================================


//BEREICH display_listExpo_seq----------------------------------------------------------------------------------------------------------------------------

//FUNKTION display_listExpo_seq()
        async function display_listExpo_seq(){

            console.log("functionExecuted: display_listExpo_seq()");

            dashboardObject_original = await loadFromLocalStorage("dashboardObject_original");

            console.log("dashboardObject_original!!!: ", dashboardObject_original)

            currentArrayExpo = dashboardObject_original.arrayExpo;

            //wenn arrayExpo nicht leer
            if (currentArrayExpo.length !== 0){
        
            await display_arrayExpo();

            await eventExpoContainer();


                 selectedExpoID = await loadFromLocalStorage("selectedExpoID");

                    if (selectedExpoID == null){
                    await selectLatestExpo();

                    } else {

                        await highlightSelectedExpo();
                    }
                   


           /*  await selectLatestExpo();*/

            }

            await setInfoExpo_seq();

            await display_listArtwork_seq();
            

            display_orga_seq();

             
            
        
        
    }//ENDE FUNKTION display_listExpo_seq()


                //FUNKTION display_arrayExpo()
                function display_arrayExpo(){

                    console.log("functionExecuted: display_arrayExpo()");

                    let currentArrayExpo = dashboardObject_original.arrayExpo;

                    let listExpoContainer = document.getElementById("listExpoContainer");

                    listExpoContainer.innerHTML = "";

                    for (let expo in currentArrayExpo){

                        let expoContainer = document.createElement("div");
                        expoContainer.classList.add("expoContainer");
                        expoContainer.id = currentArrayExpo[expo].id;

                        let expoName = document.createElement("p");
                        expoName.classList.add("expoName");
                        expoName.innerHTML = currentArrayExpo[expo].expoName;

                        let wrapperButtonExpoContainer = document.createElement("div");
                        wrapperButtonExpoContainer.classList.add("wrapperButtonExpoContainer");



                        let expoButtonOpen = document.createElement("button");
                        expoButtonOpen.classList.add("expoButton");
                        expoButtonOpen.classList.add("expoButtonOpen");

                        expoButtonOpen.innerHTML = "open";
                        //add link to open expoURL in new tab
                        expoButtonOpen.addEventListener("click", function(){
                            console.log("elementClicked: expoButtonOpen");

                            let expoURL = currentArrayExpo[expo].expoURL;

                            //open expoURL in new tab
                            window.open(expoURL, '_blank');

                        })

                        let expoButtonShare = document.createElement("button");
                        expoButtonShare.classList.add("expoButton");
                        expoButtonShare.classList.add("expoButtonShare");
                        expoButtonShare.innerHTML = "share";

                        expoButtonShare.addEventListener("click", function(){
                            console.log("elementClicked: expoButtonShare");

                            let expoURL = currentArrayExpo[expo].expoURL;

                            //copy expoURL to clipboard
                            navigator.clipboard.writeText(expoURL);

                        })

                        let expoButtonEmbbed = document.createElement("button");
                        expoButtonEmbbed.classList.add("expoButton");
                        expoButtonEmbbed.classList.add("expoButtonEmbbed");
                        expoButtonEmbbed.innerHTML = "embbed";

                        expoButtonEmbbed.addEventListener("click", function(){
                            console.log("elementClicked: expoButtonEmbbed");

                            let expoURL = currentArrayExpo[expo].expoURL;

                            //creat iframe with expoURL
                            let iframe = document.createElement("iframe");
                            iframe.src = expoURL;
                            
                            //copy iframe to clipboard

                            navigator.clipboard.writeText(iframe.outerHTML);

                        })


                        wrapperButtonExpoContainer.appendChild(expoButtonOpen);
                        wrapperButtonExpoContainer.appendChild(expoButtonShare);
                        wrapperButtonExpoContainer.appendChild(expoButtonEmbbed);




                        expoContainer.appendChild(expoName);
                        expoContainer.appendChild(wrapperButtonExpoContainer);
                     
                        

                        listExpoContainer.appendChild(expoContainer);

                    }

                }//ENDE FUNKTION display_arrayExpo()

                //FUNKTION eventExpoContainer()
                function eventExpoContainer(){

                    console.log("functionExecuted: eventExpoContainer()");

                    let arrayExpoContainer = document.getElementsByClassName("expoContainer");

                    for (let i = 0; i < arrayExpoContainer.length; i++){

                        arrayExpoContainer[i].addEventListener("click", function(){

                            console.log("elementClicked: expoContainer");

                            console.log("i: ", i);

                            console.log("currentArrayExpo[i]: ", currentArrayExpo[i]);

                            selectedExpoID = currentArrayExpo[i].id;

                            console.log("selectedExpoID: ", selectedExpoID);

                            saveToLocalStorage("selectedExpoID" , selectedExpoID);

                            saveToLocalStorage("currentExpo" , currentArrayExpo[i])

                            highlightSelectedExpo();

                            setInfoExpo_seq();

                            display_listArtwork_seq();

                            //displayListArtwork_seq();

                        })

                    }


                }//ENDE FUNKTION eventExpoContainer()

                //FUNKTION selectLatestExpo()
                function selectLatestExpo(){

                    console.log("functionExecuted: selectLatestExpo()");

                    // Reverse the array to display the newest item on top
                    let reversedcurrentArrayExpo = currentArrayExpo.slice().reverse();

                    let latestExpo = reversedcurrentArrayExpo[reversedcurrentArrayExpo.length - 1];

                    //console.log("latestExpo: ", latestExpo);

                    selectedExpoID = latestExpo.id;

                    saveToLocalStorage("selectedExpoID" , selectedExpoID);

                    saveToLocalStorage("currentExpo" , latestExpo);

                    highlightSelectedExpo();




                }//ENDE FUNKTION selectLatestExpo()

                //FUNKTION highlightSelectedExpo()
                function highlightSelectedExpo(){

                    console.log("functionExecuted: highlightSelectedExpo()");

                    let expoContainer = document.getElementsByClassName("expoContainer");

                    for (let i = 0; i < expoContainer.length; i++){

                        if (expoContainer[i].id == selectedExpoID){

                            selectElement(expoContainer[i]);

                        } else {
                                
                                unselectElement(expoContainer[i]);
    
                            }

                    }

                }//ENDE FUNKTION highlightSelectedExpo() 


    //ENDE BEREICH display_listExpo_seq----------------------------------------------------------------------------------------------------------------------------
    

    //BEREICH setInfoExpo_seq----------------------------------------------------------------------------------------------------------------------------
    
    //FUNKTION setInfoExpo_seq()
    async function setInfoExpo_seq(){

        console.log("functionExecuted: displayInfoExpo_seq()");

           await displayInfoExpo();

            //eventButtonNewExpo();
/* 
           eventButtonEditExpo();

           eventButtonSaveExpo();

           eventInputExpoName();
           eventInputExpoStart();
           eventInputExpoEnd();
           eventInputExpoLink(); */

           

    } //ENDE FUNKTION setInfoExpo_seq()

               //FUNKTION displayInfoExpo()
               function displayInfoExpo(){

               console.log("functionExecuted: displayInfoExpo()");

               //console.log("selectedExpoID: ", selectedExpoID);

               for (let i = 0; i < currentArrayExpo.length; i++){

                   if (currentArrayExpo[i].id == selectedExpoID){

                       //console.log("selectedExpo: ", currentArrayExpo[i]);

                       inputExpoName.value = currentArrayExpo[i].expoName;
                       inputExpoStart.value = currentArrayExpo[i].expoStart;
                       inputExpoEnd.value = currentArrayExpo[i].expoEnd;
                       inputExpoLink.value = currentArrayExpo[i].expoLink;

                   }

               }


       


               }//ENDE FUNKTION displayInfoExpo()

                //FUNKTION eventButtonNewExpo()
                function eventButtonNewExpo(){

                    console.log("functionExecuted: eventButtonNewExpo()");
                
                    
                
                    buttonNewExpo.addEventListener("click", function(){
                
                        console.log("elementClicked: buttonNewExpo");
                        
                        buttonCreateExpo.style.display = "block";
                        buttonEditExpo.style.display = "none";
                        buttonSaveExpo.style.display = "none";
                
                        selectedExpoID = null;
                
                        saveToLocalStorage("selectedExpoID" , selectedExpoID);
                
                        highlightSelectedExpo();
                
                        inputExpoName.value = "";
                        inputExpoStart.value = "";
                        inputExpoEnd.value = "";
                        inputExpoLink.value = "";

                        enablePointerEvents(infoExpo);

                        createNewExpoObject();


                
                        
                
                    })
                }//ENDE FUNKTION eventButtonNewExpo()

              /*  //FUNKTION eventButtonEditExpo()
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


                   let { data, error } = await supa
                   .from('Exposition')
                   .update({ expoName: expoName, expoStart: expoStart, expoEnd: expoEnd, expoLink: expoLink })
                   .eq('id', selectedExpoID)

                   if (error) {
                       console.log("error: ", error);
                   }

                   console.log("data: ", data);

               }//ENDE FUNKTION updateExpo()
    

               //FUNKTION eventButtonNewExpo()
               function eventButtonNewExpo(){

                   console.log("functionExecuted: eventButtonNewExpo()");
               
                   
               
                   buttonNewExpo.addEventListener("click", function(){
               
                       console.log("elementClicked: buttonNewExpo");
                       
                       buttonCreateExpo.style.display = "block";
                       buttonEditExpo.style.display = "none";
                       buttonSaveExpo.style.display = "none";
               
                       selectedExpoID = null;
               
                       saveToLocalStorage("selectedExpoID" , selectedExpoID);
               
                       highlightSelectedExpo();
               
                       inputExpoName.value = "";
                       inputExpoStart.value = "";
                       inputExpoEnd.value = "";
                       inputExpoLink.value = "";

                       enablePointerEvents(infoExpo);

                       createNewExpoObject();


               
                       
               
                   })
               }//ENDE FUNKTION eventButtonNewExpo()

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

                   await getOrgaID();

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

                   let expoName = inputExpoName.value;
                   let expoStart = inputExpoStart.value;
                   let expoEnd = inputExpoEnd.value;
                   let expoLink = inputExpoLink.value;

                   newExpo.expoName = expoName;
                   newExpo.expoStart = expoStart;
                   newExpo.expoEnd = expoEnd;
                   newExpo.expoLink = expoLink;

                   

                  
                   await getOrgaID();
               
                   console.log("orga_id:", orga_id);
               
                   await insertExpo();
               
               
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

               }//ENDE FUNKTION eventInputExpoLink() */


//BEREICH display_listArtwork_seq----------------------------------------------------------------------------------------------------------------------------

        //FUNKTION display_listArtwork_seq()
        async function display_listArtwork_seq(){

            console.log("functionExecuted: display_listArtwork_seq()");

            if (currentArrayExpo.length !== 0){

            await display_arrayArtwork();

            

            console.log("currentArrayArtworkExpo: ", currentArrayArtworkExpo);

            if (currentArrayArtworkExpo.length !== 0){

            await eventArtworkContainer();

            await check_selectedArtworkID_localStorage();

            

            await display_infoArtwork_seq();

        }

        }
           

        }

                //FUNKTION display_arrayArtwork()
                function display_arrayArtwork(){

                    console.log("functionExecuted: display_arrayArtwork()");

                    //console.log("dashboardObject_original: ", dashboardObject_original);
                    let currentExpoID = loadFromLocalStorage("selectedExpoID");
                    //console.log("currentExpoID: ", currentExpoID);

                    let currentExpo = dashboardObject_original.arrayExpo.find(x => x.id === currentExpoID);
                    //console.log("currentExpo: ", currentExpo);

                    currentArrayArtworkExpo = currentExpo.arrayArtworkExpo;
                    //console.log("currentArrayArtworkExpo: ", currentArrayArtworkExpo);

                    let listArtworkContainer = document.getElementById("listArtworkContainer");
                    listArtworkContainer.innerHTML = "";



                    for (let artwork in currentArrayArtworkExpo){

                        let currentArtwork = currentArrayArtworkExpo[artwork];
                        let currentArtworkInfo = currentArtwork.Artwork;
                        //console.log("currentArtworkInfo: ", currentArtworkInfo);

                        let currentArtworkTitle = currentArtworkInfo.title;
                        let currentArtworkID = currentArtworkInfo.id;
                        //console.log("currentArtworkTitle: ", currentArtworkTitle);

                        let artworkContainer = document.createElement("div");
                        artworkContainer.classList.add("artworkContainer");
                        artworkContainer.id = currentArtworkID;

                        let artworktTitle = document.createElement("p");
                        artworktTitle.classList.add("artworktTitle");
                        

                        artworktTitle.innerHTML = currentArtworkTitle;

                        artworkContainer.appendChild(artworktTitle);

                        listArtworkContainer.appendChild(artworkContainer);


                    }

                    
                }//ENDE FUNKTION display_arrayArtwork()

                //FUNKTION eventArtworkContainer()
                function eventArtworkContainer(){

                    console.log("functionExecuted: eventArtworkContainer()");

                    let arrayArtworkContainer = document.getElementsByClassName("artworkContainer");

                    for (let i = 0; i < arrayArtworkContainer.length; i++){

                        arrayArtworkContainer[i].addEventListener("click", function(){

                            console.log("elementClicked: artworkContainer");

                            console.log("i: ", i);

                            console.log("currentArrayArtworkExpo[i]: ", currentArrayArtworkExpo[i]);

                            selectedArtworkID = currentArrayArtworkExpo[i].Artwork.id;

                            console.log("selectedArtworkID: ", selectedArtworkID);

                            saveToLocalStorage("selectedArtworkID" , selectedArtworkID);

                            //saveToLocalStorage("currentArtwork" , currentArrayArtworkExpo[i])

                            highlightSelectedArtwork();

                            display_infoArtwork_seq();

                        })

                    }

                }//ENDE FUNKTION eventArtworkContainer()

                // FUNKTION check_selectedArtworkID_localStorage()
                async function check_selectedArtworkID_localStorage() {
                    console.log("functionExecuted: check_selectedArtworkID_localStorage()");
                
                    selectedArtworkID = await loadFromLocalStorage("selectedArtworkID");
                
                    console.log("selectedArtworkID: ", selectedArtworkID);
                
                    if (selectedArtworkID == null) {
                    await selectLatestArtwork();
                    } else {
                    console.log("currentArrayArtworkExpo: ", currentArrayArtworkExpo);
                
                    let artworkFound = false;
                
                    for (let i = 0; i < currentArrayArtworkExpo.length; i++) {
                        console.log("currentArtworkID: ", currentArrayArtworkExpo[i].Artwork.id);
                        console.log("selectedArtworkID: ", selectedArtworkID);
                
                        if (currentArrayArtworkExpo[i].Artwork.id == selectedArtworkID) {
                        console.log("currentArrayArtworkExpo[i]: ", currentArrayArtworkExpo[i]);
                        highlightSelectedArtwork();
                        artworkFound = true;
                        break; // Exit the loop once artwork is found
                        }
                    }
                
                    if (!artworkFound) {
                        await selectLatestArtwork();
                    }
                    }
                }
        
                //FUNKTION selectLatestArtwork()
                function selectLatestArtwork(){

                    console.log("functionExecuted: selectLatestArtwork()");

                    // Reverse the array to display the newest item on top

                    //console.log("currentArrayArtworkExpo: ", currentArrayArtworkExpo);

                    let reversedCurrentArrayExpo = currentArrayArtworkExpo.slice().reverse();

                    //console.log("reversedCurrentArrayExpo: ", reversedCurrentArrayExpo);

                    let latestArtwork = reversedCurrentArrayExpo[reversedCurrentArrayExpo.length - 1];

                    //console.log("latestArtwork: ", latestArtwork);

                    selectedArtworkID = latestArtwork.Artwork.id;

                    saveToLocalStorage("selectedArtworkID" , selectedArtworkID);

                    //saveToLocalStorage("currentArtwork" , latestArtwork);

                    highlightSelectedArtwork();



                }//ENDE FUNKTION selectLatestArtwork()

                //FUNKTION highlightSelectedArtwork()
                function highlightSelectedArtwork(){

                    console.log("functionExecuted: highlightSelectedArtwork()");

                    let artworkContainer = document.getElementsByClassName("artworkContainer");

                    for (let i = 0; i < artworkContainer.length; i++){

                        if (artworkContainer[i].id == selectedArtworkID){

                            selectElement(artworkContainer[i]);

                        } else {
                                
                            unselectElement(artworkContainer[i]);
    
                            }

                    }

                }//ENDE FUNKTION highlightSelectedArtwork()



//ENDE BEREICH display_listArtwork_seq----------------------------------------------------------------------------------------------------------------------------


//BEREICH display_infoArtwork_seq----------------------------------------------------------------------------------------------------------------------------

        
        //FUNKTION display_infoArtwork_seq()
        async function display_infoArtwork_seq(){

            console.log("functionExecuted: display_infoArtwork_seq()");

            await displayInfoArtwork();

            await displayPreviewArtwork();

            //eventButtonEditArtwork();

            //eventButtonSaveArtwork();



        }//ENDE FUNKTION display_infoArtwork_seq()

                //FUNKTION displayInfoArtwork()
                function displayInfoArtwork(){

                    console.log("functionExecuted: displayInfoArtwork()");

                    let currentArtworkID = loadFromLocalStorage("selectedArtworkID");

                    let currentArtwork = dashboardObject_original.arrayArtwork.find(x => x.id === currentArtworkID);

                    //console.log("currentArtwork: ", currentArtwork);

                    let inputArtistName = document.getElementById("inputArtistName");
                    let inputArtworkTitle = document.getElementById("inputArtworkTitle"); 
                    let inputArtworkYear = document.getElementById("inputArtworkYear");
                    let inputArtworkMonth = document.getElementById("inputArtworkMonth");
                    let inputArtworkMedium = document.getElementById("inputArtworkMedium");  
                    let inputArtworkSurface = document.getElementById("inputArtworkSurface");
                    let inputArtworkHeight = document.getElementById("inputArtworkHeight");
                    let inputArtworkWidth = document.getElementById("inputArtworkWidth");
                    let inputArtworkUnit = document.getElementById("inputArtworkUnit");
                    let inputArtworkDescription = document.getElementById("inputArtworkDescription");

                    let currentArtworkArtistName = currentArtwork.artistName;
                    let currentArtworkTitle = currentArtwork.title;
                    let currentArtworkYear = currentArtwork.year;
                    let currentArtworkMonth = currentArtwork.month;
                    let currentArtworkMedium = currentArtwork.medium;
                    let currentArtworkSurface = currentArtwork.surface;
                    let currentArtworkHeight = currentArtwork.height;
                    let currentArtworkWidth = currentArtwork.width;
                    let currentArtworkUnit = currentArtwork.unit;
                    let currentArtworkDescription = currentArtwork.description;

                    inputArtistName.value = currentArtworkArtistName;
                    inputArtworkTitle.value = currentArtworkTitle;
                    inputArtworkYear.value = currentArtworkYear;
                    inputArtworkMonth.value = currentArtworkMonth;
                    inputArtworkMedium.value = currentArtworkMedium;
                    inputArtworkSurface.value = currentArtworkSurface;
                    inputArtworkHeight.value = currentArtworkHeight;
                    inputArtworkWidth.value = currentArtworkWidth;
                    inputArtworkUnit.value = currentArtworkUnit;
                    inputArtworkDescription.value = currentArtworkDescription;


                    

                    

            


                }//ENDE FUNKTION displayInfoArtwork()

                //FUNKTION displayPreviewArtwork()
                function displayPreviewArtwork(){

                    console.log("functionExecuted: displayPreviewArtwork()");

                    let currentArtworkID = loadFromLocalStorage("selectedArtworkID");

                    let currentArtwork = dashboardObject_original.arrayArtwork.find(x => x.id === currentArtworkID);

                    console.log("currentArtwork: ", currentArtwork);

                    let currentArtworkURL = currentArtwork.artworkURL;

                    console.log("currentArtworkURL: ", currentArtworkURL);

                    let imgPreviewArtwork = document.getElementById("imgPreviewArtwork");

                    imgPreviewArtwork.src = currentArtworkURL;

                    
                }//ENDE FUNKTION displayPreviewArtwork()

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

                        updateArtwork();

                    })

                }//ENDE FUNKTION eventButtonSaveArtwork()

                //FUNKTION updateArtwork()
                async function updateArtwork(){

                    console.log("functionExecuted: updateArtwork()");

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


//ENDE BEREICH display_infoArtwork_seq----------------------------------------------------------------------------------------------------------------------------


//BEREICH display_Orga_seq----------------------------------------------------------------------------------------------------------------------------

        //FUNKTION display_Orga_seq()
        async function display_orga_seq(){

            console.log("functionExecuted: display_Orga_seq()");

            await display_orga();

        } //ENDE FUNKTION display_Orga_seq()

                //FUNKTION display_Orga()
                async function display_orga(){

                    console.log("functionExecuted: display_Orga()");

                    let dashboardObject_original = await  loadFromLocalStorage("dashboardObject_original");

                    console.log("dashboardObject_original: ", dashboardObject_original);

                    let orgaObject = dashboardObject_original.orgaObject;

                    console.log("orgaObject: ", orgaObject);

                    let orgaName = orgaObject.orgaName;
                    let orgaLogo = orgaObject.logo;
                    let orgaLink = orgaObject.orgaLink;

            
                    
                    let inputNameOrga = document.getElementById("inputNameOrga");
                    let inputLinkOrga = document.getElementById("inputLinkOrga");
                    let previewLogoOrga = document.getElementById("previewLogoOrga");

                    inputNameOrga.value = orgaName;
                    inputLinkOrga.value = orgaLink;
                    previewLogoOrga.src = orgaLogo;

                }//ENDE FUNKTION display_Orga()


                            






export {display_listExpo_seq, display_orga_seq}