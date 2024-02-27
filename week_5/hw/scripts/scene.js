import * as THREE from 'three';
import * as FB from './firebase.js';
import * as LANG from './language.js';

/* ----------- VARIABLES -----------*/
//scene
let camera, scene, scene_screen, renderer;
const textbox = document.getElementById('textbox');
//json
let thingsThatNeedUpdating = [];
let myObjectsByThreeID = {}; //convert three.js to JSON 
let myObjectsByFirebaseKey = {}; //convert firebase key to JSON
//mouse
let mouseDownX = 0, mouseDownY = 0;
let lon = -90, mouseDownLon = 0;
let lat = 0, mouseDownLat = 0;
let isUserInteracting = false;

//static mesh
const static_geometry = new THREE.PlaneGeometry(1, 1);
const static_material = new THREE.MeshBasicMaterial({opacity: 0, transparent: true});
const mesh_static = new THREE.Mesh(static_geometry, static_material);
mesh_static.position.set(-5,0,-5);

//call functions
initHTML();
init3D();
recall();

/* ----------- FIREBASE -----------*/
export function reactToFirebase(reaction, data, key){
    //add new text
    if(reaction === "added"){
        createNewText(data, key);
        //console.log(reaction);
    }
    else if(reaction === "changed"){console.log(reaction);}
    else if(reaction === "removed"){console.log(reaction);}
}
function recall() {
    console.log("recall");
    FB.subscribeToData('objects'); //get notified if anything changes in this folder
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
    scene.add(mesh_static);
    //pic
    let panotexture = new THREE.TextureLoader().load("map.png");
    let backMaterial = new THREE.MeshBasicMaterial({ map: panotexture });
    let back = new THREE.Mesh(bgGeometery, backMaterial);
    scene.add(back);

    let planeMesh;
    //load texture and initialize planeMesh, textureData and renderTargetTexture
    new THREE.TextureLoader().load("map.png", function (texture) {
        planeMesh = new THREE.Mesh(
        new THREE.SphereGeometry(texture.image.width, texture.image.height),
        new THREE.MeshBasicMaterial({ map: texture })
        );
    })

    scene.add(planeMesh);

    //move
    moveCameraWithMouse();
    camera.position.z = 0;
    animate();
}
/// ANIMATE
function animate() {
    for (let i = 0; i < thingsThatNeedUpdating.length; i++) {
        thingsThatNeedUpdating[i].texture.needsUpdate = true;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
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

/* ----------- HTML -----------*/
function initHTML() {
    // three.js format
    const THREEcontainer = document.createElement("div");
    THREEcontainer.setAttribute("id", "THREEcontainer");
    document.body.appendChild(THREEcontainer);
    THREEcontainer.style.position = "absolute";
    THREEcontainer.style.top = "0";
    THREEcontainer.style.left = "0";
    THREEcontainer.style.width = "100%";
    THREEcontainer.style.height = "100%";
    THREEcontainer.style.zIndex = "1";
    
    // draw textbox
    textbox.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { //when enter pressed
            //get textbox location
            const textboxRect = textbox.getBoundingClientRect();
            const mouse = { x: textboxRect.right - (textboxRect.width / 2), y: textboxRect.top };
            const pos = find3DCoornatesInFrontOfCamera(300 - camera.fov * 3, mouse);
            console.log(pos);
            colorCast(mouse);
            /*
            //add to firebase
            const data = { type: "text", position: { x: pos.x, y: pos.y, z: pos.z }, text: textbox.value };
            FB.addNewThingToFirebase("objects", data);
            */
            //draw circle & new text
            addP5To3D(mouse.x, mouse.y);
        }
    });
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
    const materialScreen = new THREE.ShaderMaterial({
        uniforms: { 'tDiffuse': { value: renderTargetTexture.texture } },
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragment_shader_screen' ).textContent,
        depthWrite: false
    });

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
    console.log("X:"+pos.x+" Y:"+pos.y+" RGB: ["+r+","+g+","+b+"] Color: %c     ","background:rgb("+r+","+g+","+b+");");
}

