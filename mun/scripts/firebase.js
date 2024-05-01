/* --- IMPORTS --- */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, off, get, child, update, set, push, onChildAdded, onChildChanged, onChildRemoved } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, setPersistence, browserSessionPersistence, signOut, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import * as EMBED from './embeddings.js';
import {language} from './language.js';

/* --- VARS --- */
let db, auth, app;
let googleAuthProvider;

/* --- INIT --- */
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
        //show game
        document.getElementById('game').style.display = 'block';
        //hide login
        document.getElementById('login').style.display = 'none';
        //add scene script
        let scene = document.createElement('script');
        scene.setAttribute("src", "scripts/scene.js");
        scene.setAttribute("type", "module");
        document.querySelector('body').appendChild(scene);
    }
});

/* --- BUTTONS --- */
function showStart() {
    //only show log in button
    document.getElementById('start-btn').disabled = false; 
}

/* --- CHOSEN --- */
/// SETTING CHOSEN SONG
export function trackFirebase(data){
    const dbRef = ref(getDatabase());
    //get snapshot of chosen folder
    get(child(dbRef, `MUN/songs`)).then((snapshot) => {
        //if there's already 5 songs
        if (snapshot.size > 0) {
            var chosen;
            //get 1st song
            snapshot.forEach(function(urlSnapshot) {
                if (!chosen) {
                    chosen = urlSnapshot;
                    //set as chosen
                    //in firebase
                    setDataInFirebase("MUN/songs/chosen", { 
                        key: urlSnapshot.key,
                        lang: urlSnapshot.val().lang,
                        song: urlSnapshot.val().song
                    });
                }
            });
            
        }
        //if there's less than 5 songs
        else if (snapshot.size == 0) {
            console.log(snapshot.size);
            //get random languages
            var lang_array = language["languages"];
            let n = 5;
            let random = lang_array.sort(() => .5 - Math.random()).slice(0,n);
            console.log(random);
            //get songs
            EMBED.askForWords() 
            .then(reply_arr => {
                //add them to firebase    
                for(var i=0; i<reply_arr.length; i++){
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


  
/* --- CHANGES --- */
/// ADD
export function addNewThingToFirebase(folder, data) {
    //if new thing added is a song
    //if(folder == "MUN/songs"){trackFirebase(data);} //see if should be set as chosen song
    const dbRef = ref(db, folder);
    const newKey = push(dbRef, data).key;
    return newKey; //useful for later updating
}
/// DELETE
export function deleteFromFirebase(folder, key) {
    console.log("deleting", folder + '/' + key);
    if(key == "chosen"){}
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
        //reactToFirebase("added", data.val(), data.key);
    });
    onChildChanged(commentsRef, (data) => {
        callback("changed", data.val(), data.key);
        //reactToFirebase("changed", data.val(), data.key)
    });
    onChildRemoved(commentsRef, (data) => {
        callback("removed", data.val(), data.key);
        //reactToFirebase("removed", data.val(), data.key)
    });
}
export function unSubscribeToData(folder) {
    const oldRef = ref(db, folder + '/');
    console.log("unsubscribing from", folder, oldRef);
    off(oldRef);
}


