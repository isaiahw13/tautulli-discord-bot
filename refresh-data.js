const redisClient = require("./redis");
const loadUsers = require("./methods/load-users.js");
const getAllUsersWatchTime = require("./methods/get-user-watch-time.js");

async function refreshData() {
  console.log("refreshing data...");
  //load user list and cache response
  const userList = await loadUsers();
  redisClient.set("user_list", JSON.stringify(userList));

  //load the watch time of all users and cache response
  const usersWatchTime = await getAllUsersWatchTime(userList);
  redisClient.set("user_watch_time_stats", JSON.stringify(usersWatchTime));
}

module.exports = refreshData;
