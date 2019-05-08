const IPFS = require('ipfs');

const node = {
  ipfs: null,
  isReady: false,
};

function init(repoPath = __dirname, readyCallback) {
  node.ipfs = new IPFS({
    repo: repoPath,
  });
  node.ipfs.on('ready', () => {
    console.log('IPFS IS READY');
    node.isReady = true;
    if (typeof readyCallback === 'function') {
      readyCallback();
    }
  });
}

async function addBuffers2IPFS(str) {
  if (!node.isReady) return null;
  const content = node.ipfs.types.Buffer.from(str);
  const results = await node.ipfs.add(content);
  return results[0];
}

async function catBufferFromIPFS(hash) {
  const path = hash;
  try {
    const file = await node.ipfs.cat(path);
    return file.toString();
  } catch (error) {
    console.log(error);
    return null;
  }
}

// init('./', async function() {
//     const result = await addBuffers2IPFS('gooood')
//     const file = await catBufferFromIPFS(result.hash)
// })

module.exports = {
  init,
  addBuffers2IPFS,
  catBufferFromIPFS,
};
