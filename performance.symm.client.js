var forge = require('node-forge');

// generate a random key and IV
// Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256
var key = forge.random.getBytesSync(16);
var iv = forge.random.getBytesSync(16);

/* alternatively, generate a password-based 16-byte key
var salt = forge.random.getBytesSync(128);
var key = forge.pkcs5.pbkdf2('password', salt, numIterations, 16);
*/

const nums = [1, 2, 5, 10, 20, 50, 100, 200, 500];
const sizes = [1, 1024, 1024*1024];
const sizeName = ['B', 'KB', 'MB'];

let curTime = Date.now();
let lastTime = Date.now();
let deltaTime = 0;

sizes.forEach((size, sizeIdx) => {
  nums.forEach((num) => {
    var someBytes = 'x'.repeat(num * size);
    curTime = Date.now();
    
    // encrypt some bytes using CBC mode
    // (other modes include: ECB, CFB, OFB, CTR, and GCM)
    // Note: CBC and ECB modes use PKCS#7 padding as default
    var cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({iv: iv});
    cipher.update(forge.util.createBuffer(someBytes));
    cipher.finish();
    var encrypted = cipher.output;
    // outputs encrypted hex
    // console.log(encrypted.toHex());

    lastTime = curTime;
    curTime = Date.now();
    deltaTime = curTime - lastTime;
    console.log(`${num}${sizeName[sizeIdx]} ENCRYPT: ${deltaTime}`);
    
    // decrypt some bytes using CBC mode
    // (other modes include: CFB, OFB, CTR, and GCM)
    var decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: iv});
    decipher.update(encrypted);
    var result = decipher.finish(); // check 'result' for true/false
    // outputs decrypted hex
    // console.log(decipher.output.toString());
    
    lastTime = curTime;
    curTime = Date.now();
    deltaTime = curTime - lastTime;
    console.log(`${num}${sizeName[sizeIdx]} DECRYPT: ${deltaTime}`);
  })
})
