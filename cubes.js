let socket;
let friend;
let friends;
let renderClick = true;
let xbit;
let ybit;
let friendsCount;
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


function draw() {
    background(0, 0, 0);

    friendsCount = Object.keys(friends).length;
    xbit = windowWidth/friendsCount;
    //ybit = windowHeight/friendsCount;
    ybit = windowHeight/3;

    let a = Object.keys(friends);
    let i = 0;


    // while (i < a.length) {
    //     let color = friends[a[i]].color;
    //     fill(color, (friends[a[i]].sat * 255), color, 255);
    //     translate(xbit * i, ybit * i);
    //     rect(0, 0, xbit, ybit);
    //     i++;
    // }
    Object.keys(friends).forEach((name, index) => {
        let color = friends[name].color;
        // let index = Object.keys(friends).indexOf(name);
        fill(color, (friends[name].sat * 255), color, 255);
        //strokeWeight(random(30));

        //rect((xbit * index), (ybit * index), xbit, ybit);
        rect((friends[name].randx * (windowWidth)), (ybit * (index % 3)), (friends[name].randx2 * (windowWidth)), ybit);

        // translate(xbit * index, ybit * index);
        // rect(0, 0, xbit , ybit);

        // stroke(140);
        //rect((friends[name].randx * (windowWidth)), 0, (friends[name].randx2 * (windowWidth)), windowHeight);



    });

    /*a1 = [
        {x = 0, y = 0},
        {x = 0, y = 0},
        {x = 0, y = 0}
    ];

    a2 = [
        {x = 0, y = 0},
        {x = 0, y = 0},
        {x = 0, y = 0}
    ];

    a2.length*/

    push();
    let hehe = wrap(frameCount * 1, 0, windowWidth);
    stroke(255);
    translate(hehe, 0, hehe, 0);
    line(0, 0, 0, windowHeight);
    pop();


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

wrap = (inValue, inMin, inMax) => {
    valueRange = inMax - inMin;
    return (inMin + ((((inValue - inMin) % valueRange) + valueRange) % valueRange));
}
