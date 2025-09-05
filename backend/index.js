const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for frontend communication

const playersFilePath = path.join(__dirname, 'players.json');
let players = [];

// Load players at startup
try {
  const fileData = fs.readFileSync(playersFilePath, 'utf-8');
  players = JSON.parse(fileData);
} catch (err) {
  console.log('Failed to read players.json:', err.message);
}

// Save players to file
function savePlayers(data) {
  fs.writeFileSync(playersFilePath, JSON.stringify(data, null, 2));
}

// Generate reels
function generateReels() {
  const symbols = ['A', 'B', 'C', 'D', 'W']; // Wild symbol
  const reels = [];

  for (let i = 0; i < 5; i++) {
    const reel = [];
    for (let j = 0; j < 3; j++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      reel.push(symbol);
    }
    reels.push(reel);
  }

  return reels;
}

// Determine win
function calculateWin(reels, stake) {
  const middleRow = reels.map(reel => reel[1]); // middle row
  const allSame = middleRow.every(symbol => symbol === middleRow[0]);
  const winAmount = allSame ? stake * 10 : 0;

  return {
    isWin: allSame,
    winAmount,
    matchedSymbols: allSame ? middleRow[0] : null,
    triggeredFeatures: allSame && middleRow[0] === 'W' ? ['WILD_BONUS'] : []
  };
}

// ─────────────────────────────────────────────
// Init Result API
// ─────────────────────────────────────────────
app.post('/api/initResult', (req, res) => {
  const { playerId, gameName, stake } = req.body;

  if (!playerId || !gameName || typeof stake !== 'number') {
    return res.status(400).json({ status: 'error', message: 'Invalid input' });
  }

  const player = players.find(p => p.playerId === playerId);
  if (!player) {
    return res.status(404).json({ status: 'error', message: 'Player not found' });
  }

  const sessionId = Math.random().toString(36).substring(2, 10);

  res.json({
    status: 'success',
    data: {
      playerId,
      gameName,
      stake,
      balance: player.balance,
      currency: player.currency,
      sessionId: sessionId,
      spinResult: null,
      availableFeatures: []
    }
  });
});

// ─────────────────────────────────────────────
// Spin API
// ─────────────────────────────────────────────
app.post('/api/spin', (req, res) => {
  const { playerId, stake } = req.body;

  if (!playerId || typeof stake !== 'number' || stake <= 0) {
    return res.status(400).json({ status: 'error', message: 'Invalid input' });
  }

  const playerIndex = players.findIndex(p => p.playerId === playerId);
  if (playerIndex === -1) {
    return res.status(404).json({ status: 'error', message: 'Player not found' });
  }

  const player = players[playerIndex];

  if (player.balance < stake) {
    return res.status(400).json({ status: 'error', message: 'Insufficient balance' });
  }

  // Deduct stake
  player.balance -= stake;

  // Generate spin outcome
  const reels = generateReels();
  const spin = calculateWin(reels, stake);

  // Add winnings if any
  player.balance += spin.winAmount;

  // Save updated balance
  players[playerIndex] = player;
  savePlayers(players);

  res.json({
    status: 'success',
    data: {
      playerId,
      stake,
      balance: player.balance.toFixed(2),
      currency: player.currency,
      spinResult: {
        reels,
        isWin: spin.isWin,
        winAmount: spin.winAmount,
        matchedSymbols: spin.matchedSymbols,
        triggeredFeatures: spin.triggeredFeatures
      },
      timestamp: new Date().toISOString()
    }
  });
});

// ─────────────────────────────────────────────
// Start the server
// ─────────────────────────────────────────────
app.listen(3000, () => {
  console.log('API server running on http://localhost:3000');
});
