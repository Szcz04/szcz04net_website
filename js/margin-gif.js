document.addEventListener('DOMContentLoaded', function () {
  const GIF_SRC = 'assets/szcz04.gif';
  let el = document.getElementById('margin-gif');
  if (!el) {
    el = document.createElement('img');
    el.id = 'margin-gif';
    el.className = 'fixed-margin-gif';
    el.src = GIF_SRC;
    el.alt = 'decor';
    document.body.appendChild(el);
  }

  // restore saved position (if any)
  const STORAGE_KEY = 'marginGifPos';
  function restoreSaved() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const obj = JSON.parse(raw);
      if (obj && typeof obj.left === 'number' && typeof obj.top === 'number') {
        el.style.left = obj.left + 'px';
        el.style.top = obj.top + 'px';
        return true;
      }
    } catch (e) {
      console.warn('restoreSaved error', e);
    }
    return false;
  }

  function place() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const contentHalf = 550; // half of the 1100px content width used in layout
    const baseLeft = Math.round(vw / 2 - contentHalf - 60); // base left offset into the margin
    const leftRand = baseLeft + Math.round((Math.random() * 80) - 40); // jitter +-40px
    const minTop = 80;
    const maxTop = Math.max(minTop + 20, vh - 160);
    const topRand = Math.round(minTop + Math.random() * (maxTop - minTop));

    // if user has previously dragged and saved position, restore it instead of randomizing
    if (restoreSaved()) return;

    el.style.left = leftRand + 'px';
    el.style.top = topRand + 'px';
  }

  // initial placement
  place();

  // reposition on resize (debounced)
  let t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(place, 120);
  });

  // --- Drag & drop support ---
  let dragging = false;
  let pointerId = null;
  let offsetX = 0;
  let offsetY = 0;

  function savePosition() {
    try {
      const left = parseInt(el.style.left, 10) || 0;
      const top = parseInt(el.style.top, 10) || 0;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ left, top }));
    } catch (e) {
      console.warn('savePosition error', e);
    }
  }

  el.addEventListener('pointerdown', function (ev) {
    ev.preventDefault();
    el.setPointerCapture(ev.pointerId);
    pointerId = ev.pointerId;
    dragging = true;
    el.classList.add('dragging');
    // compute offset between pointer and image top-left
    const rect = el.getBoundingClientRect();
    offsetX = ev.clientX - rect.left;
    offsetY = ev.clientY - rect.top;
  });

  window.addEventListener('pointermove', function (ev) {
    if (!dragging || ev.pointerId !== pointerId) return;
    ev.preventDefault();
    const left = Math.round(ev.clientX - offsetX);
    const top = Math.round(ev.clientY - offsetY);
    el.style.left = left + 'px';
    el.style.top = top + 'px';
  });

  window.addEventListener('pointerup', function (ev) {
    if (!dragging || ev.pointerId !== pointerId) return;
    try { el.releasePointerCapture(pointerId); } catch (e) {}
    dragging = false;
    pointerId = null;
    el.classList.remove('dragging');
    savePosition();
  });

  // double-click resets saved position and randomizes next placement
  el.addEventListener('dblclick', function () {
    localStorage.removeItem(STORAGE_KEY);
    place();
  });
});
