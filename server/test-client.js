const io = require('socket.io-client');
socket = io('http://localhost:5001');

// REGISTERED EVENTS:
//
// connect
// friend-data (in/out)
// cube-data (out)
// name-assignment (in)
// online-users (in)
// friend-list (in)

socket.on('connect', () => {
  console.log('connection: ' + socket.connected);
});

socket.on('friend-data', data => {
  console.log('friend-data:');
  console.dir(data);
});

socket.on('name-assignment', data => {
  console.log('name assigned: ' + data);
});

socket.on('online-users', count => {
  console.log('online users: ' + count);
});

socket.on('friend-list', data => {
  console.log('friend-list:');
  console.dir(data);
});

socket.connect();

// emit stuff
socket.emit('friend-data', {x: 0, y: 0, name: "FriendName", active: false});
