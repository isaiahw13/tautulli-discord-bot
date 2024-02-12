require("dotenv").config();
const axios = require("axios");
const tautulliApiKey = process.env.TAUTULLI_API_KEY;
const tautulliUrl = process.env.TAUTULLI_URL;

//create array of users with username, id, and watch time
async function getAllUsersWatchTimeStats(userList) {
  const userListWithWatchTime = [];
  //Get user watch time for every user
  for (i in userList) {
    const user = userList[i];
    try {
      //query tautulli api for user watch time
      const response = await axios.get(
        tautulliUrl +
          "/api/v2?apikey=" +
          tautulliApiKey +
          "&cmd=get_user_watch_time_stats",
        {
          params: { user_id: user.user_id, query_days: 0 },
        }
      );

      //populate user list array
      let watchSeconds = response.data.response.data[0].total_time;
      userListWithWatchTime.push({
        user_name: user.friendly_name,
        user_id: user.user_id,
        total_time: (watchSeconds / 3600).toFixed(2),
        total_time_hours: parseInt(watchSeconds / 3600),
        total_time_minutes: Math.round(((watchSeconds / 3600) % 1) * 60),
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  return userListWithWatchTime;
}

module.exports = getAllUsersWatchTimeStats;
