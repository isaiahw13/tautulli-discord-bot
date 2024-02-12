const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
require("dotenv").config();
const tautulliApiKey = process.env.TAUTULLI_API_KEY;
const tautulliUrl = process.env.TAUTULLI_URL;
const redisClient = require("../../redis");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("top-ranking")
    .setDescription("List Top 5 Server Users"),
  async execute(interaction) {
    let reply = "🏆 Top Users 🏆 \n";
    const cachedUserList = await redisClient.get(
      "user_watch_time_stats",
      (error, data) => {
        if (error) console.error(error);
        return data;
      }
    ); //get array of users with username, id, and watch time
    const sortedUserList = JSON.parse(cachedUserList);
    sortedUserList.sort(sortByWatchTime); //sort users list descending by watch time
    //Add top 5 users to bot reply
    for (let i = 0; i < sortedUserList.length && i < 5; i++) {
      reply += `#${i + 1} **${sortedUserList[i].user_name}** ${
        sortedUserList[i].total_time_hours
      } h ${sortedUserList[i].total_time_minutes} m\n`;
    }
    await interaction.reply(reply); //reply to user
  },
};

//sort users by total time watched
function sortByWatchTime(a, b) {
  return b.total_time - a.total_time;
}
