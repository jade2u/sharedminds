import * as FB from './firebase.js';
import * as LANG from './language.js';

/* --- VARS --- */
let others = {};
let songs = {};
let users = [];
let win = true;
let me, user_name, user_color, user_lang;
let folderName = "MUN";
const replicateProxy = "https://replicate-api-proxy.glitch.me";

/* --- FIREBASE --- */
/// INIT
FB.initFirebase(function (user) {
    if (user) {
        //get info from folder
        FB.subscribeToData(folderName, reactToFirebase);
        
    } else {console.log('no user');}
});
/// REACT
export function reactToFirebase(action, data, key) {
    //added
    if (action == "added") {
        //get this user's info
        if (key == FB.getUser().uid) {me = data;} 
        else {others[key] = data;}
    } 
    //changed
    else if (action == "changed") {
        //get this user's info
        if (key == FB.getUser().uid) {me = data;} 
        //else {others[key] = user_name;}
    } 
    //removed
    else if (action == "removed") {console.log("removed from FB", data, key);}
}


/* --- USER --- */
let name_btn = document.getElementById("name-btn");
let name_input = document.getElementById("country");
//when form submitted
name_btn.addEventListener("click", function () {
    //get data
    user_name = name_input.value; //country
    user_color = LANG.matchLanguage('nation', user_name); //color
    user_lang = LANG.matchLanguage('color', user_color); //lang
    users.push(user_name);
    //set locally
    localStorage.setItem("country", user_name);
    localStorage.setItem("color", user_color);
    localStorage.setItem("language", user_lang);
    //embed
    let user = FB.getUser();
    FB.setDataInFirebase(folderName + "/" + user.uid, {
        email: user.email, 
        country: user_name,
        color: user_color,
        language: user_lang, 
    });
    
    askForWords(user_name);
});

/* --- API --- */
async function askForWords(prompt) {
    //ask
    const data = {
        "version": "35042c9a33ac8fd5e29e27fb3197f33aa483f72c2ce3b0b9d201155c7fd2a287",
        input: {
            prompt: "What is the name of a well-known pop song?",
            system_prompt: "Give the response directly with no  introductory or explanatory sentences. Try to give a unique answer.",
            max_tokens: 100,
            max_length: 100,
        },
    };
    //get answer
    console.log("Asking for Words", data);
    let url = replicateProxy + "/create_n_get/";
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: 'application/json',
        },
        body: JSON.stringify(data),
    };
    //turn answer into json
    const words_response = await fetch(url, options);
    const proxy_said = await words_response.json();
    //turn answer into embedding
    if (proxy_said.output.length == 0) {console.log("Something went wrong, try it again");} 
    else {
        let reply = proxy_said.output.join("");
        console.log(reply);
        //add to firebase
        FB.addNewThingToFirebase(folderName + "/songs", {
            song: reply,
            country: prompt
        });
    }
}

/* --- EMBEDDING --- 
async function askForEmbedding(prompt, base64) {
    const data = {
        "version": "0383f62e173dc821ec52663ed22a076d9c970549c209666ac3db181618b7a304",
        "input": {
            "text_input": prompt,
            "modality": "text"
        },
    };
    let url = replicateProxy + "/create_n_get/";
    document.body.style.cursor = "progress";
    console.log("Making a Fetch Request", data);
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: 'application/json',
        },
        body: JSON.stringify(data),
    };
    //wait for reply to load
    const raw_response = await fetch(url, options);
    const replicateJSON = await raw_response.json();
    //when loaded
    if (replicateJSON.output.length == 0) {console.log("Something went wrong, try it again");} 
    else {
        //add to firebase
        //let user = FB.getUser();
        
        //localStorage.setItem("key", user.uid);
        //localStorage.setItem("country", user_name);
        //window.location.href = "../html/index.html";
    }
}
*/
