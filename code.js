var KC = {'LA':37,'UA':38,'RA':39,'DA':40,'0':48,'1':49,'2':50,'3':51,'4':52,'5':53,'6':54,'7':55,'8':56,'9':57,'A':65,'B':66,'C':67,'D':68,'E':69,'F':70,'G':71,'H':72,'I':73,'J':74,'K':75,'L':76,'M':77,'N':78,'O':79,'P':80,'Q':81,'R':82,'S':83,'T':84,'U':85,'V':86,'W':87,'X':88,'Y':89,'Z':90}; // keycodes
var camera, scene, renderer;
var cube, sphere, light, texture, speed=-.1;

var [xrotconst, yrotconst] = [.001, .001];
init();
animate();

function init() {
  texture = new THREE.TextureLoader().load('texture.png');

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor( 0xdddddd, 1);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

    
  scene = new THREE.Scene();
    
  camera = new THREE.PerspectiveCamera(
    35,        // Field of view
    1,    // Aspect ratio
    0.1,      // Near plane
    10000      // Far plane
  );
  
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
    
  light = new THREE.PointLight( 0xFFFF00 );
  light.position.set( 10, 0, 10 );
  light.castShadow = true;
  scene.add(light);
    
  renderer.setClearColor(0xdddddd, 1);
  renderer.render( scene, camera );
}

function animate() {
  var point = faces[0].points[62];
  var [xdiff, ydiff] = [point.x-x0, point.y-y0];
  requestAnimationFrame(animate);
  cube.translateZ(speed);
  cube.rotation.x += ydiff * yrotconst;
  cube.rotation.y += xdiff * yrotconst;
  [camera.position.x, camera.position.y, camera.position.z] = [cube.position.x, cube.position.y+5, cube.position.z+20];
  camera.lookAt(cube.position);
  //[camera.rotation.x, camera.rotation.y, camera.rotation.z] = [cube.rotation.x, cube.rotation.y, cube.rotation.z];
  //camera.translateZ(30);
  //amera.translateZ(1);
  renderer.render(scene, camera);
}

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var rotSpeed = 0.1
    var keyCode = event.which;
    if (keyCode == KC.W) {
      cube.rotation.x += rotSpeed;
    } else if (keyCode == KC.S) {
      cube.rotation.x -= rotSpeed;
    } else if (keyCode == KC.A) {
      cube.rotation.y += rotSpeed;
    } else if (keyCode == KC.D) {
      cube.rotation.y -= rotSpeed;
    } else if (keyCode == KC.UA) {
      speed *= 1.1;
    } else if (keyCode == KC.DA) {
      speed *= 0.9
    } else if (keyCode == KC.I) {
    } else if (keyCode == KC.K) {
    } else if (keyCode == KC.J) {
    } else if (keyCode == KC.L) {
    } else if (keyCode == 32) {
        //camera.position.set(0, 0, 0);
    }
};
