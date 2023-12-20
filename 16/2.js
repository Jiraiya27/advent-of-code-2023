const fs = require("fs");
const readline = require("readline");

const matrix = [];

function getEnergizedTilesCount(coordinate, direction) {
  const energizedMap = {};

  function getNextCoordinate([x, y], direction) {
    if (direction === "up") {
      if (x === 0) return null;
      return [x - 1, y];
    } else if (direction === "down") {
      if (x === matrix.length - 1) return null;
      return [x + 1, y];
    } else if (direction === "left") {
      if (y === 0) return null;
      return [x, y - 1];
    } else if (direction === "right") {
      if (y === matrix.length - 1) return null;
      return [x, y + 1];
    } else {
      throw new Error("Invalid direction");
    }
  }

  function getMirrorDirection(mirror, direction) {
    if (direction === "up") {
      if (mirror === "/") return "right";
      if (mirror === "\\") return "left";
    } else if (direction === "down") {
      if (mirror === "/") return "left";
      if (mirror === "\\") return "right";
    } else if (direction === "left") {
      if (mirror === "/") return "down";
      if (mirror === "\\") return "up";
    } else if (direction === "right") {
      if (mirror === "/") return "up";
      if (mirror === "\\") return "down";
    } else {
      throw new Error("Invalid direction");
    }
  }

  function processSplitter(splitter, direction, coordinate) {
    if (direction === "up" || direction === "down") {
      if (splitter === "|") return processBeam(coordinate, direction);
      if (splitter === "-") {
        processBeam(coordinate, "left");
        processBeam(coordinate, "right");
        return;
      }
    } else if (direction === "left" || direction === "right") {
      if (splitter === "|") {
        processBeam(coordinate, "up");
        processBeam(coordinate, "down");
        return;
      }
      if (splitter === "-") return processBeam(coordinate, direction);
    } else {
      throw new Error("Invalid direction");
    }
  }

  function processBeam(coordinate, direction) {
    const nextCoordinate = getNextCoordinate(coordinate, direction);
    if (!nextCoordinate) return;

    const [nextX, nextY] = nextCoordinate;

    // save energized
    if (!energizedMap[`${nextX},${nextY}`]) {
      energizedMap[`${nextX},${nextY}`] = [direction];
    } else {
      const alreadyPassed = energizedMap[`${nextX},${nextY}`].find(
        (d) => d === direction
      );
      if (alreadyPassed) return;
      energizedMap[`${nextX},${nextY}`].push(direction);
    }

    // process beam
    const nextSpace = matrix[nextX][nextY];
    if (nextSpace === ".") {
      processBeam([nextX, nextY], direction);
      return;
    } else if (nextSpace === "/" || nextSpace === "\\") {
      const newDirection = getMirrorDirection(nextSpace, direction);
      processBeam([nextX, nextY], newDirection);
      return;
    } else {
      processSplitter(nextSpace, direction, nextCoordinate);
      return;
    }
  }

  processBeam(coordinate, direction);

  return Object.keys(energizedMap).length;
}

async function main() {
  const fileStream = fs.createReadStream("1-input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const row = line.split("");
    matrix.push(row);
  }

  let max = 0;
  for (let i = 0; i < matrix.length; i++) {
    const upCount = getEnergizedTilesCount([-1, i], "down");
    const downCount = getEnergizedTilesCount([matrix.length, i], "up");
    const leftCount = getEnergizedTilesCount([i, -1], "right");
    const rightCount = getEnergizedTilesCount([i, matrix.length], "left");
    max = Math.max(max, upCount, downCount, leftCount, rightCount);
  }

  console.log(max);
}

main();
