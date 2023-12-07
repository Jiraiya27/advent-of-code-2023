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

  // generate all possible range to continue in next step
  // Any excess will continue recursion where possible otherwise return as not match any range
  // recursion calls will need to .flat to keep all ranges
  searchRange({ start, range }) {
    // Input      |---|
    // Range   |--------|
    if (start >= this.source && start + range <= this.source + this.range) {
      console.log(`
        Input      |---|
        Range   |--------|
      `);
      return [{ start: start - this.source + this.destination, range }];
    } else if (start < this.source && start + range >= this.source) {
      // Input   |------------|
      // Range      |-------|
      if (start + range > this.source + this.range) {
        console.log(`
        Input   |-------------|
        Range      |-------|
      `);
        const leftRange = { start, range: this.source - start };
        const rightRange = {
          start: this.source + this.range,
          range: start + range - this.source - this.range,
        };
        const left = this.left ? this.left.searchRange(leftRange) : [leftRange];
        const right = this.right
          ? this.right.searchRange(rightRange)
          : [rightRange];
        return [
          left,
          { start: this.destination, range: this.range },
          right,
        ].flat();
        // Input   |---|
        // Range      |-------|
      } else {
        console.log(`
        Input   |---|
        Range      |-------|
        `);
        const insideRange = start + range - this.source;
        const leftRange = {
          start: start,
          range: range - insideRange,
        };
        const left = this.left ? this.left.searchRange(leftRange) : [leftRange];
        return [
          left,
          {
            start: this.destination,
            range: insideRange,
          },
        ].flat();
      }
      // Input          |-----|
      // Range      |-------|
    } else if (
      start >= this.source &&
      start < this.source + this.range &&
      start + range > this.source + this.range
    ) {
      console.log(`
        Input          |-----|
        Range      |-------|
      `);
      const outsideRange = start + range - (this.source + this.range);
      const rightRange = {
        start: this.source + this.range,
        range: outsideRange,
      };
      const right = this.right
        ? this.right.searchRange(rightRange)
        : [rightRange];
      return [
        {
          start: start - this.source + this.destination,
          range: range - outsideRange,
        },
        right,
      ].flat();
      // Input     |----|
      // Range            |-------|
    } else if (start + range < this.source) {
      console.log(`
        Input     |----|
        Range            |-------|
      `);
      if (this.left) {
        return this.left.searchRange({ start, range });
      } else {
        return [{ start, range }];
      }
      // Input               |----|
      // Range     |-------|
    } else if (start > this.source + this.range) {
      console.log(`
        Input               |----|
        Range     |-------|
      `);
      if (this.right) {
        return this.right.searchRange({ start, range });
      } else {
        return [{ start, range }];
      }
    } else {
      throw new Error("Invalid range search");
    }
  }

  getVals() {
    return {
      source: this.source,
      destination: this.destination,
      range: this.range,
    };
  }

  listAscendingOrder(list) {
    if (this.left) this.left.listAscendingOrder(list);
    list.push(this.getVals());
    if (this.right) this.right.listAscendingOrder(list);
    return list;
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

  searchRange = (val) => {
    return this.root.searchRange(val);
  };

  // Print tree for debug
  listAscendingOrder() {
    const existingList = this.root.listAscendingOrder([]);
    return existingList;
  }
}

async function main() {
  const fileStream = fs.createReadStream("1-input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let currentTree;
  let seeds;
  const seedTree = new Tree();
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
      const paddedSeedString = seedsString + " ";
      const seedPairArray = [
        ...paddedSeedString.matchAll(/(?<pair>\d+\s+\d+\s+)/g),
      ];
      seeds = seedPairArray
        .map(([pair]) => pair.trim().split(/\s+/))
        .map(([source, range]) => ({
          start: Number(source),
          range: Number(range),
        }));
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
    .flatMap(seedToSoil.searchRange)
    .flatMap(soilToFertilizer.searchRange)
    .flatMap(fertilizerToWater.searchRange)
    .flatMap(waterToLight.searchRange)
    .flatMap(lightToTemperature.searchRange)
    .flatMap(temperatureToHumidity.searchRange)
    .flatMap(humidityToLocation.searchRange);

  console.log(Math.min(...locations.map(({ start }) => start)));
}

main();
