require("dotenv").config();
require("./http"); // run http server
const firebase = require("./api/firebase");

// Catch Errors before they crash the app.
process.on("uncaughtException", err => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error("Uncaught Exception: ", errorMsg);
  firebase.disconnectRunner();
  process.exit(0);
});

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: ", err);
  firebase.disconnectRunner();
  process.exit(0);
});
process.on("SIGINT", function() {
  console.log("Starting queue shutdown");
  firebase.disconnectRunner();
});
process.on("SIGTERM", function() {
  console.log("Starting queue shutdown");
  firebase.disconnectRunner();
});
