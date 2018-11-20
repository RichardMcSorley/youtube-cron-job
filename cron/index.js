// long running tasks
const schedule = require("node-schedule");
const cache = require("../cache");
const api = require("../api");
const logger = require("../api/logger");

const everyHour = () => {
  // log cache and count every hour
  const rule = new schedule.RecurrenceRule();
  rule.minute = 0; // every time the clock reaches 0 minutes
  schedule.scheduleJob(rule, () => {
    api.youtube.getChannelDetailsAndUpdateDB();
    logger.info(
      `HOURLY: Ran youtube api ${
        cache.timesHitYoutube
      } | videoId's are ${JSON.stringify(
        cache.videos
      )}, every day max should be 1440`
    );
  });
};

const everyMidnight = () => {
  // Garbage Collection
  const rule = new schedule.RecurrenceRule();
  rule.minute = 0; // every time the clock reaches 0 minutes
  rule.hour = 0; // every time the clock reaches 0 hours
  schedule.scheduleJob(rule, () => {
    //api.firebase.clearOldVideos();
    logger.info("MIDNIGHT: garbage collection");
    cache.videos = {};
    cache.timesHitYoutube = 0;
  });
};

const every30s = () => {
  // batch running every 1 mins
  const rule = new schedule.RecurrenceRule();
  rule.second = new schedule.Range(0, 59, 30);
  schedule.scheduleJob(rule, async () => {
    const regular = await api.youtube.getChannelVideos();
    const live = await api.youtube.getLiveVideos();
    api.youtube.updateDBwithVideos(regular);
    api.youtube.updateDBwithVideos(live);
  });
};

const run = () => {
  everyMidnight();
  everyHour();
  every30s();
};

run();
