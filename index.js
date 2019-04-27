require("dotenv").config();
process.on("uncaughtException", err => {
  console.log(err)
  process.exit(1);
});

process.on("unhandledRejection", err => {
  console.log(err)
  process.exit(1);
});

require('./cron');
