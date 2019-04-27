
const request = require("request-promise");
const firebase = require("../firebase");
const { sendMessage } = require('../mq');
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const infoConstructor = item => {
  const { id, snippet, statistics, brandingSettings } = item;
  const { title, customUrl = null, description = null, thumbnails } = snippet;
  const { channel, image } = brandingSettings;
  const {
    keywords = null,
    featuredChannelsUrls = null,
    profileColor = null,
    unsubscribedTrailer = null
  } = channel;
  const smallImage = thumbnails.default.url;
  const mediumImage = thumbnails.medium.url;
  const largeImage = thumbnails.high.url;
  const { viewCount, subscriberCount, videoCount } = statistics;

  return {
    id,
    title,
    url: "https://youtube.com/channel/" + id,
    description,
    smallImage,
    mediumImage,
    largeImage,
    viewCount,
    subscriberCount,
    viewCount,
    videoCount,
    image,
    keywords,
    featuredChannelsUrls,
    profileColor,
    unsubscribedTrailer,
    customUrl
  };
};

const videoConstructor = item => {
  const { id, snippet } = item;
  const { videoId } = id;
  const {
    channelId,
    title,
    description,
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
    publishedAt,
    description,
    channelId
  };
};

const getBySearch = async query => {
  query = `${query}&key=${YOUTUBE_API_KEY}`;
  let result;
  try {
    result = await request({
      url: `https://www.googleapis.com/youtube/v3/search${query}`,
      method: "GET",
      json: true
    });
    return result;
  } catch (error) {
    console.error(error);
    process.exit(1)
  }
};

const getByChannels = async query => {
  query = `${query}&key=${YOUTUBE_API_KEY}`;
  let result;
  try {
    result = await request({
      url: `https://www.googleapis.com/youtube/v3/channels${query}`,
      method: "GET",
      json: true
    });

    return result;
  } catch (error) {
    console.error(error);
    process.exit(1)
  }
};

const getChannelDetailsAndUpdateDB = async (query) => {
  const { items = [] } = await getByChannels(query);
  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    await firebase.sendInfoToDB({ ...infoConstructor(item) });
  }
  return 'done';
};

const getVideosAndUpdateDB = async (query) => {
  const { items = [] } = await getBySearch(query);
  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    try {
      await sendMessage('new_youtube_video', {...videoConstructor(item)})
    } catch (error) {
      console.log(error);
      process.exit(1)
    }
    
  }
  return 'done';
};


module.exports = {
  getChannelDetailsAndUpdateDB,
  getVideosAndUpdateDB
}