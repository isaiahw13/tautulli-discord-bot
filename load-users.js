require("dotenv").config();
const axios = require("axios");
const tautulliApiKey = process.env.TAUTULLI_API_KEY;
const tautulliUrl = process.env.TAUTULLI_URL;

async function loadUsers() {
  try {
    const response = await axios.get(
      tautulliUrl + "/api/v2?apikey=" + tautulliApiKey + "&cmd=get_user_names"
    );
    const userList = response.data.response.data;
    return userList;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = { loadUsers };
