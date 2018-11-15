const moment = require("moment");
const chalk = require("chalk");

function cmd(cmd, suffix) {
  console.log(
    chalk.cyan(`[${moment().format("YYYY-MM-DD HH:mm:ss")}]`),
    chalk.bold.green("[COMMAND]"),
    chalk.bold.green(cmd),
    suffix
  );
}

function info(msg) {
  console.log(chalk.cyan(`[${moment().format("YYYY-MM-DD HH:mm:ss")}]`),chalk.bold.cyan("[INFO]"), msg);
}

function warn(msg) {
  console.log(
    chalk.cyan(`[${moment().format("YYYY-MM-DD HH:mm:ss")}]`),
    chalk.yellow(`[WARN] ${msg}`)
  );
}

function error(msg) {
  console.log(
    chalk.cyan(`[${moment().format("YYYY-MM-DD HH:mm:ss")}]`),
    chalk.red(`[ERROR] ${msg}`)
  );
}

module.exports = {
  cmd,
  info,
  warn,
  error
};
