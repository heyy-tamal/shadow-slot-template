function checkForScatters(reels) {
  const scatterPositions = [];

  for (let row = 0; row < reels[0].length; row++) {
    for (let col = 0; col < reels.length; col++) {
      if (reels[col][row] === 'S') {
        scatterPositions.push({ row, col });
      }
    }
  }

  let freeSpinsAwarded = 0;
  if (scatterPositions.length >= 3) {
    freeSpinsAwarded = 10;
  }
  return { freeSpinsAwarded, scatterPositions };
}

module.exports = { checkForScatters };
