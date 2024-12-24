console.log("hello javaScript");
let currSong = new Audio() 
let songs;
let currFolder;



// fetching songs //
async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${currFolder}/`);
  let response = await a.text();
  //console.log(response)

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  // console.log(as)

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3"))
      songs.push(element.href.split(`/${currFolder}/`)[1]);
  }
  // console.log(songs)

    // display songs //
    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    // console.log(songUl)
    songUl.innerHTML = ""
    for (const song of songs) {
      songUl.innerHTML =songUl.innerHTML +
        `<li>
      
                <img src="images/music.svg" class="invert" alt="" />
                <p> ${song.replaceAll("%20", " ").split(".")[0]}</p>
                <img src="images/playSong.svg" class="invert" alt="" />
     
      </li>`;
    }
    // console.log(songUl);

    // call playMusic function to play music //
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
      // console.log(e.children[1].innerHTML)
      playMusic(e.children[1].innerHTML.trim())
    });
  });

  playMusic(songs[0],true)
  play.src="images/play.svg"

}

function playMusic(track,pause=false)
{
  let music = (`/${currFolder}/`+track).replaceAll(" ","%20")
  console.log(music)

  if(music.endsWith(".mp3"))
  currSong.src = music;
  else
  {
      music = music +".mp3"
      currSong.src= music;
  }
 
  if(!pause)
  {
    currSong.play();
    play.src = "images/pause.svg"
  }
  // let audio = new Audio(music)
  // audio.play(audio);
  document.querySelector(".songinfo").innerHTML = decodeURI(track.split(".")[0]);

}

// converts seconds to minutes //
function convertSecondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "00:00"; 
  }

  seconds = Math.floor(Number(seconds));
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}


// display albums //
async function displayAlbums(){
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".playlist");
  let array = Array.from(anchors);

  for (let index = 0; index < array.length; index++) {
      const e = array[index];

    if(e.href.includes("/songs/"))
    {
      let folder = e.href.split("/").slice(-2)[0];
      let a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();
      // console.log(response)
      cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card ">
            <img src="songs/${folder}/cover.jpg" class="img" alt="" />
            <img
              src="images/playlist.svg"
              style="width: 45px"
              class="play-song"
              alt=""
            />
            <h4>${response.title}</h4>
            <p>${response.description}</p>
          </div>`
    }
  }

  // add event listner to card //
Array.from(document.getElementsByClassName("card")).forEach( e=>{
  e.addEventListener("click",async item=>{
    // console.log(item.currentTarget.dataset.folder)
    let dataSet = item.currentTarget.dataset.folder;
    await getSongs(`songs/${dataSet}`);
    
    // move hamburger to right
     document.querySelector(".left").style.left = "0%"
     document.querySelector(".left").style.width = "80vw"
  })
});
  
}


async function main() {
  // getting song //
  await getSongs("songs/hindiSongs");
  // console.log(songs);

  // display albums dynamically //
  displayAlbums();

  // add event listner to play pause next and previous //
play.addEventListener("click",()=>{
  if(currSong.paused){
    currSong.play()
    play.src = "images/pause.svg"
  }
  else{
    currSong.pause()
    play.src="images/play.svg"
  }
});

previous.addEventListener("click",()=>{
  // console.log((songs.indexOf(currSong.src.split("/").slice(-1)[0])))
  let index = songs.indexOf(currSong.src.split("/").slice(-1)[0]);

  if(index-1>=0)
    playMusic(songs[index-1])
  else
  playMusic(songs[songs.length-1])
});

next.addEventListener("click",()=>{
  let index = songs.indexOf(currSong.src.split("/").slice(-1)[0]);

  if(index+1<songs.length)
    playMusic(songs[index+1])
  else
  playMusic(songs[0])
});

// add event listner to update time //
currSong.addEventListener("timeupdate",()=>{
  // console.log(currSong.currentTime,currSong.duration)
  document.querySelector(".songtime")
    .innerHTML = `${convertSecondsToMinutes(currSong.currentTime)}/${convertSecondsToMinutes(currSong.duration)}`

    document.querySelector(".circle").style.left = (currSong.currentTime/currSong.duration)*100 + "%";
});

// add event listner  to seekbar //
document.querySelector(".seekbar").addEventListener("click",e=>{
  // console.log(e.offsetX,e.target.getBoundingClientRect().width)
  let percent =  (e.offsetX/e.target.getBoundingClientRect().width)*100;
  document.querySelector(".circle").style.left = percent + "%";
  // console.log(percent)
 currSong.currentTime= (currSong.duration*percent)/100;
});


// add event listner to hamburger //
hamburger.addEventListener("click",()=>{
  document.querySelector(".left").style.left = "0%"
});

// add event to close button //
cross.addEventListener("click",()=>{
  document.querySelector(".left").style.left = "-100%"
});


}





main();
