
function setup() {
  colorMode(HSB, 255);
  createCanvas(windowWidth, windowHeight);
  background(0, 0, 0);
}

function draw() {
  background(128);
  //   random2D();
  poly = Array(
    createVector(40, 40),
    createVector(40, 200),
    createVector(600, 200),
    createVector(600, 40),
  );

  noFill();
  beginShape();
  poly.forEach((vector) => {
    vertex(vector.x, vector.y);
  });
  endShape(CLOSE);
}
