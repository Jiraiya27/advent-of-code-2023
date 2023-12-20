const fs = require("fs");
const readline = require("readline");

const MAX_CYCLES = 1_000_000_000;

const rotateRight = (matrix) =>
  matrix[0].map((col, i) => matrix.map((row) => row[i]));

const rotateRightAndReverse = (matrix) =>
  matrix[0].map((col, i) => matrix.map((row) => row[i]).reverse());

const rotateLeft = (matrix) =>
  matrix[0].map((val, index) =>
    matrix.map((row) => row[row.length - 1 - index])
  );

const rotateLeftAndReverse = (matrix) =>
  matrix[0].map((val, index) =>
    matrix.map((row) => row[row.length - 1 - index]).reverse()
  );

const findNextO = (array) => array.findIndex((v) => v === "O");

const matrixToString = (matrix) => {
  let printString = "";
  for (let i = 0; i < matrix.length; i++) {
    const column = matrix[i];
    for (let j = 0; j < column.length; j++) {
      const val = column[j];
      printString += val;
    }
    printString += "\n";
  }
  return printString;
};

const getPositions = (string) => {
  return string
    .replaceAll("\n", "")
    .split("")
    .reduce((acc, val, i) => {
      if (val === "O") {
        acc.push(i);
      }
      return acc;
    }, [])
    .toString();
};

const getLoadFromPositions = (string, length) => {
  return string.split(",").reduce((acc, val) => {
    const points = length - Math.floor(val / length);
    return acc + points;
  }, 0);
};

const tilt = (matrix) => {
  outer: for (let i = 0; i < matrix.length; i++) {
    const column = matrix[i];
    let leftIndex = findNextO(column);
    if (leftIndex === -1) continue;

    inner: for (let j = 1; j < column.length; j++) {
      if (leftIndex >= j) continue;
      const val = column[j];
      if (val === "O") continue;
      if (val === "#") {
        const remainingColumn = column.slice(j);
        const newLeftIndex = findNextO(remainingColumn);
        if (newLeftIndex === -1) continue outer;
        leftIndex = newLeftIndex + j;
      }
      if (val === ".") {
        column[leftIndex] = ".";
        column[j] = "O";
        const swappedArray = column.slice(leftIndex, j + 1);
        const newLeftIndex = findNextO(swappedArray);
        if (newLeftIndex === -1) {
          throw new Error("Swap and find next O failed.");
        }
        leftIndex = newLeftIndex + leftIndex;
      }
    }
  }

  return matrix;
};

const cycle = (matrix) => {
  const north = rotateRightAndReverse(matrix);
  const northTilted = tilt(north);
  const west = rotateLeftAndReverse(northTilted);
  const westTilted = tilt(west);
  const south = rotateLeft(westTilted);
  const southTilted = tilt(south);
  const east = rotateLeft(southTilted);
  const eastTilted = tilt(east);
  const original = rotateLeftAndReverse(rotateLeft(eastTilted));
  return original;
};

async function main() {
  const fileStream = fs.createReadStream("1-input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let matrix = [];
  for await (const line of rl) {
    matrix.push(line.split(""));
  }

  let count = 1;
  const positionsCache = {};
  let matrixString = matrixToString(matrix);
  while (count < MAX_CYCLES) {
    const cycledMatrix = cycle(matrix);
    const cycledMatrixString = matrixToString(cycledMatrix);
    const cycledPositions = getPositions(cycledMatrixString);
    // if found 2 same result back to back = repeating = stop
    if (matrixString === cycledMatrixString) break;

    // update values before second check to still have access
    // if break loop
    matrix = cycledMatrix;
    matrixString = cycledMatrixString;
    // repeating in cycles = stop
    if (positionsCache[cycledPositions]) {
      positionsCache[cycledPositions].push(count);
      if (positionsCache[cycledPositions].length === 5) break;
    } else {
      positionsCache[cycledPositions] = [count];
    }
    // const load = getLoadFromPositions(cycledPositions, matrix.length);
    // console.log("================");
    // console.log(count, load, points);
    // console.log(cycledMatrixString);
    count += 1;
  }

  const stoppedMatrixPostions = getPositions(matrixString);
  const [startLoopCount, repeatAtCount] = positionsCache[stoppedMatrixPostions];
  const cyclicLoopSize = repeatAtCount - startLoopCount;
  const finalCount =
    ((MAX_CYCLES - startLoopCount) % cyclicLoopSize) + startLoopCount;
  const finalPosition = Object.keys(positionsCache).find((position) =>
    positionsCache[position].find((v) => v === finalCount)
  );
  const finalLoad = getLoadFromPositions(finalPosition, matrix.length);
  console.log(finalLoad);
}

main();
