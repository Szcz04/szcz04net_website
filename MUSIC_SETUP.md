# 🎵 Music Player Setup Guide

The music player in the gallery section allows you to showcase MP3 projects with descriptions, similar to the visual art gallery.

## Quick Start

### 1. Add Your MP3 Files
Place your music files in the `assets/music/` folder:
```
assets/music/
├── 1.mp3
├── 2.mp3
├── 3.mp3
└── (add more as needed)
```

### 2. Update Default Tracks
Edit `js/music-player.js` and modify the `DEFAULT_TRACKS` array (around line 13):

```javascript
const DEFAULT_TRACKS = [
  { 
    id: 1, 
    url: 'assets/music/1.mp3', 
    title: 'My First Track', 
    description: 'A project I worked on in 2025' 
  },
  { 
    id: 2, 
    url: 'assets/music/2.mp3', 
    title: 'Second Project', 
    description: 'Electronic music experiment' 
  },
  // Add more tracks here
];
```

### Key Properties:
- **id**: Unique number (1, 2, 3...)
- **url**: Path to your MP3 file (relative to HTML root)
- **title**: Track name displayed in player
- **description**: Short description shown above player

## How It Works

### File Structure
```
gallery.html          → Music section markup
js/music-player.js    → Audio player logic
css/style.css         → Music player styling
assets/music/         → Your MP3 files go here
```

### Features
- ✅ Native HTML5 audio player with controls
- ✅ Clickable track list with highlighting
- ✅ Auto-advances to next track when finished
- ✅ Shows current track title and description
- ✅ localStorage persistence (remembers where you stopped)
- ✅ Fully responsive (desktop, tablet, mobile)

### Storage
- **localStorage key**: `galleryMusic`
- Data persists per browser/domain
- Clearing browser cache clears saved tracks

## Customization

### Change Player Appearance
Update CSS classes in `style.css`:
- `.music-player` - Main container
- `.track-list` - Track list styling
- `.track-item` - Individual track styling
- `.track-item.active` - Currently playing track

### Modify Track List Height
Edit `.track-items` max-height in CSS (currently 300px on desktop):
```css
.track-items {
  max-height: 300px;  /* Change this value */
  overflow-y: auto;
}
```

## Troubleshooting

### Audio doesn't play
1. Check file path in DEFAULT_TRACKS matches actual file location
2. Verify MP3 files are in `assets/music/` folder
3. Ensure server is running (use `python -m http.server 8000`)
4. Check browser console for errors (F12)

### Track list not showing
1. Make sure DEFAULT_TRACKS array is not empty
2. Verify `#trackItems` element exists in gallery.html
3. Check browser console for JavaScript errors

### Changes not appearing
- Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear localStorage in browser DevTools if needed

## Next Steps

- Add more tracks by following the pattern in DEFAULT_TRACKS
- Customize track descriptions
- Experiment with the Technology section similarly
- Consider adding a form to upload tracks dynamically (requires backend)
