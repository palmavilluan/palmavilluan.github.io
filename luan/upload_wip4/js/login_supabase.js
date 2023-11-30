console.log("fileLoaded: login_supabase.js");



//ABSCHNITT variabeln ==================================================================================================
import { supa } from './setup_supabase.js';


let inputMailUser = document.getElementById("inputMailUser");
let inputPassUser = document.getElementById("inputPassUser");

let buttonLogin = document.getElementById("buttonLogin");

let buttonLogout = document.getElementById("buttonLogout");

let infoUser = document.getElementById("infoUser");
let infoAuth = document.getElementById("infoAuth");

let currentUser;

let redirectLoginRegister = document.getElementById("redirectLoginRegister");

let infoUpload = document.getElementById("infoUpload");


//ABSCHNITT funktionen aufruf==================================================================================================




checkUser();

//updateUserStatus(initialUser);
eventButtonLogin();
//eventButtonRegister();
eventButtonLogout();


//ABSCHNITT funktionen definition==================================================================================================

//FUNKTION eventButtonLogin
function eventButtonLogin() {
    console.log("functionExecuted: eventButtonLogin()");

    buttonLogin.addEventListener("click", function() {
        console.log("elementClicked: buttonLogin");

        loginUser();

    });

}//ENDE FUNKTION eventButtonLogin

//FUNKTION eventButtonLogout
function eventButtonLogout() {
    console.log("functionExecuted: eventButtonLogout()");
    
    buttonLogout.addEventListener("click", function() {
        console.log("elementClicked: buttonLogout");
        
        logoutUser();
    });

}//ENDE FUNKTION eventButtonLogout

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

    if (!window.location.href.includes("upload.html")) {

        window.location.href = "upload.html";

    }

            



    //updateUserStatus(user);

    } else {

        console.log("infoUser: not authenticated");

        //redirect to login page

        updateUserStatus(null);
            
        }
   
  
    
    

   

    

}//ENDE FUNKTION checkUser()

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

    if (!data.user.email_confirmed_at) {
        console.log("infoUser: not verified");

        infoAuth.innerHTML = "Mail Verifizierung ausstehend: " + mailUser ;

    }



   
    if (error) {
        console.log("error: ", error);
    

        infoAuth.innerHTML = "Mail oder Passwort ungültig";
    



    }





}//ENDE FUNKTION loginUser()

//FUNKTION updateUserStatus()
function updateUserStatus(user) {
    console.log("functionExecuted: updateUserStatus()");

    
    if (user) {
        console.log("infoUser: authenticated as", user.email );

        
        console.log("currentURL: ", window.location.href);

        if (!window.location.href.includes("upload.html")) {

            window.location.href = "upload.html";

        }


        inputAuthContainer.style.display = "none";
        buttonLogout.style.display = "block";
        buttonLogin.style.display = "none";
        infoUser.style.display = "block";
        redirectLoginRegister.style.display = "none";
        

        infoUser.textContent = `angemeldet als: ${user.email}`;



    } else {
        console.log("infoUser: not authenticated");

        
        inputAuthContainer.style.display = "block";
        buttonLogout.style.display = "none";
        buttonLogin.style.display = "block";
        infoUser.style.display = "none";
        redirectLoginRegister.style.display = "block";

        infoUser.textContent = "";
    }
  }//ENDE FUNKTION updateUserStatus()

 //FUNKTION authStateChange()
 function authStateChange(event, session) {
    console.log("functionExecuted: authStateChange()");

    console.log("supabaseClient: ", supa);

    if (event === "SIGNED_IN" && session) {
        console.log("infoUser: signed in as ", session.user);
        
        updateUserStatus(session.user);

    } else if (event === "SIGNED_IN" && !session) {
        console.log("infoUser: signed in as ", session.user);

        //reload page
        window.location.reload();}
    
    else if (event === "SIGNED_OUT") {

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