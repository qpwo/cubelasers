// March 2018
// Uses three.js to render a simple cube + sphere scene
// Authors: Robert Max Williams and Luke Harold Miles. Public Domain Dedication.

let frameCount = 0;
let camera, scene, renderer; // primary objects
let sphere, light, texture, cylinder; // secondary objects
let myName = "default";
let allUsers = {}, allCubes = {}, myData = {}, myCube;
let mouthOpen = false;

init(); // load all the objects into the scene
animate(); // move them around

function dist2d(p1,p2) {
  return Math.sqrt(Math.pow(p1.x-p2.x, 2)+Math.pow(p1.y-p2.y, 2));
}

function freshCube() {
  let cube = new THREE.Mesh(
    new THREE.BoxGeometry(5,5,5),
    new THREE.MeshLambertMaterial({color: 0xFF0000})
  );
  //cube.castShadow = true;
  return cube;
}

function init() {
  texture = new THREE.TextureLoader().load('texture.png'); // inner surface of sphere

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xdddddd, 1); // Grey background
  //renderer.shadowMap.enabled = true; // Allow shadows
  document.getElementById("webgl-container").appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(35, 1, 0.1, 10000);
  
  myCube = freshCube();
  scene.add(myCube);
  
  sphere = new THREE.Mesh(
    new THREE.SphereGeometry(100,32,32),
    new THREE.MeshLambertMaterial({side: THREE.DoubleSide, map:texture})
  );
  //sphere.receiveShadow = true;
  scene.add(sphere);

  cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(1,1,5,16),
    new THREE.MeshBasicMaterial({color: 0xffff00})
  );

  light = new THREE.PointLight(0xFFFF00); // yellow point light
  light.position.set(0, 0, 0);
  //light.castShadow = true;
  scene.add(light);
}

function animate() {
  if (frameCount % 10 == 0) {
    getAllUsers()
    for (let name in allUsers) {
      if (allUsers.hasOwnProperty(name)) {
        if (!allCubes.hasOwnProperty(name)) {
          let cube = freshCube();
          console.log("Adding cube for user " + name);
          allCubes[name] = cube;
          scene.add(cube);
        }
        let cube = allCubes[name]; // maybe todo: check existence guaranteed?
        let d = allUsers[name];
        [cube.position.x, cube.position.y, cube.position.z] = [d.x, d.y, d.z];
        [cube.rotation.x, cube.rotation.y, cube.rotation.z] = [d.rx, d.ry, d.rz];
      }
    }
  myData = {x: myCube.position.x, y: myCube.position.y, z: myCube.position.z,
            rx: myCube.rotation.x, ry: myCube.rotation.y, rz: myCube.rotation.z};
  sendMyData()
  }

  let leftTemple  = faces[0].points[0];
  let rightTemple = faces[0].points[14];
  let faceWidth = dist2d(leftTemple, rightTemple);
  let speed = Math.pow(faceWidth/150,2)/10;

  myCube.translateZ(-speed); // cube goes forward in direction facing
  if (myCube.position.length() > 100) // cube is outside sphere
    myCube.position.setLength(95); // bring it back in

  let P = faces[0].points;
  let [a,b,c,d] = [P[47], P[60], P[57], P[53]];
  if (dist2d(b,c)/dist2d(a,d) > 0.9) {
    if (!mouthOpen) {
      mouthOpen = true;
      scene.add(cylinder);
    }
  } else {
    mouthOpen = false;
    scene.remove(cylinder);
  }
  if (mouthOpen) {
    [cylinder.position.x, cylinder.position.y, cylinder.position.z] = [myCube.position.x, myCube.position.y, myCube.position.z];
    [cylinder.rotation.x, cylinder.rotation.y, cylinder.rotation.z] = [myCube.rotation.x, myCube.rotation.y, myCube.rotation.z];
    cylinder.translateZ(-20);
    [cylinder.rotation.x, cylinder.rotation.y, cylinder.rotation.z] = [cylinder.rotation.z, cylinder.rotation.x, cylinder.rotation.y] 
  }

  let rotationSpeed = .0003;
  let nose = faces[0].points[62]; // tip of the nose
  var [xdiff, ydiff] = [nose.x-x0, nose.y-y0]; // distance between current coords and initial coords

  if (Math.abs(ydiff) > 20)
    myCube.rotateOnWorldAxis(new THREE.Vector3(1,0,0), ysign * Math.sign(ydiff)*(Math.abs(ydiff)-20) * rotationSpeed);
    //myCube.rotation.x += ysign * Math.sign(ydiff)*(Math.abs(ydiff)-20) * rotationSpeed; // cube turns with face
  if (Math.abs(xdiff) > 20)
    myCube.rotateOnWorldAxis(new THREE.Vector3(0,1,0), xsign * Math.sign(xdiff)*(Math.abs(xdiff)-20) * rotationSpeed);
    //myCube.rotation.y += xsign * Math.sign(xdiff)*(Math.abs(xdiff)-20) * rotationSpeed; // cube turns with face
  [camera.position.x, camera.position.y, camera.position.z] =
    [myCube.position.x, myCube.position.y, myCube.position.z]; // the camera is inside the cube
  [camera.rotation.x, camera.rotation.y, camera.rotation.z] =
    [myCube.rotation.x, myCube.rotation.y, myCube.rotation.z]; // the camera looks in the same direction
  

  frameCount += 1;
  renderer.render(scene, camera); // update the scene
  requestAnimationFrame(animate); // rerun on next frame
}

function defaultData() {
  return {x:0, y:0, z:0, rx:0, ry:0, rz:0, mouthOpen:false}
}
// function to send my stuff to the server
function sendMyData() {
  var d = {};
  d[myName] = myData;
  $.ajax({
    type:"POST",
    url:"/datasend",
    data: JSON.stringify(d)
  });
}

// function to get everyone else's data
function getAllUsers() {
  $.ajax({
    type:"GET",
    url:"/datareceive",
    success: function(data) {
      allUsers = JSON.parse(data)
    }
  });
  return allUsers
}

// non blocking prompt
setTimeout(function() { 
  myName = window.prompt('enter your nickname', 'default'); 
  myData = defaultData()
}, 1);
