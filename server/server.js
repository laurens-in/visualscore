
// Socket.IO uses a http server
const http = require('http').createServer('drawing-server');
const io = require('socket.io')(http);
const port = process.env.PORT || 5001;

// names generator
const metal = require('metal-name');

let onlineUsers = [];

// REGISTERED EVENTS:
//
// friend-data (in/out)
// cube-data (in)
// name-assignment (out)
// online-users (out)
// friend-list (out)

// connection listener
io.on('connection', socket => {
  // socket is an event
  console.dir(socket.eventNames());
	// socket.removeAllListeners(); // TODO: why is this required?

  // generate a unique name and assign it
	let newUsername = metal();
	socket.metalname = newUsername;
  onlineUsers++;

	// give them their name and send user count
	socket.emit('name-assignment', newUsername);
  socket.emit('online-users', onlineUsers);

	// create a list of friends (using their "metalname")
  let friendList = [];

	// compile a list of names of connected users
	io.sockets.clients((error, clients) => {
		friendList = [];
    if (error) throw error;

    // query each of the connected clients for their name
		for (let i = 0; i < clients.length; i++) {
			friendList[i] = io.sockets.connected[clients[i]].metalname;
    }

		// send the list
		io.emit('friend-list', friendList);
  });

	// pass along all the incoming messages to everyone
	socket.on('friend-data', (msg) => {
		socket.broadcast.emit('friend-data', msg);
  });

  socket.on('cube-data', data => {
    // need way to identify sender
    // store / update incoming data
    console.log('incoming cube data:');
    console.dir(data);
  });

	// client disconnection handler
	socket.on('disconnect', () => {
		onlineUsers--;
		console.log(`user disconnected. now there are ${onlineUsers}`);
		let friendList = [];
		io.sockets.clients((error, clients) => {
			friendList = [];
			if (error) throw error;
			for (let i = 0; i < clients.length; i++) {
				friendList[i] = io.sockets.connected[clients[i]].metalname;
			}
			io.emit('friend-list', friendList);
		});
		io.emit('online-users', onlineUsers);
	});
});

http.listen(port, () => {
	console.log(`listening on *: ${port}`);
});
