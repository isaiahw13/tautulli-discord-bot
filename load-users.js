require("dotenv").config();
const axios = require("axios");
const tautulliApiKey = process.env.TAUTULLI_API_KEY;
const tautulliUrl = process.env.TAUTULLI_URL;

const redis = require("redis");
const redisClient = redis.createClient();
redisClient.connect().catch(console.error);
const DEFAULT_EXPIRATION = 300; //five min data expiration period

async function loadUsers() {
  try {
    const cachedData = await redisClient.get("user_names", (error, data) => {
      if (error) console.error(error);
      if (data != null) return res.json(JSON.parse(data));
    });
    //return cached data
    if (cachedData !== null) return JSON.parse(cachedData);
    else {
      //query tautulli api for user list
      const response = await axios.get(
        tautulliUrl + "/api/v2?apikey=" + tautulliApiKey + "&cmd=get_user_names"
      );
      const userList = response.data.response.data;
      //cache data
      redisClient.setEx(
        "user_names",
        DEFAULT_EXPIRATION,
        JSON.stringify(response.data.response.data)
      );
      return userList;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = { loadUsers };
