console.log("fileLoaded: script.js");

//ABSCHNITT definieren globale Variablen========================================================================================================



let expoName = "expoName";
let expoYear = "expoYear";
let orgaName = "Zentrum Paul Klee";
let orgaURL = "https://www.artikulierung.ch/rasterizeProject/index.html";


let virtualExpoFrame = document.querySelector("#virtualExpoFrame");

let screenState = "full";

let currentView = "expoPreview";

//currentView = "expoView";



//BEREICH Icons------------------------------------------------------------------------------------------------------------------------------

let iconArray = document.querySelectorAll(".overlayIcon");

let profilBild_icon = document.querySelector("#profilBild_icon");

let expoTitle = document.querySelector("#expoTitle_text");
let expoName_text = document.querySelector("#expoName_text");
let orgaName_text = document.querySelector("#orgaName_text");
let expoDate_text = document.querySelector("#expoDate_text");

let linkKopieren_icon = document.querySelector("#linkKopieren_icon");

let virtualExpo_icon = document.querySelector("#virtualExpo_icon");

let virtualExpo_logo = document.querySelector("#virtualExpo_logo");
let exit_icon = document.querySelector("#exit_icon");
let home_icon = document.querySelector("#home_icon");
let guide_icon = document.querySelector("#guide_icon");
let settings_icon = document.querySelector("#settings_icon");
let toggleScreen_icon = document.querySelector("#toggleScreen_icon");

let expoPreviewIconArray = [
    "profilBild_icon",
    "expoTitle_text",
    "orgaName_text",
    "linkKopieren_icon",
    "virtualExpo_icon",
    "virtualExpo_logo"
];

//BEREICH Info------------------------------------------------------------------------------------------------------------------------------    

let overlayHeaderInfo = document.querySelector("#overlayHeaderInfo");
let overlayMainInfo = document.querySelector("#overlayMainInfo");
let overlayFooterInfo = document.querySelector("#overlayFooterInfo");

let overlayInfoArray = document.querySelectorAll(".overlayInfo");




//ABSCHNITT aufrufen Funktionen========================================================================================================

setOverlay();

event_profilBild_icon();
event_virtualExpo_icon();
event_orgaName_text();
event_linkKopieren_icon();
event_virtualExpo_logo();
event_exit_icon();
event_home_icon();
event_guide_icon();
event_settings_icon();
event_toggleScreen_icon();

//clearBackgroundColors();




//ABSCHNITT definieren Funktionen========================================================================================================   


//BEREICH vorbereitende Funktionen------------------------------------------------------------------------------------------------------------------------------

//FUNKTION setOverlay()
function setOverlay(){


for (let i= 0; i < overlayInfoArray.length; i++){

    overlayInfoArray[i].style.display = "none";

}



expoName_text.innerHTML =    expoName + "&nbsp;";
orgaName_text.innerHTML =    "@" + orgaName + "&nbsp;";

expoDate_text.innerHTML =    expoYear;




if (currentView == "expoPreview") {

    console.log("currentView: expoPreview");

    for (let i = 0; i < expoPreviewIconArray.length; i++) {


        let expoPreviewIcon = document.querySelector("#" + expoPreviewIconArray[i]);
        expoPreviewIcon.style.display = "flex";
    }

}


if (currentView == "expoView"){

    console.log("currentView: expoView");

    let expoViewIconArray = iconArray;

    for (let i = 0; i < expoViewIconArray.length; i++) {

        expoViewIconArray[i].style.display = "flex";
    }

    virtualExpo_icon.style.display = "none";

    

}

}//ENDE FUNKTION setOverlay()


//FUNKTION clearBackgroundColors()
function clearBackgroundColors() {
    console.log("functionExecuted: clearBackgroundColors()");

    //select all elements without the overlayInfo elements
    let allElements = document.querySelectorAll('*');

    for (let i = 0; i < allElements.length; i++) {

        //console.log(allElements[i]);

        //console.log(allElements[i].classList);

        if (allElements[i].classList.contains("overlayInfo") == false) {

            console.log("no overlayInfo");


            allElements[i].style.backgroundColor = "transparent";
          
    
        }


}

}//ENDE FUNKTION clearBackgroundColors()



//BEREICH allgemeine Funktionen------------------------------------------------------------------------------------------------------------------------------

//FUNKTION mouseOverOpacity()
function mouseOverOpacity(targetIcon){

    targetIcon.style.opacity = "0.5";

}//ENDE FUNKTION mouseOverOpacity()

