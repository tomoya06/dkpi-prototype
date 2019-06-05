const {
  encryptData,
  decryptData,
} = require('./lib/util');

var app = require('http').createServer()
var io = require('socket.io')(app);
let lastTime;

app.listen(8000);

io.on('connection', function (socket) {
  console.log('NEW CONNECTION');

  socket.on('hello', function (obj) {
    console.log("NEW HELLO");

    let { enData, keys, size, curTime } = obj;
    lastTime = curTime;
    curTime = Date.now();
    deltaTime = curTime - lastTime;
    console.log(`${size} RECEIVE: ${deltaTime} | ${curTime}`);

    // const data = decryptData(enData, keys);
    
    // curTime = Date.now();
    // deltaTime = curTime - lastTime;
    // lastTime = curTime;
    // console.log(`${size} DECRYPT: ${deltaTime} | ${curTime}`);
    // socket.emit('helloagain', data+Date.now().toString());
  });
});