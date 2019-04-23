// methods to call firebase db
const db = require("./firebase").database;
const moment = require("moment");
const videoDBRes = "videos";


const sendVideoToDB = async ({ videoId, liveBroadcastContent, ...rest }) => {
  const video = {
    ...rest,
    videoId,
    liveBroadcastContent,
    timestamp: moment().format()
  };

  if (liveBroadcastContent === "live" || liveBroadcastContent === "upcoming") {
    const puppetRef = db.ref("livechat/puppet/video/tasks");
    const key = await puppetRef.push().key;
    await puppetRef.child(key).update(video);
  }

  const dbBaseRef = db.ref(videoDBRes + "/tasks");
  const key = await dbBaseRef.push().key;
  await dbBaseRef.child(key).update(video);
  const dbBaseRef2 = db.ref(videoDBRes + 2 + "/tasks");
  const key2 = await dbBaseRef2.push().key;
  await dbBaseRef2.child(key2).update(video);
  return;
};

const sendInfoToDB = async info => {
  const dbBaseRef = db.ref(videoDBRes + "/channel/" + info.id);
  await dbBaseRef.set(info);
  return;
};

module.exports.sendVideoToDB = sendVideoToDB;
module.exports.sendInfoToDB = sendInfoToDB;
