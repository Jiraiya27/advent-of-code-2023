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
  const time = Number(timeString.replace(/\s+/g, ""));
  const [, distanceString] = distanceRegex.exec(file);
  const distance = Number(distanceString.replace(/\s+/g, ""));

  const holdRange = calculateHoldRange(time, distance);
  console.log(holdRange);
}

main();
