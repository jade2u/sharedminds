const replicateProxy = "https://replicate-api-proxy.glitch.me"
let playing = false;
let img;
let canvas;

function setup() {
    const result = select("#result");
    canvas = createCanvas(512, 512);

    let input_box = createInput("What's stuck in your head?");
    input_box.size(500);
    input_box.id("input_prompt");
    input_box.parent("prompt");
    
    //add a button to ask for picture
    let button = createButton("START");
    button.id("start");
    button.parent("prompt");
    button.mousePressed(() => {
        /*
        if(playing){
            const result = document.querySelector('#result');
            result.style.visibility = "hidden";
        }
        */
        
        result.html('');
        canvas.hide();
        askForWords(input_box.value());
    });
}

async function askForWords(p_prompt) {
    document.body.style.cursor = "progress";
    const result = select("#result");
    const loading = select("#load");
    loading.html("Getting the name...");
    const data = {
        "version": "35042c9a33ac8fd5e29e27fb3197f33aa483f72c2ce3b0b9d201155c7fd2a287",
        input: {
            prompt: "reply with no additional text, the song title and artist of a song that has the lyrics: " + p_prompt,
            max_tokens: 100,
            max_length: 100,
        },
    };
    //console.log("Asking for Words", data);
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: 'application/json',
        },
        body: JSON.stringify(data),
    };
    const url = replicateProxy + "/create_n_get/"
    //console.log("words url", url, "words options", options);
    const words_response = await fetch(url, options);
    //console.log("words_response", words_response);
    const proxy_said = await words_response.json();
    if (proxy_said.output.length == 0) {
        loading.html("Something went wrong, try it again");
    } else {
        let reply = proxy_said.output.join("");
        result.html(reply);
        console.log(reply);
        askForSound(reply); 
    }
}

async function askForSound(p_prompt) {
    const loading = select("#load");
    const result = select("#result");
    loading.html("Getting how it goes...");
    let data = {
        //replicate / riffusion / riffusion
        "version": "8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
        input: {
            "prompt_a": p_prompt,
        },
    };
    //console.log("Asking for Sound Info From Replicate via Proxy", data);
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    const url = replicateProxy + "/create_n_get/"
    //console.log("url", url, "options", options);
    const audio_info = await fetch(url, options);
    console.log("audio_response", audio_info);
    const proxy_said = await audio_info.json();
    console.log("proxy_said", proxy_said.output.audio);
    const ctx = new AudioContext();
    let incomingData = await fetch(proxy_said.output.audio);
    let arrayBuffer = await incomingData.arrayBuffer();
    let decodedAudio = await ctx.decodeAudioData(arrayBuffer);
    const playSound = ctx.createBufferSource();
    playSound.buffer = decodedAudio;;
    playSound.connect(ctx.destination);
    console.log('loaded');

    let play = createButton("LISTEN");
    let pause = createButton("▶");
    play.parent("result");
    pause.parent('result');

    pause.mousePressed(function () {
        console.log(ctx.state);
        if (ctx.state === 'suspended') {
            pause.html("⏸");
            ctx.resume();
        } else
            pause.html("▶");
            ctx.suspend();
    });
    
    play.mousePressed(() => {
        playSound.start(ctx.currentTime);
        playSound.loop = true;
        play.hide();
    });

    askForPicture(p_prompt);
}

async function askForPicture(p_prompt) {
    const loading = select("#load");
    loading.html("Looking through my playlist...");
    let data = {
        "version": "da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf",
        input: {
            "prompt": p_prompt,
            "width": 512,
            "height": 512,
        },
    };
    //console.log("Asking for Picture Info From Replicate via Proxy", data);
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    const url = replicateProxy + "/create_n_get/"
    console.log("url", url, "options", options);
    const picture_info = await fetch(url, options);
    console.log("picture_response", picture_info);
    const proxy_said = await picture_info.json();
    console.log(proxy_said);
    if (proxy_said.output.length == 0) {
        loading.html("Something went wrong, try it again");
    } else {

        showCard(p_prompt);

        loadImage(proxy_said.output[0], (img) => {
            //imageMode(CENTER);
            image(img, 0, 0, 400, 400);
        });
    }
}

function showCard(){
    const result = document.querySelector('#result');
    const loading = document.querySelector('#load')

    loading.innerHTML = '';
    result.style.visibility = "visible";
    canvas.show();
    console.log('done');
}