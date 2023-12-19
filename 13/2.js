const fs = require("fs");
const readline = require("readline");

function isReflection(first, second) {
  const minArrayLength = Math.min(first.length, second.length);
  for (let i = 0; i < minArrayLength; i++) {
    const firstRow = first.at(`-${i + 1}`);
    const secondRow = second[i];
    const isSame = firstRow.every((val, i) => {
      return val === secondRow[i];
    });
    if (!isSame) return false;
  }
  return true;
}

function findMirrorPoints(field) {
  const matrix = field
    .split("\n")
    .slice(1)
    .map((row) => row.split(""));
  // console.log(matrix);

  // loop rows, starting from 1 - n-1
  for (let i = 1; i < matrix.length; i++) {
    const first = matrix.slice(0, i);
    const second = matrix.slice(i);
    const isSame = isReflection(first, second);
    if (isSame) {
      return i * 100;
    }
  }

  const transposedMatrix = matrix[0].map((col, i) =>
    matrix.map((row) => row[i])
  );
  // loop columns
  for (let i = 1; i < transposedMatrix.length; i++) {
    const first = transposedMatrix.slice(0, i);
    const second = transposedMatrix.slice(i);
    const isSame = isReflection(first, second);
    if (isSame) {
      return i;
    }
  }

  console.log("old gg");
}

function findNewMirrorPoints(field, oldPoints) {
  const matrix = field
    .split("\n")
    .slice(1)
    .map((row) => row.split(""));

  for (let k = 0; k < matrix.length; k++) {
    for (let l = 0; l < matrix[k].length; l++) {
      const char = matrix[k][l];
      const flippedChar = char === "." ? "#" : ".";
      const newMatrix = JSON.parse(JSON.stringify(matrix));
      newMatrix[k][l] = flippedChar;

      // loop rows, starting from 1 - n-1
      for (let i = 1; i < newMatrix.length; i++) {
        const first = newMatrix.slice(0, i);
        const second = newMatrix.slice(i);
        const isSame = isReflection(first, second);
        if (isSame) {
          const points = i * 100;
          if (points !== oldPoints) return points;
        }
      }

      const transposedMatrix = newMatrix[0].map((col, i) =>
        newMatrix.map((row) => row[i])
      );
      // loop columns
      for (let i = 1; i < transposedMatrix.length; i++) {
        const first = transposedMatrix.slice(0, i);
        const second = transposedMatrix.slice(i);
        const isSame = isReflection(first, second);
        if (isSame) {
          const points = i;
          if (points !== oldPoints) return points;
        }
      }
    }
  }

  console.log("new gg");
}

async function main() {
  const fileStream = fs.createReadStream("1-input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let sum = 0;
  let count = 0;
  let currentField = "";
  for await (const line of rl) {
    if (line) {
      currentField += `\n${line}`;
    } else {
      console.log(++count);
      const oldPoints = findMirrorPoints(currentField);
      const points = findNewMirrorPoints(currentField, oldPoints);
      sum += points;
      currentField = "";
    }
  }

  console.log("sum:", sum);
}

main();
