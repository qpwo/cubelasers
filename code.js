var KC = {'LA':37,'UA':38,'RA':39,'DA':40,'0':48,'1':49,'2':50,'3':51,'4':52,'5':53,'6':54,'7':55,'8':56,'9':57,'A':65,'B':66,'C':67,'D':68,'E':69,'F':70,'G':71,'H':72,'I':73,'J':74,'K':75,'L':76,'M':77,'N':78,'O':79,'P':80,'Q':81,'R':82,'S':83,'T':84,'U':85,'V':86,'W':87,'X':88,'Y':89,'Z':90}; // keycodes
var camera, scene, renderer;
var geometry, material, mesh;

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
  camera.position.z = 1;

  scene = new THREE.Scene();

  geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
  material = new THREE.MeshNormalMaterial();

  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

}

function animate() {

  requestAnimationFrame( animate );

  //mesh.rotation.x += 0.01;
  //mesh.rotation.y += 0.02;

  renderer.render( scene, camera );

}

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == KC.W) {
        mesh.position.y += .01;
    } else if (keyCode == KC.S) {
        mesh.position.y -= .01;
    } else if (keyCode == KC.A) {
        mesh.position.x -= .01;
    } else if (keyCode == KC.D) {
        mesh.position.x += .01;
    } else if (keyCode == KC.I) {
        mesh.rotation.x += .1;
    } else if (keyCode == KC.K) {
        mesh.rotation.x -= .1;
    } else if (keyCode == KC.J) {
        mesh.rotation.y += .1;
    } else if (keyCode == KC.L) {
        mesh.rotation.y -= .1;
    } else if (keyCode == 32) {
        mesh.position.set(0, 0, 0);
    }
};
