require("dotenv").config();

process.on("uncaughtException", err => {
  process.exit(0);
});

process.on("unhandledRejection", err => {
  process.exit(0);
});

require('./cron');
