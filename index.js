const Client = require('./src/kahoot.js');

function Kahoot(options) {
  return new Client(options);
}

Kahoot.Client = Client;

module.exports = Kahoot;
