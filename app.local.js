'use strict'

const dotenv = require('dotenv');
const result = dotenv.config()
 
if (result.error) {
  console.log(result);
  throw result.error;
}

const app = require('./app')
const port = process.env.PORT || 3000

app.listen(port, () => 
  console.log(`Local server is listening on port ${port}.`)
)