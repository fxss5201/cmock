const chalk = require("chalk");

module.exports = {
  logSuccess: chalk.green(" ✔ "),
  logError: chalk.red(" ✖ "),
  logInfo: chalk.blue(" ℹ "),
  logWarning: chalk.yellow(" ⚠ "),
};
