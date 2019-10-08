
let socket;
let friend;
let friends;
var gui;
var localFader = 0;
var localFaderMin = 0;
var localFaderMax = 255;
var remoteFader = 0;
let touched = false;

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
    remoteFader = msg.fader;
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
            translate(10, windowHeight/2);
            fill(0,0,0,127);
            rect(30, 20, 255, 55);
            fill(index * 12, 255, 200, 127);
            rect(30, 20, remoteFader, 55);
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
    background(0, 0, 0);

    // create the GUI
    gui = createGui('client-gui');
    gui.addGlobals('localFader');
}


function draw() {
    if (mouseIsPressed || touched) {
        friend.active = true;
        friend.x = mouseX / windowWidth;
        friend.y = mouseY / windowHeight;
        friend.fader = localFader;
        sendIt();
        stroke(0, 255, 200);
        fill(0, 255, 200, 127);
        ellipse(mouseX, mouseY, 5, 5);
    } else {
        friend.active = false;
    }
    friender();
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
