console.log("fileLoaded: login_supabase.js");



//ABSCHNITT variabeln ==================================================================================================
import { supa } from './setup_supabase.js';


let inputMailUser = document.getElementById("inputMailUser");
let inputPassUser = document.getElementById("inputPassUser");

let buttonLogin = document.getElementById("buttonLogin");

let buttonLogout = document.getElementById("buttonLogout");

let statusUser = document.getElementById("statusUser");
let currentUser;

//ABSCHNITT funktionen aufruf==================================================================================================

//console.log("supabaseClient: ", supa);



checkUser();

//updateUserStatus(initialUser);
eventButtonLogin();
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

    console.log("statusUser: authenticated as ", data.session.user);

    updateUserStatus(user);

    } else {

        console.log("statusUser: not authenticated");

        updateUserStatus(null);
            
        }
   
  
    
    

   

    

}//ENDE FUNKTION checkUser()


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
            console.log("statusUser: not verified");
    
            statusUser.textContent = "Mail Verifizierung ausstehend: " + mailUser ;
    
        }

        else {
    

        statusUser.textContent = "Mail oder Passwort ungültig";

    }
    }



}//ENDE FUNKTION loginUser()


//FUNKTION updateUserStatus()
function updateUserStatus(user) {
    console.log("functionExecuted: updateUserStatus()");

    
    if (user) {
        console.log("statusUser: authenticated as", user.email );

        statusUser.textContent = `angemeldet als: ${user.email}`;


        authContainer.style.display = "none";

    } else {
        console.log("statusUser: not authenticated");

        statusUser.textContent = "nicht angemeldet";
        authContainer.style.display = "block";
        
    }
  }//ENDE FUNKTION updateUserStatus()

 //FUNKTION authStateChange()
 function authStateChange(event, session) {
    console.log("functionExecuted: authStateChange()");

    console.log("supabaseClient: ", supa);

    if (event === "SIGNED_IN" && session) {
        console.log("statusUser: signed in as ", session.user);
        
        updateUserStatus(session.user);

    } else if (event === "SIGNED_IN" && !session) {
        console.log("statusUser: signed in as ", session.user);

        //reload page
        window.location.reload();}
    
    else if (event === "SIGNED_OUT") {
        //console.log("statusUser: signed out as ", session.user);

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
      console.log("statusUser: signed out");
  }
}//ENDE FUNKTION logoutUser()


export { currentUser };