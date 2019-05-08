const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const douban = require('./users/dbkey.json');

const url = 'https://www.douban.com/service/auth2/token';

// for (let key in douban) {
//   url += `${key}=${douban[key]}&`;
// }
const params = new URLSearchParams();
for (const key in douban) {
  params.append(key, douban[key]);
}

fetch(url, {
  method: 'POST',
  body: params,
}).then(res => res.json())
  .then(json => console.log(json));
