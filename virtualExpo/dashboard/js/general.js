console.log("fileLoaded: general.js")

//FUNKTION selectElement(element)
function selectElement(element){

    console.log("functionExecuted: selectElement()");

    element.classList.add("selectedElement");

} //ENDE FUNKTION selectElement(element)

//FUNKTION unselectElement(element)
function unselectElement(element){
    
        console.log("functionExecuted: unselectElement()");
    
        element.classList.remove("selectedElement");
} //ENDE FUNKTION unselectElement(element)



//FUNKTION saveToLocalStorage(objectToSave)
function saveToLocalStorage(key, value) {

    console.log("functionExecuted: saveToLocalStorage()");


    let stringifiedValue = JSON.stringify(value);

    //console.log("stringifiedObject: ", stringifiedValue );


    localStorage.setItem(key , stringifiedValue);

}//ENDE FUNKTION saveToLocalStorage(objectToSave)


//FUNKTION loadFromLocalStorage(objectToLoad)
function loadFromLocalStorage(key) {

    console.log("functionExecuted: loadFromLocalStorage()");

    let retrievedValue = localStorage.getItem(key);

    //console.log("retrievedValue: ", retrievedValue);

    let parsedValue = JSON.parse(retrievedValue);

    return parsedValue;

}//ENDE FUNKTION loadFromLocalStorage(objectToLoad)

 //FUNKTION disablePointerEvents(element)
 function enablePointerEvents(element){

    console.log("functionExecuted: enablePointerEvents()");

    element.style.pointerEvents = "auto";

    element.classList.remove("lockedElement");

}//ENDE FUNKTION disablePointerEvents(element)

//FUNKTION disablePointerEvents(element)
function disablePointerEvents(element){

    console.log("functionExecuted: disablePointerEvents()");

    element.style.pointerEvents = "none";

    element.classList.add("lockedElement");

}//ENDE FUNKTION disablePointerEvents(element)