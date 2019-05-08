const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const { client_id, subject_id } = require('./users/dbkey.json');

fetch('http://localhost:2000/token?addr=did:cpc:uuid:subid2')
  .then(res => res.json())
  .then((json) => {
    console.log(json);
    const { token } = json;
    updateComment(token);
  })
  .catch((error) => {
    console.log('AUTH FAILED');
  });

function updateComment(token) {
  const params = new URLSearchParams();
  params.append('client_id', client_id);
  params.append('subject_id', subject_id);
  params.append('comment', `${Date.now()} MARKING TEST`);
  params.append('status', 'wish');

  // const headers = new fetch.Headers();
  // headers.append("Authorization", `Bearer ${token}`);
  fetch('https://api.douban.com/v2/movie/collection/1226523442', {
    method: 'POST',
    body: params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.json())
    .then(json => console.log(json));
}
