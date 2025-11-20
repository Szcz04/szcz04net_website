document.addEventListener('DOMContentLoaded', function () {
  const playerEmpty = document.getElementById('playerEmpty');
  const playerContent = document.getElementById('playerContent');
  const audioPlayer = document.getElementById('audioPlayer');
  const trackTitle = document.getElementById('trackTitle');
  const trackDescription = document.getElementById('trackDescription');
  const trackItems = document.getElementById('trackItems');
  const prevTrackBtn = document.getElementById('prevTrackBtn');
  const nextTrackBtn = document.getElementById('nextTrackBtn');

  const STORAGE_KEY = 'galleryMusic';

  // Default music tracks - edit this array to add your own mp3 files
  const DEFAULT_TRACKS = [
    { id: 1, url: 'assets/music/1.mp3', title: 'Chase', description: "Chase scene soundtrack for indie game project" },
    { id: 2, url: 'assets/music/2.mp3', title: 'Cozy grassland', description: "Peaceful ambient track for indie game project" },
    { id: 3, url: 'assets/music/3.mp3', title: 'Goofy', description: "Playful and whimsical melody for indie game project" },
    { id: 4, url: 'assets/music/4.mp3', title: 'Bubbles', description: "Ethereal underwater-themed soundtrack for indie game project" },
    { id: 5, url: 'assets/music/5.mp3', title: 'Warrior cats', description: "Mysterious theme for indie game project" },
    { id: 6, url: 'assets/music/6.mp3', title: 'Alien shooter remix', description: "Beat with melody sampled from main theme of 'Alien shooter' game" },
    { id: 7, url: 'assets/music/7.mp3', title: 'Lurking', description: "Uneasiness inducing ambient beat" },
    { id: 8, url: 'assets/music/8.mp3', title: 'Why am i hearing myself', description: "Retro themed beat" },
  ];

  let tracks = [];
  let currentIndex = 0;

  // Load tracks from localStorage or use defaults
  function loadTracks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        tracks = JSON.parse(stored);
        // Always update with latest DEFAULT_TRACKS to get new descriptions
        if (tracks.length !== DEFAULT_TRACKS.length || 
            JSON.stringify(tracks) !== JSON.stringify(DEFAULT_TRACKS)) {
          tracks = DEFAULT_TRACKS.map(track => ({...track}));
          saveTracks();
        }
      } else {
        tracks = DEFAULT_TRACKS.map(track => ({...track}));
        saveTracks();
      }
    } catch (e) {
      console.error('Failed to load tracks', e);
      tracks = DEFAULT_TRACKS.map(track => ({...track}));
    }
    updatePlayer();
  }

  // Save tracks to localStorage
  function saveTracks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
    } catch (e) {
      console.error('Failed to save tracks', e);
    }
  }

  // Update player display
  function updatePlayer() {
    if (tracks.length === 0) {
      playerEmpty.style.display = 'block';
      playerContent.style.display = 'none';
      return;
    }

    playerEmpty.style.display = 'none';
    playerContent.style.display = 'block';

    // Clamp current index
    currentIndex = Math.max(0, Math.min(currentIndex, tracks.length - 1));

    // Update audio source and info
    const track = tracks[currentIndex];
    audioPlayer.src = track.url;
    trackTitle.textContent = track.title;
    trackDescription.textContent = track.description;

    // Update track list highlighting and descriptions
    renderTrackListActive();
  }

  // Render track list
  function renderTrackList() {
    if (!trackItems) return;
    trackItems.innerHTML = '';
    tracks.forEach((track, idx) => {
      const item = document.createElement('div');
      item.className = 'track-item';
      if (idx === currentIndex) item.classList.add('active');
      item.innerHTML = `
        <div class="track-item-number">${idx + 1}</div>
        <div class="track-item-info">
          <div class="track-item-title">${track.title}</div>
          <div class="track-item-desc">${idx === currentIndex ? track.description : ''}</div>
        </div>
      `;
      item.addEventListener('click', () => {
        currentIndex = idx;
        updatePlayer();
      });
      trackItems.appendChild(item);
    });
  }

  // Update track list active state
  function renderTrackListActive() {
    if (!trackItems) return;
    const items = trackItems.querySelectorAll('.track-item');
    items.forEach((item, idx) => {
      item.classList.toggle('active', idx === currentIndex);
      // Update description visibility - only show for active track
      const descEl = item.querySelector('.track-item-desc');
      if (descEl) {
        descEl.textContent = idx === currentIndex ? tracks[idx].description : '';
      }
    });
  }

  // Navigation to next track when current ends
  audioPlayer.addEventListener('ended', () => {
    currentIndex = (currentIndex + 1) % tracks.length;
    updatePlayer();
  });

  // Previous track button
  if (prevTrackBtn) {
    prevTrackBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
      updatePlayer();
    });
  }

  // Function to jump to specific track by ID (for deep linking)
  function jumpToTrack(trackId) {
    const trackIndex = tracks.findIndex(track => track.id === trackId);
    if (trackIndex !== -1) {
      currentIndex = trackIndex;
      updatePlayer();
    }
  }

  // Next track button
  if (nextTrackBtn) {
    nextTrackBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % tracks.length;
      updatePlayer();
    });
  }

  // Initial load
  loadTracks();
  renderTrackList();

  // Expose API for deep linking
  window.musicPlayer = {
    jumpToTrack: jumpToTrack,
    getCurrentTrack: () => tracks[currentIndex],
    getTracks: () => tracks
  };
});