//FUNKTION mouseOutOpacity()
function mouseOutOpacity(targetIcon){

    targetIcon.style.opacity = "1";


}//ENDE FUNKTION mouseOutOpacity()

//FUNKTION showInfo()
function showInfo(targetIcon, infoText, targetInfo ){

    targetInfo.innerHTML = infoText;

    targetInfo.style.display = "block";

    

    //calculate left posittion of targetIcon

    let targetIconLeft = targetIcon.getBoundingClientRect().left;
    let targetIconWidth = targetIcon.getBoundingClientRect().width;


    let targetInfoWidth = targetInfo.getBoundingClientRect().width;

    let targetInfoLeft = targetIconLeft + targetIconWidth/2 - targetInfoWidth/2;
    
    

    //make sure the targetInfo is inside the corresponding oberlayInfoWrapper

    let targetInfoWrapper = targetInfo.parentNode;

    //console.log(targetInfoWrapper);

    let targetInfoWrapperLeft = targetInfoWrapper.getBoundingClientRect().left;
    let targetInfoWrapperRight = targetInfoWrapper.getBoundingClientRect().right;

    if (targetInfoLeft < targetInfoWrapperLeft){

        targetInfoLeft = targetInfoWrapperLeft;

    } else if (targetInfoLeft + targetInfoWidth > targetInfoWrapperRight){

        targetInfoLeft = targetInfoWrapperRight - targetInfoWidth;


    }

    targetInfo.style.left = targetInfoLeft + "px";



    if (targetInfoWrapper.id != "overlayFooterInfoWrapper"){


    let targetIconBottom = targetIcon.getBoundingClientRect().bottom;

    //console.log(targetIconBottom);

    let targetInfoTop = targetIconBottom + 5  ;

    //console.log(targetInfoTop);

    targetInfo.style.top = targetInfoTop + "px";


} else {

    let targetIconTop = targetIcon.getBoundingClientRect().top;
    
    let targetInfoHeight = targetInfo.getBoundingClientRect().height;

    let targetInfoTop = targetIconTop - targetInfoHeight -5;

    targetInfo.style.top = targetInfoTop + "px";


   
   
    
}


 





   

}//ENDE FUNKTION showInfo()

//FUNKTION hideInfo()
function hideInfo(targetInfo){

    targetInfo.style.display = "none";

}//ENDE FUNKTION hideInfo()



//BEREICH event Funktionen------------------------------------------------------------------------------------------------------------------------------

//FUNKTION event_profilBild_icon()
function event_profilBild_icon() {

    profilBild_icon.addEventListener("click", function () {

        window.open(orgaURL, "_blank");

    });


    profilBild_icon.addEventListener("mouseover", function () {

        showInfo(profilBild_icon, "Link " + orgaName, overlayHeaderInfo);

        mouseOverOpacity(profilBild_icon);

    

    });


    profilBild_icon.addEventListener("mouseout", function () {

        hideInfo(overlayHeaderInfo);

        mouseOutOpacity(profilBild_icon);

    });

}//ENDE FUNKTION event_profilBild_icon()


//FUNKTION event_orgaName_text()
function event_orgaName_text() {

    orgaName_text.addEventListener("click", function () {

        window.open(orgaURL, "_blank");

    });


    orgaName_text.addEventListener("mouseover", function () {
            
            showInfo(orgaName_text, "Link " + orgaName, overlayHeaderInfo);

            mouseOverOpacity(orgaName_text);
    
        
    
        });

    
        orgaName_text.addEventListener("mouseout", function () {

            hideInfo(overlayHeaderInfo);

            mouseOutOpacity(orgaName_text);

        });

}//ENDE FUNKTION event_orgaName_text()

//FUNKTION event_linkKopieren_icon()
function event_linkKopieren_icon() {

    linkKopieren_icon.addEventListener("mouseover", function () {

        showInfo(linkKopieren_icon, "Link kopieren", overlayHeaderInfo);

        mouseOverOpacity(linkKopieren_icon);

    

    });


    linkKopieren_icon.addEventListener("mouseout", function () {

        hideInfo(overlayHeaderInfo);

        mouseOutOpacity(linkKopieren_icon);

    });


}//ENDE FUNKTION event_linkKopieren_icon()

//FUNKTION event_virtualExpo_icon()
function event_virtualExpo_icon() {


virtualExpo_icon.addEventListener("click", function () {

    currentView = "expoView";

    setOverlay();


});


virtualExpo_icon.addEventListener("mouseover", function () {

    showInfo(virtualExpo_icon, "Ausstellung ansehen", overlayMainInfo);

    mouseOverOpacity(virtualExpo_icon);
    

});



virtualExpo_icon.addEventListener("mouseout", function () {

    //hideInfo(overlayMainInfo);

    mouseOutOpacity(virtualExpo_icon);

});

}//ENDE FUNKTION event_virtualExpo_icon()

