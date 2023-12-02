const fs = require("fs");
const readline = require("readline");

const gameIdRegex = /Game (\d+):\s(.*)/;

const pullRegex = /(\d+)\s(\w+)/;

function calculateGamePower(line) {
  const [, , rest] = gameIdRegex.exec(line);
  const minRequired = {
    red: 0,
    green: 0,
    blue: 0,
  };
  const sets = rest.split(";");
  sets.forEach((set) => {
    const pulls = set.split(",");
    pulls.forEach((pull) => {
      const [, amount, color] = pullRegex.exec(pull);
      minRequired[color] = Math.max(minRequired[color], amount);
    });
  });
  return minRequired["red"] * minRequired["green"] * minRequired["blue"];
}

async function main() {
  const fileStream = fs.createReadStream("1-input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let sum = 0;

  for await (const line of rl) {
    sum += calculateGamePower(line);
  }

  console.log(sum);
}

main();
