// March 2018
// Adapted from Rainer Lienhart's `brfv4_javascript_examples` https://github.com/Tastenkunst/brfv4_javascript_examples
// Displays facial map overlayed with webcam stream in browser window
var brfv4BaseURL = "js/libs/brf_asmjs/";
var faces;

function initExample() {
  var webcam      = document.getElementById("_webcam");    // our webcam video
  var imageData    = document.getElementById("_imageData");  // image data for BRFv4
  var imageDataCtx  = null;

  var brfv4      = null;
  var brfManager    = null;
  var resolution    = null;
  var ua        = window.navigator.userAgent;
  var isIOS11      = (ua.indexOf("iPad") > 0 || ua.indexOf("iPhone") > 0) && ua.indexOf("OS 11_") > 0;

  startCamera();

  function startCamera() {
    console.log("startCamera");
    // Start video playback once the camera was fetched.
    function onStreamFetched (mediaStream) {
      console.log("onStreamFetched");
      webcam.srcObject = mediaStream;
      webcam.play();
      function onStreamDimensionsAvailable () {
        console.log("onStreamDimensionsAvailable");
        if (webcam.videoWidth === 0) {
          setTimeout(onStreamDimensionsAvailable, 100);
        } else {
          // Resize the canvas to match the webcam video size.
          imageData.width    = webcam.videoWidth;
          imageData.height  = webcam.videoHeight;
          imageDataCtx    = imageData.getContext("2d");
          if(isIOS11) {
            webcam.pause();
            webcam.srcObject.getTracks().forEach(function(track) {
              track.stop();
            });
          }
          waitForSDK();
        }
      }
      if(imageDataCtx === null) {
        onStreamDimensionsAvailable();
      } else {
        trackFaces();
      }
    }
    window.navigator.mediaDevices.getUserMedia({video: {width: 640, height: 480, frameRate: 30}})
      .then(onStreamFetched).catch(function () { alert("No camera available."); });
  }

  function waitForSDK() {
    if(brfv4 === null) {
      brfv4 = { locateFile: function(fileName) {return brfv4BaseURL+fileName;} };
      initializeBRF(brfv4);
    }
    if(brfv4.sdkReady) {
      initSDK();
    } else {
      setTimeout(waitForSDK, 100);
    }
  }

  function initSDK() {
    resolution  = new brfv4.Rectangle(0, 0, imageData.width, imageData.height);
    brfManager  = new brfv4.BRFManager();
    brfManager.init(resolution, resolution, "com.tastenkunst.brfv4.js.examples.minimal.webcam");
    if(isIOS11) {
      setTimeout(function () {
        console.log('delayed camera restart for iOS 11');
        startCamera()
      }, 2000)
    } else {
      trackFaces();
    }
  }

  function trackFaces() {
    imageDataCtx.setTransform(-1.0, 0, 0, 1, resolution.width, 0); // mirrored for draw of video
    imageDataCtx.drawImage(webcam, 0, 0, resolution.width, resolution.height);
    imageDataCtx.setTransform( 1.0, 0, 0, 1, 0, 0); // unmirrored for draw of results
    brfManager.update(imageDataCtx.getImageData(0, 0, resolution.width, resolution.height).data);
    faces = brfManager.getFaces();
    for(var i = 0; i < faces.length; i++) {
      var face = faces[i];
      if(    face.state === brfv4.BRFState.FACE_TRACKING_START ||
          face.state === brfv4.BRFState.FACE_TRACKING) {
        imageDataCtx.strokeStyle="#00a0ff";
        for(var k = 0; k < face.vertices.length; k += 2) {
          imageDataCtx.beginPath();
          imageDataCtx.arc(face.vertices[k], face.vertices[k + 1], 2, 0, 2 * Math.PI);
          imageDataCtx.stroke();
        }
      }
    }
    requestAnimationFrame(trackFaces);
  }
}

  window.onload = initExample;

