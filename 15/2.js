const fs = require("fs");

const lensRege = /(?<label>\S*)(?<operation>=|-)(?<focal>\d*)/;

async function main() {
  const file = fs.readFileSync("1-input.txt", "utf8");
  const steps = file.split(",");

  const hashmap = {};

  steps.forEach((string) => {
    let hash = 0;
    const [, label, operation, focal] = lensRege.exec(string);
    label.split("").forEach((char) => {
      const ascii = char.charCodeAt(0);
      hash += ascii;
      hash *= 17;
      hash = hash % 256;
    });

    if (operation === "=") {
      if (hashmap[hash]) {
        const labelIndex = hashmap[hash].findIndex(
          ({ label: l }) => l === label
        );
        if (labelIndex !== -1) {
          hashmap[hash][labelIndex] = { label, focal };
        } else {
          hashmap[hash].push({ label, focal });
        }
      } else {
        hashmap[hash] = [{ label, focal }];
      }
    } else if (operation === "-") {
      if (hashmap[hash]) {
        const labelIndex = hashmap[hash].findIndex(
          ({ label: l }) => l === label
        );
        if (labelIndex !== -1) {
          hashmap[hash].splice(labelIndex, 1);
        }
      }
    } else {
      throw new Error("Unknown operation");
    }
  });

  const focusPowerSum = Object.entries(hashmap).reduce((acc, [key, value]) => {
    const boxSum = value.reduce((total, { focal }, i) => {
      const boxVal = Number(key) + 1;
      const slot = i + 1;
      const focalLength = Number(focal);
      const power = boxVal * slot * focalLength;
      return total + power;
    }, 0);
    return acc + boxSum;
  }, 0);
  console.log(focusPowerSum);
}

main();
