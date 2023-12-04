const fs = require("fs");
const readline = require("readline");

const cardRegex = /Card\s+(\d+):\s(.*)/;

async function main() {
  const fileStream = fs.createReadStream("1-input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let sum = 0;
  const duplicates = {};

  function compoundTotalNumberOfScratchCards(line) {
    const [_, cardNo, rest] = cardRegex.exec(line);
    const [winningNumberString, ourNumberString] = rest.split("|");
    const winningNumbers = winningNumberString.trim().split(/\s+/);
    const ourNumbers = ourNumberString.trim().split(/\s+/);
    const countedNumbers = {};
    let winnings = ourNumbers.reduce((acc, curr) => {
      const isWin = winningNumbers.includes(curr);
      if (isWin && !countedNumbers[curr]) {
        countedNumbers[curr] = 1;
        return acc + 1;
      }
      return acc;
    }, 0);

    const currentTotalCards = (duplicates[cardNo] ?? 0) + 1;
    while (winnings > 0) {
      const targetCardNo = Number(cardNo) + winnings;
      duplicates[targetCardNo] =
        (duplicates[targetCardNo] ?? 0) + currentTotalCards;
      winnings -= 1;
    }
  }

  for await (const line of rl) {
    sum += 1;
    compoundTotalNumberOfScratchCards(line);
  }

  const duplicateSum = Object.values(duplicates).reduce(
    (acc, curr) => acc + curr,
    0
  );

  console.log(sum + duplicateSum);
}

main();
