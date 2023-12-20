const fs = require("fs");
const readline = require("readline");

const rotateRight = (matrix) =>
  matrix[0].map((col, i) => matrix.map((row) => row[i]).reverse());

const findNextO = (array) => array.findIndex((v) => v === "O");

const sumMatrixPoints = (matrix) =>
  matrix.reduce((acc, column, i) => {
    const columnPoints = column.reduce((acc, val, i) => {
      const points = val === "O" ? i + 1 : 0;
      return acc + points;
    }, 0);
    return acc + columnPoints;
  }, 0);

async function main() {
  const fileStream = fs.createReadStream("1-input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const input = [];
  for await (const line of rl) {
    input.push(line.split(""));
  }

  const matrix = rotateRight(input);

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

  console.log(sumMatrixPoints(matrix));
}

main();
