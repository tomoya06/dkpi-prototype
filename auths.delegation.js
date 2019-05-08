const fetch = require('node-fetch');
const forge = require('node-forge');
const _ = require('lodash');
const { tokens } = require('./auths/proxy.json');

const md = forge.md.sha256.create();
const token = _.find(tokens, item => _.includes(item.scope, 'douban:all'));

const thash = md.update(token).digest().toHex();
console.log(thash);

fetch('http://localhost:3000/service', {
  method: 'POST',
  body: `hash=${thash}`,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
}).then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error('error', err));
