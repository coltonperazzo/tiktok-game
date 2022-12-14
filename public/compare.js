let videoData = {};

async function sendGetRequest(url) {
  let response = await fetch(url, {
    method: 'GET'
  });
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

async function sendPostRequest(url, data) {
  let response = await fetch(url, {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data) });
  if (response.ok) {
    let data = await response.text();
    console.log("Got server response:", data);
    return data;
  } else {
    throw Error(response.status);
  }
}
let videoElmts = document.getElementsByClassName("tiktokDiv");
sendGetRequest("/getTwoVideos")
    .then(function(data) {
      let jsonData = JSON.parse(data);
      for(let i = 0 ; i < jsonData.length; i++) {
        addVideo(jsonData[i].url, videoElmts[i]);
        let nickNames = document.getElementsByClassName("tiktokNickname");
        nickNames[i].textContent = jsonData[i].nickname;
        videoData[i] = {
          data: jsonData[i],
          didLike: false
        };
      }
      loadTheVideos();
    }).catch(function(error) {
      console.log("Error occurred: ", error);
});

let reloadButtons = document.getElementsByClassName("reload");
for (let i = 0; i<2; i++) {
  let reload = reloadButtons[i]; 
  reload.addEventListener("click",function() { reloadVideo(videoElmts[i]) });
} 

let heartButtons = document.querySelectorAll("div.heart");
function updateHeartButton(didLike, buttonNumber) {
  let heartButton = heartButtons[buttonNumber];
  if (heartButton) {
    if (didLike) {
      heartButton.classList.remove("unloved");
      heartButton.firstChild.setAttribute("data-prefix", "fas");
    } else { 
      heartButton.classList.add("unloved"); 
      heartButton.firstChild.setAttribute("data-prefix", "far");
    }
    videoData[buttonNumber].didLike = didLike;
  }
}

for(let i = 0; i < heartButtons.length; i++) {
  let heartButton = heartButtons[i];
  heartButton.classList.add("unloved");
  heartButton.addEventListener("click", function() {
    for(let j = 0; j < 2; j++) {
      if (videoData[j].didLike) {
        if (j == i) { return; }
        updateHeartButton(false, j);
      }
    }
    updateHeartButton(true, i);
  });
}

let nextButton = document.getElementsByClassName("enabledButton")[0];
nextButton.addEventListener("click", function() {
  for(let i = 0; i < 2; i++) {
      if (videoData[i].didLike) {
        let otherVideoData = null;
        if (i == 0) {
          otherVideoData = videoData[1];
        } else { otherVideoData = videoData[0]; }
        sendPostRequest("/insertPref", {better: videoData[i].data.rowIdNum, worse: otherVideoData.data.rowIdNum})
          .then(function(data) {
            if (data == "continue") {
              location.reload();
            } else {
              window.location = "/winner.html";
            }
          })
          .catch(function(error) {
            console.log("Error occurred: ", error);
        });
        break;
      }
  }
})



    