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
    { title: "Thriller", artist: "Michael Jackson", src: "Song_3.mp3", albumArt: "Album_art.jpg" },
    { title: "Escanor Lion sin of pride", artist: "Pureojuice", src: "Song_4.mp3", albumArt: "escanor.jpg"},
    { title: "Albert gnatta", artist: "4X4 Tout terrain", src: "Song_5.mp3", albumArt: "4X4.jpg"}
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

// Home tab - Update the UI for the Home tab
function showHomeContent() {
    // Load the current song details into the UI
    const currentSong = songs[currentSongIndex]; // Get the current song from the songs array

    mainContent.innerHTML = `
        <!-- Now Playing Section -->
        <div class="now-playing">
            <img src="${currentSong.albumArt}" alt="Album Art" class="album-art">
            <div class="song-info">
                <h1 id="song-title">${currentSong.title}</h1>
                <p id="artist-name">${currentSong.artist}</p>
            </div>
        </div>

        <!-- Playback Controls -->
        <div class="player-controls">
            <button id="prev-track">⏮</button>
            <button id="play-pause">⏯</button>
            <button id="next-track">⏭</button>
            <div class="progress-bar">
                <div class="progress"></div>
            </div>
        </div>
    `;

    // Reattach event listeners for playback controls
    document.getElementById('play-pause').addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.textContent = '⏸';
        } else {
            audioPlayer.pause();
            playPauseBtn.textContent = '⏯';
        }
    });

    document.getElementById('prev-track').addEventListener('click', () => {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
        loadSong(songs[currentSongIndex]);
        showHomeContent(); // Refresh Home content with new song info
        audioPlayer.play();
        playPauseBtn.textContent = '⏸';
    });

    document.getElementById('next-track').addEventListener('click', () => {
        currentSongIndex++;
        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0;
        }
        loadSong(songs[currentSongIndex]);
        showHomeContent(); // Refresh Home content with new song info
        audioPlayer.play();
        playPauseBtn.textContent = '⏸';
    });

    // Reinitialize the progress bar
    const progress = document.querySelector('.progress');
    audioPlayer.addEventListener('timeupdate', () => {
        const { duration, currentTime } = audioPlayer;
        if (!isNaN(duration)) {
            const progressPercent = (currentTime / duration) * 100;
            progress.style.width = `${progressPercent}%`;
        }
    });

    // Handle song end
    audioPlayer.addEventListener('ended', () => {
        document.getElementById('next-track').click();
    });
}

// Call showHomeContent to initialize the Home tab
showHomeContent();


// Function to update Browse tab content
function showBrowseSongsContent() {
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

    // Display songs
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
}

// Function to update Playlist tab content
function updatePlaylistTab() {
    const playlistNames = Object.keys(playlists);
    
    mainContent.innerHTML = '<h2>Your Playlists</h2>';
    
    if (playlistNames.length === 0) {
        mainContent.innerHTML += '<p>No playlists available. Add some from the Browse tab!</p>';
    } else {
        playlistNames.forEach((playlist) => {
            const playlistDiv = document.createElement('div');
            playlistDiv.innerHTML = `<h3>${playlist}</h3><ul id="${playlist}-songs"></ul>`;
            mainContent.appendChild(playlistDiv);
            
            const playlistSongList = document.getElementById(`${playlist}-songs`);
            playlists[playlist].forEach((song) => {
                const songItem = document.createElement('li');
                songItem.textContent = `${song.title} - ${song.artist}`;
                playlistSongList.appendChild(songItem);
            });
        });
    }
}

//// Function to update the UI language based on the selected language
function updateLanguage(language) {
    const translations = {
        en: {
            settings: "Settings",
            darkTheme: "Dark Theme",
            brightness: "Brightness",
            language: "Language",
            selectLanguage: "Select Language",
            browseSongs: "Browse Songs",
            createPlaylist: "Create Playlist",
            availablePlaylists: "Available Playlists",
            yourPlaylists: "Your Playlists",
            noPlaylists: "No playlists available. Add some from the Browse tab!",
            enterPlaylistName: "Enter playlist name",
            selectPlaylist: "Select a playlist",
            homeTab: "Home",
            browseTab: "Browse",
            playlistTab: "Playlists",
            settingsTab: "Settings"
        },
        fr: {
            settings: "Paramètres",
            darkTheme: "Thème Sombre",
            brightness: "Luminosité",
            language: "Langue",
            selectLanguage: "Sélectionner la langue",
            browseSongs: "Parcourir les chansons",
            createPlaylist: "Créer une playlist",
            availablePlaylists: "Playlists Disponibles",
            yourPlaylists: "Vos playlists",
            noPlaylists: "Aucune playlist disponible. Ajoutez-en depuis l'onglet Parcourir !",
            enterPlaylistName: "Entrez le nom de la playlist",
            selectPlaylist: "Sélectionnez une playlist",
            homeTab: "Accueil",
            browseTab: "Parcourir",
            playlistTab: "Playlists",
            settingsTab: "Paramètres"
        },
        es: {
            settings: "Ajustes",
            darkTheme: "Tema Oscuro",
            brightness: "Brillo",
            language: "Idioma",
            selectLanguage: "Seleccionar Idioma",
            browseSongs: "Explorar Canciones",
            createPlaylist: "Crear Lista de Reproducción",
            availablePlaylists: "Listas de Reproducción Disponibles",
            yourPlaylists: "Tus Listas de Reproducción",
            noPlaylists: "No hay listas de reproducción disponibles. ¡Añade algunas desde la pestaña Explorar!",
            enterPlaylistName: "Ingrese el nombre de la lista de reproducción",
            selectPlaylist: "Seleccionar una lista de reproducción",
            homeTab: "Inicio",
            browseTab: "Explorar",
            playlistTab: "Listas de Reproducción",
            settingsTab: "Ajustes"
        },
        // Add more languages as needed
    };

    const lang = translations[language];

    document.querySelector('#settings-title').textContent = lang.settings;
    document.querySelector('#theme-label').textContent = lang.darkTheme;
    document.querySelector('#brightness-label').textContent = lang.brightness;
    document.querySelector('#language-label').textContent = lang.language;
    document.querySelector('#language-select-label').textContent = lang.selectLanguage;

    updateBrowseTabLanguage(language);
    updatePlaylistsTabLanguage(language);
    updateTabsLanguage(language);
}

