import * as THREE from 'three';
import * as FB from './firebase.js';
import * as LANG from './language.js';


/* ----------- VARIABLES -----------*/
//scene
let camera, scene, scene_screen, renderer;
//json
let thingsThatNeedUpdating = [];
let myObjectsByThreeID = {}; //convert three.js to JSON 
let myObjectsByFirebaseKey = {}; //convert firebase key to JSON
let new_lang;
//game
let chosen_song, chosen_lang, chosen_key;
const hello = document.getElementById('hello');
const chosen_text = document.getElementById("chosen-word");
//mouse
let mouseDownX = 0, mouseDownY = 0;
let lon = -90, mouseDownLon = 0;
let lat = 0, mouseDownLat = 0;
let isUserInteracting = false;
//user
let user_pic, user_key;
var cancel; 
var seconds = 0;

//call functions
initHTML();
init3D();

/* ----------- FIREBASE -----------*/
/// INIT
FB.initFirebase(function (user) {
    //if signed in
    if (user) {
        //get user data
        user_pic = user.photoURL;
        user_key = user.uid;
        //get database changes
        FB.subscribeToData("MUN", reactToFirebase);
        FB.trackSongs();
    } else {console.log('no user');}
});

/// FIREBASE CHANGE
export function reactToFirebase(reaction, data, key){
    //added
    if(reaction === "added"){
        //if chosen song
        if(data.type == "chosen"){getChosen(data);} //update screen

        //if pin
        if(data.type == "pin") {
            //if win
            if(chosen_lang == data.lang){
                console.log('win');
                //make green
                hello.style.backgroundColor = "limegreen";
                hello.style.color = "white";
                chosen_text.style.backgroundColor = "limegreen";
                chosen_text.style.color = "white";
                //delete chosen song from firebase
                FB.deleteFromFirebase("MUN/songs", "chosen");
                FB.deleteFromFirebase("MUN/songs", chosen_key);
                //get new chosen song
                FB.trackSongs();
                //cancel = setInterval(incrementSeconds, 1000);
                //if(seconds == 2){clearInterval(cancel);}
            }
        }  
    }
    //changed
    else if(reaction === "changed"){
        console.log(reaction);}
    //removed
    else if(reaction === "removed"){
        if(data.key == "chosen"){console.log("repicking");} //picking new chosen song
    }
}

function incrementSeconds() {
    seconds += 1;
    //console.log(seconds);
    if(seconds == 2){
        hello.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
        hello.style.color = "black";
        chosen_text.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
        chosen_text.style.color = "black";
        seconds = 0;
        return;
    }
}


/// GET CHOSEN WORD
function getChosen(data){
    console.log(data);
    //update vars
    chosen_key = data.key;
    chosen_song = data.song;
    chosen_lang = data.lang;
    //translate song
    LANG.translate(chosen_song, chosen_lang)
    .then(translatedText => {
        console.log(translatedText);
        //update html
        chosen_text.innerHTML = translatedText; 
        hello.innerHTML = chosen_song;
    })
}



/* ----------- 3D -----------*/
/// 3D SCENE
function init3D() {
    //scene
    scene = new THREE.Scene();
    scene_screen = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    //inital renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('THREEcontainer').appendChild(renderer.domElement);
    //bg
    let bgGeometery = new THREE.SphereGeometry(1000, 60, 40);
    bgGeometery.scale(-1, 1, 1);
    //pic
    let panotexture = new THREE.TextureLoader().load("./map.png");
    let backMaterial = new THREE.MeshBasicMaterial({ map: panotexture });
    let back = new THREE.Mesh(bgGeometery, backMaterial);
    scene.add(back);

    //move
    moveCameraWithMouse();
    camera.position.z = 0;
    animate();
}
/// 3D POSITION
function find3DCoornatesInFrontOfCamera(distance, mouse) {
    let vector = new THREE.Vector3();
    vector.set(
        (mouse.x / window.innerWidth) * 2 - 1,
        - (mouse.y / window.innerHeight) * 2 + 1,
        0
    );
    vector.unproject(camera);
    vector.multiplyScalar(distance)
    return vector;
}
/// ANIMATE
function animate() {
    for (let i = 0; i < thingsThatNeedUpdating.length; i++) {
        thingsThatNeedUpdating[i].texture.needsUpdate = true;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}


/* ----------- HTML -----------*/
function initHTML() {
    /// THREE.JS
    const THREEcontainer = document.createElement("div");
    THREEcontainer.setAttribute("id", "THREEcontainer");
    document.body.appendChild(THREEcontainer);
    THREEcontainer.style.position = "absolute";
    THREEcontainer.style.top = "0";
    THREEcontainer.style.left = "0";
    THREEcontainer.style.width = "100%";
    THREEcontainer.style.height = "100%";
    THREEcontainer.style.zIndex = "1";

    ///CHANGE TEXT
    document.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { //when enter pressed
            //get textbox location
            const textboxRect = hello.getBoundingClientRect();
            const mouse = { x: textboxRect.right - (textboxRect.width / 2), y: textboxRect.top };
            const pos = find3DCoornatesInFrontOfCamera(300 - camera.fov * 3, mouse);

            //get color & language
            colorCast(mouse);
            //get translation
            LANG.translate(hello.innerHTML, new_lang)
            .then(translatedText => {
                //change text
                hello.innerHTML = translatedText;
                //add translated to firebase
                const data = { 
                    type: "pin", 
                    position: { x: pos.x, y: pos.y, z: pos.z }, 
                    lang: new_lang,
                    pic: user_pic
                };
                FB.addNewThingToFirebase("MUN/pin/", data);
            })
            
            //stamp
            addP5To3D(mouse.x, mouse.y);
        }
    });
}


