require("dotenv").config();
const axios = require("axios");
const tautulliApiKey = process.env.TAUTULLI_API_KEY;
const tautulliUrl = process.env.TAUTULLI_URL;
const redisClient = require("../redis");

async function loadUsers() {
  try {
    //query tautulli api for user list
    const response = await axios.get(
      tautulliUrl + "/api/v2?apikey=" + tautulliApiKey + "&cmd=get_user_names"
    );
    return response.data.response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
module.exports = loadUsers;
