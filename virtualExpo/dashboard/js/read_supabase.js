console.log("fileLoaded: read_supabase.js");


//ABSCHNITT variabeln ==================================================================================================

import { supa } from './setup_supabase.js';
import {currentUser} from './auth_supabase.js';
import {display_listExpo_seq, display_orga_seq} from './display_supabase.js';



let orgaObject;
let currentOrgaID;

let arrayExpo;
let currentArrayExpo;
let selectedExpoID;

let arrayArtworkOrga;

let dashboardObject_original;
let dashboardObject_modified;

class dashboardObject {
    constructor(orgaObject, arrayExpo, arrayArtworkOrga) {
        this.orgaObject = orgaObject;
        this.arrayExpo = arrayExpo;
        this.arrayArtwork = arrayArtworkOrga;
    }
}



//ABSCHNITT Funktionen ausführung========================================================================================


getObjectDashboard_seq();

//updateObjectDashboard_seq();




//ABSCHNITT Funktionen definition==================================================================================================

       //BEREICH getObjectDashboard_seq----------------------------------------------------------------------------------------------------------------------------
        async function getObjectDashboard_seq(){
            
                console.log("functionExecuted: getObjectDashboard_seq()");
            
                await getObjectOrga();

                currentOrgaID = orgaObject.id;

                displayObjectOrgaName();

                displayOrgaLogo();

                saveToLocalStorage("currentOrgaID", currentOrgaID);

                await getArrayArtworkOrga();

                //console.log("arrayArtworkOrga: ", arrayArtworkOrga);

                await getArrayExpo_seq();

                await setObjectDashboard_seq();

                display_listExpo_seq();

                display_orga_seq();

                updateObjectDashboard_seq();

                

        }

                //FUNKTION getObjectOrga() 
                async function getObjectOrga(){

                    console.log("functionExecuted: getObjectOrga()");

                    console.log("currentUser: ", currentUser);

                    let { data, error } = await supa
                    .from('Organisation')
                    .select('*')
                    .eq('user_id', currentUser.id)

                    if (error) {
                        console.log("error: ", error);
                    }

                    console.log("orgaData: ", data);

                    orgaObject = data[0];

                    
                }//ENDE FUNKTION getObjectOrga()


                function displayObjectOrgaName(){
                        
                        console.log("functionExecuted: displayObjectOrgaName()");
    
                        let orgaName = orgaObject.orgaName;
    
                        console.log("orgaName: ", orgaName);
    
                        let infoUser = document.getElementById("infoUser");

                        infoUser.innerHTML =  `angemeldet als: ${orgaName}`;
                }

                function displayOrgaLogo(){

                    console.log("functionExecuted: displayOrgaLogo()");

                    console.log("orgaObject: ", orgaObject);

                    let imgOrgaLogo = document.querySelector("#imgOrgaLogo");

                    imgOrgaLogo.src = orgaObject.logo;


            

                }
 
                //FUNKTION getArrayArtworkOrga()
                async function getArrayArtworkOrga(){
                    
                    console.log("functionExecuted: getArrayArtworkOrga()");

                        let { data, error } = await supa
                        .from('Artwork')
                        .select('*')
                        .eq('orga_id', currentOrgaID)

                        if (error) {
                            console.log("error: ", error);
                        }

                        //console.log("artworkData: ", data);

                        arrayArtworkOrga = data;

                    
                }//ENDE FUNKTION getArrayArtworkOrga()

                        

                //FUNKTION getArrayExpo_seq()
                async function getArrayExpo_seq(){

                    console.log("functionExecuted: getArrayExpo_seq()");

                    await getArrayExpo();

                    await setArrayArtworkExpo();

                }//ENDE FUNKTION getArrayExpo_seq()

                        //FUNKTION getArrayExpo()
                        async function getArrayExpo(){

                            console.log("functionExecuted: getArrayExpo()");

                            let { data, error } = await supa
                            .from('Exposition')
                            .select('*')
                            .eq('orga_id', currentOrgaID )
                            .order('created_at', {ascending: false})

                            if (error) {
                                console.log("error: ", error);
                            }
                        
                            //console.log("expoData: ", data);

                            arrayExpo = data;

                            currentArrayExpo = arrayExpo;
                        }//ENDE FUNKTION getArrayExpo()

                        //FUNKTION setArrayArtworkExpo()
                        async function setArrayArtworkExpo(){

                            console.log("functionExecuted: setArrayArtworkExpo()");

                            //console.log("arrayExpo: ", arrayExpo);

                            //console.log("arrayExpo.length: ", arrayExpo.length);

                            for (let i = 0; i < arrayExpo.length; i++) {
                                
                                let expoID = arrayExpo[i].id;

                                //console.log("expoID: ", expoID);


                                let arrayArtworkExpo = await getArrayArtworkExpo(expoID);



                                arrayExpo[i].arrayArtworkExpo = arrayArtworkExpo;

                            }

                            //console.log("arrayExpo.length: ", arrayExpo.length);

                            //console.log("arrayExpo: ", arrayExpo);

                            
                        }//ENDE FUNKTION setArrayArtworkExpo()

                        //FUNKTION getArrayArtworkExpo()
                        async function getArrayArtworkExpo(expoID){

                            //console.log("functionExecuted: getArrayArtworkExpo()");
        
                            //console.log("expoID: ", expoID);
        
                            let { data, error } = await supa
                            .from('ArtworkExposition')
                            .select('*, Artwork(*)')
                            .eq('expo_id', expoID )
        
                            if (error) {
                                console.log("error: ", error);
                            }
        
                            //console.log("artworkData: ", data);
        
                            let artworkArray = data;
        
                            return artworkArray;
        
                        }//ENDE FUNKTION getArrayArtworkExpo()


                //FUNKTION setObjectDashboard_seq()
                async function setObjectDashboard_seq(){

                    console.log("functionExecuted: setObjectDashboard_seq()");

                    await setObjectDashboard();

                    console.log("dashboardObject_original: ", dashboardObject_original);
                    console.log("dashboardObject_modified: ", dashboardObject_modified);

                    saveToLocalStorage("dashboardObject_original", dashboardObject_original);
                    saveToLocalStorage("dashboardObject_modified", dashboardObject_modified);

                }//ENDE FUNKTION setObjectDashboard_seq()

                        //FUNKTION setObjectDashboard()
                        function setObjectDashboard(){

                            console.log("functionExecuted: setObjectDashboard()");

                            dashboardObject_original = new dashboardObject(orgaObject, arrayExpo, arrayArtworkOrga);

                            dashboardObject_modified = dashboardObject_original;


                        }// ENDE FUNKTION setObjectDashboard()

        
        //ENDE BEREICH getObjectDashboard_seq----------------------------------------------------------------------------------------------------------------------------


        //BEREICH updateObjectDashboard_seq----------------------------------------------------------------------------------------------------------------------------
        
        //FUNKTION updateObjectDashboard_seq()
        function updateObjectDashboard_seq(){

            console.log("functionExecuted: updateObjectDashboard_seq()");

            subscribeOrganisation();

            subscribeTable("Exposition");

            subscribeTable("Artwork");

            subscribeArtworkExposition();
            


        }//ENDE FUNKTION updateObjectDashboard_seq()

                //FUNKTION subscribeTable()
                function subscribeTable(targetTable){
                        
                        console.log("functionExecuted: subscribeTable()");

                        console.log("targetTable: ", targetTable)

                        let orga_id = currentOrgaID;

                        let channelName = targetTable + "Channel";
        
                        const expoChannel = supa
                        .channel(channelName)
                        .on(
                        'postgres_changes',
                        { event: '*', schema: 'public', table: targetTable, filter: `orga_id=eq.${orga_id}` },
                        (payload) => {
                            console.log('Change received!', payload)
            
                            let modifiedTable = payload.table;
            
                            updateObjectDashboard(modifiedTable)
            
            
            
                        
            
                        }
                        )
                        .subscribe()
            
                        //console.log("realtimeSubcribtion");
            
                }//ENDE FUNKTION subscribeTable()

                //FUNKTION subscribeOrganisation()
                function subscribeOrganisation(){
                    
                    console.log("functionExecuted: subscribeOrganisation()");

                    let orga_id = currentOrgaID;

                    const expoChannel = supa
                    .channel('orgaChannel')
                    .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'Organisation', filter: `id=eq.${orga_id}` },

                    (payload) => {
                        console.log('Change received!', payload)

                        let modifiedTable = payload.table;

                        updateObjectDashboard(modifiedTable)

                


                }  )


                    .subscribe()

                    console.log("realtimeSubcribtion");

                }// ENDE FUNKTION subscribeOrganisation()

                //FUNKTION subscribeArtworkExposition()
                function subscribeArtworkExposition(){

                    console.log("functionExecuted: subscribeArtworkExposition()");

                    let orga_id = currentOrgaID;

                    const expoChannel = supa
                    .channel('artworkExpositionChannel')
                    .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'ArtworkExposition'},

                    (payload) => {
                        console.log('Change received!', payload)

                        let modifiedTable = payload.table;

                        updateObjectDashboard(modifiedTable)


                }  )

                .subscribe()

                console.log("realtimeSubcribtion");

                }// ENDE FUNKTION subscribeArtworkExposition()


                //FUNKTION updateObjectDashboard()
                async function updateObjectDashboard(modifiedTable){

                    console.log("functionExecuted: updateObjectDashboard()");
                    console.log("modifiedTable: ", modifiedTable);

                    if (modifiedTable == "Organisation") {

                        await getObjectOrga();

                        currentOrgaID = orgaObject.id;

                        await getArrayArtworkOrga();

                        setObjectDashboard_seq();

                    }


                    if (modifiedTable == "Exposition") {


                        await getArrayExpo_seq();

                        await setObjectDashboard_seq();
                        
                        
                    }


                    if (modifiedTable == "Artwork") {

                        await getArrayArtworkOrga();

                        await getArrayExpo_seq();

                        await setObjectDashboard_seq();
                        
                    }


                    if (modifiedTable == "ArtworkExposition") {

                        await getArrayArtworkOrga();

                        await getArrayExpo_seq();

                        
                    }

                

                    display_listExpo_seq();


                }//ENDE FUNKTION updateObjectDashboard()



    
        //ENDE BEREICH updateObjectDashboard_seq----------------------------------------------------------------------------------------------------------------------------
        
        



