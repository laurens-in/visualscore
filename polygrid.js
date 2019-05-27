let polys = [];
let colors = [];
const vertexCount = 42;
const selectedCells = [7, 14, 21, 28, 35];

function setupVoronoi() {
	voronoiCellStrokeWeight(1);
	voronoiCellStroke(1);
  voronoiSiteFlag(false);
  for (let i = 0; i < 42; i++) {
		voronoiSite(random(0,windowWidth), random(0,windowHeight), 64+(i*3));
	}
  voronoi(windowWidth, windowHeight, false);
  voronoiDraw(0, 0, true, false);
  return voronoiGetCells();
}

function setup() {
  // frameRate(10);
  colorMode(HSB, 255);
  createCanvas(windowWidth, windowHeight);
  background(0, 0, 0);
  polys = setupVoronoi();

  for (let i = 0; i < selectedCells.length; i++) {
    colors.push([random(0,255), 128, 196]);
  }
}

function mousePressed(){
  const cellId = voronoiGetSite(mouseX, mouseY, false);
  fill(random(0,255), 128, 196);
  beginShape();
  polys[cellId].forEach((vector) => {
    vertex(vector[0], vector[1]);
  });
  endShape(CLOSE);
}

function paintCell(index) {
  fill(color(colors[index]));
  colors[index][0]+=random(-5,5);
  beginShape();
  polys[selectedCells[index]].forEach((vector) => {
    vertex(vector[0], vector[1]);
  });
  endShape(CLOSE);
}

function draw() {
  for (let i = 0; i < selectedCells.length; i++) {
    paintCell(i);
  }
}
