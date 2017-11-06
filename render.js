const rust = {};
const rust_parallel = {};
const js = require('mandelbrot');

function draw(backend, maxIterations, magnificationFactor, panX, panY) {
  var myCanvas = document.getElementById("screen");
  var ctx = myCanvas.getContext("2d");

  var image = backend.generate(myCanvas.width, myCanvas.height, maxIterations, magnificationFactor, panX, panY);
  for (var x=0; x < myCanvas.width; x++) {
    for (var y=0; y < myCanvas.height; y++) {
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
  document.getElementById("render").onclick = function fun() {
    var maxIterations = parseInt(document.getElementById("iterations").value);
    var backend_value = document.getElementById("backend").selectedOptions[0].value;
    var magnification = parseFloat(document.getElementById("magnification").value);
    var panX = parseFloat(document.getElementById("panX").value);
    var panY = parseFloat(document.getElementById("panY").value);
    var backend;
    var t1 = Date.now();
    switch (backend_value) {
      case 'javascript':
        backend = js;
        break;
      case 'rust':
        backend = rust;
        break;
      case 'rust parallel':
        backend = rust_parallel;
        break;
    }
    draw(backend, maxIterations, magnification, panX, panY);
    var t2 = Date.now();
    var render_time = t2 - t1;
    document.getElementById("render_time").innerText = `Time: ${render_time.toFixed(2)}ms`;
  }
})();

