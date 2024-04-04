import { UMAP } from "https://cdn.skypack.dev/umap-js";
let points = [];

///CANVAS
let canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = "absolute";
canvas.style.left = "0px";
canvas.style.top = "10%";
let ctx = canvas.getContext('2d');
document.body.append(canvas);

///UNIVERSE FIELD
let createUniverseField = document.createElement('input');
let input_div = document.getElementById('input');
createUniverseField.type = "text";
createUniverseField.autocomplete = "off";
createUniverseField.style.position = "absolute";
createUniverseField.style.left = "50%";
createUniverseField.style.top = "5%";
createUniverseField.style.transform = "translate(-50%,-50%)";
createUniverseField.style.width = "350px";
createUniverseField.id = "createUniverse";
createUniverseField.placeholder = "Enter a scene and press 'Enter'";
input_div.append(createUniverseField);
//create universe when enter pressed
createUniverseField.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        let universalMotto = createUniverseField.value;
        console.log("create universe", universalMotto);
        createUniverse(universalMotto);
        //reset stuff
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        points = [];
        while (document.querySelector('svg').hasChildNodes())
        document.querySelector('svg').removeChild(document.querySelector('svg').firstChild)
               
    }
});

///GET EMBEDDINGS
init();
function init() {
    let embeddingsAndSentences = JSON.parse(localStorage.getItem("embeddings"));
    if (embeddingsAndSentences) {
        runUMAP(embeddingsAndSentences);
    }
    else {
        console.log("no embeddings");
    }
}

///PLACE SENTENCE
function placeSentence(sentence, fitting) {
    ctx.font = "12px Arial";
    ctx.fillStyle = "rgba(100,100,100,0.7)";
    let w = ctx.measureText(sentence).width;
    let text_x = Math.abs(fitting[0] * window.innerWidth - w);
    let text_y = Math.abs(fitting[1] * 0.7 * window.innerHeight + 50);
    ctx.fillText(sentence, text_x, text_y);
    //add to points list w/ coordinates
    points.push({
        ctx,
        "song": sentence,
        "x": text_x,
        "y": text_y,
    })
    if(points.length >= 20){connect(points);}
}

///CONNECT
function connect(points){
    //order
    points.sort((a, b) => a.y - b.y);
    console.log(points);

    //draw line b/t last point and this point
    for(var i=1; i< points.length; i++){
        //get distances between points
        let x_dist = Math.abs(points[i].x - points[i-1].x);
        let y_dist = Math.abs(points[i].y - points[i-1].y);
        
        if(y_dist > points.length || x_dist > points.length*10){
            //color
            let color_num = Math.floor(Math.abs(x_dist-y_dist));
            if(color_num > 255){color_num = 255;}
            let line_color = `rgba(${color_num}, ${color_num/2}, ${color_num/0.5}, ${1-(color_num/1000)})`;
            //draw line
            var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
            newLine.setAttribute('id','line2');
            newLine.setAttribute('x1',points[i-1].x - 10);
            newLine.setAttribute('y1',points[i-1].y + 60);
            newLine.setAttribute('x2',points[i].x -10);
            newLine.setAttribute('y2',points[i].y + 60);
            newLine.setAttribute("stroke", line_color);
            //add to svg
            document.querySelector('svg').append(newLine);
        }
    }
}


///CREATE UNIVERSE
async function createUniverse(universalMotto) {
    document.body.style.cursor = "progress";

    ///GET SENTENCES
    let text = "give me 20 song titles and their artists i should listen to while " + universalMotto + ". try to avoid songs with '" + universalMotto + "' in the title.";
    //call AI
    const data = {
        model: "gpt-3.5-turbo-instruct",
        prompt: text,
        temperature: 0,
        max_tokens: 1000,
    };
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(data),
    };
    const openAIProxy = "https://openai-api-proxy.glitch.me";
    const url = openAIProxy + "/AskOpenAI/";
    const response = await fetch(url, options);
    const openAI_json = await response.json();
    //get each song
    let answer_array = openAI_json.choices[0].text.split("\n");
    answer_array = answer_array.slice(2);

    //add each song to embedding set
    let embedding_set = "";
    for(var i=0; i<answer_array.length; i++){
        //remove number
        let slice_index = answer_array[i].indexOf('.') + 2;
        let song = answer_array[i].slice(slice_index);
        //add to set
        embedding_set += song + "\n";
    }
    
    //get embeddings
    //console.log(embedding_set);
    let embeddingData = {
        version: "75b33f253f7714a281ad3e9b28f63e3232d583716ef6718f2e46641077ea040a",
        input: {
            inputs: embedding_set,
        }
    };
    
    ///GET SIMILARITY
    console.log("Asking for Embedding Similarities From Replicate via Proxy", data);
    options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(embeddingData),
    };
    const replicateProxy = "https://replicate-api-proxy.glitch.me"
    const replicateURL = replicateProxy + "/create_n_get/";
    const raw = await fetch(replicateURL, options)
    const embeddingsJSON = await raw.json();
    document.body.style.cursor = "auto";
    //embed
    localStorage.setItem("embeddings", JSON.stringify(embeddingsJSON.output));
    //map
    runUMAP(embeddingsJSON.output)
}


///MAP
function runUMAP(embeddingsAndSentences) {
    let embeddings = [];
    for (let i = 0; i < embeddingsAndSentences.length; i++) {
        //add
        embeddings.push(embeddingsAndSentences[i].embedding);
    }
    var myrng = new Math.seedrandom('hello.');  //same random number
    let umap = new UMAP({
        nNeighbors: 0,
        minDist: 1,
        nComponents: 2,
        random: myrng, 
        spread: 1,
    });
    let fittings = umap.fit(embeddings);
    //normalize to 0-1
    fittings = normalize(fittings);  
    //map
    for (let i = 0; i < embeddingsAndSentences.length; i++) {
        placeSentence(embeddingsAndSentences[i].input, fittings[i]);
    }
}

///NORMALIZE
function normalize(arrayOfNumbers) {
    //find max and min in the array
    let max = [0, 0];
    let min = [0, 0];
    for (let i = 0; i < arrayOfNumbers.length; i++) {
        for (let j = 0; j < 2; j++) {
            if (arrayOfNumbers[i][j] > max[j]) {
                max[j] = arrayOfNumbers[i][j];
            }
            if (arrayOfNumbers[i][j] < min[j]) {
                min[j] = arrayOfNumbers[i][j];
            }
        }
    }
    //make 0-1
    for (let i = 0; i < arrayOfNumbers.length; i++) {
        for (let j = 0; j < 2; j++) {
            arrayOfNumbers[i][j] = (arrayOfNumbers[i][j] - min[j]) / (max[j] - min[j]);
        }
    }
    return arrayOfNumbers;
}