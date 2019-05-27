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
}

var randomGrow = [];
let b = 0;
let x;
let y;
let r = 10;

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
    if (mouseIsPressed) {
        if (i === 0) {
            randomer();
        }
    }
    else {
        r = 0
        if (i === 0) {
            randomGrow.pop();
        }
/*         if (randomGrow.length === 0) {
            m = random(10) + 1;
        } */
    }
}



function randomer() {
    x = mouseX + random(-r, r);
    y = mouseY + random(-r, r);
    randomGrow.push({x, y});
    r += 2;
}

function draw() {
  background(0);
  arrayAdder();
  for (let i = 0; i < randomGrow.length; i += 1) {
    let color = i * 4 + 65;
    noStroke();
    fill(color, 175);
    //rect(randomGrow[i].x, randomGrow[i].y, ((i + 10) + random(5)) * 2, ((i + 10) + random(5)) * 2);
    ellipse(randomGrow[i].x, randomGrow[i].y, ((i) + random(3)) / 1.5);
    //rect(randomGrow[i].x, randomGrow[i].y, (i + 10) * 2, (i + 10) * 2);
  }
}



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

wrap = (inValue, inMin, inMax) => {
    valueRange = inMax - inMin;
    return (inMin + ((((inValue - inMin) % valueRange) + valueRange) % valueRange));
}