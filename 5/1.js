const fs = require("fs");
const readline = require("readline");

const seedsRegex = /seeds:\s+(.*)/;

class Node {
  constructor(source, destination, range) {
    this.left = null;
    this.right = null;
    this.source = source;
    this.destination = destination;
    this.range = range;
  }

  add(node) {
    if (node.source < this.source) {
      if (this.left) {
        this.left.add(node);
      } else {
        this.left = node;
      }
    } else {
      if (this.right) {
        this.right.add(node);
      } else {
        this.right = node;
      }
    }
  }

  print() {
    if (this.left) this.left.print();
    console.log(this.source);
    if (this.right) this.right.print();
  }

  search(val) {
    if (val >= this.source && val <= this.source + this.range) {
      return val - this.source + this.destination;
    } else if (val < this.source) {
      if (this.left) {
        return this.left.search(val);
      } else {
        return val;
      }
    } else if (val > this.source + this.range) {
      if (this.right) {
        return this.right.search(val);
      } else {
        return val;
      }
    } else {
      throw new Error("Invalid search condition");
    }
  }
}

class Tree {
  constructor(root) {
    this.root = root;
  }

  add(node) {
    if (!this.root) {
      this.root = node;
    } else {
      this.root.add(node);
    }
  }

  print() {
    this.root.print();
  }

  search = (val) => {
    return this.root.search(val);
  };
}

async function main() {
  const fileStream = fs.createReadStream("1-input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let seeds;
  let currentTree;
  const seedToSoil = new Tree();
  const soilToFertilizer = new Tree();
  const fertilizerToWater = new Tree();
  const waterToLight = new Tree();
  const lightToTemperature = new Tree();
  const temperatureToHumidity = new Tree();
  const humidityToLocation = new Tree();
  for await (const line of rl) {
    if (!seeds) {
      const [, seedsString] = seedsRegex.exec(line);
      seeds = seedsString.split(/\s+/).map(Number);
      continue;
    }

    switch (line.trim()) {
      case "seed-to-soil map:":
        currentTree = seedToSoil;
        continue;
      case "soil-to-fertilizer map:":
        currentTree = soilToFertilizer;
        continue;
      case "fertilizer-to-water map:":
        currentTree = fertilizerToWater;
        continue;
      case "water-to-light map:":
        currentTree = waterToLight;
        continue;
      case "light-to-temperature map:":
        currentTree = lightToTemperature;
        continue;
      case "temperature-to-humidity map:":
        currentTree = temperatureToHumidity;
        continue;
      case "humidity-to-location map:":
        currentTree = humidityToLocation;
        continue;
      case "":
        currentTree = null;
        continue;
    }

    if (!currentTree) {
      throw new Error(
        "Only number lines should remain after setting current map"
      );
    }

    const [destinationStart, sourceStart, range] = line
      .split(/\s+/)
      .map(Number);
    const node = new Node(sourceStart, destinationStart, range);
    currentTree.add(node);
  }

  const locations = seeds
    .map(seedToSoil.search)
    .map(soilToFertilizer.search)
    .map(fertilizerToWater.search)
    .map(waterToLight.search)
    .map(lightToTemperature.search)
    .map(temperatureToHumidity.search)
    .map(humidityToLocation.search);

  console.log(Math.min(...locations));
}

main();
