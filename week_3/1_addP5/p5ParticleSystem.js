import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.1/three.module.min.js';

let camera, scene, renderer;
let thingsThatNeedUpdating = [];
initHTML();
init3D();


function init3D() {
    /// SCENE
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

    /// RENDERER
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    //put three.js in div
    document.getElementById('THREEcontainer').appendChild(renderer.domElement); //created in initHTML

    /// BG
    let bgGeometery = new THREE.SphereGeometry(1000, 60, 40);
    bgGeometery.scale(-1, 1, 1);
    //pic
    let panotexture = new THREE.TextureLoader().load("itp.jpg");
    let backMaterial = new THREE.MeshBasicMaterial({ map: panotexture });
    let back = new THREE.Mesh(bgGeometery, backMaterial);
    scene.add(back);

    moveCameraWithMouse();

    camera.position.z = 0;
    animate();

}

function animate() {
    for (let i = 0; i < thingsThatNeedUpdating.length; i++) {
        thingsThatNeedUpdating[i].texture.needsUpdate = true;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function initHTML() {
    /// CONTAINER
    const THREEcontainer = document.createElement("div");
    THREEcontainer.setAttribute("id", "THREEcontainer");
    document.body.appendChild(THREEcontainer);
    //style
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
    //style
    textInput.style.position = "absolute";
    textInput.style.top = "50%";
    textInput.style.left = "50%";
    textInput.style.transform = "translate(-50%, -50%)";
    textInput.style.zIndex = "5";

    /// ENTER
    textInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            const inputRect = textInput.getBoundingClientRect(); //get input box
            let mouse = { x: inputRect.left, y: inputRect.top }; //get top left corner
            const pos = find3DCoornatesInFrontOfCamera(150 - camera.fov, mouse); //get coordinates according to what is on cam
            createNewText(textInput.value, pos); //create new text w position
        }
    });

    window.addEventListener("dragover", function (e) {
        e.preventDefault();  //prevents browser from opening the file
    }, false);

    window.addEventListener("drop", (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        for (let i = 0; i < files.length; i++) {
            if (!files[i].type.match("image")) continue;
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

/// PARTICLES
function createP5Sketch(w, h) {
    let sketch = function (p) {
        let particles = [];
        let myCanvas;
        p.getCanvas = function () {
            return myCanvas;
        }
        p.setup = function () {
            myCanvas = p.createCanvas(w, h);

        };
        p.draw = function () {
            //update list
            p.clear();
            for (let i = 0; i < 5; i++) {
                let p = new Particle();
                particles.push(p);
            }
            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                particles[i].show();
                if (particles[i].finished()) {
                    particles.splice(i, 1); //delete last particle
                }
            }
        };

        class Particle {
            constructor() {
                //position
                this.x = p.width / 2;
                this.y = p.height / 2;
                this.vx = p.random(-1, 1);
                this.vy = p.random(-4, 1);
                this.alpha = 255;
            }
            finished() {
                return this.alpha < 0;
            }
            update() {
                //order
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= 10;
            }
            show() {
                //style
                p.noStroke();
                p.fill(255, 0, 255, this.alpha);
                p.ellipse(this.x, this.y, 5);
            }
        }
    };
    return new p5(sketch);
}

function addP5To3D(_x, _y) {  //called from double click
    let newP5 = createP5Sketch(200, 200);
    let p5Canvas = newP5.getCanvas(); //pull the p5 canvas out of sketch 
    let canvas = p5Canvas.elt; //and then regular (elt) js canvas out of special p5 canvas
    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    let material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    let geo = new THREE.PlaneGeometry(canvas.width / canvas.width, canvas.height / canvas.width);
    let mesh = new THREE.Mesh(geo, material);

    mesh.scale.set(10, 10, 10);

    let mouse = { x: _x, y: _y };
    console.log("camera fov", camera.fov);
    const posInWorld = find3DCoornatesInFrontOfCamera(300 - camera.fov * 3, mouse);
    mesh.position.x = posInWorld.x;
    mesh.position.y = posInWorld.y;
    mesh.position.z = posInWorld.z;

    mesh.lookAt(0, 0, 0);
    scene.add(mesh);
    let thisObject = { canvas: canvas, mesh: mesh, texture: texture, p5Canvas: p5Canvas };
    thingsThatNeedUpdating.push(thisObject);
}





///// MOUSE STUFF
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

/// PARTICLE DOUBLE CLICK
function div3DDoubleClick(event) {
    console.log('double click');
    addP5To3D(event.clientX, event.clientY);
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