/* ----------- CIRCLE -----------*/
/// NEW P5
function createP5Sketch(w, h) {
    let sketch = function (p) {
        let myCanvas;
        
        p.getCanvas = function () {
            return myCanvas;
        }
        p.setup = function () {
            myCanvas = p.createCanvas(w, h);
        };
        p.draw = function () {
            this.x = p.width / 2;
            this.y = p.height / 2;
            this.alpha = 255;
            p.noStroke();
            p.fill(0, 255, 0, 10);
            p.ellipse(this.x, this.y, 5);
        };
    };
    return new p5(sketch);
}

/// ADD P5 TO 3D
function addP5To3D(_x, _y) {
    let newP5 = createP5Sketch(200, 200);
    let p5Canvas = newP5.getCanvas(); //pull the p5 canvas out of sketch 
    let canvas = p5Canvas.elt; //and then regular (elt) js canvas out of special p5 canvas
    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    let material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthTest: false });
    let geo = new THREE.PlaneGeometry(canvas.width / canvas.width, canvas.height / canvas.width);
    let mesh = new THREE.Mesh(geo, material);
    mesh.scale.set(10, 10, 10);

    let mouse = { x: _x, y: _y };
    const posInWorld = find3DCoornatesInFrontOfCamera(300 - camera.fov * 3, mouse);
    mesh.position.x = posInWorld.x;
    mesh.position.y = posInWorld.y;
    mesh.position.z = posInWorld.z;

    mesh.lookAt(0, 0, 0);
    scene.add(mesh);

    let thisObject = { canvas: canvas, mesh: mesh, texture: texture, p5Canvas: p5Canvas };
    thingsThatNeedUpdating.push(thisObject);

    //console.log(mesh.getWorldPosition(mesh_static.position))
}

/* ----------- TEXT -----------*/
/// NEW 
function createNewText(data, firebaseKey) {
    // canvas
    let canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    //material
    let texture = new THREE.Texture(canvas);
    let material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, alphaTest: 0.5 });
    let geo = new THREE.PlaneGeometry(1, 1);
    let mesh = new THREE.Mesh(geo, material);
    mesh.lookAt(0, 0, 0);
    mesh.scale.set(10, 10, 10);
    scene.add(mesh);
    let text_msg = data.text;
    let posInWorld = data.position;
    //add to firebase
    let thisObject = { type: "text", firebaseKey: firebaseKey, threeID: mesh.uuid, text: text_msg, position: posInWorld, canvas: canvas, mesh: mesh, texture: texture };
    myObjectsByThreeID[mesh.uuid] = thisObject;
    myObjectsByFirebaseKey[firebaseKey] = thisObject;
    //draw
    redrawText(thisObject);

}
/// ADD TO 3D
function redrawText(thisObject) {
    //position
    thisObject.mesh.position.x = thisObject.position.x;
    thisObject.mesh.position.y = thisObject.position.y;
    thisObject.mesh.position.z = thisObject.position.z;
    thisObject.mesh.lookAt(0, 0, 0);
    //find language
    let new_lang = LANG.matchLanguage(thisObject.mesh.getWorldPosition(mesh_static.position))
    //translate
    LANG.translate(thisObject.text, new_lang)
    .then(translatedText => {
        //draw text
        let canvas = thisObject.canvas;
        let context = canvas.getContext("2d");
        thisObject.texture.needsUpdate = true;

        console.log(translatedText);
        context.clearRect(0, 0, canvas.width, canvas.height);
        let fontSize = Math.max(camera.fov / 10, 15);
        context.font = fontSize + "pt Arial";
        context.textAlign = "center";
        context.fillStyle = "red";
        context.fillText(translatedText, canvas.width / 2, canvas.height / 2);
    })
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
    addP5To3D(event.clientX, event.clientY);
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


