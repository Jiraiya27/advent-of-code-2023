const fs = require("fs");

async function main() {
  const file = fs.readFileSync("1-input.txt", "utf8");
  const steps = file.split(",");

  const sum = steps.reduce((acc, string) => {
    let value = 0;
    string.split("").forEach((char) => {
      const ascii = char.charCodeAt(0);
      value += ascii;
      value *= 17;
      value = value % 256;
    });
    return acc + value;
  }, 0);

  console.log(sum);
}

main();
