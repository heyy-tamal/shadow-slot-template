const fs = require('fs');
const path = require('path');

const playersFilePath = path.join(__dirname, '../players.json');

function loadPlayers() {
  try {
    const fileData = fs.readFileSync(playersFilePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (err) {
    console.log('Failed to read players.json:', err.message);
    return [];
  }
}

function savePlayers(data) {
  fs.writeFileSync(playersFilePath, JSON.stringify(data, null, 2));
}

module.exports = { loadPlayers, savePlayers };
