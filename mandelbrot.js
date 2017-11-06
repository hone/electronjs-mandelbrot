module.exports = {
  belongs: function(c_re, c_im, maxIterations) {
    var iteration = 0;
    var x = 0.0;
    var y = 0.0;

    for (iteration = 0; iteration < maxIterations; iteration++) {
      // Calculate the real and imaginary components of the result
      // separately
      var x_new = (x * x - y * y) + c_re;
      y = 2 * x * y + c_im;
      x = x_new;
      if(x * x + y * y > 2 * 2) {
        return iteration/maxIterations * 100; // In the Mandelbrot set
      }
    }

    return 0.0; // Not in the set
  },
  generate: function(width, height, maxIterations, magnification, panX, panY) {
    var t1 = Date.now();
    var image = new Uint8Array(width * height);

    for(var x=0; x < width; x++) {
      for(var y=0; y < height; y++) {
        var index = x * width + y;
        var belongsToSet =
          this.belongs(x/magnification - panX,
              y/magnification - panY, maxIterations);
        image[index] = belongsToSet;
      }
    }
    var t2 = Date.now();
    var render_time = (t2 - t1)/1000.0;
    process.stderr.write(`JavaScript timing: ${render_time}\n`);

    return image;
  }
}
