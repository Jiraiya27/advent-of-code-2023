const fs = require("fs");

const timeRegex = /Time:\s+(.*)/;
const distanceRegex = /Distance:\s+(.*)/;

function calculateHoldRange(time, targetDistance) {
  let holdSeconds = 1;
  let startHoldFaster, endHoldFaster;
  let complete = false;
  while (holdSeconds < time && !complete) {
    const remainingTime = time - holdSeconds;
    const distance = remainingTime * holdSeconds;
    if (distance > targetDistance) {
      if (!startHoldFaster) {
        startHoldFaster = holdSeconds;
      } else {
        endHoldFaster = holdSeconds;
      }
    } else if (endHoldFaster) {
      complete = true;
    }

    holdSeconds += 1;
  }

  return endHoldFaster - startHoldFaster + 1;
}

async function main() {
  const file = fs.readFileSync("1-input.txt", "utf8");

  const [, timeString] = timeRegex.exec(file);
  const times = timeString.trim().split(/\s+/).map(Number);
  const [, distanceString] = distanceRegex.exec(file);
  const distances = distanceString.trim().split(/\s+/).map(Number);

  let productSum = 1;
  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const distance = distances[i];
    const holdRange = calculateHoldRange(time, distance);
    productSum *= holdRange;
  }

  console.log(productSum);
}

main();
