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
  let currentNodes = Object.keys(graph).filter((n) => n.endsWith("A"));
  let loopRotationCount = new Array(currentNodes.length).fill(null);
  let found = false;
  while (!found) {
    const direction = directions[count % directions.length];
    const nextNodeIndex = direction === "L" ? 0 : 1;
    const nextNodes = currentNodes.map(
      (currentNode) => graph[currentNode][nextNodeIndex]
    );
    nextNodes.forEach((n, i) => {
      if (n.endsWith("Z") && !loopRotationCount[i]) {
        loopRotationCount[i] = count + 1;
      }
    });

    found = loopRotationCount.every(Number.isInteger);
    count += 1;
    currentNodes = nextNodes;
  }

  console.log(loopRotationCount);
  // Find Lowest Common Multiple of all loopRotations for final answer
}

main();
