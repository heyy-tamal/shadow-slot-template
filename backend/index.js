const express = require('express');
const cors = require('cors');
const { loadPlayers, savePlayers } = require('./utils/fileHandler');
const { generateReels } = require('./features/reels');
const { calculateWin } = require('./features/payout');

const app = express();
app.use(express.json());
app.use(cors());

let players = loadPlayers();

// ─────────────────────────────────────────────
// Init Result API
// ─────────────────────────────────────────────
app.post('/api/initResult', (req, res) => {
  const { playerId, gameName, stake } = req.body;
  const player = players.find(p => p.playerId === playerId);

  if (!player) return res.status(404).json({ status: 'error', message: 'Player not found' });

  const sessionId = Math.random().toString(36).substring(2, 10);
  player.sessionId = sessionId;
  savePlayers(players);

  res.json({
    status: 'success',
    data: { playerId, gameName, stake, balance: player.balance, currency: player.currency, sessionId }
  });
});

// ─────────────────────────────────────────────
// Spin API
// ─────────────────────────────────────────────
app.post('/api/spin', (req, res) => {
  const { playerId, stake } = req.body;
  const player = players.find(p => p.playerId === playerId);

  if (!player) return res.status(404).json({ status: 'error', message: 'Player not found' });
  if (player.balance < stake) return res.status(400).json({ status: 'error', message: 'Insufficient balance' });

  player.balance -= stake;

  const reels = generateReels();
  const spin = calculateWin(reels, stake);

  player.balance += spin.winAmount;

  // free spins handling
  if (spin.scatterResult.freeSpinsAwarded > 0) {
    player.freeSpins.remaining += spin.scatterResult.freeSpinsAwarded;
    player.freeSpins.triggeredFrom = 'SCATTERS';
  }

  // store history
  player.history.push({
    stake,
    reels,
    win: spin.winAmount,
    balance: player.balance,
    ts: new Date().toISOString()
  });

  savePlayers(players);

  res.json({
    status: 'success',
    data: {
      playerId,
      balance: player.balance,
      currency: player.currency,
      spinResult: { ...spin, reels },
      timestamp: new Date().toISOString()
    }
  });
});

app.listen(3210, () => console.log('API running on http://localhost:3210'));
