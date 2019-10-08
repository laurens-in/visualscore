let socket;
let friend;
let friends;
let nameRender;

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

    // the array of connected clients
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

    nameRender = createGraphics(500, 100);
    nameRender.clear();
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

function showName() {
  if (friend.name == 'FriendName'){
    nameRender.clear();
    nameRender.stroke(255);
    nameRender.fill(0);
    nameRender.textSize(32);
    nameRender.text('waiting for connection', 0, 32);
    image(nameRender, 0, 0);
  } else {
    nameRender.clear();
    nameRender.stroke(255);
    nameRender.fill(0);
    nameRender.textSize(32);
    nameRender.text(friend.name, 0, 32);
    image(nameRender, 0, 0);
  }
}
