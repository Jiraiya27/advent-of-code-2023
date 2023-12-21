const fs = require("fs");

async function main() {
  const file = fs.readFileSync("1-sample.txt", "utf8");
  const matrix = file.split("\n").map((vals) => vals.split(""));

  function findValidSurroudingPaths([x, y], currentPath, direction) {
    let possiblePaths;
    if (direction.includes("U")) {
      possiblePaths = [
        { coordinate: [x, y - 1], direction: "L" },
        { coordinate: [x, y + 1], direction: "R" },
      ];
      if (direction.length < 3) {
        possiblePaths.push({
          coordinate: [x - 1, y],
          direction: direction + "U",
        });
      }
    } else if (direction.includes("D")) {
      possiblePaths = [
        { coordinate: [x, y - 1], direction: "L" },
        { coordinate: [x, y + 1], direction: "R" },
      ];
      if (direction.length < 3) {
        possiblePaths.push({
          coordinate: [x + 1, y],
          direction: direction + "D",
        });
      }
    } else if (direction.includes("L")) {
      possiblePaths = [
        { coordinate: [x - 1, y], direction: "U" },
        { coordinate: [x + 1, y], direction: "D" },
      ];
      if (direction.length < 3) {
        possiblePaths.push({
          coordinate: [x, y - 1],
          direction: direction + "L",
        });
      }
    } else if (direction.includes("R")) {
      possiblePaths = [
        { coordinate: [x - 1, y], direction: "U" },
        { coordinate: [x + 1, y], direction: "D" },
      ];
      if (direction.length < 3) {
        possiblePaths.push({
          coordinate: [x, y + 1],
          direction: direction + "R",
        });
      }
    }

    return possiblePaths.filter(({ coordinate }) => {
      const point = `${coordinate[0]},${coordinate[1]}`;
      const exists = currentPath.find((c) => c === point);
      const xValid = coordinate[0] >= 0 && coordinate[0] < matrix.length;
      const yValid = coordinate[1] >= 0 && coordinate[1] < matrix.length;
      return !exists && xValid && yValid;
    });
  }

  let min = Infinity;

  function findHeatLoss([x, y], currentPath, direction, sumHeatloss) {
    const newPath = [...currentPath, `${x},${y}`];
    const heatloss = Number(matrix[x][y]);
    sumHeatloss += heatloss;

    if (x === matrix.length - 1 && y === matrix.length - 1) {
      console.log(min, sumHeatloss);
      min = Math.min(min, sumHeatloss);
      return;
    }

    if (sumHeatloss > min) return;

    const nextPaths = findValidSurroudingPaths([x, y], newPath, direction);
    if (!nextPaths.length) return;

    nextPaths.forEach(
      ({ coordinate: nextCoordinate, direction: nextDirection }) =>
        findHeatLoss(nextCoordinate, newPath, nextDirection, sumHeatloss)
    );
  }

  findHeatLoss([0, 0], [], "R", 0);
  // sample works after 10-15 mins
  console.log(min - matrix[0][0]);
}

main();
