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

    // collection of connected clients
    friends = {};

    socket = io('https://cedricluziuslaurens.laurenshwm.now.sh');

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
  background(0);
  //clear();
  // if (currentPart == 1){
  //   //do some stuff e.g. cubes();
  // } else if (currentPart == 2){
  //   //do some other stuff
  // }

  showName();
  //makeCube();
  clientSettingA();

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// handling "the touching"
let touched;

//prevent mobile browser from scrolling
function touchMoved(){
  return false;
}

function touchStarted() {
    touched = true;
    return false;
}

function touchEnded() {
    touched = false;
    return false;
}

////////////////////////////////////////////// FUNCTIONS FOR SKETCHES //////////////////////////////////////////////////////

////////////// SHOW NAME ////////////////

let nameRenderOnline;
let nameRenderOffline;

function showName() {
  if (friend.name == 'FriendName'){
    nameRenderOffline.clear();
    nameRenderOffline.background(255);
    nameRenderOffline.ellipse(windowWidth/2, windowHeight/2, frameCount * 2 + 200);
    nameRenderOffline.stroke(255);
    nameRenderOffline.fill(0);
    nameRenderOffline.textSize(20);
    nameRenderOffline.textAlign(LEFT, TOP);
    nameRenderOffline.text('waiting for connection', 10, 10);

    image(nameRenderOffline, 0, 0);
  } else {

    let d = new Date();
    let currentTime = d.toLocaleTimeString();
    nameRenderOnline.clear();
    nameRenderOnline.noStroke();
    nameRenderOnline.fill(10, 255, 10);
    nameRenderOnline.textAlign(LEFT, TOP);
    nameRenderOnline.textSize(20);
    nameRenderOnline.text(friend.name + '\nstatus: online\n' + currentTime, 10, 10)
    image(nameRenderOnline, 0, 0);
  }
}

///////////// GENERATE CUBES //////////////

let cube = {
  positionX: 0,
  positionY: 0,
  width: 0,
  line: 0,
  x: 0,
  color: [0, 255, 0],
  opacity: 125,
  active: false
};

let growsize = 0;
let timeTouched = 0;


function clientSettingA() {
  if(touched){

    // grow stuff


    rectMode(CENTER);

    if (growsize == 0){
      noStroke();
      fill(0, 0);
      cube.positionX = mouseX;

    } else {
      stroke(255);
      fill([... cube.color, cube.opacity]);
      cube.width = growsize / windowWidth;
    }

    growsize += 2;

    cube.x = cube.positionX - growsize/2;

    console.log(cube.width);

    if (cube.x <= 20 && cube.positionX + growsize/2 >= windowWidth - 20){
      growsize -= 2;
    } else if (cube.x < 20){
      cube.positionX += 1;
      cube.x = 20;
      console.log(cube.x);
    } else if (cube.positionX + growsize/2 > windowWidth - 20){
      cube.positionX -= 1;
      console.log('lol i am so big');
    }

    // opacity stuff

    if(mouseX < cube.positionX){
      let swipe = cube.positionX - mouseX;
      cube.opacity = map(swipe, 0, cube.positionX, 125, 0);

    } else if (mouseX > cube.positionX) {
      let swipe = mouseX - cube.positionX;
      cube.opacity = map(swipe, 0, windowWidth - cube.positionX, 125, 255);
    } else {
      timeTouched++;
      if (timeTouched > 200 && timeTouched < 2000){
        textAlign(RIGHT, TOP);
        fill(0, 255, 0);
        textSize(20);
        text('you can move your finger, ' + friend.name.toLowerCase() +'!', windowWidth-10, 10);
      }
    }

    // color stuff

    if(mouseY < cube.positionY){
      let swipe = cube.positionY - mouseY;
      cube.color[1] = map(swipe, 0, cube.positionY, 255, 0);
      cube.color[0] = map(swipe, 0, cube.positionY, 0, 255);

    } else if (mouseY > cube.positionY) {
      let swipe = mouseY - cube.positionY;
      cube.color[1] = map(swipe, 0, windowHeight - cube.positionY, 255, 0);
      cube.color[2] = map(swipe, 0, windowHeight - cube.positionY, 0, 255);
    }


  } else {
    lastGrow = growsize;
    timeTouched = 0;
    growsize = 0;
  }
  rect(cube.positionX, (windowHeight / 2), cube.width * windowWidth, (windowHeight/3));

}

