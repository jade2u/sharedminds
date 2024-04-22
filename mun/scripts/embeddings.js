import * as FB from './firebase.js';

/* --- VARS --- */
let others = {};
let users = [];
let win = true;
let me, user_name;
let folderName = "MUN";
const replicateProxy = "https://replicate-api-proxy.glitch.me";


/* --- BUTTONS --- */
// COUNTRY
let name_btn = document.getElementById("name-btn");
let name_input = document.getElementById("country");
name_btn.addEventListener("click", function () {
    console.log(name_input.value);
    user_name = name_input.value; 
});
/// WORD
let word_btn = document.getElementById("word-btn");
let word_input = document.getElementById("word");
word_btn.addEventListener("click", function () {
    console.log(word_input.value);
    askForWords(word_input.value);
});


/* --- FIREBASE --- */
/// INIT
FB.initFirebase(function (user) {
    if (user) {
        FB.subscribeToData(folderName, reactToFirebase);
    } else {
        console.log('no user');
    }
});
/// REACT
export function reactToFirebase(action, data, key) {
    //added
    if (action == "added") {
        if (key == FB.getUser().uid) {
            me = data;
        } 
        else {
            others[key] = data;
        }
        users.push(data);
    } 
    //changed
    else if (action == "changed") {
        if (key == FB.getUser().uid) {me = data;} 
        else {
            others[key] = data;
        }
    } 
    //removed
    else if (action == "removed") {console.log("removed from FB", data, key);}
    

    if(win == true && users.length==2){
        const random = Math.floor(Math.random() * users.length);
        const chosen_user = users[random];
        console.log(chosen_user);
        
        FB.setDataInFirebase(folderName + "/chosen", {
            god: chosen_user
        });
        win = false;
    }
    //console.log(win);
}

/// EMBEDDING
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
    //turn embedding into json
    const raw_response = await fetch(url, options);
    const replicateJSON = await raw_response.json();
    //add to firebase if exists
    if (replicateJSON.output.length == 0) {console.log("Something went wrong, try it again");} 
    else {
        let user = FB.getUser();
        let email = user.email;
        FB.setDataInFirebase(folderName + "/" + user.uid, {
            email: email, 
            country: user_name, 
            prompt: prompt, 
            base64: base64, 
            embedding: replicateJSON.output 
        });
        localStorage.setItem("key", user.uid);
        localStorage.setItem("country", user_name);
        //console.log(localStorage.getItem("user"));
        window.location.href = "../html/index.html";
    }
}
/// API
async function askForWords(prompt) {
    //ask
    const data = {
        "version": "35042c9a33ac8fd5e29e27fb3197f33aa483f72c2ce3b0b9d201155c7fd2a287",
        input: {
            prompt: "reply with no additional text or wording, an existing song that has the phrase '" + prompt + "' in the title",
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
        let base64 = reply;
        console.log(reply);
        askForEmbedding(prompt, base64);
    }
}