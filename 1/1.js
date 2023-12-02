const fs = require("fs");
const readline = require("readline");

async function main() {
  const fileStream = fs.createReadStream("1-input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let sum = 0;

  for await (const line of rl) {
    let l = 0;
    let r = line.length - 1;
    let lFinal, rFinal;
    while (!lFinal || !rFinal) {
      if (!lFinal) {
        const lVal = line.at(l);
        if (/[0-9]/.test(lVal)) {
          lFinal = lVal;
        } else {
          l += 1;
        }
      }
      if (!rFinal) {
        const rVal = line.at(r);
        if (/[0-9]/.test(rVal)) {
          rFinal = rVal;
        } else {
          r -= 1;
        }
      }
    }
    sum += Number(lFinal + rFinal);
  }

  console.log(sum);
}

main();
