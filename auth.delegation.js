const fetch = require('node-fetch')

fetch('http://localhost:2000/token?addr=did:cpc:uuid:subid1')
.then(res => res.json())
.then(json => {
  console.log(json)
})