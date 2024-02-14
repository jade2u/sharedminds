import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.1/three.module.min.js';

let camera, scene, renderer;
let thingsThatNeedUpdating = [];

const hello = document.getElementById('hello');

let mouseDownX = 0, mouseDownY = 0;
let lon = -90, mouseDownLon = 0;
let lat = 0, mouseDownLat = 0;
let isUserInteracting = false;

//static mesh
const static_geometry = new THREE.PlaneGeometry(1, 1);
const static_material = new THREE.MeshBasicMaterial({opacity: 0, transparent: true});
const mesh_static = new THREE.Mesh(static_geometry, static_material);
mesh_static.position.set(-5,0,-5);


initHTML();
init3D();

/* ----------- SETUP -----------*/
/// 3D SCENE
function init3D() {
    //scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    //renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('THREEcontainer').appendChild(renderer.domElement);
    //bg
    let bgGeometery = new THREE.SphereGeometry(1000, 60, 40);
    bgGeometery.scale(-1, 1, 1);
    //pic
    let panotexture = new THREE.TextureLoader().load("map.png");
    let backMaterial = new THREE.MeshBasicMaterial({ map: panotexture });
    let back = new THREE.Mesh(bgGeometery, backMaterial);
    scene.add(back);
    
    //move
    moveCameraWithMouse();
    camera.position.z = 0;
    animate();

    scene.add(mesh_static);

}
function animate() {
    for (let i = 0; i < thingsThatNeedUpdating.length; i++) {
        thingsThatNeedUpdating[i].texture.needsUpdate = true;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
/// HTML
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

    // change text
    hello.innerHTML = 'hello';
    hello.style.zIndex = "5";
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


/* ----------- P5 -----------*/
/// DRAW CIRCLE
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
            p.fill(255, 0, 0, 10);
            p.ellipse(this.x, this.y, 5);
  
        };
    };
    return new p5(sketch);
}

/// ADD SKETCH TO 3D
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

    matchLanguage(mesh.getWorldPosition(mesh_static.position));
}

/// LANGUAGES
function matchLanguage(pos){
    console.log(pos);
    
    /// S AM
    //spanish
    if((pos.x<3.4 && pos.x>-5.6) && (pos.y<4.8 && pos.y>-5.52)){
        //portugese
        if(pos.x<-1.78 && (pos.y<0.57 && pos.y>-3.54)){hello.innerHTML = "olá";}
        else {hello.innerHTML = "hola"};

        //jamaica
        if((pos.x<-1.3 && pos.x>-1.5) && (pos.y<2.1 && pos.y>1.9)){hello.innerHTML = "waa gwaan";}
    }

    
    
    /// N AM
    //english
    if((pos.x<3 && pos.x>-3) && (pos.y<8.1 && pos.y>2.7)){hello.innerHTML = "hello";}
    //hawaiian
    if((pos.x<5.6 && pos.x>5.3) && (pos.y<2.4 && pos.y>2.1)){hello.innerHTML = "aloha";}
    
    
    
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
/// PARTICLE DOUBLE CLICK
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
    //text
    hello.style.top = event.clientY + "px";
    hello.style.left = (event.clientX + 20) + "px";

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
    lat = Math.max(- 30, Math.min(30, lat));  //restrict movement
    let phi = THREE.MathUtils.degToRad(90 - lat);  //restrict movement
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

