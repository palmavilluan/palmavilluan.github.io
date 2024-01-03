console.log("fileLoaded: register_supabase.js")

//ABSCHNITT variabeln ==================================================================================================

import { supa } from './setup_supabase.js';

let buttonRegister = document.getElementById("buttonRegister");
let buttonLogin = document.getElementById("buttonLogin");

let inputMailUser = document.getElementById("inputMailUser");
let inputPassUser = document.getElementById("inputPassUser");
let inputNameOrga = document.getElementById("inputNameOrga");
let inputLogoOrga = document.getElementById("inputLogoOrga");
let inputLinkOrga = document.getElementById("inputLinkOrga");



let infoUser = document.getElementById("infoUser");

let currentUser;
let mailUser;
let passUser;
let logoURL;
let fileName;
let storageLogoURL = "https://jozvukgfgcazwazxxyjg.supabase.co/storage/v1/object/public/" + "Logo/Public/";

let checkEmailConfirmationInterval;

//ABSCHNITT funktionen aufruf==================================================================================================

eventButtonRegister();
checkUser();




//ABSCHNITT funnktionen definition==================================================================================================
//FUNKTION checkUser()
async function checkUser() {
    console.log("functionExecuted: initializeUser()");

    
   /*  const { data: { user } } = await supa.auth.getUser()

    console.log("user: ", user);
    
 */

    
    const { data, error } = await supa.auth.getSession()

    //console.log("data: ", data);

    if (data.session) {

    let user = data.session.user;
    
    currentUser = user;

    console.log("infoUser: authenticated as ", data.session.user);

    if (!window.location.href.includes("index.html")) {

       // window.location.href = "index.html";

    }

            



    //updateUserStatus(user);

    } else {

        console.log("infoUser: not authenticated");

        

        //updateUserStatus(null);
            
        }
   
  
    
    

   

    

}//ENDE FUNKTION checkUser()



//FUNKTION eventButtonRegister
function eventButtonRegister() {
    console.log("functionExecuted: eventButtonRegister()");
    
    buttonRegister.addEventListener("click", function() {
        console.log("elementClicked: buttonRegister");
        
        registerUser();
    });

}//ENDE FUNKTION eventButtonRegister


//FUNKTION registerUser()
async function registerUser() {
    console.log("functionExecuted: registerUser()");

    //checkExistingUser();



    mailUser = inputMailUser.value;
    passUser = inputPassUser.value;
    
    //console.log("mailUser: ", mailUser);
    //console.log("passUser: ", passUser);
    
    const {data, error} = await supa.auth.signUp({
        email: mailUser,
        password: passUser
    })

    if (error) {

        console.log("error: ", error);

        infoUser.innerHTML = "Registrierung fehlgeschlagen";
    } else {


    console.log("data: ", data);

    let user = data.user;

    console.log("user: ", user);

  

    infoUser.innerHTML = "Mail Verifizierung ausstehend: " + user.email ;

    // Start checking email confirmation
    checkEmailConfirmationInterval = setInterval(() => {
        checkEmailConfirmation(user);
    }, 1000); // Check every 5 seconds (adjust the interval as needed)


    

}



        

  
}//ENDE FUNKTION registerUser()


// Function to check email confirmation
async function checkEmailConfirmation(user) {
console.log("functionExecuted: checkEmailConfirmation()");

    const { data, error } = await supa.auth.signInWithPassword({
        email: mailUser,
        password: passUser
    
    })

    console.log("data: ", data);

    currentUser = data.user;

    if (data.user.email_confirmed_at) {

        console.log("infoUser: verified");

        // Stop checking email confirmation
        clearInterval(checkEmailConfirmationInterval);

        // Redirect to the dashboard

        let logo = inputLogoOrga.files[0];

        console.log("logo: ", logo);

        await createLogoURL(logo);

        await uploadLogo(logo);

        insertOrganisation();

        window.location.href = "index.html";

        

    }
   
   
        else if (!data.user.email_confirmed_at) {
            console.log("infoUser: not verified");
    
            infoAuth.innerHTML = "Mail Verifizierung ausstehend: " + mailUser ;
    
        }

        else {

            console.log("wtf");

            infoAuth.innerHTML = "Mail Verifizierung ausstehend: " + mailUser ;

        }



    

     
}


function createLogoURL(logo) {
                
    console.log("functionExecuted: createLogoURL()");

    fileName = logo.name;

    //remove file extension from fileName

    fileName = fileName.split(".")[0];

    console.log("fileName: ", fileName);

    logoURL = storageLogoURL + fileName;

}

//FUNKTION uploadLogo
async function uploadLogo(logo) {
    console.log("functionExecuted: uploadLogo()");

    let file = logo;

    console.log(fileName)


    const { data, error } = await supa.storage
    .from('Logo')
    .upload('Public/' + fileName, file)

    console.log(data);

    if (error) {
    
        console.log("error: ", error);

    } else {
    // Handle success
    }
}//ENDE FUNKTION uploadLogo



//FUNKTION insertOrganisation()
async function insertOrganisation() {
    console.log("functionExecuted: createOrganisation()");

    console.log("currentUser: ", currentUser);

    let user_id = currentUser.id;

    let nameOrga = inputNameOrga.value;
    let linkOrga = inputLinkOrga.value;


    let { data, error } = await supa
    .from('Organisation')
    .insert([
        {   user_id: user_id, 
            orgaName: nameOrga,
            logo: logoURL,
            orgaLink: linkOrga
    }
    ]);

    if (error) {
        console.log("error: ", error);

    }








   





    }