# Slot Game Backend

A simple Express.js backend for the slot game with player management and spin logic.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

## API Endpoints

### POST /api/initResult

Initialize a game session for a player.

**Request Body:**

```json
{
  "playerId": "player123",
  "gameName": "slot-game",
  "stake": 2.0
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "playerId": "player123",
    "gameName": "slot-game",
    "stake": 2.0,
    "balance": 93,
    "currency": "USD",
    "sessionId": "abc123def",
    "spinResult": null,
    "availableFeatures": []
  }
}
```

### POST /api/spin

Process a spin and update player balance.

**Request Body:**

```json
{
  "playerId": "player123",
  "stake": 2.0
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "playerId": "player123",
    "stake": 2.0,
    "balance": "91.00",
    "currency": "USD",
    "spinResult": {
      "reels": [
        ["A", "B", "C"],
        ["D", "A", "B"],
        ["C", "D", "A"],
        ["B", "C", "D"],
        ["A", "B", "C"]
      ],
      "isWin": false,
      "winAmount": 0,
      "matchedSymbols": null,
      "triggeredFeatures": []
    },
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
}
```

## Game Logic

- **Reels**: 5 reels with 3 symbols each
- **Symbols**: A, B, C, D, W (Wild)
- **Win Condition**: All middle row symbols must match
- **Win Multiplier**: 10x stake for matching symbols
- **Wild Bonus**: Special feature when Wild symbols match

## Players

Default players are stored in `players.json`:

- `player123`: $93 USD
- `player456`: €200 EUR
