const rust = require('neon-mandelbrot')

function checkIfBelongsToMandelbrotSet(x, y, maxIterations) {
  var realComponentOfResult = x;
  var imaginaryComponentOfResult = y;

  for(var i = 0; i < maxIterations; i++) {
    // Calculate the real and imaginary components of the result
    // separately
    var tempRealComponent = realComponentOfResult * realComponentOfResult
      - imaginaryComponentOfResult * imaginaryComponentOfResult
      + x;

    var tempImaginaryComponent = 2 * realComponentOfResult * imaginaryComponentOfResult
      + y;

    realComponentOfResult = tempRealComponent;
    imaginaryComponentOfResult = tempImaginaryComponent;

    if (realComponentOfResult * imaginaryComponentOfResult > 5)
      return (i/maxIterations * 100); // In the Mandelbrot set
  }

  return 0; // Not in the set
}

function generate_mandelbrot(width, height, maxIterations, magnification, panX, panY) {
  var image = new Float64Array(width * height);

  for(var x=0; x < width; x++) {
    for(var y=0; y < height; y++) {
      var index = x * width + y;
      var belongsToSet =
        checkIfBelongsToMandelbrotSet(x/magnification - panX,
            y/magnification - panY, maxIterations);
      image[index] = belongsToSet;
    }
  }

  return image;
}

function drawRust(maxIterations) {
  // Create Canvas
  var myCanvas = document.getElementById("screen");
  var ctx = myCanvas.getContext("2d");

  var image = new Uint8Array(rust.rust_mandelbrot());
  for(var x=0; x < myCanvas.width; x++) {
    for(var y=0; y < myCanvas.height; y++) {
      var index = x * myCanvas.width + y;
      var belongsToSet = image[index];
      if(belongsToSet == 0) {
        ctx.fillStyle = '#000';
        ctx.fillRect(x,y, 1,1); // Draw a black pixel
      } else {
        ctx.fillStyle = '#FFF';
        //ctx.fillStyle = 'hsl(0, 100%, ' + belongsToSet + '%)';
        ctx.fillRect(x,y, 1,1); // Draw a colorful pixel
      }
    }
  }
}

function draw(maxIterations) {
  // Create Canvas
  var myCanvas = document.getElementById("screen");
  var ctx = myCanvas.getContext("2d");

  // Start drawing
  var magnificationFactor = 200;
  var panX = 2;
  var panY = 1.5;

  var image = generate_mandelbrot(myCanvas.width, myCanvas.height, maxIterations, magnificationFactor, panX, panY);
  for(var x=0; x < myCanvas.width; x++) {
    for(var y=0; y < myCanvas.height; y++) {
      var index = x * myCanvas.width + y;
      var belongsToSet = image[index];
      if(belongsToSet == 0) {
        ctx.fillStyle = '#000';
        ctx.fillRect(x,y, 1,1); // Draw a black pixel
      } else {
        ctx.fillStyle = 'hsl(0, 100%, ' + belongsToSet + '%)';
        ctx.fillRect(x,y, 1,1); // Draw a colorful pixel
      }
    } 
  }
}

(function() {
  window.onload = function() {
    document.getElementById("render").onclick = function fun() {
      var maxIterations = parseInt(document.getElementById("iterations").value);
      var backend = document.getElementById("backend").selectedOptions[0].value;
      var t1 = Date.now();
      if (backend == "javascript") {
        draw(maxIterations);
      } else {
        drawRust(maxIterations);
      }
      var t2 = Date.now();
      var render_time = t2 - t1;
      document.getElementById("render_time").innerText = `Time: ${render_time.toFixed(2)}ms`;
    }
  }
})();

