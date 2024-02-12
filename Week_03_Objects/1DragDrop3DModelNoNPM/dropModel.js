//Notice import map in html 
//import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.1/three.module.min.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera, scene, renderer;
let thingsThatNeedUpdating = [];
let thingsThatNeedSpinning = [];
initHTML();
init3D();

/// LOAD DUCK
const loader = new GLTFLoader(); //load 3d model
function creatNewModel(file, pos) {
    loader.load(file, function (gltf) {
        const model = gltf.scene;
        model.scale.set(5, 5, 5);
        model.position.set(pos.x, pos.y, pos.z);
        scene.add(model);
        thingsThatNeedSpinning.push(model); //spin
    });
}


function init3D() {
    /// CANVAS
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

    /// RENDERER
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('THREEcontainer').appendChild(renderer.domElement);

    /// BG
    let bgGeometery = new THREE.SphereGeometry(1000, 60, 40);
    bgGeometery.scale(-1, 1, 1);
    //img
    let panotexture = new THREE.TextureLoader().load("itp.jpg");
    let backMaterial = new THREE.MeshBasicMaterial({ map: panotexture });
    let back = new THREE.Mesh(bgGeometery, backMaterial);
    scene.add(back);
    //light
    let ambientLight = new THREE.AmbientLight(new THREE.Color('hsl(0, 0%, 100%)'), 0.75);
    scene.add(ambientLight);

    moveCameraWithMouse();

    camera.position.z = 0;
    animate();

}

function animate() {
    //update
    for (let i = 0; i < thingsThatNeedUpdating.length; i++) {
        thingsThatNeedUpdating[i].texture.needsUpdate = true;
    }
    //spin
    for (let i = 0; i < thingsThatNeedSpinning.length; i++) {
        thingsThatNeedSpinning[i].rotation.y += 0.01;
        thingsThatNeedSpinning[i].rotation.x += 0.01;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function initHTML() {
    /// CONTAINER
    const THREEcontainer = document.createElement("div");
    THREEcontainer.setAttribute("id", "THREEcontainer");
    document.body.appendChild(THREEcontainer);
    // style
    THREEcontainer.style.position = "absolute";
    THREEcontainer.style.top = "0";
    THREEcontainer.style.left = "0";
    THREEcontainer.style.width = "100%";
    THREEcontainer.style.height = "100%";
    THREEcontainer.style.zIndex = "1";

    /// TEXT
    const textInput = document.createElement("input");
    textInput.setAttribute("type", "text");
    textInput.setAttribute("id", "textInput");
    textInput.setAttribute("placeholder", "Enter text here");
    document.body.appendChild(textInput);
    // style
    textInput.style.position = "absolute";
    textInput.style.top = "50%";
    textInput.style.left = "50%";
    textInput.style.transform = "translate(-50%, -50%)";
    textInput.style.zIndex = "5";

    /// ENTER
    textInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            //text box position
            const inputRect = textInput.getBoundingClientRect();
            let mouse = { x: inputRect.left, y: inputRect.top };
            console.log("Entered Text", mouse.z);
            const pos = find3DCoornatesInFrontOfCamera(150 - camera.fov, mouse);
            createNewText(textInput.value, pos);
        }
    });

    window.addEventListener("dragover", function (e) {
        e.preventDefault();  //prevents browser from opening the file
    }, false);

    window.addEventListener("drop", (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        for (let i = 0; i < files.length; i++) {
            if (files[i].type.match("image")) {
                // Process the dropped image file here
                console.log("Dropped image file:", files[i]);

                const reader = new FileReader();
                reader.onload = function (event) {
                    const img = new Image();
                    img.onload = function () {
                        let mouse = { x: e.clientX, y: e.clientY };
                        const pos = find3DCoornatesInFrontOfCamera(150 - camera.fov, mouse);
                        createNewImage(img, pos, files[i]);
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(files[i]);
                // 3d model
            } else if (files[i].name.match(/\.glb/)) {
                console.log("Dropped 3d file:", files[i]);
                const reader = new FileReader();
                reader.onload = function (event) {
                    let mouse = { x: e.clientX, y: e.clientY };
                    const pos = find3DCoornatesInFrontOfCamera(150 - camera.fov, mouse);
                    creatNewModel(event.target.result, pos);
                };
                reader.readAsDataURL(files[i]);
            }

        }
    }, true);
}

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




function createNewImage(img, posInWorld, file) {

    console.log("Created New Text", posInWorld);
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    let context = canvas.getContext("2d");
    let fontSize = Math.max(12);
    context.drawImage(img, 0, 0);
    context.font = fontSize + "pt Arial";
    context.textAlign = "center";
    context.fillStyle = "red";
    context.fillText(file.name, canvas.width / 2, canvas.height - 30);
    
    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    let material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    let geo = new THREE.PlaneGeometry(canvas.width / canvas.width, canvas.height / canvas.width);
    let mesh = new THREE.Mesh(geo, material);

    mesh.position.x = posInWorld.x;
    mesh.position.y = posInWorld.y;
    mesh.position.z = posInWorld.z;

    console.log(posInWorld);
    mesh.lookAt(0, 0, 0);
    mesh.scale.set(10, 10, 10);
    scene.add(mesh);
}


function createNewText(text_msg, posInWorld) {
    let canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;

    let context = canvas.getContext("2d");
    let fontSize = Math.max(camera.fov / 2, 72);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = fontSize + "pt Arial";
    context.textAlign = "center";
    context.fillStyle = "red";
    context.fillText(text_msg, canvas.width / 2, canvas.height / 2);

    let textTexture = new THREE.Texture(canvas);
    textTexture.needsUpdate = true;
    let material = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true });
    let geo = new THREE.PlaneGeometry(1, 1);
    let mesh = new THREE.Mesh(geo, material);

    mesh.position.x = posInWorld.x;
    mesh.position.y = posInWorld.y;
    mesh.position.z = posInWorld.z;

    console.log(posInWorld);
    mesh.lookAt(0, 0, 0);
    mesh.scale.set(10, 10, 10);
    scene.add(mesh);
}


