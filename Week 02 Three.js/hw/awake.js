import * as THREE from "https://cdn.skypack.dev/three@0.136.0";;

let camera, scene, renderer;
let sphere, light, texture, material;
let dir = 1;
var button = document.getElementById('button');
var pics = [
    'cookie.png',
    'eye.png',
    'fur.jpeg',
    'lego.jpeg',
    'man.png',
    'mom.png',
    'soccer.jpeg',
    'strawberry.jpeg',
]
const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
}
var sound = new Audio('crying.wav');

init3D(); //have to call the setup yourself

function init3D() {
    // SCENE
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#FFE6F3"); //bg color
    scene.fog = new THREE.Fog("#FFE6F3", 0.015, 80); //fog color
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    //default renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('id', 'renderer');

    // SHAPE
    const geometry = new THREE.SphereGeometry();
    //material 
    texture = new THREE.TextureLoader().load('/img/cookie.png');
    material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
    });
    material.needsUpdate = true;
    sphere = new THREE.Mesh(geometry, material);
    //position
    sphere.position.set(0, 0, -30);
    sphere.scale.set(10, 10, 10);
    scene.add(sphere);
    
    // LIGHT
    light = new THREE.PointLight(0xFF00);
    /* position the light so it shines on the sphere (x, y, z) */
    light.position.set(0, 0, 0);
    scene.add(light);
    camera.position.z = 5;
    animate();  // have to kickstart the draw-like function
}


function animate() {  //like draw
    // MOVE
    sphere.position.setZ(sphere.position.z + dir);
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    // CHANGE IMG
    //when sphere hits back
    if(sphere.position.z == -180){
        //load new texture
        texture = new THREE.TextureLoader().load('/img/' + pics[Math.floor(Math.random() * pics.length)]);
        //reset material
        sphere.material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });
    }
    
    //DIRECTION
    if (sphere.position.z < -180 || sphere.position.z > -15) {
        dir = -dir;
    
        //BUTTON
        //going back (fade out)
        if(dir == -1){
            const back = async () => {
                await sleep(300);
                for (let i = 9; i >= 0 ; i--) { //decrease opacity
                    await sleep(80);
                    button.style.opacity = "0." + i;
                }
                await sleep (1000);
            }
            back();
        }
        //going forward (fade in)
        if(dir == 1){
            const forward = async () => {
                await sleep(1000);
                for (let i = 0; i < 10; i++) { //increase opacity
                    await sleep(100);
                    button.style.opacity = "0." + i;
                    //when button close enough
                    if(i >= 8){
                        //change color & play sound on click
                        button.addEventListener('click', function(){
                            button.style.backgroundColor = 'green';
                            sound.play();
                        });
                    }
                    else {
                        //change color back
                        button.style.backgroundColor = 'rgb(196, 46, 46)';
                    }
                }
                await sleep (1000);
            }
            forward();
        }
    }
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);  //call it self, almost recursive
};


