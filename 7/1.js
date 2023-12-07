const fs = require("fs");
const readline = require("readline");

const handTypes = {
  high: [],
  onePair: [],
  twoPair: [],
  three: [],
  fullHouse: [],
  four: [],
  five: [],
};

function calculateHandType(hand) {
  const occurenceCount = {};
  hand.split("").forEach((c) => {
    occurenceCount[c] = (occurenceCount[c] ?? 0) + 1;
  });

  const counts = Object.values(occurenceCount);

  if (counts.includes(5)) return "five";
  if (counts.includes(4)) return "four";
  if (counts.includes(3) && counts.includes(2)) return "fullHouse";
  if (counts.includes(3)) return "three";
  if (counts.filter((c) => c === 2).length === 2) return "twoPair";
  if (counts.filter((c) => c === 2).length === 1) return "onePair";
  return "high";
}

function convertCardToPoints(card) {
  if (card === "A") return 14;
  if (card === "K") return 13;
  if (card === "Q") return 12;
  if (card === "J") return 11;
  if (card === "T") return 10;
  return Number(card);
}

function sortSameType(a, b) {
  for (let i = 0; i < 5; i++) {
    const aCardPoints = convertCardToPoints(a.hand[i]);
    const bCardPoints = convertCardToPoints(b.hand[i]);

    if (aCardPoints === bCardPoints) continue;
    return aCardPoints < bCardPoints ? -1 : 1;
  }
}

async function main() {
  const fileStream = fs.createReadStream("1-input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let totalCount = 0;
  for await (const line of rl) {
    const [hand, points] = line.split(" ");
    const type = calculateHandType(hand);
    handTypes[type].push({ hand, points });
    totalCount += 1;
  }

  const totalPoints = Object.keys(handTypes)
    .flatMap((type) => {
      console.log(type);
      handTypes[type].sort(sortSameType);
      return handTypes[type];
    })
    .reduce((acc, curr, i) => {
      return acc + curr.points * (i + 1);
    }, 0);

  console.log(totalPoints);
}

main();
