const fs = require("fs");
const readline = require("readline");

async function main() {
  const fileStream = fs.createReadStream("1-input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const graph = {};
  let directions;
  for await (const line of rl) {
    if (!directions) {
      directions = line;
      continue;
    }

    if (!line) continue;

    const [node, left, right] = line.replace(/\s+|\(|\)/g, "").split(/=|,/g);
    graph[node] = [left, right];
  }

  let count = 0;
  let currentNode = "AAA";
  let found = false;
  while (!found) {
    const direction = directions[count % directions.length];
    const nextNodeIndex = direction === "L" ? 0 : 1;
    const nextNode = graph[currentNode][nextNodeIndex];
    if (nextNode === "ZZZ") {
      found = true;
    }
    count += 1;
    currentNode = nextNode;
  }

  console.log(count);
}

main();
