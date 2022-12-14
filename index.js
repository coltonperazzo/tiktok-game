'use strict'

const express = require("express");
const win = require("./pickWinner");
const bodyParser = require('body-parser');

const db = require("./sqlWrap");
const ops = require("./sqlOperations")

function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  return n;
}

const app = express();
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})
app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/compare.html");
});

app.use(bodyParser.json());

app.post('/insertPref', async function(req, res, next) {
  let data = req.body;
  let pref = await ops.getAllPref();
  if (pref.length >= 15) {
    res.send("pick winner");
    return;
  }
  await ops.insertIntoPref(data);
  res.send("continue");
})

app.get("/getWinner", async function(req, res) {
  let videos = await ops.getAllVideos();
  let winner = await win.computeWinner(videos.length, false);
  let winnerData = null;
  if (winner) {
    for(let i = 0 ; i < videos.length; i++) {
      if (videos[i].rowIdNum == winner) {
        winnerData = videos[i];
        break;
      }
    }
  }
  res.send(winnerData);
});

app.get('/getTwoVideos', async function(req, res, next) {
  let allVideos = await ops.getAllVideos();
  let firstVideo = allVideos[getRandomInt(allVideos.length)];
  let secondVideo = null;
  while (secondVideo == null) {
    let randomVideo = allVideos[getRandomInt(allVideos.length)];
    if (randomVideo.url != firstVideo.url) {
      secondVideo = randomVideo;
    }
  }
  res.json([firstVideo, secondVideo]);
})

app.use(function(req, res){
  res.status(404); 
  res.type('txt'); 
  res.send('404 - File '+req.url+' not found'); 
});

const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});