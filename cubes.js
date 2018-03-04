// March 2018
// Uses three.js to render a simple cube + sphere scene
// Authors: Robert Max Williams and Luke Harold Miles. Public Domain Dedication.

(function() {
var camera, scene, renderer; // primary objects
var cube, sphere, light, texture; // secondary objects

init(); // load all the objects into the scene
animate(); // move them around

function init() {
  texture = new THREE.TextureLoader().load('texture.png'); // inner surface of sphere

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xdddddd, 1); // Grey background
  renderer.shadowMap.enabled = true; // Allow shadows
  document.getElementById("webgl-container").appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(35, 1, 0.1, 10000);

  cube = new THREE.Mesh(
    new THREE.BoxGeometry(5,5,5),
    new THREE.MeshLambertMaterial({color: 0xFF0000})
  );
  cube.castShadow = true;
  scene.add(cube);

  sphere = new THREE.Mesh(
    new THREE.SphereGeometry(100,32,32),
    new THREE.MeshLambertMaterial({side: THREE.DoubleSide, map:texture})
  );
  sphere.receiveShadow = true;
  scene.add(sphere);

  light = new THREE.PointLight(0xFFFF00); // yellow point light
  light.position.set(0, 0, 0);
  light.castShadow = true;
  scene.add(light);
}

function animate() {
  var leftTemple  = faces[0].points[0];
  var rightTemple = faces[0].points[14];
  var faceWidth = Math.sqrt(Math.pow(leftTemple.x-rightTemple.x,2) + Math.pow(leftTemple.y-rightTemple.y,2));
  var speed = Math.pow(faceWidth/150,2)/10;

  cube.translateZ(-speed); // cube goes forward in direction facing
  if (cube.position.length() > 100) // cube is outside sphere
    cube.position.setLength(95); // bring it back in

  var rotationSpeed = .001;
  var nose = faces[0].points[62]; // tip of the nose
  var [xdiff, ydiff] = [nose.x-x0, nose.y-y0]; // distance between current coords and initial coords

  if (Math.abs(ydiff) > 20)
    cube.rotation.x += ysign * Math.sign(ydiff)*(Math.abs(ydiff)-20) * rotationSpeed; // cube turns with face
  if (Math.abs(xdiff) > 20)
    cube.rotation.y += xsign * Math.sign(xdiff)*(Math.abs(xdiff)-20) * rotationSpeed; // cube turns with face
  [camera.position.x, camera.position.y, camera.position.z] =
    [cube.position.x, cube.position.y, cube.position.z]; // the camera is inside the cube
  [camera.rotation.x, camera.rotation.y, camera.rotation.z] =
    [cube.rotation.x, cube.rotation.y, cube.rotation.z]; // the camera looks in the same direction

  renderer.render(scene, camera); // update the scene
  requestAnimationFrame(animate); // rerun on next frame
}
})();


var username = "default"
// get username and functions for ajax in/out with server

// non blocking prompt
setTimeout(function() { var sign = window.prompt('enter your nickname', 'default'); }, 1);

// function to send my stuff to the server

