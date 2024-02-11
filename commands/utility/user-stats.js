const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const tautulliApiKey = process.env.TAUTULLI_API_KEY;
const tautulliUrl = process.env.TAUTULLI_URL;
require("dotenv").config();
const loadUsers = require("../../load-users.js").loadUsers;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user-stats")
    .setDescription("Provides User Watch Time Stats.")
    .addStringOption((option) =>
      option
        .setName("plex-username")
        .setDescription("Your Username")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user_name = interaction.options.getString("plex-username");
    const user_id = await getUserId(user_name);//match username with user id
    const user_watch_time_stats = await getUserWatchTimeStats(user_id);//get total time watched for user
    const reply = `
    User: **${user_name}**\n Total Time Watched: ${(
      user_watch_time_stats[0].total_time / 3600
    ).toFixed(2)} Hours
    `;
    await interaction.reply(reply);//reply to user
  },
};

//query tautulli api for server users and get user id of given username
async function getUserId(user_name) {
  const userList = await loadUsers();//pull list of usernames and their ids
  //match username with id
  for (i in userList) {
    if (userList[i].friendly_name == user_name) {
      getUserWatchTimeStats(userList[i].user_id);
      return userList[i].user_id;
    }
  }
}

//query tautulli api for user watch time stats
async function getUserWatchTimeStats(user_id) {
  try {
    const response = await axios.get(
      tautulliUrl +
        "/api/v2?apikey=" +
        tautulliApiKey +
        "&cmd=get_user_watch_time_stats",
      {
        params: { user_id: user_id, query_days: 0 },
      }
    );
    return response.data.response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
