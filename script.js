// Select relevant DOM elements
const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause');
const prevTrackBtn = document.getElementById('prev-track');
const nextTrackBtn = document.getElementById('next-track');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const albumArt = document.querySelector('.album-art');
const progressBar = document.querySelector('.progress');
const browseTab = document.getElementById('browse-tab');
const playlistTab = document.getElementById('playlist-tab');
const settingsTab = document.getElementById('settings-tab');
const mainContent = document.querySelector('.main-content');

// Sample song data (title, artist, file source, and album art)
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

// Function to load a song's data (title, artist, album art, and audio source)
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
        playPauseBtn.textContent = '⏸'; // Switch to pause icon
    } else {
        audioPlayer.pause();
        playPauseBtn.textContent = '⏯'; // Switch back to play icon
    }
});

// Play the previous track
prevTrackBtn.addEventListener('click', () => {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1; // Loop to last song if at the first song
    }
    loadSong(songs[currentSongIndex]);
    audioPlayer.play();
    playPauseBtn.textContent = '⏸'; // Set to pause icon when song plays
});

// Play the next track
nextTrackBtn.addEventListener('click', () => {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0; // Loop to first song if at the last song
    }
    loadSong(songs[currentSongIndex]);
    audioPlayer.play();
    playPauseBtn.textContent = '⏸'; // Set to pause icon when song plays
});

/*
// Update the progress bar as the song plays
audioPlayer.addEventListener('timeupdate', () => {
    const { duration, currentTime } = audioPlayer;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
});
*/

// Update the progress bar as the song plays
audioPlayer.addEventListener('timeupdate', () => {
    const { duration, currentTime } = audioPlayer;
    
    // Check if the duration is valid (not NaN)
    if (!isNaN(duration)) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }
});



// When the song ends, automatically play the next track
audioPlayer.addEventListener('ended', () => {
    nextTrackBtn.click(); // Simulate clicking the next track button
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
            playPauseBtn.textContent = '⏸';
        });
        songList.appendChild(songItem);
    });
});

// Playlist tab - Create and manage playlists
playlistTab.addEventListener('click', () => {
    mainContent.innerHTML = `
        <h2>Playlists</h2>
        <input type="text" id="new-playlist-name" placeholder="New Playlist Name">
        <button id="create-playlist-btn">Create Playlist</button>
        <div id="playlists-container"></div>
    `;
    
    const createPlaylistBtn = document.getElementById('create-playlist-btn');
    const playlistsContainer = document.getElementById('playlists-container');
    
    createPlaylistBtn.addEventListener('click', () => {
        const playlistName = document.getElementById('new-playlist-name').value;
        if (playlistName && !playlists[playlistName]) {
            playlists[playlistName] = [];
            const playlistDiv = document.createElement('div');
            playlistDiv.classList.add('playlist');
            playlistDiv.innerHTML = `<h3>${playlistName}</h3><ul id="playlist-${playlistName}"></ul><button class="add-song-btn">Add Songs</button>`;
            playlistsContainer.appendChild(playlistDiv);
            
            const addSongBtn = playlistDiv.querySelector('.add-song-btn');
            addSongBtn.addEventListener('click', () => {
                displayAddSongsToPlaylist(playlistName);
            });
        }
    });
});

// Function to display songs to add to a playlist
function displayAddSongsToPlaylist(playlistName) {
    mainContent.innerHTML = `<h2>Add Songs to ${playlistName}</h2><ul id="add-song-list"></ul>`;
    const addSongList = document.getElementById('add-song-list');
    
    songs.forEach((song, index) => {
        const songItem = document.createElement('li');
        songItem.textContent = `${song.title} - ${song.artist}`;
        songItem.addEventListener('click', () => {
            playlists[playlistName].push(songs[index]);
            updatePlaylistUI(playlistName);
            playlistTab.click();
        });
        addSongList.appendChild(songItem);
    });
}

// Function to update playlist UI
function updatePlaylistUI(playlistName) {
    const playlistUl = document.getElementById(`playlist-${playlistName}`);
    playlistUl.innerHTML = '';
    
    playlists[playlistName].forEach((song, index) => {
        const playlistSongItem = document.createElement('li');
        playlistSongItem.textContent = `${song.title} - ${song.artist}`;
        playlistSongItem.addEventListener('click', () => {
            currentSongIndex = songs.indexOf(song);
            loadSong(songs[currentSongIndex]);
            audioPlayer.play();
            playPauseBtn.textContent = '⏸';
        });
        
        const removeSongBtn = document.createElement('button');
        removeSongBtn.textContent = 'Remove';
        removeSongBtn.addEventListener('click', () => {
            playlists[playlistName].splice(index, 1);
            updatePlaylistUI(playlistName);
        });
        
        playlistSongItem.appendChild(removeSongBtn);
        playlistUl.appendChild(playlistSongItem);
    });
}

// Settings tab - Theme toggler
settingsTab.addEventListener('click', () => {
    mainContent.innerHTML = `
        <h2>Settings</h2>
        <button id="toggle-theme-btn">Toggle Dark/Light Theme</button>
    `;
    
    const toggleThemeBtn = document.getElementById('toggle-theme-btn');
    toggleThemeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
    });
});


