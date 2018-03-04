var KC = {'LA':37,'UA':38,'RA':39,'DA':40,'0':48,'1':49,'2':50,'3':51,'4':52,'5':53,'6':54,'7':55,'8':56,'9':57,'A':65,'B':66,'C':67,'D':68,'E':69,'F':70,'G':71,'H':72,'I':73,'J':74,'K':75,'L':76,'M':77,'N':78,'O':79,'P':80,'Q':81,'R':82,'S':83,'T':84,'U':85,'V':86,'W':87,'X':88,'Y':89,'Z':90}; // keycodes
var camera, scene, renderer;
var cube, sphere, light;

init();
animate();

function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor( 0xdddddd, 1);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
    
  scene = new THREE.Scene();
    
  camera = new THREE.PerspectiveCamera(
    35,        // Field of view
    800 / 600,    // Aspect ratio
    0.1,      // Near plane
    10000      // Far plane
  );
  camera.position.set( -15, 10, 10 );
  camera.lookAt( scene.position );
  
  cube = new THREE.Mesh(
    new THREE.BoxGeometry(5,5,5),
    new THREE.MeshLambertMaterial({color: 0xFF0000})
  );
  cube.castShadow = true;
  scene.add(cube);

  sphere = new THREE.Mesh(
    new THREE.SphereGeometry(100,32,32),
    new THREE.MeshLambertMaterial({color: 0x00FF00, side: THREE.DoubleSide})
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
  requestAnimationFrame(animate);
  cube.translateZ(-.1);
  [camera.position.x, camera.position.y, camera.position.z] = [cube.position.x, cube.position.y+5, cube.position.z+20];
  camera.lookAt(cube.position);
  //[camera.rotation.x, camera.rotation.y, camera.rotation.z] = [cube.rotation.x, cube.rotation.y, cube.rotation.z];
  //camera.translateZ(30);
  //amera.translateZ(1);
  renderer.render(scene, camera);
}

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    var speed = 0.1;
    if (keyCode == KC.W) {
        cube.rotation.x += speed;
    } else if (keyCode == KC.S) {
        cube.rotation.x -= speed;
    } else if (keyCode == KC.A) {
        cube.rotation.y += speed;
    } else if (keyCode == KC.D) {
        cube.rotation.y -= speed;
    } else if (keyCode == KC.I) {
    } else if (keyCode == KC.K) {
    } else if (keyCode == KC.J) {
    } else if (keyCode == KC.L) {
    } else if (keyCode == 32) {
        //camera.position.set(0, 0, 0);
    }
};
