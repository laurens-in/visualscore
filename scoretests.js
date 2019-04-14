let x_dist = 0;
let y_dist = 0;
let c_offset = 193;
let x_div = 17;
let y_div = 5;
let renderClick = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  x_baseWidth = windowWidth / x_div;
  y_baseHeight = windowHeight / y_div;
  colorMode(RGB, 255);
  background(50);
  colorMode(HSB, 255);
}

function draw() {
  if (mouseIsPressed) {
    if (renderClick) {
      separator(y_dist);
      while (y_dist < windowHeight) {
        brick();
        separator(y_dist);
      }
      separator(windowHeight-1);
      y_dist = 0;
      c_offset += 1;
      if (c_offset > 255) {
        c_offset = 0;
      }
      renderClick = false;
    }
  } else {
    renderClick = true;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(50);
  x_baseWidth = windowWidth / x_div;
  y_baseHeight = windowHeight / y_div;
}

separator = (y) => {
  stroke(127);
  line(0, y, windowWidth, y);
}

brick = () => {  
  let r = random();
  let x = 25 + (x_baseWidth * r);
  let c = wrap(c_offset + (1-r) * 64, 0, 255);

  if (x < 42) {
    fill(c, 242, random(20, 250), 128);
    stroke(c, 242, random(0, 255));
  } else {
    fill(0, 0, random(20, 230), 200);
    noStroke();
  }
  rect(x_dist, y_dist, x, y_baseHeight);
  
  x_dist += x;
  if (x_dist >= windowWidth) {
    x_dist = 0;
    y_dist += y_baseHeight;
  }
}

wrap = (inValue, inMin, inMax) => {
  valueRange = inMax - inMin;
  return (inMin + ((((inValue - inMin) % valueRange) + valueRange) % valueRange));
}
