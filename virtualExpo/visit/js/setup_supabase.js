console.log("fileLoaded: setup_supabase.js");

//ABSCHNITT variabeln ==================================================================================================

//ABSPEICHERN variabeln für supabase client
const supabaseURL = 'https://jozvukgfgcazwazxxyjg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvenZ1a2dmZ2Nhendhenh4eWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg2NTgzOTIsImV4cCI6MjAxNDIzNDM5Mn0.0L0DcfuA7x1Q8YO7v2FBVRNjtRUaSWt4cnztXJfg75c';
//ERSTELLEN supabase client
const supa = supabase.createClient(supabaseURL, supabaseKey, {
    auth: {
        redirectTo: window.location.origin, 
    },

});

console.log("supabaseClient: ", supa);

//EXPORTIEREN supabase client
export { supa }






