let poly = Array();

function setup() {
  colorMode(HSB, 255);
  createCanvas(windowWidth, windowHeight);
  background(0, 0, 0);
  poly.push(
    createVector(40, 40),
    createVector(40, 200),
    createVector(600, 200),
    createVector(600, 40)
  );
}

function draw() {
  background(128);
  //   random2D();

  noFill();
  beginShape();
  poly.forEach((vector) => {
    vertex(vector.x, vector.y);
  });
  endShape(CLOSE);
}
