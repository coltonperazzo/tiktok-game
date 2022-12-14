
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

function getWinningVideo() {
  sendGetRequest("/getWinner")
    .then(function(data) {
      let jsonData = JSON.parse(data);
      addVideo(jsonData.url, divElmt);
      let nickname = document.getElementsByClassName("tiktokNickname");
      nickname[0].textContent = jsonData.nickname;
      loadTheVideos();
    }).catch(function(error) {
      console.log("Error occurred: ", error);
  });
}
getWinningVideo();

let divElmt = document.getElementById("tiktokDiv");
let reloadButton = document.getElementById("reload");
reloadButton.addEventListener("click",function () {
  reloadVideo(tiktokDiv);
});