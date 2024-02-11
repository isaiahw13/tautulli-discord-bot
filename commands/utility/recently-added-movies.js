const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
require("dotenv").config();
const tautulliApiKey = process.env.TAUTULLI_API_KEY;
const tautulliUrl = process.env.TAUTULLI_URL;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("recently-added-movies")
    .setDescription("Get recently added movies"),
  async execute(interaction) {
    let reply = "🍿 Recently Added Movies 🍿 \n";
    const recentlyAdded = await getRecentlyAdded();
    for (let i = 0; i < recentlyAdded.length; i++) {
      reply += `${i + 1}) **${recentlyAdded[i].title}** ${
        recentlyAdded[i].audience_rating / 2
      }⭐️\n`;
    }
    await interaction.reply(reply); //reply to user
  },
};

async function getRecentlyAdded() {
  try {
    const response = await axios.get(
      tautulliUrl +
        "/api/v2?apikey=" +
        tautulliApiKey +
        "&cmd=get_recently_added",
      {
        params: {
          count: 5,
          media_type: "movie",
        },
      }
    );
    //return array of last 5 added movies
    return response.data.response.data.recently_added;
  } catch (err) {
    console.log(err);
  }
}
