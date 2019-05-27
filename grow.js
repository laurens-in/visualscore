let socket;
let friend;
let friends;
let renderClick = true;

// send current drawing state
function sendIt() {
  if (friend.name != "FriendName") {
    socket.emit("friend-data", friend);
  }
}

function sendFriend() {
  socket.emit("friend-data", friend);
}

function friendFilter(masterList) {
  Object.keys(friends).forEach(function (name) {
    if (masterList.indexOf(name) === -1) {
      delete friends[name];
    }
  });
}

function updateFriend(name, msg) {
  friends[name] = msg;
};

// render friends onto canvas
function friender() {


}


function setup() {
  colorMode(HSB, 255);

  // prototype object for representing current state
  friend = {
    x: 0, y: 0, name: "FriendName", active: false
  };

  // the array of connected clients
  friends = {};

  socket = io('https://scroppy-club-dxdjyofhzo.now.sh');

  // handler for receiving "friend-data" messages from socket
  socket.on("friend-data", function (msg) {
    updateFriend(msg.name, msg);
  });

  // handler for the initial socket connection
  socket.on("connect", function () {
    console.log("connection: " + socket.connected);
  });

  // handler for receiving "name-assignment" messages from socket
  socket.on("name-assignment", function (msg) {
    friend.name = msg;
    console.log("We shall call you " + msg);
  });

  // handler for receiving "online-users messages from socket"
  socket.on("online-users", function (count) {
    // console.log(count.toString());
  });

  // handler for receiving "friend-list" messages from socket
  socket.on("friend-list", (msg)=>{
    friendFilter(msg);
  });

  socket.connect();

  createCanvas(windowWidth, windowHeight);
  background(0, 0, 0);

  poly.push(
    createVector(100, 40),
    createVector(40, 200),
    createVector(600, 500),
    createVector(600, 40)
  );
}

var randomGrow = [];
let b = 0;
let x;
let y;
let s = 5;
var hit = false;
var notBusy = true;
let poly = Array();
let r;

/*function mouseClicked() {
  x = mouseX + random(-r, r);
  y = mouseY + random(-r, r);
  randomGrow.push({x, y});
  r += 5;

}*/

//--- funktioniert
/*
function arrayAdder() {
  if (mouseIsPressed) {
    randomer();
  }
}*/

function arrayAdder() {
  let m = 1;
  let i = frameCount % m;
  if (notBusy) {
    if (mouseIsPressed) {
      if (i === 0) {
        randomer();
      }
    }
    else {
      notBusy = false;
    }
  } else {
    s = 0;
    r = 2;
    if (i === 0) {
      randomGrow.pop();
    }
    if (randomGrow.length === 0) {
      notBusy = true;
    }

  }
}



function randomer() {
  r = 10;
  let x = mouseX + random(-s, s);
  let y = mouseY + random(-s, s);
  hit = collideCirclePoly(x, y, r, poly, true);
  if (hit) {
    randomGrow.push({x, y, r});
    s += 1.2;
  }

}

function draw() {
  background(100);

    // noFill();
    beginShape();
    fill(200, 100, 100);
    stroke(51);
    poly.forEach((vector) => {
      vertex(vector.x, vector.y);
    });
    endShape(CLOSE);

    arrayAdder();
    for (let i = 0; i < randomGrow.length; i += 1) {
      let color = i;
      let x = randomGrow[i].x;
      let y = randomGrow[i].y;
      let r = randomGrow[i].r;
      let xl = wrap(i - 1, 0, randomGrow.length);
      noStroke();
      fill(color, 175);
      ellipse(x, y, r);
      push();
      stroke(i, 200, 50, 150);
      line(x, y, randomGrow[xl].x, randomGrow[xl].y);
      pop();
      push();
      stroke(i, 50, 200, 150);
      line(x, y, randomGrow[0].x, randomGrow[0].y);
      pop();
    }
      //rect(randomGrow[i].x, randomGrow[i].y, (i + 10) * 2, (i + 10) * 2);
      //rect(randomGrow[i].x, randomGrow[i].y, ((i + 10) + random(5)) * 2, ((i + 10) + random(5)) * 2);
}




  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

  wrap = (inValue, inMin, inMax) => {
    valueRange = inMax - inMin;
    return (inMin + ((((inValue - inMin) % valueRange) + valueRange) % valueRange));
  }
