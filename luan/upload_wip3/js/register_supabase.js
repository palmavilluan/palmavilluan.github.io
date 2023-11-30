console.log("fileLoaded: register_supabase.js")

//ABSCHNITT variabeln ==================================================================================================

import { supa } from './setup_supabase.js';

let buttonRegister = document.getElementById("buttonRegister");
let buttonLogin = document.getElementById("buttonLogin");

let inputMailUser = document.getElementById("inputMailUser");
let inputPassUser = document.getElementById("inputPassUser");

let infoUser = document.getElementById("infoUser");

//ABSCHNITT funktionen aufruf==================================================================================================

eventButtonRegister();
eventButtonLogin();


//FUNKTION eventButtonRegister
function eventButtonRegister() {
    console.log("functionExecuted: eventButtonRegister()");
    
    buttonRegister.addEventListener("click", function() {
        console.log("elementClicked: buttonRegister");
        
        registerUser();
    });

}//ENDE FUNKTION eventButtonRegister

//FUNKTION eventButtonLogin
function eventButtonLogin() {
    console.log("functionExecuted: eventButtonLogin()");

    buttonLogin.addEventListener("click", function() {
        console.log("elementClicked: buttonLogin");

        loginUser();

    });

}//ENDE FUNKTION eventButtonLogin



//FUNKTION registerUser()
async function registerUser() {
    console.log("functionExecuted: registerUser()");

    //checkExistingUser();



    let mailUser = inputMailUser.value;
    let passUser = inputPassUser.value;
    
    //console.log("mailUser: ", mailUser);
    //console.log("passUser: ", passUser);
    
    const {data, error} = await supa.auth.signUp({
        email: mailUser,
        password: passUser
    })

    if (error) {

        console.log("error: ", error);

        infoUser.innerHTML = "Registrierung fehlgeschlagen";
    }


    console.log("data: ", data);

    let user = data.user;

    console.log("user: ", user);

    infoUser.innerHTML = "Mail Verifizierung ausstehend: " + mailUser ;

    buttonRegister.style.display = "none";
    buttonLogin.style.display = "block";



        

  
}//ENDE FUNKTION registerUser()


//FUNKTION loginUser()
async function loginUser() {
    console.log("functionExecuted: loginUser()");

    let mailUser = inputMailUser.value;
    let passUser = inputPassUser.value;

    console.log("mailUser: ", mailUser);
    console.log("passUser: ", passUser);
    
    const { data, error } = await supa.auth.signInWithPassword({
        email: mailUser,
        password: passUser
    
    })

    console.log("data: ", data);


   
    if (error) {
        console.log(error);
        console.log("error: ", error);

        if (!data.email_verified) {
            console.log("infoUser: not verified");
    
            infoUser.textContent = "Mail Verifizierung ausstehend: " + mailUser ;
    
        }

        else {
    

        infoUser.textContent = "Mail oder Passwort ungültig";

    }
    }



}//ENDE FUNKTION loginUser()

