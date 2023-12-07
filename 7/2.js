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

  if (occurenceCount["J"] >= 4) return "five";
  if (occurenceCount["J"] === 3) {
    if (counts.includes(2)) {
      return "five";
    } else {
      return "four";
    }
  }
  if (occurenceCount["J"] === 2) {
    if (counts.includes(3)) {
      return "five";
    } else if (counts.filter((c) => c === 2).length === 2) {
      return "four";
    } else {
      return "three";
    }
  }
  if (occurenceCount["J"] === 1) {
    if (counts.includes(4)) {
      return "five";
    } else if (counts.includes(3)) {
      return "four";
    } else if (counts.filter((c) => c === 2).length === 2) {
      return "fullHouse";
    } else if (counts.includes(2)) {
      return "three";
    } else {
      return "onePair";
    }
  }

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
  if (card === "T") return 10;
  if (card === "J") return 1;
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
      handTypes[type].sort(sortSameType);
      return handTypes[type];
    })
    .reduce((acc, curr, i) => {
      return acc + curr.points * (i + 1);
    }, 0);

  console.log(totalPoints);
}

main();
