if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
} else {
  require("./http"); // run http server
}
const api = require('./api');
require('./cron');

// tasks that should run on start:
const run = async () => { 
  const regular = await api.youtube.getChannelVideos();
  const live = await api.youtube.getLiveVideos();
  api.youtube.updateDBwithVideos(regular);
  api.youtube.updateDBwithVideos(live);
  api.youtube.getChannelDetailsAndUpdateDB();
}
run();