const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
require("dotenv").config();
const tautulliApiKey = process.env.TAUTULLI_API_KEY;
const tautulliUrl = process.env.TAUTULLI_URL;
const loadUsers = require("../../load-users.js").loadUsers;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("top-ranking")
    .setDescription("List Top 5 Server Users"),
  async execute(interaction) {
    let reply = "🏆 Top Users 🏆 \n";
    const sortedUserList = await getAllUsersWatchTimeStats(); //get array of users with username, id, and watch time
    sortedUserList.sort(sortByWatchTime); //sort users list descending by watch time
    //Add top 5 users to bot reply
    for (let i = 0; i < sortedUserList.length && i < 5; i++) {
      reply += `#${i + 1} **${sortedUserList[i].user_name}** ${
        sortedUserList[i].total_time_hours
      } h ${sortedUserList[i].total_time_minutes} m\n`;
    }
    await interaction.reply(reply);//reply to user
  },
};

//create array of users with username, id, and watch time
async function getAllUsersWatchTimeStats() {
  const userList = await loadUsers(); //get user list from tautulli
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

//sort users by total time watched
function sortByWatchTime(a, b) {
  return b.total_time - a.total_time;
}
