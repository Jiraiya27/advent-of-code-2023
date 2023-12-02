const fs = require("fs");
const readline = require("readline");

// Regex for first occurence work but second didn't work
// tried negative lookahead and match all groups but failed for
// `oneight` so just brute force string match
// const matchNumberRegex =
//   /(one|two|three|four|five|six|seven|eight|nine|1|2|3|4|5|6|7|8|9)/g;

const wordList = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];

const wordToNumberMap = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

const reverseWordList = wordList.map((word) =>
  word.split("").reverse().join("")
);

const reverseWordToNumberMap = Object.keys(wordToNumberMap).reduce(
  (acc, key) => {
    const reverseWord = key.split("").reverse().join("");
    const val = wordToNumberMap[key];
    acc[reverseWord] = val;
    return acc;
  },
  {}
);

function findFirstWord(inputString, words, map) {
  const indexList = words.map((word) => {
    const index = inputString.indexOf(word);
    return index === -1 ? Infinity : index;
  });
  const minIndex = Math.min(...indexList);
  const wordIndex = indexList.indexOf(minIndex);
  const word = words[wordIndex];
  return map[word] ?? word;
}

async function main() {
  const fileStream = fs.createReadStream("2-input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let sum = 0;

  for await (const line of rl) {
    const left = findFirstWord(line, wordList, wordToNumberMap);
    const right = findFirstWord(
      line.split("").reverse().join(""),
      reverseWordList,
      reverseWordToNumberMap
    );
    sum += Number(left + right);
  }

  console.log(sum);
}

main();
