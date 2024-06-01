/* ----------- IMPORTS -----------*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
//database
import { getDatabase, ref, off, get, child, update, set, push, onChildAdded, onChildChanged, onChildRemoved } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
//authorization
import { getAuth, setPersistence, browserSessionPersistence, onAuthStateChanged, signInWithRedirect, signInWithPopup,GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import * as EMBED from './embeddings.js'; //to ask replicate
import {language} from './language.js'; //to get language array

/* ----------- VARS -----------*/
let db, auth, app;
let googleAuthProvider;

/* ----------- INIT -----------*/
/// GET USER
export function getUser() {
    return auth.currentUser;
}
/// AUTHORIZE 
export function initFirebase(callback) {
    const firebaseConfig = {
        apiKey: "AIzaSyAIChKsZULkKP_-_SkEfJcSLdpYz6cVQqM",
        authDomain: "sharedminds-jade.firebaseapp.com",
        databaseURL: "https://sharedminds-jade-default-rtdb.firebaseio.com",
        projectId: "sharedminds-jade",
        storageBucket: "sharedminds-jade.appspot.com",
        messagingSenderId: "219682702966",
        appId: "1:219682702966:web:716fc5648a493faa370157",
        measurementId: "G-YP7BNHVY30"
      };
    app = initializeApp(firebaseConfig);
    db = getDatabase();
    auth = getAuth();
    setPersistence(auth, browserSessionPersistence);

    //google login
    googleAuthProvider = new GoogleAuthProvider();

    //sign in states
    onAuthStateChanged(auth, (user) => {
        //signed in
        if (user) {
            const uid = user.uid;
            callback(user);
        } 
        //signed out
        else {
            console.log("signed out");
            showStart();
            callback(null);
        }
    });
    //get user
    return auth.currentUser;
}
/// BUTTON
initFirebase(function (user) {
    //sign in
    document.getElementById("signInWithGoogle").addEventListener("click", function () {
        signInWithPopup(auth, googleAuthProvider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(error);
                //const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log(credential);
            }
        );
        
    });
    //when user authorized
    if(user){
        document.getElementById('start-btn').disabled = 'false';
        document.getElementById("start-btn").addEventListener("click", function () {
            //show game
            document.getElementById('game').style.display = 'block';
            //hide login
            document.getElementById('login').style.display = 'none';
            //add scene script
            let scene = document.createElement('script');
            scene.setAttribute("src", "../scripts/scene.js");
            scene.setAttribute("type", "module");
            document.querySelector('body').appendChild(scene);
        });
    }
});

/* --- BUTTONS --- */
function showStart() {
    //only show log in button
    document.getElementById('start-btn').disabled = false; 
}

/* ----------- CHOSEN -----------*/
export function trackSongs(){
    const dbRef = ref(getDatabase());
    get(child(dbRef, `MUN/songs`)).then((snapshot) => { //get snapshot of songs
        //if there's >1 songs left
        if (snapshot.size > 1) {
            var chosen;
            snapshot.forEach(function(urlSnapshot) {
                //set 1st song as chosen
                if (!chosen) {
                    chosen = urlSnapshot;
                    setDataInFirebase("MUN/songs/chosen", { 
                        type: 'chosen',
                        key: urlSnapshot.key,
                        lang: urlSnapshot.val().lang,
                        song: urlSnapshot.val().song
                    });
                }
            });
            
        }
        //if there's only 1 song left
        else if (snapshot.size == 1) {
            //get 5 random languages
            var lang_array = language["languages"];
            let n = 5;
            let random = lang_array.sort(() => .5 - Math.random()).slice(0,n);
            console.log(random);
            //get songs
            EMBED.askForWords() 
            .then(reply_arr => {
                //add 5 songs to firebase  
                for(var i=0; i<=5; i++){
                    addNewThingToFirebase("MUN/songs", {
                        type: "song",
                        song: reply_arr[i],
                        lang: lang_array[i].code
                    });
                }
            })
        }
    }).catch((error) => { console.error(error);});
}

  
/* ----------- CHANGES -----------*/
/// ADD
export function addNewThingToFirebase(folder, data) {
    const dbRef = ref(db, folder);
    const newKey = push(dbRef, data).key;
    return newKey; //useful for later updating
}
/// DELETE
export function deleteFromFirebase(folder, key) {
    console.log("deleting", folder + '/' + key);
    const dbRef = ref(db, folder + '/' + key);
    set(dbRef, null);
}
/// CHANGE
export function setDataInFirebase(dbPath, data) {
    const dbRef = ref(db, dbPath); //if it doesn't exist, it adds (pushes) with you providing the key
    set(dbRef, data); //if it does exist, it overwrites
}
/// UPDATE
export function updateJSONFieldInFirebase(folder, key, data) {
    const dbRef = ref(db, folder + '/' + key);
    update(dbRef, data);
    console.log(dbRef, data)
}
/// GET UPDATES
export function subscribeToData(folder, callback) {
    //get callbacks when there are changes either by you locally or others remotely
    const commentsRef = ref(db, folder + '/');
    onChildAdded(commentsRef, (data) => {
        callback("added", data.val(), data.key);
        reactToFirebase("added", data.val(), data.key);
    });
    onChildChanged(commentsRef, (data) => {
        callback("changed", data.val(), data.key);
        reactToFirebase("changed", data.val(), data.key)
    });
    onChildRemoved(commentsRef, (data) => {
        callback("removed", data.val(), data.key);
        reactToFirebase("removed", data.val(), data.key)
    });
}
export function unSubscribeToData(folder) {
    const oldRef = ref(db, folder + '/');
    console.log("unsubscribing from", folder, oldRef);
    off(oldRef);
}



