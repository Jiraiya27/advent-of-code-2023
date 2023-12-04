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

  function getFullNumber(i, j) {
    let val = map[i][j];
    let fullNumber = val;
    let left = j - 1;
    let right = j + 1;
    let continueShiftLeft = true;
    let continueShiftRight = true;
    do {
      const leftVal = map[i][left];
      const rightVal = map[i][right];
      if (Number.isInteger(Number(leftVal))) {
        fullNumber = leftVal + fullNumber;
        left -= 1;
      } else {
        continueShiftLeft = false;
      }
      if (Number.isInteger(Number(rightVal))) {
        fullNumber += rightVal;
        right += 1;
      } else {
        continueShiftRight = false;
      }
    } while (continueShiftLeft || continueShiftRight);

    return Number(fullNumber);
  }

  // i,j is position of *
  function checkSurrounding(i, j) {
    const setsToCheck = [
      // top row
      [
        [i - 1, j - 1],
        [i - 1, j],
        [i - 1, j + 1],
      ],
      // left same row
      [[i, j - 1]],
      // right same row
      [[i, j + 1]],
      // bottom row
      [
        [i + 1, j - 1],
        [i + 1, j],
        [i + 1, j + 1],
      ],
    ];

    // count number of adjacent numbersets
    let saveNumber = "";
    const numberSet = [];
    for (let k = 0; k < setsToCheck.length; k++) {
      const positionsToCheck = setsToCheck[k];
      for (let l = 0; l < positionsToCheck.length; l++) {
        const [row, col] = positionsToCheck[l];
        if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) {
          saveNumber = "";
          continue;
        }

        const val = map[row][col];
        if (Number.isInteger(Number(val))) {
          if (!saveNumber) {
            numberSet.push(getFullNumber(row, col));
          }
          saveNumber += val;
        } else {
          saveNumber = "";
        }
      }

      // reset count when going into different section
      saveNumber = "";
    }

    if (numberSet.length !== 2) return 0;

    return numberSet[0] * numberSet[1];
  }

  for (let i = 0; i < map.length; i++) {
    const row = map[i];
    for (let j = 0; j < row.length; j++) {
      const char = row[j];
      if (char === "*") {
        sum += checkSurrounding(i, j);
      }
    }
  }

  console.log(sum);
}

main();