/////MOUSE STUFF
let mouseDownX = 0, mouseDownY = 0;
let lon = -90, mouseDownLon = 0;
let lat = 0, mouseDownLat = 0;
let isUserInteracting = false;


function moveCameraWithMouse() {
    //set up event handlers
    const div3D = document.getElementById('THREEcontainer');
    div3D.addEventListener('mousedown', div3DMouseDown, false);
    div3D.addEventListener('mousemove', div3DMouseMove, false);
    div3D.addEventListener('mouseup', div3DMouseUp, false);
    div3D.addEventListener('wheel', div3DMouseWheel, { passive: true });
    //add double click listener
    window.addEventListener('dblclick', div3DDoubleClick, false); // Add double click event listener
    window.addEventListener('resize', onWindowResize, false);
    camera.target = new THREE.Vector3(0, 0, 0);  //something for the camera to look at
}

/// CREATE DUCK
function div3DDoubleClick(event) {
    console.log('double click');
    let mouse = { x: event.clientX, y: event.clientY };
    const pos = find3DCoornatesInFrontOfCamera(150 - camera.fov, mouse);
    creatNewModel('./Duck.glb', pos);
}

/// CLICK & DRAG
function div3DMouseDown(event) {
    mouseDownX = event.clientX;
    mouseDownY = event.clientY;
    mouseDownLon = lon;
    mouseDownLat = lat;
    isUserInteracting = true;
}
function div3DMouseMove(event) {
    if (isUserInteracting) {
        lon = (mouseDownX - event.clientX) * 0.1 + mouseDownLon;
        lat = (event.clientY - mouseDownY) * 0.1 + mouseDownLat;
        computeCameraOrientation();
    }
}
function div3DMouseUp(event) {
    isUserInteracting = false;
}

/// ZOOM
function div3DMouseWheel(event) {
    camera.fov += event.deltaY * 0.05;
    camera.fov = Math.max(5, Math.min(100, camera.fov)); //limit zoom
    camera.updateProjectionMatrix();
}

/// ORIENTATION
function computeCameraOrientation() {
    lat = Math.max(- 30, Math.min(30, lat));  //restrict movement
    let phi = THREE.MathUtils.degToRad(90 - lat);  //restrict movement
    let theta = THREE.MathUtils.degToRad(lon);
    //move the target that the camera is looking at
    camera.target.x = 100 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 100 * Math.cos(phi);
    camera.target.z = 100 * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(camera.target);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    console.log('Resized');
}

