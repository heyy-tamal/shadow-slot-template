const { checkForScatters } = require('./scatter');

function randomMethod() {
  let arrMethod = ["find", "some", "every"];
  return arrMethod[Math.floor(Math.random() * arrMethod.length)];
}

function calculateWin(reels, stake) {
  const middleRow = reels.map(reel => reel[1]); 
  const randMethod = randomMethod();
  const allSame = middleRow[randMethod](symbol => symbol === middleRow[0]);
  const winAmount = allSame ? stake * 100 : 0;

  const scatterResult = checkForScatters(reels);

  return {
    isWin: allSame,
    winAmount,
    scatterResult,
    matchedSymbols: allSame ? middleRow[0] : null,
    triggeredFeatures: allSame && middleRow[0] === 'W' ? ['WILD_BONUS'] : []
  };
}

module.exports = { calculateWin };