/* ----------- P5 -----------*/
/// STAMP
function createP5Sketch(w, h) {
    let sketch = function (p) {
        let myCanvas;
        let img;
        p.getCanvas = function () {
            return myCanvas;
        }
        p.setup = function () {
            img = p.loadImage(user_pic);
            myCanvas = p.createCanvas(w, h);
        };
        p.draw = function () {
            this.x = p.width / 2;
            this.y = p.height / 2;
            this.alpha = 255;
            p.noStroke();
            p.fill(255, 0, 0, 100);
            p.image(img, this.x-5, this.y-10, 10, 10);
        };
    };
    return new p5(sketch);
}

/// ADD SKETCH TO 3D
function addP5To3D(_x, _y) {
    //get canvas
    let newP5 = createP5Sketch(200, 200);
    let p5Canvas = newP5.getCanvas(); 
    let canvas = p5Canvas.elt; 
    //add to texture
    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    let material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthTest: false });
    let geo = new THREE.PlaneGeometry(canvas.width / canvas.width, canvas.height / canvas.width);
    let mesh = new THREE.Mesh(geo, material);
    mesh.scale.set(10, 10, 10);

    //position
    const mouse = { x: _x, y: _y };
    const pos = find3DCoornatesInFrontOfCamera(300 - camera.fov * 3, mouse);
    mesh.position.x = pos.x;
    mesh.position.y = pos.y;
    mesh.position.z = pos.z;
    let thisObject = { canvas: canvas, mesh: mesh, texture: texture, p5Canvas: p5Canvas };

    thingsThatNeedUpdating.push(thisObject);
    mesh.lookAt(0, 0, 0);
    scene.add(mesh);
}

/* ----------- RAYCASTER -----------*/
function colorCast(pos){
    //setup raycaster & plane mesh
    let rayCaster = new THREE.Raycaster();
    rayCaster.setFromCamera(pos, camera);
    let plane_mesh;
    scene.traverse(function(object) {
        if (object.isMesh && (object.geometry.type=="PlaneGeometry")){plane_mesh = object};
    });

    //get cords in window
    let mouse = new THREE.Vector2();
    mouse.x =((pos.x-renderer.domElement.offsetLeft)/renderer.domElement.width)*2-1;
    mouse.y =-((pos.y-renderer.domElement.offsetTop)/renderer.domElement.height)*2+1;
    mouse.x=parseInt(window.innerWidth/2+mouse.x*window.innerWidth/2);
    mouse.y=parseInt(window.innerHeight/2+mouse.y*window.innerHeight/2);
    //render stuff
    let renderTargetTexture = new THREE.WebGLRenderTarget(
        window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type: THREE.FloatType }
    );

    renderer.clear();
    renderer.setRenderTarget(renderTargetTexture);
    renderer.clear();
    renderer.render(scene,camera);
    renderer.setRenderTarget(null);
    renderer.render(scene_screen,camera);
    //read pixels to rgb
    const read=new Float32Array(4);
    renderer.readRenderTargetPixels(renderTargetTexture,pos.x,pos.y,1,1,read);
    let r=parseInt(read[0]*255);
    let g=parseInt(read[1]*255);
    let b=parseInt(read[2]*255);
    let map_color = "("+r+","+g+","+b+")";
    //match map color to language
    new_lang = LANG.matchLanguage('color', map_color);
    if(new_lang!=undefined){hello.style.color = "rgb" + map_color + "";}
    
}


/* ----------- MOUSE STUFF -----------*/
function moveCameraWithMouse() {
    //set up event handlers
    const div3D = document.getElementById('THREEcontainer');
    div3D.addEventListener('mousedown', div3DMouseDown, false);
    div3D.addEventListener('mousemove', div3DMouseMove, false);
    div3D.addEventListener('mouseup', div3DMouseUp, false);
    div3D.addEventListener('wheel', div3DMouseWheel, { passive: true });
    window.addEventListener('dblclick', div3DDoubleClick, false);
    window.addEventListener('resize', onWindowResize, false);

    camera.target = new THREE.Vector3(0, 0, 0);  //something for the camera to look at
}
/// DOUBLE CLICK
function div3DDoubleClick(event) {
    //addP5To3D(event.clientX, event.clientY);
}
/// CLICK
function div3DMouseDown(event) {
    mouseDownX = event.clientX;
    mouseDownY = event.clientY; 
    mouseDownLon = lon;
    mouseDownLat = lat;

    isUserInteracting = true;
}
/// DRAG
function div3DMouseUp(event) {
    isUserInteracting = false;
}
/// MOVE
function div3DMouseMove(event) {
    //when clicked
    if (isUserInteracting) {
        lon = (mouseDownX - event.clientX) * 0.1 + mouseDownLon;
        lat = (event.clientY - mouseDownY) * 0.1 + mouseDownLat;
        computeCameraOrientation();   
    }
}
/// ZOOM
function div3DMouseWheel(event) {
    camera.fov += event.deltaY * 0.05;
    camera.fov = Math.max(5, Math.min(90, camera.fov)); //limit zoom
    camera.updateProjectionMatrix();
}
/// ORIENTATION
function computeCameraOrientation() {
    lat = Math.max(- 30, Math.min(90, lat));  //restrict movement
    let phi = THREE.MathUtils.degToRad(100 - lat);  //restrict movement
    let theta = THREE.MathUtils.degToRad(lon);
    //move the target that the camera is looking at
    camera.target.x = 100 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 100 * Math.cos(phi);
    camera.target.z = 100 * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(camera.target);
}
/// WINDOW RESIZE
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    console.log('Resized');
}


