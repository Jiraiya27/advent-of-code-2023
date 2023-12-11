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
  const galaxyIndices = {};
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
        galaxyIndices[galaxyCount] = [rowIndex, colIndex];
        matrix[rowIndex].push(galaxyCount);
      } else {
        matrix[rowIndex].push(char);
      }
    }
    rowIndex += 1;
  }

  // reverse from found to find not found rows/cols
  const expandedRows = {};
  const expandedCols = {};
  for (let i = 0; i < rowIndex; i++) {
    if (!rowFoundGalaxy[i]) {
      expandedRows[i] = true;
    }
    if (!columnFoundGalaxy[i]) {
      expandedCols[i] = true;
    }
  }

  let galaxyNo = 1;
  let pathSum = 0;
  const distanceMultiplier = 999_999;
  while (galaxyNo < galaxyCount) {
    for (
      let targetGalaxyNo = galaxyNo + 1;
      targetGalaxyNo <= galaxyCount;
      targetGalaxyNo++
    ) {
      const startGalaxyIndex = galaxyIndices[galaxyNo];
      const targetGalaxyIndex = galaxyIndices[targetGalaxyNo];

      const lowerX =
        startGalaxyIndex[0] < targetGalaxyIndex[0]
          ? startGalaxyIndex[0]
          : targetGalaxyIndex[0];
      const higherX =
        startGalaxyIndex[0] > targetGalaxyIndex[0]
          ? startGalaxyIndex[0]
          : targetGalaxyIndex[0];
      let expandedX = 0;
      for (let i = lowerX + 1; i < higherX; i++) {
        if (expandedRows[i]) expandedX += 1;
      }

      const lowerY =
        startGalaxyIndex[1] < targetGalaxyIndex[1]
          ? startGalaxyIndex[1]
          : targetGalaxyIndex[1];
      const higherY =
        startGalaxyIndex[1] > targetGalaxyIndex[1]
          ? startGalaxyIndex[1]
          : targetGalaxyIndex[1];
      let expandedY = 0;
      for (let i = lowerY + 1; i < higherY; i++) {
        if (expandedCols[i]) expandedY += 1;
      }

      const diffX = higherX - lowerX;
      const diffY = higherY - lowerY;
      const expandedDistance = (expandedX + expandedY) * distanceMultiplier;
      const distance = diffX + diffY + expandedDistance;

      pathSum += distance;
    }

    galaxyNo += 1;
  }

  console.log(pathSum);
}

main();
