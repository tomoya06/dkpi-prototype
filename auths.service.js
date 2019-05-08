const app = require('express')();
const bodyParser = require('body-parser');
const _ = require('lodash');

const { tokens } = require('./auths/serve.json');

const port = 3000;

function checkHash(hash) {
  // SIMPLIFIED GETTING TOKEN PROCESS
  const foundHashItem = _.find(tokens, { thash: hash });
  if (!foundHashItem) { return false; }
  if (!foundHashItem.scope.includes('douban:all')) { return false; }
  return true;
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.post('/service', (req, res) => {
  try {
    const { hash } = req.body;
    if (!checkHash(hash)) { throw new Error('ILLEGAL HASH'); }
    res.send({
      date: Date.now(),
    });
  } catch (error) {
    res.status(403).send(error);
  }
});

app.listen(port, () => {
  console.log('LISTEN ON PORT ', port);
});