// Function to handle language change in Browse tab
function updateBrowseTabLanguage(language) {
    const lang = translations[language];
    document.querySelector('.main-content').innerHTML = `
        <h2>${lang.browseSongs}</h2>
        <ul id="song-list"></ul>
        <h3>${lang.createPlaylist}</h3>
        <form id="create-playlist-form">
            <input type="text" id="playlist-name" placeholder="${lang.enterPlaylistName}" required>
            <button type="submit">${lang.createPlaylist}</button>
        </form>
        <h3>${lang.availablePlaylists}</h3>
        <select id="playlist-select">
            <option value="" disabled selected>${lang.selectPlaylist}</option>
        </select>
    `;
}

// Function to handle language change in Playlists tab
function updatePlaylistsTabLanguage(language) {
    const lang = translations[language];
    document.querySelector('.main-content').innerHTML = `
        <h2>${lang.yourPlaylists}</h2>
    `;
    if (Object.keys(playlists).length === 0) {
        document.querySelector('.main-content').innerHTML += `<p>${lang.noPlaylists}</p>`;
    } else {
        Object.keys(playlists).forEach((playlist) => {
            const playlistDiv = document.createElement('div');
            playlistDiv.innerHTML = `<h3>${playlist}</h3><ul id="${playlist}-songs"></ul>`;
            document.querySelector('.main-content').appendChild(playlistDiv);
        });
    }
}

// Update tabs with translations
function updateTabsLanguage(language) {
    const lang = translations[language];
    document.getElementById('home-tab').textContent = lang.homeTab || "Home";
    document.getElementById('browse-tab').textContent = lang.browseTab || "Browse";
    document.getElementById('playlist-tab').textContent = lang.playlistTab || "Playlists";
    document.getElementById('settings-tab').textContent = lang.settingsTab || "Settings";
}

// Settings tab - Display settings
settingsTab.addEventListener('click', () => {
    mainContent.innerHTML = `
        <h2 id="settings-title">Settings</h2>
        <div>
        <p>
            <label for="theme-toggle" id="theme-label">Dark Theme</label>
            <input type="checkbox" id="theme-toggle">
        </div>
        <div>
            <label for="brightness-slider" id="brightness-label">Brightness</label>
            <input type="range" id="brightness-slider" min="50" max="150" value="100">
        </div>
        <div>
            <label for="language-select" id="language-label">Language</label>
            <select id="language-select">
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <!-- Add more languages here -->
            </select>
        </div>
         <div>
            <label for="volume-slider" id="volume-label">Volume</label>
            <input type="range" id="volume-slider" min="0" max="1" step="0.01" value="1">
        </div></p>
    `;

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-theme');
    });

    const brightnessSlider = document.getElementById('brightness-slider');
    brightnessSlider.addEventListener('input', (event) => {
        const brightnessValue = event.target.value;
        document.body.style.filter = `brightness(${brightnessValue}%)`;
    });

    const languageSelect = document.getElementById('language-select');
    languageSelect.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        updateLanguage(selectedLanguage);
    });

    // Add event listener for the volume slider
    const volumeSlider = document.getElementById('volume-slider');
    volumeSlider.addEventListener('input', (event) => {
        audioPlayer.volume = event.target.value; // Set volume of the audio player
    });
});


// Initial display of the Home tab content
showHomeContent();

// Event listeners for tab navigation
homeTab.addEventListener('click', () => {
    showHomeContent();
});

browseTab.addEventListener('click', () => {
    showBrowseSongsContent();
});

playlistTab.addEventListener('click', () => {
    updatePlaylistTab();
});

settingsTab.addEventListener('click', () => {
    showSettingsContent();
});
