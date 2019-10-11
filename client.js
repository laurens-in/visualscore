let socket;
let friend;
let friends;

/////////////////////////////////////// SOCKET.IO RELATED FUNCTIONS EVENT-HANDLING //////////////////////////////////////////

// send friend object
function sendIt() {
    if (friend.name != "FriendName") {
        socket.emit("friend-data", friend);
    }
}

function sendFriend() {
    socket.emit("friend-data", friend);
}

function friendFilter(masterList) {
    Object.keys(friends).forEach((name) => {
        if (masterList.indexOf(name) === -1) {
            delete friends[name];
        }
    });
}

function updateFriend(msg) {
    friends[msg.name] = msg;
};

//////////////////////////////////////// P5 - PRELOAD - DRAW - SETUP - RESIZE /////////////////////////////////////////////
let font;

//prevent mobile browser from scrolling
function touchMoved(){
  return false;
}

// is loaded once before setup() and draw() to get assets
function preload() {
  font = loadFont('assets/SourceSansPro-Regular.otf');
}

// Setup function called once on page load, initializes everything
function setup() {

    /////////////////// SOCKET SETUP /////////////////
    // prototype object for representing current state
    friend = {
        x: 0, y: 0, name: "FriendName", active: false
    };

    // the object??(array) of connected clients
    friends = {};

    socket = io('https://scroppy-club-dxdjyofhzo.now.sh');

    // handler for receiving "friend-data" messages from socket
    socket.on("friend-data", (msg) => {
        updateFriend(msg);
    });

    // handler for the initial socket connection
    socket.on("connect", () => {
        console.log("connection: " + socket.connected);
    });

    // handler for receiving "name-assignment" messages from socket
    socket.on("name-assignment", (msg) => {
        friend.name = msg;
        console.log("We shall call you " + msg);
    });

    // handler for receiving "online-users" messages from socket
    socket.on("online-users", (count) => {
        console.log(count.toString());
    });

    // handler for receiving "friend-list" messages from socket
    socket.on("friend-list", (msg) => {
        friendFilter(msg);
    });

    socket.connect();

    ////////////////// P5 SETUP ///////////////////

    createCanvas(windowWidth, windowHeight);

    //showName() canvas setup
    nameRenderOnline = createGraphics(windowWidth, windowHeight);
    nameRenderOnline.clear();
    nameRenderOffline = createGraphics(windowWidth, windowHeight);
    nameRenderOffline.clear();
}


function draw() {
  clear();
  // if (currentPart == 1){
  //   //do some stuff e.g. cubes();
  // } else if (currentPart == 2){
  //   //do some other stuff
  // }

  showName();

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

////////////////////////////////////////////// FUNCTIONS FOR SKETCHES //////////////////////////////////////////////////////

////////////// SHOW NAME ////////////////

let nameRenderOnline;
let nameRenderOffline;

function showName() {
  if (friend.name == 'FriendName'){
    nameRenderOffline.clear();
    nameRenderOffline.stroke(255);
    nameRenderOffline.fill(0);
    nameRenderOffline.textSize(32);
    nameRenderOffline.text('waiting for connection', 0, 32);
    nameRenderOffline.ellipse(windowWidth/2, windowHeight/2, frameCount * 2 + 200);
    image(nameRenderOffline, 0, 0);
  } else {
    nameRenderOnline.background(0, 25);
    nameRenderOnline.stroke(255);
    nameRenderOnline.fill(255);
    nameRenderOnline.textSize(32);
    nameRenderOnline.text(friend.name, 0, 32);
    nameRenderOnline.textSize(20);
    nameRenderOnline.text('status: online', 0, 52)

    nameRenderOnline.noStroke();
    nameRenderOnline.fill(100)
    nameRenderOnline.ellipse(mouseX, mouseY, 15);

    image(nameRenderOnline, 0, 0);
  }
}