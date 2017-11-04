const rust = require('neon-mandelbrot')

function checkIfBelongsToMandelbrotSet(c_re, c_im, maxIterations) {
  var iteration = 0;
  var x = 0.0;
  var y = 0.0;

  while(iteration < maxIterations && x * x + y * y <= 2 * 2) {
    // Calculate the real and imaginary components of the result
    // separately
    var x_new = (x * x - y * y) + c_re;
    y = 2 * x * y + c_im;
    x = x_new;
    iteration++;
  }

  if(iteration < maxIterations) {
    return iteration/maxIterations * 100; // In the Mandelbrot set
  } else {
    return 0; // Not in the set
  }
}

function generate_mandelbrot(width, height, maxIterations, magnification, panX, panY) {
  var image = new Uint8Array(width * height);

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

  var image = new rust();
  for(var x=0; x < myCanvas.width; x++) {
    for(var y=0; y < myCanvas.height; y++) {
      var index = x * myCanvas.width + y;
      var belongsToSet = image[index];
      if(belongsToSet == 0) {
        ctx.fillStyle = '#000';
        ctx.fillRect(x,y, 1,1); // Draw a black pixel
      } else {
        //ctx.fillStyle = '#FFF';
        ctx.fillStyle = 'hsl(0, 100%, ' + belongsToSet + '%)';
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

