const fs = require("fs");
const readline = require("readline");

async function main() {
  const fileStream = fs.createReadStream("1-input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let rowIndex = 0;
  let galaxyCount = 0;
  const rowFoundGalaxy = {};
  const columnFoundGalaxy = {};
  let matrix = [];
  for await (const line of rl) {
    matrix.push([]);
    for (let colIndex = 0; colIndex < line.length; colIndex++) {
      const char = line[colIndex];
      if (!rowFoundGalaxy[rowFoundGalaxy] && char === "#") {
        rowFoundGalaxy[rowIndex] = true;
      }
      if (!columnFoundGalaxy[colIndex] && char === "#") {
        columnFoundGalaxy[colIndex] = true;
      }
      if (char === "#") {
        galaxyCount += 1;
        matrix[rowIndex].push(galaxyCount);
      } else {
        matrix[rowIndex].push(char);
      }
    }
    rowIndex += 1;
  }

  let addedRowCount = 0;
  // initial matrix is square so row = col
  for (let i = 0; i < rowIndex; i++) {
    if (!rowFoundGalaxy[i]) {
      const emptyArray = new Array(rowIndex).fill(".");
      matrix.splice(i + addedRowCount, 0, emptyArray);
      addedRowCount += 1;
    }
  }

  let addedColCount = 0;
  for (let i = 0; i < rowIndex; i++) {
    if (!columnFoundGalaxy[i]) {
      for (let j = 0; j < matrix.length; j++) {
        const row = matrix[j];
        row.splice(i + addedColCount, 0, ".");
      }
      addedColCount += 1;
    }
  }

  const galaxyIndices = {};
  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    for (let j = 0; j < row.length; j++) {
      const position = row[j];
      if (position !== ".") {
        galaxyIndices[position] = [i, j];
      }
    }
  }

  let galaxyNo = 1;
  let pathSum = 0;
  while (galaxyNo < galaxyCount) {
    for (
      let targetGalaxyNo = galaxyNo + 1;
      targetGalaxyNo <= galaxyCount;
      targetGalaxyNo++
    ) {
      const startGalaxyIndex = galaxyIndices[galaxyNo];
      const targetGalaxyIndex = galaxyIndices[targetGalaxyNo];
      pathSum +=
        Math.abs(targetGalaxyIndex[0] - startGalaxyIndex[0]) +
        Math.abs(targetGalaxyIndex[1] - startGalaxyIndex[1]);
    }

    galaxyNo += 1;
  }

  console.log(pathSum);
}

main();
