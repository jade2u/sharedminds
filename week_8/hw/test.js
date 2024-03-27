import * as FB from './firebaseAuth.js';

let others = {};
let me;
const replicateProxy = "https://replicate-api-proxy.glitch.me";
let exampleName = "week8";

FB.initFirebase(function (user) {
    if (user) {
        //document.getElementById("localUser").style.visibility = "hidden";
        FB.subscribeToData(exampleName, reactToFirebase);
    } else {
        //document.getElementById("localUser").style.visibility = "hidden";
    }
});

function reactToFirebase(action, data, key) {
    if (action == "added") {
        if (key == FB.getUser().uid) {
            //document.getElementById("inputText").value = "";
            let localImage = document.getElementById("outputImage");
            localImage.src = data.base64;
            me = data;
            renderOthers();
        } else {
            others[key] = data;
            renderOthers();
        }
    } else if (action == "changed") {
        if (key == FB.getUser().uid) {
            //document.getElementById("inputText").value = "";
            let localImage = document.getElementById("outputImage");
            localImage.src = data.base64;
            me = data;
            renderOthers();
        } else {
            others[key] = data;
            renderOthers();
        }
    } else if (action == "removed") {
        console.log("removed from FB", data, key);
    }
    console.log("others", others);
}

function renderOthers() {
    if (!me) return;
    console.log("renderOthers", others);
    //getNormalized2DDistance(me, others);
    let angle = 0;
    let angleStep = 2 * Math.PI / (Object.keys(others).length + 1);;
    for (let key in others) {
        let other = others[key];
        let otherDiv = document.getElementById(key);
        if (!otherDiv) {
            otherDiv = document.createElement("div");
            otherDiv.setAttribute("id", key);
            document.getElementById("playlist").appendChild(otherDiv);
        }
        let distance = 200 + (1 - other.normalizedDistance) * 200;
        let x = distance * Math.cos(angle);
        let y = distance * Math.sin(angle);
        //console.log("x,y", x, y, angle);
        angle += angleStep;
        otherDiv.innerHTML = "<img src='" + other.base64 + "' width='150px' crossorigin='anonymous'/>";
    }
}

function cosineSimilarity(a, b) {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += (a[i] * b[i]);
        magnitudeA += (a[i] * a[i]);
        magnitudeB += (b[i] * b[i]);
    }
    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);
    return dotProduct / (magnitudeA * magnitudeB);
}

let inputField = document.getElementById("inputText");
inputField.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        askForWords(inputField.value);
    }
});


async function askForEmbedding(prompt, base64) {
    const data = {
        "version": "0383f62e173dc821ec52663ed22a076d9c970549c209666ac3db181618b7a304",
        "input": {
            "text_input": prompt,
            "modality": "text"
        },
    };
    //feedback.innerHTML = "";
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
    const raw_response = await fetch(url, options);
    //turn it into json
    const replicateJSON = await raw_response.json();
    document.body.style.cursor = "auto";

    console.log("replicateJSON", replicateJSON);
    if (replicateJSON.output.length == 0) {
        feedback.innerHTML = "Something went wrong, try it again";
    } else {
        console.log("embedding", replicateJSON.output);
        let user = FB.getUser();
        console.log("user", user);
        let userName = user.displayName ? user.displayName : user.email.split("@")[0];
        FB.setDataInFirebase(exampleName + "/" + user.uid, { userName: userName, prompt: prompt, base64: base64, embedding: replicateJSON.output });
    }
}

async function askForWords(prompt) {
    const result = document.querySelector('#localUser');
    result.style.visibility = "hidden";

    const data = {
        "version": "35042c9a33ac8fd5e29e27fb3197f33aa483f72c2ce3b0b9d201155c7fd2a287",
        input: {
            prompt: "reply with no additional text or wording, the song title and artist of a song that has the lyrics: " + prompt,
            max_tokens: 100,
            max_length: 100,
        },
    };
    //console.log("Asking for Words", data);
    feedback.innerHTML = "Getting the name ...";
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

    const words_response = await fetch(url, options);
    //console.log("words_response", words_response);
    const proxy_said = await words_response.json();
    if (proxy_said.output.length == 0) {
        feedback.innerHTML = "Something went wrong, try it again";
    } else {
        let reply = proxy_said.output.join("");
        let title = document.getElementById("title");
        title.innerHTML = reply;

        let base64 = reply;
        askForEmbedding(prompt, base64);

        console.log(reply);
        askForPicture(reply); 
    }
}

async function askForPicture(prompt) {
    const data = {
        "version": "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        input: {
            prompt: prompt,
            seed: 42
        },
    };
    feedback.innerHTML = "Getting what it looks like ...";
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
    const raw_response = await fetch(url, options);
    //turn it into json
    const replicateJSON = await raw_response.json();
    document.body.style.cursor = "auto";

    console.log("replicateJSON", replicateJSON);
    if (replicateJSON.output.length == 0) {
        feedback.innerHTML = "Something went wrong, try it again";
    } else {
        feedback.innerHTML = "";
        let imageURL = replicateJSON.output[0];
        let localImage = document.getElementById("outputImage");
        localImage.crossOrigin = "Anonymous";
        localImage.onload = function () {
            console.log("image loaded", localImage);
            let canvas = document.createElement("canvas");
            canvas.width = localImage.width;
            canvas.height = localImage.height;
            let context = canvas.getContext("2d");
            context.drawImage(localImage, 0, 0, localImage.width, localImage.height);
            let base64 = canvas.toDataURL();
            //addImageRemote(base64,prompt);
            askForEmbedding(prompt, base64);
            showCard(prompt);
        }
        localImage.src = imageURL;
        localImage.crossOrigin = 'anonymous';

    }
}

function showCard(){
    const result = document.querySelector('#localUser');
    result.style.visibility = "visible";

    const playlist = document.querySelector('#playlist');
    playlist.style.visibility = "visible";

    console.log('done');
}
