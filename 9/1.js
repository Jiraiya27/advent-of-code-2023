const fs = require("fs");
const readline = require("readline");

function findNextSequence(numbers) {
  let loopCount = 0;
  const layers = {
    0: numbers,
  };
  while (!layers[loopCount].every((n) => n === 0)) {
    const currentLayer = layers[loopCount];
    const nextLayer = [];
    for (let i = 0; i < currentLayer.length - 1; i++) {
      const a = currentLayer[i];
      const b = currentLayer[i + 1];
      nextLayer[i] = b - a;
    }
    loopCount += 1;
    layers[loopCount] = nextLayer;
  }

  return Object.values(layers).reduce((acc, layer) => acc + layer.at(-1), 0);
}

async function main() {
  const fileStream = fs.createReadStream("1-input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let sum = 0;

  for await (const line of rl) {
    const numbers = line.split(/\s+/).map(Number);
    sum += findNextSequence(numbers);
  }

  console.log(sum);
}

main();
