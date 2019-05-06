
let socket;
let friend;
let friends;
let renderClick = true;
let font,
  fontsize;

function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = loadFont('assets/SourceSansPro-Regular.otf');
}

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
    Object.keys(friends).forEach(function (name) {
        if (friends[name].active) {
            let index = Object.keys(friends).indexOf(name) + 1;
            stroke(index * 12, 255, 200);
            fill(index * 12, 255, 200, 127);
            ellipse(friends[name].x * windowWidth, friends[name].y * windowHeight, 5, 5);
        }
    });
}

function setup() {
    fontsize = (windowWidth/10);
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

    textFont(font);
    textSize(fontsize);
    textAlign(CENTER, CENTER);
    background(0);
}


function draw() {
    fill(255 - friend.color);
    text('tap screen', windowWidth * 0.5, windowHeight * 0.5);
    colorMode(HSB, 255);
    if (mouseIsPressed) {
      if (renderClick) {
          let chooser = [0, 255];
          friend.active = true;
          friend.color = random(255);
          friend.randx = random();
          friend.randx2 = (friend.randx + (random(0.25) - 0.5));
          if (friend.color > 210) {
              friend.sat = random(chooser);
          }
          else {
              friend.sat = 0;
          }
          sendIt();
          fill(friend.color, friend.sat, friend.color);
          rect(0, 0, windowWidth, windowHeight);
        }
        renderClick = false;
        friend.active = false;
        sendIt(); 
      }
      else {
        renderClick = true;
    }
  }

// this interferes with p5-gui functionality, leave it disabled for now
// function touchStarted() {
//     touched = true;
//     return false;
// }

// this interferes with p5-gui functionality, leave it disabled for now
// function touchEnded() {
//     touched = false;
//     return false;
// }

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
