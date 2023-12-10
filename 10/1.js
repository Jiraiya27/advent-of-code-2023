const fs = require("fs");
const readline = require("readline");

function findStartingPaths(matrix, [x, y]) {
  const paths = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const currentX = x + i;
      const currentY = y + j;
      const pipe = matrix.at(currentX)?.at(currentY);
      if (!pipe.length) continue;
      const linkedPipe = pipe.find(
        ([pathX, pathY]) => x === pathX && y === pathY
      );
      if (linkedPipe) {
        paths.push([currentX, currentY]);
      }
    }
  }

  if (paths.length !== 2) throw new Error("Didn't find both paths");

  return paths;
}

async function main() {
  const fileStream = fs.createReadStream("1-input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let startingIndex;
  let rowIndex = 0;
  let matrix = [];
  for await (const line of rl) {
    const row = Array.from(line).map((c, i) => {
      const north = [rowIndex - 1, i];
      const south = [rowIndex + 1, i];
      const east = [rowIndex, i + 1];
      const west = [rowIndex, i - 1];
      switch (c) {
        case "|":
          return [north, south];
        case "-":
          return [east, west];
        case "L":
          return [north, east];
        case "J":
          return [north, west];
        case "7":
          return [south, west];
        case "F":
          return [south, east];
        case ".":
          return [];
        case "S":
          startingIndex = [rowIndex, i];
          return [];
        default:
          throw new Error("Invalid character");
      }
    });
    rowIndex += 1;
    matrix.push(row);
  }

  let [[leftX, leftY], [rightX, rightY]] = findStartingPaths(
    matrix,
    startingIndex
  );

  console.log("starting paths:", [leftX, leftY], [rightX, rightY]);
  let distance = 1;
  let prevLeft = startingIndex;
  let prevRight = startingIndex;
  while (leftX !== rightX || leftY !== rightY) {
    // destructure
    const prevLeftX = prevLeft[0];
    const prevLeftY = prevLeft[1];
    const prevRightX = prevRight[0];
    const prevRightY = prevRight[1];

    // Find the next path
    const nextLeft = matrix[leftX][leftY]
      .filter(([x, y]) => x !== prevLeftX || y !== prevLeftY)
      .flat();
    const nextRight = matrix[rightX][rightY]
      .filter(([x, y]) => x !== prevRightX || y !== prevRightY)
      .flat();

    // update values for next loop
    prevLeft = [leftX, leftY];
    prevRight = [rightX, rightY];
    leftX = nextLeft[0];
    leftY = nextLeft[1];
    rightX = nextRight[0];
    rightY = nextRight[1];
    distance += 1;
  }

  console.log(distance);
}

main();