//FUNKTION event_virtualExpo_logo()
function event_virtualExpo_logo() {

    virtualExpo_logo.addEventListener("click", function () {

        currentView = "expoPreview";

        setOverlay();



    });


    virtualExpo_logo.addEventListener("mouseover", function () {

        showInfo(virtualExpo_logo, "Ausstellung verlassen", overlayFooterInfo);

        mouseOverOpacity(virtualExpo_logo);


    });




    virtualExpo_logo.addEventListener("mouseout", function () {

        hideInfo(overlayFooterInfo);

        mouseOutOpacity(virtualExpo_logo);

    });


}//ENDE FUNKTION event_virtualExpo_logo()

//FUNKTION event_exit_icon()
function event_exit_icon() {

    exit_icon.addEventListener("click", function () {

        currentView = "expoPreview";

        setOverlay();



    });


    exit_icon.addEventListener("mouseover", function () {

        showInfo(exit_icon, "Ausstellung verlassen", overlayFooterInfo);

        mouseOverOpacity(exit_icon);

    });



    exit_icon.addEventListener("mouseout", function () {


        hideInfo(overlayFooterInfo);

        mouseOutOpacity(exit_icon);

    });



}//ENDE FUNKTION event_exit_icon()

//FUNKTION event_home_icon()
function event_home_icon() {

    //console.log("functionExecuted: event_home_icon()")

    home_icon.addEventListener("click", function () {

    });


    home_icon.addEventListener("mouseover", function () {

        showInfo(home_icon, "zur Anfangsposition", overlayFooterInfo);

        mouseOverOpacity(home_icon);



    });



    home_icon.addEventListener("mouseout", function () {


        hideInfo(overlayFooterInfo);


        mouseOutOpacity(home_icon);



    });



}//ENDE FUNKTION event_home_icon()

//FUNKTION event_guide_icon()
function event_guide_icon() {

    guide_icon.addEventListener("click", function () {

    });


    guide_icon.addEventListener("mouseover", function () {

        showInfo(guide_icon, "Anleitung ansehen", overlayFooterInfo);

        mouseOverOpacity(guide_icon);



    });



    guide_icon.addEventListener("mouseout", function () {



        hideInfo(overlayFooterInfo);

        mouseOutOpacity(guide_icon);



    });



}//ENDE FUNKTION event_guide_icon()

//FUNKTION event_settings_icon()
function event_settings_icon() {

    settings_icon.addEventListener("click", function () {
            
        }


    );


    settings_icon.addEventListener("mouseover", function () {

        showInfo(settings_icon, "Einstellungen öffnen", overlayFooterInfo);

        mouseOverOpacity(settings_icon);

    });



    settings_icon.addEventListener("mouseout", function () {


        hideInfo(overlayFooterInfo);

        mouseOutOpacity(settings_icon);

    });



}//ENDE FUNKTION event_settings_icon()

//FUNKTION event_toggleScreen_icon()
function event_toggleScreen_icon() {

    toggleScreen_icon.addEventListener("click", function () {

        //console.log("iconClicked: toggleScreen_icon");

       if (screenState == "small"){

        //console.log("currentScreenstate: small")

        screenState = "full";

        toggleScreen_icon.src = "../00_media/04_svg/smallScreen_icon.svg";

        //virtualExpoFrame.requestFullscreen();

        virtualExpoFrame.style.width = "100vw";
        virtualExpoFrame.style.height = "100vh";

       } else {

        //console.log("currentScreenstate: full")

        screenState = "small";

        //document.exitFullscreen();

        toggleScreen_icon.src = "../00_media/04_svg/fullScreen_icon.svg";

        virtualExpoFrame.style.width = "80vw";
        virtualExpoFrame.style.height = "80vh";

       }



    });








    toggleScreen_icon.addEventListener("mouseover", function () {

        if (screenState == "small"){

            showInfo(toggleScreen_icon, "Vollbild", overlayFooterInfo);

            

        } else {

            showInfo(toggleScreen_icon, "Vollbild beenden", overlayFooterInfo);

        }

        

        mouseOverOpacity(toggleScreen_icon);


    });




    toggleScreen_icon.addEventListener("mouseout", function () {


        hideInfo(overlayFooterInfo);

        mouseOutOpacity(toggleScreen_icon);



    });



}//ENDE FUNKTION event_toggleScreen_icon()















        











