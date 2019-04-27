// methods to call firebase db
const db = require("./firebase").database;
const videoDBRes = "videos";

const sendInfoToDB = async info => {
  const dbBaseRef = db.ref(videoDBRes + "/channel/" + info.id);
  await dbBaseRef.set(info);
  return;
};
module.exports.sendInfoToDB = sendInfoToDB;
