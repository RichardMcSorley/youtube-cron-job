// methods to call youtube's api
const moment = require("moment");
var request = require("request-promise");
const cache = require("../../cache");
const firebase = require("../firebase");
const logger = require("../logger");

const infoConstructor = item => {
  const { id, snippet, statistics } = item;
  const {
    title,
    customUrl,
    description,
    thumbnails
  } = snippet;
  const smallImage = thumbnails.default.url;
  const mediumImage = thumbnails.medium.url;
  const largeImage = thumbnails.high.url;
  const { viewCount, subscriberCount, videoCount } = statistics;

  return {
    id,
    title,
    url: 'https://youtube.com/' + customUrl,
    description,
    smallImage,
    mediumImage,
    largeImage,
    viewCount,
    subscriberCount,
    viewCount,
    videoCount
  };
};

const videoConstructor = item => {
  const { id, snippet } = item;
  const { videoId } = id;
  const {
    title,
    channelTitle,
    liveBroadcastContent,
    publishedAt,
    thumbnails
  } = snippet;
  const { high } = thumbnails;
  const youtubeVideoURLBase = "https://youtu.be/";
  const videoUrl = youtubeVideoURLBase + videoId;
  const { url } = high;
  const thumbnailUrl = url;

  return {
    videoId,
    title,
    channelTitle,
    liveBroadcastContent,
    videoUrl,
    thumbnailUrl,
    publishedAt
  };
};

const getChannelVideos = async () => {
  cache.timesHitYoutube += 1;
  const YOUTUBE_API_KEY = process.env.youtube_api_key;
  const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
  let result;
  try {
    result = await request({
      url: `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet&type=video&eventType=completed&order=date&maxResults=5`,
      method: "GET",
      json: true
    });
    return result;
  } catch (error) {
    logger.error(error);
    return error;
  }
};
const getLiveVideos = async () => {
  cache.timesHitYoutube += 1;
  const YOUTUBE_API_KEY = process.env.youtube_api_key;
  const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
  let result;
  try {
    result = await request({
      url: `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&type=video&eventType=live&key=${YOUTUBE_API_KEY}`,
      method: "GET",
      json: true
    });
    return result;
  } catch (error) {
    logger.error(error);
    return error;
  }
};

const getChannelDetails = async () => {
  cache.timesHitYoutube += 1;
  const YOUTUBE_API_KEY = process.env.youtube_api_key;
  const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
  let result;
  try {
    result = await request({
      url: `https://www.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`,
      method: "GET",
      json: true
    });

    return result;
  } catch (error) {
    logger.error(error);
    return error;
  }
};

const getChannelDetailsAndUpdateDB = async () => {
  const value = await getChannelDetails();
  const { items } = value;
  if (items && items.length === 1) {
    firebase.sendInfoToDB(infoConstructor(items[0]));
  } else {
    logger.warn("No items in channel search");
  }
};

const updateDBwithVideos = async ({items}) => {
  if (items && items.length > 0) {
    items.forEach(item => {
      firebase.sendVideoToDB(videoConstructor(item));
    });
  } else {
    logger.warn("No items in search");
  }
};

module.exports.updateDBwithVideos = updateDBwithVideos;
module.exports.getChannelDetailsAndUpdateDB = getChannelDetailsAndUpdateDB;
module.exports.getChannelVideos = getChannelVideos;
module.exports.getLiveVideos = getLiveVideos;