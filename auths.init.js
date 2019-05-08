const forge = require('node-forge');
const crypto = require('crypto');

const token = crypto.randomBytes(32).toString('hex');
const md = forge.md.sha256.create();
md.update(token);
const thash = md.digest().toHex();

console.log('token', token);
console.log('thash', thash);
