// methods to call firebase db
const db = require("./firebase").database;
const cache = require("../../cache");
const moment = require('moment');

const sendVideoToDB = async video => {
  if (video.videoId in cache.videos) {
    // video is in local cache, dont do anything
    return;
  }
  video.timestamp = moment().format();
  const dbBaseRef = db.ref(process.env.YOUTUBE_DB + "/videos");
      // Video does not exist, we should update
      const key = await dbBaseRef.push().key;
      dbBaseRef.child(key).update(video);
      cache.videos[video.videoId] = 1; // add to cache
  
};

const sendInfoToDB = async info => {
  const dbBaseRef = db.ref(process.env.YOUTUBE_DB + "/channel");
  await dbBaseRef.set(info);
};

const clearOldChat = async () => {
  const ref = db.ref("livechat");
  ref.once("value", async videoId => {
    videoId.ref.remove()
  });
};

module.exports.sendVideoToDB = sendVideoToDB;
module.exports.sendInfoToDB = sendInfoToDB;
module.exports.clearOldChat = clearOldChat;
