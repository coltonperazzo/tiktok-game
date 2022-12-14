'use strict'

const db = require("./sqlWrap");
const cmds = {
  addVideo: "INSERT into VideoTable (url, nickname, userid, flag) values (?,?,?,?)",
  getAllVideos: "SELECT * from VideoTable",
  getAllPref: "SELECT * from PrefTable",
  insertIntoPref: "INSERT into PrefTable (better, worse) values (?, ?)",
}

async function addVideo(data) {
  try {
    await db.run(cmds["addVideo"], [data.url, data.nickname, data.userid, data.flag]);
  } catch (error) {
    console.log("addVideo() error:", addVideo);
  }
}

async function getAllVideos() {
  try {
    let videoResults = await db.all(cmds["getAllVideos"], []);
    return videoResults;
  } catch (error) {
    console.log("getAllVideos() error:", error);
  }
  return [];
}

async function getAllPref() {
  try {
    let videoResults = await db.all(cmds["getAllPref"], []);
    return videoResults;
  } catch (error) {
    console.log("getAllPref() error:", error);
  }
  return [];
}

async function insertIntoPref(data) {
  try {
    await db.run(cmds["insertIntoPref"], [data.better, data.worse]);
  } catch (error) {
    console.log("insertIntoPref() error:", addVideo);
  }
}

module.exports = {
  addVideo: addVideo,
  getAllVideos: getAllVideos,
  getAllPref: getAllPref,
  insertIntoPref: insertIntoPref
}