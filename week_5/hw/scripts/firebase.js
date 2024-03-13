// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, child, onValue, update, set, push, onChildAdded, onChildChanged, onChildRemoved } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { reactToFirebase } from './scene.js';


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

const app = initializeApp(firebaseConfig);
let appName = "MUN";
const db = getDatabase();


export function addNewThingToFirebase(folder, data) {
    //firebase will supply the key,  this will trigger "onChildAdded" below
    const dbRef = ref(db, appName + '/' + folder);
    const newKey = push(dbRef, data).key;

    /*
    //if new word
    if(folder=="words"){
        let word_bank = [];
        //get the word
        get(child(ref(db), `MUN/words/${newKey}`)).then((snapshot) => {
            if (snapshot.exists()) {
                //add to array
                word_bank.push(snapshot.val());
                console.log(word_bank);
            } else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          });
    }
    */
    return newKey; //useful for later updating
}

export function updateJSONFieldInFirebase(folder, key, data) {
    console.log(appName + '/' + folder + '/' + key)
    const dbRef = ref(db, appName + '/' + folder + '/' + key);
    update(dbRef, data);
}

export function deleteFromFirebase(folder, key) {
    console.log("deleting", appName + '/' + folder + '/' + key);
    const dbRef = ref(db, appName + '/' + folder + '/' + key);
    set(dbRef, null);
}

export function subscribeToData(folder) {
    //get callbacks when there are changes either by you locally or others remotely
    const commentsRef = ref(db, appName + '/' + folder + '/');

    onChildAdded(commentsRef, (data) => {
        reactToFirebase("added", data.val(), data.key);
        //console.log(commentsRef);
    });
    onChildChanged(commentsRef, (data) => {
        reactToFirebase("changed", data.val(), data.key)
    });
    onChildRemoved(commentsRef, (data) => {
        reactToFirebase("removed", data.val(), data.key)
    });
}

export function setDataInFirebase(folder, key, data) {
    //if it doesn't exist, it adds (pushes) with you providing the key
    //if it does exist, it overwrites
    const dbRef = ref(db, appName + '/' + folder)
    set(dbRef, data);
}