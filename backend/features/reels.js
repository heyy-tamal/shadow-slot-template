function generateReels() {
  const symbols = ['A', 'B', 'C', 'D', 'W', 'S'];
  const reels = [];

  for (let col = 0; col < 5; col++) {
    const reel = [];
    for (let row = 0; row < 4; row++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      reel.push(symbol);
    }
    reels.push(reel);
  }

  return reels;
}

module.exports = { generateReels };
