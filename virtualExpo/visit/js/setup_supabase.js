console.log("fileLoaded: setup_supabase.js");

//ABSCHNITT variabeln ==================================================================================================

//ABSPEICHERN variabeln für supabase client
const supabaseURL = 'https://iyyuoagdhhmhflhpesni.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5eXVvYWdkaGhtaGZsaHBlc25pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg4OTczMTUsImV4cCI6MjA0NDQ3MzMxNX0.OJCdOthFFfKFK7Tgtqji51tOkUJ6A1khyAedA4vhKTs';
//ERSTELLEN supabase client
const supa = supabase.createClient(supabaseURL, supabaseKey, {
    auth: {
        redirectTo: window.location.origin, 
    },

});

console.log("supabaseClient: ", supa);

//EXPORTIEREN supabase client
export { supa }






