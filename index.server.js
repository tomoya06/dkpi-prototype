const {
  generateKeyPair,
  generatePEM,
} = require('./lib/CERTapi');
const DPKI = require('./lib/DPKIapi');
const DServer = require('./lib/WEBapi');
const {
  sleep,
} = require('./lib/util');

let userConfig;

async function main() {
  const argv = require('minimist')(process.argv.slice(2));
  const configPath = argv.p || './users/eth_config.json';
  const sleepTime = parseInt(argv.s || '1000');
  if (!configPath) {
    console.log('YOU NEED TO PASS A CONFIG FILE BY ADDING -p');
    return;
  }
  userConfig = require(`${configPath}`);
  if (!userConfig.user || !userConfig.user.address) {
    console.log('ILLEGAL CONFIG FILE');
    return;
  }

  const dpki = new DPKI(userConfig);
  let idNum = await dpki.getIdentityNumber();
  console.log(`CURRENT IDENTITY AMOUNT : ${idNum}`);

  const keypair = generateKeyPair();
  const pem = generatePEM(keypair);
  await dpki.addIdentity(pem.pub);

  idNum = await dpki.getIdentityNumber();
  console.log(`CURRENT IDENTITY AMOUNT : ${idNum}`);

  const myID = await dpki.getIdentity(userConfig.user.address);
  console.log(`IDENTITY: \n${JSON.stringify(myID)}`);

  console.log(`REGISTERED. SLEEP FOR ${sleepTime}ms...`);
  sleep(sleepTime);
  console.log('WAKE UP');

  console.log('STARTING WEBSOCKET SETVER...');
  const dServer = new DServer(dpki, keypair);
}

main();
