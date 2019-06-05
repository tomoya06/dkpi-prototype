const {
  encryptData,
  decryptData,
} = require('./lib/util');

const {
  generateCipher,
  generateKeyPair,
} = require('./lib/CERTapi');

const minimist = require('minimist');
var args = minimist(process.argv.slice(2));

const socketio = require('socket.io-client');

const keypair = generateKeyPair();

const keys = {
  cipher: generateCipher(),
  herPublickey: keypair.publicKey,
  myPrivateKey: keypair.privateKey,
};

const nums = [1, 2, 5, 10, 20, 50, 100, 200, 500];
const sizes = [1, 1024, 1024*1024];
const sizeName = ['B', 'KB', 'MB'];

let curTime = Date.now();
let lastTime = Date.now();
let deltaTime = 0;

nums.forEach((num) => {
  const data = 'x'.repeat(num * 1);
  const enData = encryptData(data, keys);
})
nums.forEach((num) => {
  const data = 'x'.repeat(num * 1);
  const enData = encryptData(data, keys);
})
nums.forEach((num) => {
  curTime = Date.now();
  deltaTime = curTime - lastTime;
  lastTime = curTime;

  const data = 'x'.repeat(num * 1);
  const enData = encryptData(data, keys);

  curTime = Date.now();
  deltaTime = curTime - lastTime;
  lastTime = curTime;
  console.log(`${num}B ENCRYPT: ${deltaTime} | ${curTime}`);
})

const socket = socketio('http://localhost:8000');

socket.on('dconnect', () => {
  console.log('CONNECTED');

  let size = sizes[args.size];
  let num = nums[args.num];
  let sizeIdx = args.size;

  const data = 'x'.repeat(num * size);

  lastTime = Date.now();
  const enData = encryptData(data, keys);
  
  curTime = Date.now();
  deltaTime = curTime - lastTime;
  lastTime = curTime;
  console.log(`${num}${sizeName[sizeIdx]} ENCRYPT: ${deltaTime} | ${curTime}`);
  
  const deData = decryptData(enData, keys);
  
  curTime = Date.now();
  deltaTime = curTime - lastTime;
  lastTime = curTime;
  console.log(`${num}${sizeName[sizeIdx]} DECRYPT: ${deltaTime} | ${curTime}`);

  socket.emit('hello', {
    enData,
    keys,
    curTime,
    size: `${num}${sizeName[sizeIdx]}`,
  });
  // sizes.forEach((size, sizeIdx) => {
  //   nums.forEach((num) => {
      
  //   })
  // })
  
})

// socket.on('helloagain', (newdata) => {

//   if (newdata.slice(0, -13) === data) {
//     console.log("OK");
//   }
// })
