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

function draw(maxIterations) {
  // Create Canvas
  var myCanvas = document.getElementById("screen");
  var ctx = myCanvas.getContext("2d");

  // Start drawing
  var magnificationFactor = 200;
  var panX = 2;
  var panY = 1.5;
  for(var x=0; x < myCanvas.width; x++) {
    for(var y=0; y < myCanvas.height; y++) {
      var belongsToSet = 
        checkIfBelongsToMandelbrotSet(x/magnificationFactor - panX, 
            y/magnificationFactor - panY, maxIterations);
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
      draw(maxIterations);
    }
  }
})();

