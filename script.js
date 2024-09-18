// Select relevant DOM elements
const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause');
const prevTrackBtn = document.getElementById('prev-track');
const nextTrackBtn = document.getElementById('next-track');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const albumArt = document.querySelector('.album-art');
const progressBar = document.querySelector('.progress');

// Navigation tab elements
const homeTab = document.getElementById('home-tab');
const browseTab = document.getElementById('browse-tab');
const playlistTab = document.getElementById('playlist-tab');
const settingsTab = document.getElementById('settings-tab');
const mainContent = document.querySelector('.main-content');

// Sample song data
const songs = [
    { title: "Don't Stop Til You Get Enough", artist: "Micheal Jackson", src: "Song_1.mp3", albumArt: "Album_art.jpg" },
    { title: "Dirty Diana", artist: "Micheal Jackson", src: "Song_2.mp3", albumArt: "Album_art.jpg" },
    { title: "Thriller", artist: "Micheal Jackson", src: "Song_3.mp3", albumArt: "Album_art.jpg" }
];

// Playlist object
let playlists = {};

// Track the current song index
let currentSongIndex = 0;

// Load the initial song
loadSong(songs[currentSongIndex]);

// Function to load a song's data
function loadSong(song) {
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    albumArt.src = song.albumArt;
    audioPlayer.src = song.src;
    audioPlayer.load();
}

// Play or pause the song
playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.textContent = '⏸';
    } else {
        audioPlayer.pause();
        playPauseBtn.textContent = '⏯';
    }
});

// Play the previous track
prevTrackBtn.addEventListener('click', () => {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(songs[currentSongIndex]);
    audioPlayer.play();
    playPauseBtn.textContent = '⏸';
});

// Play the next track
nextTrackBtn.addEventListener('click', () => {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0;
    }
    loadSong(songs[currentSongIndex]);
    audioPlayer.play();
    playPauseBtn.textContent = '⏸';
});

// Update the progress bar as the song plays
audioPlayer.addEventListener('timeupdate', () => {
    const { duration, currentTime } = audioPlayer;
    if (!isNaN(duration)) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }
});

// When the song ends, play the next track
audioPlayer.addEventListener('ended', () => {
    nextTrackBtn.click();
});

// Home tab - Display welcome message
homeTab.addEventListener('click', () => {
    mainContent.innerHTML = `
        <div class="now-playing">
            <img src="Album_art.jpg" alt="Album Art" class="album-art">
            <div class="song-info">
                <h1 id="song-title">Song Title</h1>
                <p id="artist-name">Artist Name</p>
            </div>
        </div>
    `;
    loadSong(songs[currentSongIndex]);
});

// Browse tab - Display songs to browse
browseTab.addEventListener('click', () => {
    mainContent.innerHTML = '<h2>Browse Songs</h2><ul id="song-list"></ul>';
    const songList = document.getElementById('song-list');
    
    songs.forEach((song, index) => {
        const songItem = document.createElement('li');
        songItem.textContent = `${song.title} - ${song.artist}`;
        songItem.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(songs[currentSongIndex]);
            audioPlayer.play();
        });
        songList.appendChild(songItem);
    });
});

// Playlists tab - Display playlists
playlistTab.addEventListener('click', () => {
    mainContent.innerHTML = '<h2>Your Playlists</h2>';
    const playlistNames = Object.keys(playlists);
    
    if (playlistNames.length === 0) {
        mainContent.innerHTML += '<p>No playlists available. Add some from Browse tab!</p>';
    } else {
        playlistNames.forEach((playlist) => {
            const playlistDiv = document.createElement('div');
            playlistDiv.innerHTML = `<h3>${playlist}</h3><ul id="${playlist}-songs"></ul>`;
            const playlistSongs = document.getElementById(`${playlist}-songs`);
            
            playlists[playlist].forEach((song, index) => {
                const songItem = document.createElement('li');
                songItem.textContent = `${song.title} - ${song.artist}`;
                songItem.addEventListener('click', () => {
                    currentSongIndex = songs.indexOf(song);
                    loadSong(songs[currentSongIndex]);
                    audioPlayer.play();
                });
                playlistSongs.appendChild(songItem);
            });
            mainContent.appendChild(playlistDiv);
        });
    }
});

// Settings tab - Display settings
settingsTab.addEventListener('click', () => {
    mainContent.innerHTML = `
        <h2>Settings</h2>
        <div>
            <label for="theme-toggle">Dark Theme</label>
            <input type="checkbox" id="theme-toggle">
        </div>
    `;

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-theme');
    });
});
