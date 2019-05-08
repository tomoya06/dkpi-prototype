const {
  signData,
  verifyData,
  cipherData,
  decipherData,
  generateCipher,
  generateKeyPair,
} = require('../lib/CERTapi');

const data = '123';
const cipher = generateCipher();
const myKeypair = generateKeyPair();
const herKeypair = generateKeyPair();

const myPublicKey = myKeypair.publicKey;
const myPrivateKey = myKeypair.privateKey;
const herPublickey = herKeypair.publicKey;
const herPrivateKey = herKeypair.privateKey;

const enData = cipherData(data, cipher);
const enCipher = herPublickey.encrypt(JSON.stringify(cipher));
const signature = signData(data, myPrivateKey);

const decipher = JSON.parse(herPrivateKey.decrypt(enCipher));
const deData = decipherData(enData, decipher);

if (!verifyData(deData, signature, myPublicKey)) {
  console.log('oops');
} else {
  console.log('OK');
}
