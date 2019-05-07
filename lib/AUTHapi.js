const app = require('express')();
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const douban = require('./../users/dbkey.json');
const ipfs = require('./FIPFSapi');

module.exports = class AuthServer {
  constructor(port = 2000) {
    ipfs.init();
    app.use(async (req, res, next) => {
      // SIMPLIFIED DID AUTHENTICATION PROCESS
      const { addr } = req.query;
      const diddoc = ipfs.catBufferFromIPFS('doc1.json');
      const authList = diddoc.authorization.map(item => item.id);
      const authIdx = authList.indexOf(addr);
      console.log(authIdx);
      if (authIdx < 0) {
        res.legit = false;
        return next();
      }
      const scope = diddoc.authorization[authIdx].scope;
      console.log(scope);
      if (!scope.includes('douban:all')) {
        res.legit = false;
        return next();
      }
      res.legit = true;
      return next();
    })

    app.get('/token', (req, res) => {
      if (!res.legit) {
        return res.status(403).send('');
      }

      let url = 'https://www.douban.com/service/auth2/token';
      const params = new URLSearchParams();
      for (let key in douban) {
        params.append(key, douban[key]);
      }
      fetch(url, {
        method: 'POST',
        body: params
      }).then((res) => res.json())
        .then(json => {
          console.log(json);
          res.send({
            token: json.access_token
          })
        })
    })

    app.listen(port, () => {
      console.log(`AUTH SERVER LISTEN ON PORT ${port}`);
    })
  }
}