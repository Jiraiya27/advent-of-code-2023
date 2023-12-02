const fs = require("fs");
const readline = require("readline");

const gameIdRegex = /Game (\d+):\s(.*)/;

const pullRegex = /(\d+)\s(\w+)/;

const LIMIT = {
  red: 12,
  green: 13,
  blue: 14,
};

function extractPossibleGameId(line) {
  const [, gameId, rest] = gameIdRegex.exec(line);
  const sets = rest.split(";");
  const isPossible = sets.every((set) => {
    const pulls = set.split(",");
    return pulls.every((pull) => {
      const [, amount, color] = pullRegex.exec(pull);
      return amount <= LIMIT[color];
    });
  });
  return isPossible ? Number(gameId) : 0;
}

async function main() {
  const fileStream = fs.createReadStream("1-input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let sum = 0;

  for await (const line of rl) {
    sum += extractPossibleGameId(line);
  }

  console.log(sum);
}

main();
