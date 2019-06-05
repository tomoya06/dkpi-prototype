const {
  signData,
  verifyData,
  cipherData,
  decipherData,
} = require('./CERTapi');

function sleep(mill) {
  const startTime = Date.now();
  while (Date.now() - startTime < mill) {}
}

function encryptData(data, keys) {
  const {
    cipher,
    herPublickey,
    myPrivateKey,
  } = keys;
  const enData = cipherData(data, cipher);
  const enCipher = herPublickey.encrypt(JSON.stringify(cipher));
  const signature = signData(data, myPrivateKey);
  return {
    enData,
    enCipher,
    signature,
  };
}

function encryptSend(socket, data, keys, evt = 'COMMUNICATION', cnt) {
  const {
    cipher,
    herPublickey,
    myPrivateKey,
  } = keys;
  const enData = cipherData(data, cipher);
  const enCipher = herPublickey.encrypt(JSON.stringify(cipher));
  const signature = signData(data, myPrivateKey);
  socket.emit(evt, {
    enData,
    enCipher,
    signature,
    cnt,
  });
}

function decryptData(data, keys) {
  const {
    enData,
    enCipher,
    signature,
    cnt,
  } = data;
  const {
    myPrivateKey,
    herPublickey,
  } = keys;
  const cipher = JSON.parse(myPrivateKey.decrypt(enCipher));
  const deData = decipherData(enData, cipher);
  if (!verifyData(deData, signature, herPublickey)) {
    return null;
  }
  return deData;
}

module.exports = {
  sleep,
  encryptData,
  encryptSend,
  decryptData,
};
