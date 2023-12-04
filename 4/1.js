const fs = require("fs");
const readline = require("readline");

const cardRegex = /Card\s+\d+:\s(.*)/;

function calculatePoints(line) {
  const [_, rest] = cardRegex.exec(line);
  const [winningNumberString, ourNumberString] = rest.split("|");
  const winningNumbers = winningNumberString.trim().split(/\s+/);
  const ourNumbers = ourNumberString.trim().split(/\s+/);
  const countedNumbers = {};
  const winnings = ourNumbers.reduce((acc, curr) => {
    const isWin = winningNumbers.includes(curr);
    if (isWin && !countedNumbers[curr]) {
      countedNumbers[curr] = 1;
      return acc + 1;
    }
    return acc;
  }, 0);
  return winnings ? Math.pow(2, winnings - 1) : 0;
}

async function main() {
  const fileStream = fs.createReadStream("1-input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let sum = 0;

  for await (const line of rl) {
    const points = calculatePoints(line);
    sum += points;
  }

  console.log(sum);
}

main();
