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

function updateFriend(msg) {
    friends[msg.name] = msg;
};

////////////////////////////////////////// P5 - PRELOAD - DRAW - SETUP - RESIZE ///////////////////////////////////////////

// is loaded once before setup() and draw() to get assets
function preload() {
  font = loadFont('assets/SourceSansPro-Regular.otf');
}

// Setup function called once on page load, initializes everything
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
    background(0);
}


function draw() {

  }

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
