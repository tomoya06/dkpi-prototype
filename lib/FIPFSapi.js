const fs = require('fs');
const path = require('path');

function init() {
  console.log('IPFS INIT');
}

function addBuffers2IPFS(str) {
  console.log('Added ', str);
}

function catBufferFromIPFS(file) {
  const fileStr = fs.readFileSync(path.resolve(__dirname, '..', 'diddocs', file));
  return JSON.parse(fileStr);
}

module.exports = {
  init,
  addBuffers2IPFS,
  catBufferFromIPFS,
};
