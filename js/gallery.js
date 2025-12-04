document.addEventListener('DOMContentLoaded', function () {
  const viewerEmpty = document.getElementById('viewerEmpty');
  const viewerContent = document.getElementById('viewerContent');
  const currentImage = document.getElementById('currentImage');
  const imageDescription = document.getElementById('imageDescription');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const imageIndicator = document.getElementById('imageIndicator');
  const thumbnailGrid = document.getElementById('thumbnailGrid');

  // Lightbox elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxDescription = document.getElementById('lightboxDescription');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  const STORAGE_KEY = 'galleryVisualArt';
  
  // Hardcoded images - edit this array to add your own images
  const DEFAULT_IMAGES = [
    { id: 1, dataUrl: 'assets/visual_art/1.png', description: '3D model of my OC' },
    { id: 2, dataUrl: 'assets/visual_art/2.png', description: 'Quick clothes studies' },
    { id: 3, dataUrl: 'assets/visual_art/3.png', description: 'Random fragment of my sketchbook' },
    { id: 4, dataUrl: 'assets/visual_art/4.png', description: 'Random fragment of my sketchbook' },
    { id: 5, dataUrl: 'assets/visual_art/5.png', description: 'Random fragment of my sketchbook' },
    { id: 6, dataUrl: 'assets/visual_art/6.png', description: 'Random fragment of my sketchbook'},
    { id: 7, dataUrl: 'assets/visual_art/7.png', description: 'Random fragment of my sketchbook' },
    { id: 8, dataUrl: 'assets/visual_art/8.png', description: 'Random fragment of my sketchbook' },
    { id: 9, dataUrl: 'assets/visual_art/9.png', description: 'Random fragment of my sketchbook' },
    { id: 10, dataUrl: 'assets/visual_art/10.png', description: 'Digital WIP of my OC' },
    { id: 11, dataUrl: 'assets/visual_art/11.png', description: 'Random fragment of my sketchbook' },
    { id: 12, dataUrl: 'assets/visual_art/12.png', description: 'Sketches of Terry Davis, The smartest programmer that has ever lived' },
    { id: 13, dataUrl: 'assets/visual_art/13.png', description: 'Digital character concept' },
    { id: 14, dataUrl: 'assets/visual_art/14.png', description: 'Random fragment of my sketchbook' },
    { id: 15, dataUrl: 'assets/visual_art/15.png', description: 'Random fragment of my sketchbook' },
    { id: 16, dataUrl: 'assets/visual_art/16.png', description: 'Random fragment of my sketchbook' },
    { id: 17, dataUrl: 'assets/visual_art/17.png', description: 'Random fragment of my sketchbook' },
    { id: 18, dataUrl: 'assets/visual_art/18.png', description: 'Digital character concept' },
    { id: 19, dataUrl: 'assets/visual_art/19.png', description: 'Random fragment of my sketchbook' },
    { id: 20, dataUrl: 'assets/visual_art/20.png', description: 'Commisioned work' },
    { id: 21, dataUrl: 'assets/visual_art/21.png', description: 'Random fragment of my sketchbook' }
  ];

  let images = [];
  let currentIndex = 0;

  // Load images from localStorage or use defaults
  function loadImages() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        images = JSON.parse(stored);
      } else {
        images = DEFAULT_IMAGES.map(img => ({...img}));
        saveImages();
      }
    } catch (e) {
      console.error('Failed to load images', e);
      images = DEFAULT_IMAGES.map(img => ({...img}));
    }
    updateViewer();
  }

  // Save images to localStorage
  function saveImages() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    } catch (e) {
      console.error('Failed to save images', e);
    }
  }

  // Update viewer display
  function updateViewer() {
    if (images.length === 0) {
      viewerEmpty.style.display = 'block';
      viewerContent.style.display = 'none';
      return;
    }

    viewerEmpty.style.display = 'none';
    viewerContent.style.display = 'flex';

    // Clamp current index
    currentIndex = Math.max(0, Math.min(currentIndex, images.length - 1));

    // Update image
    const img = images[currentIndex];
    currentImage.src = img.dataUrl;
    currentImage.alt = img.description;
    imageDescription.textContent = img.description;

    // Update indicator with description
    updateIndicator();
    // Update description text
    if (imageDescription) imageDescription.textContent = img.description || '';
    // Update thumbnails active state
    renderThumbnailsActive();
  }

  // Update indicator dots with description label
  function updateIndicator() {
    const dots = imageIndicator.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
      dot.title = images[idx].description;
    });
  }

  // Render indicator dots
  function renderIndicator() {
    imageIndicator.innerHTML = '';
    images.forEach((img, idx) => {
      const dot = document.createElement('span');
      dot.className = 'dot';
      dot.title = img.description;
      if (idx === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => {
        currentIndex = idx;
        updateViewer();
      });
      imageIndicator.appendChild(dot);
    });
  }

  function renderThumbnailsActive() {
    if (!thumbnailGrid) return;
    const thumbs = thumbnailGrid.querySelectorAll('img');
    thumbs.forEach((el, idx) => {
      el.classList.toggle('active', idx === currentIndex);
    });
  }

  // Navigation
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateViewer();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateViewer();
  });

  // Lightbox functionality
  function openLightbox(imageIndex) {
    if (lightboxModal && lightboxImage && lightboxDescription) {
      currentIndex = imageIndex;
      const image = images[currentIndex];
      lightboxImage.src = image.dataUrl;
      lightboxDescription.textContent = image.description;
      lightboxModal.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Prevent background scroll
      updateLightboxNavigation();
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.style.display = 'none';
      document.body.style.overflow = 'auto'; // Restore scroll
    }
  }

  function updateLightboxNavigation() {
    if (lightboxPrev && lightboxNext) {
      lightboxPrev.disabled = images.length <= 1;
      lightboxNext.disabled = images.length <= 1;
    }
  }

  // Lightbox event listeners
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      const image = images[currentIndex];
      lightboxImage.src = image.dataUrl;
      lightboxDescription.textContent = image.description;
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % images.length;
      const image = images[currentIndex];
      lightboxImage.src = image.dataUrl;
      lightboxDescription.textContent = image.description;
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (lightboxModal && lightboxModal.style.display === 'block') {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        lightboxPrev.click();
      } else if (e.key === 'ArrowRight') {
        lightboxNext.click();
      }
    }
  });

  // Function to jump to specific image by ID (for deep linking)
  function jumpToImage(imageId) {
    const imageIndex = images.findIndex(img => img.id === imageId);
    if (imageIndex !== -1) {
      currentIndex = imageIndex;
      updateViewer();
    }
  }

  // Update thumbnail click handler to jump to viewer (not lightbox)
  function renderThumbnails() {
    if (!thumbnailGrid) {
      console.error('thumbnailGrid element not found');
      return;
    }
    console.log('Rendering', images.length, 'thumbnails');
    thumbnailGrid.innerHTML = '';
    images.forEach((image, idx) => {
      const t = document.createElement('img');
      t.src = image.dataUrl;
      t.alt = image.description;
      t.className = 'thumb';
      if (idx === currentIndex) t.classList.add('active');
      t.addEventListener('click', () => {
        currentIndex = idx;
        updateViewer(); // Jump to viewer instead of opening lightbox
      });
      thumbnailGrid.appendChild(t);
    });
    console.log('Thumbnails rendered:', thumbnailGrid.children.length);
  }

  // Update main image click to open lightbox
  if (currentImage) {
    currentImage.addEventListener('click', () => {
      openLightbox(currentIndex);
    });
    currentImage.style.cursor = 'zoom-in';
  }

  // Initial load
  loadImages();
  renderIndicator();
  renderThumbnails();

  // Expose API for deep linking
  window.gallery = {
    jumpToImage: jumpToImage,
    getCurrentImage: () => images[currentIndex],
    getImages: () => images,
    openLightbox: openLightbox
  };
});


