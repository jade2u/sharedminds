var 	onMouseDownMouseX = 0, onMouseDownMouseY = 0;
var onPointerDownPointerX =0 ,onPointerDownPointerY =0;
var lon = 0, onMouseDownLon = 0,lat = 0, onMouseDownLat = 0, phi = 0, theta = 0;
var   isUserInteracting = false;
var myCamera;

function activatePanoControl(cam){
  console.log( "activated pano controls");
  myCamera = cam;  //passing the camera to a variable here makes it easier to reuse this file

  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'mouseup', onDocumentMouseUp, false );
  //myCamera.target = new THREE.Vector3( 0, 0, 0 );

  
  // Listen for window resize
  window.addEventListener( 'resize', onWindowResize, false );
}
function onDocumentMouseDown( event ) {
  onPointerDownPointerX = event.clientX;
  onPointerDownPointerY = event.clientY;
  onPointerDownLon = lon;
  onPointerDownLat = lat;
  isUserInteracting  = true;
}
function onDocumentMouseUp( event ) {
  isUserInteracting = false;
}

function computeCameraOrientation() {
  lat = Math.max( - 85, Math.min( 85, lat ) );
  phi = THREE.Math.degToRad( 90 - lat );
  theta = THREE.Math.degToRad( lon );
  myCamera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
  myCamera.target.y = 500 * Math.cos( phi );
  myCamera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );
  myCamera.lookAt( myCamera.target );
}


function onWindowResize() {
  myCamera.aspect = window.innerWidth / window.innerHeight;
  myCamera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
