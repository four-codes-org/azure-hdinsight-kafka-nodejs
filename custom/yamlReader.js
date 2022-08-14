const fs = require("fs");
const yaml = require("js-yaml");

const yamlReader = (fileLocation) => {
  try {
    let fileContents = fs.readFileSync(fileLocation, "utf8");
    let data = yaml.load(fileContents);
    return data;
  } catch (e) {
    return e;
  }
};

module.exports = yamlReader;
