const fs = require("fs");

const ratingRegex = /x=(?<x>\d+),m=(?<m>\d+),a=(?<a>\d+),s=(?<s>\d+)/;
const criteriaRegex = /([x|m|a|s])([<|>])(\d+)/;

const workflows = {};

function processNextStep(nextStep, rating) {
  if (nextStep === "A") return true;
  if (nextStep === "R") return false;
  return processWorkflow(nextStep, rating);
}

function processWorkflow(name, rating) {
  const workflow = workflows[name];
  for (let i = 0; i < workflow.length; i++) {
    const condition = workflow[i];

    if (condition === "A") return true;
    if (condition === "R") return false;
    if (!condition.includes(":")) return processWorkflow(condition, rating);

    const [criteria, nextStep] = condition.split(":");
    const [, key, operator, val] = criteriaRegex.exec(criteria);
    const points = rating[key];
    if (operator === "<") {
      if (points < Number(val)) {
        return processNextStep(nextStep, rating);
      }
    } else {
      if (points > Number(val)) {
        return processNextStep(nextStep, rating);
      }
    }
  }
}

async function main() {
  const file = fs.readFileSync("1-input.txt", "utf8");
  const [workflowString, ratings] = file.split("\n\n");

  workflowString.split("\n").forEach((workflow) => {
    const [name, conditionString] = workflow.split(/{|}/);
    const conditions = conditionString.split(",");
    workflows[name] = conditions;
  });

  const accepted = ratings
    .split("\n")
    .map((rating) => {
      const { groups } = ratingRegex.exec(rating);
      return groups;
    })
    .filter((rating) => processWorkflow("in", rating));

  const sum = accepted.reduce((acc, { x, m, a, s }) => {
    return acc + Number(x) + Number(m) + Number(a) + Number(s);
  }, 0);
  console.log(sum);
}

main();
