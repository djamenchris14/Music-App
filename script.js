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
    { title: "Don't Stop Til You Get Enough", artist: "Michael Jackson", src: "Song_1.mp3", albumArt: "Album_art.jpg" },
    { title: "Dirty Diana", artist: "Michael Jackson", src: "Song_2.mp3", albumArt: "Album_art.jpg" },
    { title: "Thriller", artist: "Michael Jackson", src: "Song_3.mp3", albumArt: "Album_art.jpg" }
];

// Playlist object to store playlists
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

// Browse tab - Display songs to browse and allow users to add songs to playlists
browseTab.addEventListener('click', () => {
    mainContent.innerHTML = `
        <h2>Browse Songs</h2>
        <ul id="song-list"></ul>
        <h3>Create Playlist</h3>
        <form id="create-playlist-form">
            <input type="text" id="playlist-name" placeholder="Enter playlist name" required>
            <button type="submit">Create Playlist</button>
        </form>
        <h3>Available Playlists</h3>
        <select id="playlist-select">
            <option value="" disabled selected>Select a playlist</option>
        </select>
    `;

    const songList = document.getElementById('song-list');
    const createPlaylistForm = document.getElementById('create-playlist-form');
    const playlistSelect = document.getElementById('playlist-select');

    // Display songs and allow users to add them to the selected playlist
    songs.forEach((song, index) => {
        const songItem = document.createElement('li');
        songItem.textContent = `${song.title} - ${song.artist}`;
        songItem.addEventListener('click', () => {
            const selectedPlaylist = playlistSelect.value;
            if (selectedPlaylist) {
                playlists[selectedPlaylist].push(song);
                alert(`Added "${song.title}" to ${selectedPlaylist}`);
                updatePlaylistTab(); // Update the Playlists tab whenever a song is added
            } else {
                alert("Please select a playlist first!");
            }
        });
        songList.appendChild(songItem);
    });

    // Handle playlist creation
    createPlaylistForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const playlistName = document.getElementById('playlist-name').value.trim();
        if (playlistName && !playlists[playlistName]) {
            playlists[playlistName] = [];
            updatePlaylistSelect();
            updatePlaylistTab(); // Update the Playlists tab whenever a new playlist is created
            alert(`Playlist "${playlistName}" created!`);
        } else {
            alert("Playlist name is either empty or already exists!");
        }
    });

    // Function to update the playlist dropdown
    function updatePlaylistSelect() {
        playlistSelect.innerHTML = '<option value="" disabled selected>Select a playlist</option>';
        Object.keys(playlists).forEach((playlist) => {
            const option = document.createElement('option');
            option.value = playlist;
            option.textContent = playlist;
            playlistSelect.appendChild(option);
        });
    }

    updatePlaylistSelect();  // Initially populate the select dropdown
});

// Function to update the Playlists tab
function updatePlaylistTab() {
    const playlistNames = Object.keys(playlists);
    
    mainContent.innerHTML = '<h2>Your Playlists</h2>';
    
    if (playlistNames.length === 0) {
        mainContent.innerHTML += '<p>No playlists available. Add some from the Browse tab!</p>';
    } else {
        playlistNames.forEach((playlist) => {
            const playlistDiv = document.createElement('div');
            playlistDiv.innerHTML = `<h3>${playlist}</h3><ul id="${playlist}-songs"></ul>`;
            const playlistSongs = document.getElementById(`${playlist}-songs`);
            
            playlists[playlist].forEach((song) => {
                const songItem = document.createElement('li');
                songItem.textContent = `${song.title} - ${song.artist}`;
                songItem.addEventListener('click', () => {
                    currentSongIndex = songs.indexOf(song);
                    loadSong(songs[currentSongIndex]);
                    audioPlayer.play();
                });
                playlistDiv.appendChild(songItem);
            });
            mainContent.appendChild(playlistDiv);
        });
    }
}

// Playlists tab - Display playlists when the tab is clicked
playlistTab.addEventListener('click', () => {
    updatePlaylistTab();
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
