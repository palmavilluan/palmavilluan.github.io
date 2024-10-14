console.log("fileLoaded: auth_supabase.js");



//ABSCHNITT variabeln ==================================================================================================
import { supa } from './setup_supabase.js';


let inputMailUser = document.getElementById("inputMailUser");
let inputPassUser = document.getElementById("inputPassUser");

let buttonLogin = document.getElementById("buttonLogin");
//let buttonRegister = document.getElementById("buttonRegister");


let buttonLogout = document.getElementById("buttonLogout");

let infoUser = document.getElementById("infoUser");
let currentUser;

let redirectLoginRegister = document.getElementById("redirectLoginRegister");

let infoUpload = document.getElementById("infoUpload");
let inputUploadContainer = document.getElementById("inputUploadContainer");

let elementsAuthTrue = document.getElementsByClassName("authTrue");
let elementsAuthFalse = document.getElementsByClassName("authFalse");

//ABSCHNITT funktionen aufruf==================================================================================================

//console.log("supabaseClient: ", supa);



checkUser();

//updateUserStatus(initialUser);
eventButtonLogin();
//eventButtonRegister();
eventButtonLogout();


//ABSCHNITT funktionen definition==================================================================================================

//FUNKTION eventButtonLogin
function eventButtonLogin() {
    console.log("functionExecuted: eventButtonLogin()");

    buttonLogin.addEventListener("click", async function() {
        console.log("elementClicked: buttonLogin");

        await loginUser();

        //reload page
        window.location.reload();

    });

}//ENDE FUNKTION eventButtonLogin


//FUNKTION eventButtonRegister
function eventButtonRegister() {
    console.log("functionExecuted: eventButtonRegister()");
    
    buttonRegister.addEventListener("click", function() {
        console.log("elementClicked: buttonRegister");
        
        registerUser();
    });

}//ENDE FUNKTION eventButtonRegister


//FUNKTION eventButtonLogout
function eventButtonLogout() {
    console.log("functionExecuted: eventButtonLogout()");
    
    buttonLogout.addEventListener("click", function() {
        console.log("elementClicked: buttonLogout");
        
        logoutUser();

        let containerOrgaLogo = document.getElementById("containerOrgaLogo");

        containerOrgaLogo.innerHTML = "";
    });

}//ENDE FUNKTION eventButtonLogout


//FUNKTION checkUser()
export async function checkUser() {
    console.log("functionExecuted: checkUser()");

    
   /*  const { data: { user } } = await supa.auth.getUser()

    console.log("user: ", user);
    
 */

    
    const { data, error } = await supa.auth.getSession()

    //console.log("data111: ", data);

    if (data.session) {

    //console.log("data: ", data);

    let user = data.session.user;

    //console.log("user111: ", user);
    
    currentUser = user;

    console.log("currentUser: authenticated as ", data.session.user);

    updateUserStatus(user);

    } else {

        console.log("infoUser: not authenticated");

        //redirect to login page

        updateUserStatus(null);
            
        }
   
  
    
    

   

    

}//ENDE FUNKTION checkUser()



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

        infoUser.textContent = "Registrierung fehlgeschlagen";
    }


    console.log("data: ", data);

    let user = data.user;

    console.log("user: ", user);

    infoUser.textContent = "Mail Verifizierung ausstehend: " + mailUser ;

    window.location.reload();



        

  
}//ENDE FUNKTION registerUser()

//FUNKTION checkExistingUser()
async function checkExistingUser() {

    console.log("functionExecuted: checkExistingUser()")

    let mailUser = inputMailUser.value;
    let passUser = inputPassUser.value;

    console.log("mailUser: ", mailUser);

    const { data, error } = await supa
    .from('auth.users')
    .select('*');

    console.log("data: ", data);

    if (data.length > 0) {
        console.log("user already exists");

    } else {

        console.log("user does not exist");
        

    }

    if (error) {
        console.log("error: ", error);

    }

}//ENDE FUNKTION checkExistingUser()

//FUNKTION loginUser()
async function loginUser() {
    console.log("loginUser");

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






//FUNKTION updateUserStatus()
function updateUserStatus(user) {
    console.log("functionExecuted: updateUserStatus()");

    
    if (user) {
        console.log("currentUser: authenticated as", user.email );

        for (let i = 0; i < elementsAuthTrue.length; i++) {
            elementsAuthTrue[i].style.display = "block";
        }

        for (let i = 0; i < elementsAuthFalse.length; i++) {
            elementsAuthFalse[i].style.display = "none";
        }

        /* inputAuthContainer.style.display = "none";
        buttonLogout.style.display = "block";
        buttonLogin.style.display = "none";
        infoUser.style.display = "block";
        redirectLoginRegister.style.display = "none";


        inputUploadContainer.style.display = "block"; */
        

        infoUser.textContent = `angemeldet als: ${user.email}`;
        infoMainBody.textContent = "";



    } else {
        console.log("infoUser: not authenticated");

        for (let i = 0; i < elementsAuthTrue.length; i++) {
            elementsAuthTrue[i].style.display = "none";
        }

        for (let i = 0; i < elementsAuthFalse.length; i++) {

            elementsAuthFalse[i].style.display = "block";
        }

        
        /* inputAuthContainer.style.display = "block";
        buttonLogout.style.display = "none";
        buttonLogin.style.display = "block";
        infoUser.style.display = "none";
        redirectLoginRegister.style.display = "block";

        inputUploadContainer.style.display = "none"; */

        infoUser.textContent = "";
        infoMainBody.textContent = "Anmeldung erforderlich";
    }
  }//ENDE FUNKTION updateUserStatus()

 //FUNKTION authStateChange()
 function authStateChange(event, session) {
    console.log("functionExecuted: authStateChange()");

    //console.log("supabaseClient: ", supa);

    if (event === "SIGNED_IN" && session) {
        console.log("currentUser: signed in as ", session.user);
        
        updateUserStatus(session.user);

    } else if (event === "SIGNED_IN" && !session) {
        console.log("currentUser: signed in as ", session.user);

        //reload page
        window.location.reload();}
    
    else if (event === "SIGNED_OUT") {
        //console.log("infoUser: signed out as ", session.user);

        updateUserStatus(null);
    }

}//ENDE FUNKTION authStateChange()

//EVENT authStateChange
// Listener, für Änderungen des Auth Status
// UserStatus wird aktualisiert, wenn sich der Auth Status ändert
supa.auth.onAuthStateChange(authStateChange);




//FUNKTION logoutUser()
async function logoutUser() {
  const { error } = await supa.auth.signOut();
  if (error) {
      console.error("error: during logout", error);
  } else {
      updateUserStatus(null);
      console.log("infoUser: signed out");
  }
}//ENDE FUNKTION logoutUser()


export { currentUser };