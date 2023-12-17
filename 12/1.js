const fs = require("fs");
const readline = require("readline");

function convertToFaultyArrangment(pipes) {
  const result = [];
  let currentCount = 0;
  for (let i = 0; i < pipes.length; i++) {
    const char = pipes[i];
    if (char === "#") {
      currentCount += 1;
    } else if (currentCount !== 0) {
      result.push(currentCount);
      currentCount = 0;
    }
  }
  if (currentCount !== 0) {
    result.push(currentCount);
  }

  return result.join(",");
}

function calculatePermutations(input, expected, resultPipes) {
  if (!input) {
    const result = convertToFaultyArrangment(resultPipes);
    return expected === result ? 1 : 0;
  }

  const char = input[0];
  if (char === "?") {
    const isDamaged = calculatePermutations(
      input.substring(1),
      expected,
      resultPipes + "#"
    );
    const isNotDamaged = calculatePermutations(
      input.substring(1),
      expected,
      resultPipes + "."
    );
    return isDamaged + isNotDamaged;
  } else {
    return calculatePermutations(
      input.substring(1),
      expected,
      resultPipes + char
    );
  }
}

async function main() {
  const fileStream = fs.createReadStream("1-input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let sum = 0;
  let count = 0;
  for await (const line of rl) {
    const [input, damagedGroups] = line.split(" ");
    console.log(++count);
    sum += calculatePermutations(input, damagedGroups, "");
  }

  console.log("sum:", sum);
}

main();
