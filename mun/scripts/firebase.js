/* --- IMPORTS --- */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, off, get, child, update, set, push, onChildAdded, onChildChanged, onChildRemoved } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, setPersistence, browserSessionPersistence, signOut, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
//import {reactToFirebase} from "./scene.js";

/* --- VARS --- */
let db, auth, app;
let googleAuthProvider;

/* --- INIT --- */
/// GET USER
export function getUser() {
    return auth.currentUser;
}
/// INIT 
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
            showLogOutButton(user);
        } 
        //signed out
        else {
            console.log("signed out");
            showLoginButtons();
            callback(null);
        }
    });
    //get user
    return auth.currentUser;
}

/* --- GOOGLE --- */
if(document.getElementById("signInWithGoogle") != undefined){
    document.getElementById("signInWithGoogle").addEventListener("click", function () {
        signInWithPopup(auth, googleAuthProvider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
    });
}

/* --- BUTTONS --- */
/// LOG IN
function showLoginButtons() {
    //only show log in button
    document.getElementById("login").style.display = "block";
    document.getElementById("logout").style.display = "none";
}
/// LOGGED IN
function showLogOutButton(user) {
    //only show log out button
    if(document.getElementById("logoutButton") != undefined){
        document.getElementById("logout").style.display = "block";
        document.getElementById("login").style.display = "none";
        let userNameDiv = document.getElementById("userName");
        //show email as user
        if (user.displayName) {userNameDiv.innerHTML = user.email;} 
    }
    
}
/// LOG OUT
if(document.getElementById("logoutButton") != undefined){
    document.getElementById("logoutButton").addEventListener("click", function () {
        signOut(auth).then(() => {
            console.log("signed out");
        }).catch((error) => {
            console.log("error signing out");
        });
    });
}

/* --- CHOSEN --- */
/// SETTING CHOSEN SONG
export function trackFirebase(data){
    const dbRef = ref(getDatabase());
    //get snapshot of chosen folder
    get(child(dbRef, `MUN/songs/chosen`)).then((snapshot) => {
        //if there's already a chosen song, print
        if (snapshot.exists()) {console.log(snapshot.val());}
        //if there's no chosen song, set latest song as chosen song
        else {setDataInFirebase('MUN/songs/chosen', data);}
    }).catch((error) => { console.error(error);});
    //redirect
    window.location.href = "../html/index.html";
}

  
/* --- CHANGES --- */
/// ADD
export function addNewThingToFirebase(folder, data) {
    //if new thing added is a song
    if(folder == "MUN/songs"){trackFirebase(data);} //see if should be set as chosen song
    
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


