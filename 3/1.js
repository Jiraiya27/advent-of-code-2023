const fs = require("fs");
const readline = require("readline");

async function main() {
  const fileStream = fs.createReadStream("1-input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const map = [];
  let sum = 0;

  // store input as 2D array in mem
  for await (const line of rl) {
    const lineArray = [];
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      lineArray.push(char);
    }

    map.push(lineArray);
  }

  let saveNumber = "";

  // j is position of the last digit of the number
  function checkSurrounding(i, j) {
    if (!saveNumber)
      throw new Error("Should not check surrounding when savedNumber is empty");
    const numberLength = saveNumber.length;
    const firstNumberRowIndex = j - numberLength + 1;
    let fullNumberValue = "";
    const positionsToCheck = [
      // same row
      [i, firstNumberRowIndex - 1],
      [i, j + 1],
    ];
    // top and bottom row
    for (let k = firstNumberRowIndex - 1; k <= j + 1; k++) {
      positionsToCheck.push([i - 1, k]);
      positionsToCheck.push([i + 1, k]);
      // store the number full value
      if (k > firstNumberRowIndex - 1 && k < j + 1) {
        fullNumberValue += map[i][k];
      }
    }

    for (let l = 0; l < positionsToCheck.length; l++) {
      const [row, col] = positionsToCheck[l];
      if (row < 0 || row >= map.length || col < 0) continue;
      const val = map[row][col];
      if (!val || val === "." || Number.isInteger(Number(val))) continue;
      return Number(fullNumberValue);
    }
    return 0;
  }

  for (let i = 0; i < map.length; i++) {
    const row = map[i];
    for (let j = 0; j < row.length; j++) {
      const char = row[j];
      // if is number append and go next loop
      if (Number.isInteger(Number(char))) {
        saveNumber += char;
        continue;
      }

      // otherwise reset and check surrounding
      if (saveNumber) {
        sum += checkSurrounding(i, j - 1);
      }
      saveNumber = "";
    }

    // at end of row if have saveNumber check surrounding
    // and reset again
    if (saveNumber) {
      sum += checkSurrounding(i, row.length - 1);
    }
    saveNumber = "";
  }

  console.log(sum);
}

main();
