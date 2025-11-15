# AI Coding Agent Instructions for szcz04net_website

## Project Overview
Static personal portfolio website with a retro terminal aesthetic (green-on-black theme). Built with vanilla HTML/CSS/JavaScript. The site features a multi-page layout, blog section, gallery viewer with image management, and an interactive draggable GIF element.

## Architecture & Key Components

### Page Structure
- **Single-page layout**: Fixed 1100px max-width centered content (see `.content` in `css/style.css`)
- **All pages share**: Navigation header with skewed 3D-effect tab buttons, margin GIF decoration, shared stylesheet
- **Active page indicator**: Uses `.active` class on nav links; set via `class="active"` directly in HTML per page
- **Page types**:
  - `index.html`: Blog feed (expandable with more `.blog-post` articles)
  - `about.html`, `contact.html`: Single-column content (use `content.single` class)
  - `gallery.html`: Grid layout with sidebar tabs for subsections (Visual Art, Technology, Music)

### Styling System (retro terminal green theme)
- **CSS variables** (`style.css` lines 2-6): `--bg`, `--accent` (#185326), `--text`, `--muted`
- **Font**: Monospace ("Courier New", Monaco) across entire site
- **3D navigation effects**: Tab buttons use `skewY(-8deg)` transform, drop-shadow, and pseudo-elements (::before for side face, ::after for underline)
- **Layout utilities**: `.content.single` (block), `.content.gallery` (flex wrap), `.left` (main content), `.right` (sidebar - currently commented out)

### JavaScript Modules

#### `margin-gif.js` (110 lines)
- **Purpose**: Manages a draggable, persistent decorative GIF positioned in the page margin
- **Key functions**:
  - `place()`: Calculates viewport-aware position; base left = viewport center minus half content width (550px) minus 60px offset, with ±40px jitter
  - `restoreSaved()`: Loads position from localStorage (key: `marginGifPos`)
  - **Drag support**: Pointer events with `pointerId` tracking; saves position to localStorage on drop
  - **Responsive**: Re-positions on window resize (debounced 120ms)
- **Data storage**: Object `{left, top}` in localStorage

#### `gallery.js` (164 lines)
- **Purpose**: Image gallery viewer with lightbox, thumbnails, and browser-local persistence
- **Data model**: Array of image objects `{id, dataUrl, description}`; defaults in `DEFAULT_IMAGES` (lines 12-41)
- **localStorage key**: `galleryVisualArt`
- **DOM structure**:
  - `#viewerEmpty` (initial state), `#viewerContent` (image view)
  - `#currentImage`, `#imageDescription`, `#prevBtn`, `#nextBtn`, `#imageIndicator`, `#thumbnailGrid`
- **Key features**:
  - Prev/Next navigation with current index tracking
  - Click thumbnails to jump to image
  - Keyboard support (arrow keys, inferred from `imageIndicator`)
  - Image data can be serialized/deserialized to JSON for persistence
- **To add images**: Edit `DEFAULT_IMAGES` array with new `{id, dataUrl, description}` objects; path is relative to HTML root

### Navigation & Client-Side Routing
- **Gallery subsections**: Visual Art (active by default), Technology, Music—toggled via `.sidebar-tab` buttons in `gallery.html` (lines 87-102)
- **Tab switching**: Data-driven (`data-section` attribute) with click handlers; shows/hides corresponding `.gallery-section` divs
- **Pattern**: Minimal approach; each section marked `style="display:none"` initially

## Development Patterns

### Adding New Content
- **Blog posts**: Add new `.blog-post` article block to `index.html` `.left` section; follow existing structure with `.post-header`, `.post-title`, `<time class="post-date">`, `.post-content`
- **Gallery images**: Modify `DEFAULT_IMAGES` in `gallery.js`; add PNG files to `assets/visual_art/` with numeric names (1.png, 2.png, etc.)
- **Gallery subsections**: Uncomment or copy existing subsection divs in `gallery.html` (Technology, Music patterns already in place); add corresponding sidebar button

### Color & Theming
- All colors defined as CSS variables (`:root`); adjust only these 4 variables for full theme change
- Accent color used for borders, text, 3D effects; text color for primary content
- Dark backgrounds use rgba overlays for layering (e.g., `.blog-post` background: `rgba(24, 83, 38, 0.08)`)

### Responsive Design
- **Mobile-first breakpoint handling**: Content width and margin calculations in `margin-gif.js` use `clientWidth`/`innerWidth` viewport checks
- **Flex layout**: Navigation and gallery grids use flexbox; content layout uses `.content` with gap spacing
- **Grid gallery**: `grid-template-columns: repeat(auto-fit, minmax(140px, 1fr))` for flexible thumbnail sizing
- **Media queries**: Three breakpoints implemented:
  - `@media(max-width:768px)`: Tablet/large mobile—navigation scaled to 100px width, font sizes reduced 10-20%, margins/padding halved
  - `@media(max-width:480px)`: Small mobile—navigation scaled to 70px, 3D pseudo-elements hidden, font sizes further reduced 10-15%, margins/padding reduced further
- **Margin GIF**: Hidden on screens `<768px` to prevent layout conflicts; visibility controlled in `margin-gif.js` `place()` function

### Accessibility
- Semantic HTML: `<header>`, `<main>`, `<section>`, `<aside>`, `<article>`, `<time>`
- ARIA labels on nav links and buttons: `aria-label` attributes for icon-based navigation
- Alt text on all images

## Storage & Persistence
- **localStorage used for**:
  - Margin GIF position: `marginGifPos` key → position object
  - Gallery images: `galleryVisualArt` key → JSON array of images
- **No backend**: Data persists per browser/domain; clearing cache wipes saved state
- **Fallback behavior**: Gallery loads `DEFAULT_IMAGES` if no stored data found

## Common Tasks

### Updating Navigation
- Edit all `.html` files' `<nav class="topnav">` to keep consistent
- Set `class="active"` on the current page's corresponding link (per-page)
- Image buttons (`<img>` tags) styled in CSS; currently SVG support also present but unused

### Fixing 3D Navigation Effects
- Skew angle: `skewY(-8deg)` (affects both SVG/img and pseudo-elements)
- Drop shadow: `filter: drop-shadow(2px 2px 0 rgba(0,0,0,0.65))`
- Underline animation: Duration 360ms with cubic-bezier easing; transforms on `.topnav a::after`

### Debugging Draggable GIF
- Check localStorage `marginGifPos` in browser DevTools
- Test viewport size calculations in `place()` function; ensure `contentHalf` aligns with actual CSS max-width (1100px)
- Pointer events may conflict if other elements capture events; check z-index and pointer-events values

## File Organization
```
.
├── index.html, about.html, gallery.html, contact.html  # Page templates
├── css/style.css                                          # All styling (422 lines)
├── js/
│   ├── margin-gif.js                                      # Draggable margin decoration
│   └── gallery.js                                         # Image gallery logic
└── assets/
    ├── *.png, *.gif, ico.ico                              # Images for nav, margin, favicon
    └── visual_art/                                        # Gallery image folder (1.png–21.png)
```

## Important Notes
- **No build step**: Static site; changes to HTML/CSS/JS take effect immediately on refresh
- **No external dependencies**: Vanilla JS only; no frameworks or libraries
- **IE/Legacy browser support**: Uses modern features (pointer events, CSS grid); not tested on older browsers
- **Performance**: GIF positioning debounced; gallery uses in-memory array (no network calls)
