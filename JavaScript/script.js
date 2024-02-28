/* ************************************************************************************* */

async function get_songs() {
    let a = await fetch("/Songs_Used/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let b = div.getElementsByTagName("a")
    let songs = []
    for (let i = 0; i < b.length; i++) {
        const element = b[i];
        if (element.href.endsWith(".mp3")) {
            songs.push({
                url: element.href,
                title: extractTitleFromUrl(element.href),
            });
        }
    }
    return songs;
}

/* ************************************************************************************* */

function extractTitleFromUrl(url) {
    let decodedUrl = decodeURIComponent(url);
    let urlParts = decodedUrl.split("/");
    let filename = urlParts[urlParts.length - 1];
    let title = filename.replace(".mp3", "").replace(/_/g, " ");
    return title;
}

/* ************************************************************************************* */

var audio = new Audio();
var is_paused = true;
var current_time = 0;
let current_index = 0;

async function main() {
    let songs = await get_songs();
    console.log(songs);
    let change_button = document.getElementById("play_pause");
    if (is_paused) {
        audio.src = songs[current_index].url;
        audio.currentTime = current_time;
        audio.play();
        is_paused = false;
        let target_elements = document.querySelectorAll(".current h3");
        target_elements.forEach((element) => {
            element.textContent = songs[current_index].title;
        });
        document.getElementById("next_play").querySelector("h3").textContent = songs[current_index + 1].title;
        change_button.src = 'Images_Used/image_30.png';
    } 
    else {
        audio.pause();
        is_paused = true;
        current_time = audio.currentTime;
        change_button.src = 'Images_Used/image_29.png';
    }
}
document.getElementById("play_pause").addEventListener("click", main);


/* ************************************************************************************* */

document.getElementById("next").addEventListener("click", () => {
    audio.pause();
    is_paused = true;
    current_time = 0
    current_index = (current_index + 1);
    main();
});

/* ************************************************************************************* */

document.getElementById("previous").addEventListener("click", () => {
    audio.pause();
    is_paused = true;
    current_index = (current_index - 1)
    main();
});

/* ************************************************************************************* */

let hustleLinks = document.getElementsByClassName("hustleLink");
for (let i = 0; i < hustleLinks.length; i++) {
    hustleLinks[i].addEventListener("click", function(event) {
        event.preventDefault();
        let fourth_unhide = document.querySelector('.fourth');
        fourth_unhide.classList.toggle('hide');
    });
}


/* ************************************************************************************* */

const seekbar = document.getElementById('seekbar');
audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    seekbar.style.setProperty('--progress', `${progress}%`);
});
seekbar.addEventListener('input', () => {
    const progress = seekbar.value;
    audio.currentTime = (progress / 100) * audio.duration;
});

/* ************************************************************************************* */

const volumeRange = document.getElementById('volumeRange');
const volumeIcon = document.getElementById('volumeIcon');
audio.addEventListener('volumechange', () => {
    const volume = (audio.volume * 100).toFixed(0);
    volumeRange.value = volume;
    volumeIcon.src = audio.volume < 0.6
        ? "Images_Used/image_35.png"
        : "Images_Used/image_34.png";
    volumeRange.style.setProperty('--volume-progress', `${volume}%`);
});
volumeRange.addEventListener('input', () => {
    const volume = volumeRange.value / 100;
    audio.volume = volume;
    volumeIcon.src = volume < 0.6
        ? "Images_Used/image_35.png"
        : "Images_Used/image_34.png";
    volumeRange.style.setProperty('--volume-progress', `${volume * 100}%`);
});