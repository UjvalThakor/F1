/**
 * MAX VERSTAPPEN — MASONRY GALLERY & LIGHTBOX MODAL
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Gallery Filtering
  const filterBtns = document.querySelectorAll('.gallery-tab-btn');
  const galleryItems = document.querySelectorAll('.gallery-tile');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 2. Lightbox Modal
  const modal = document.getElementById('galleryModal');
  const modalImg = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalClose = document.getElementById('modalClose');
  const btnPrev = document.getElementById('modalPrev');
  const btnNext = document.getElementById('modalNext');

  if (!modal) return;

  let currentIndex = 0;
  const visibleImages = () => Array.from(galleryItems).filter(item => item.style.display !== 'none');

  function openLightbox(index) {
    const items = visibleImages();
    if (!items[index]) return;

    currentIndex = index;
    const targetItem = items[currentIndex];
    const imgSrc = targetItem.getAttribute('data-full-img');
    const title = targetItem.querySelector('.gallery-tile-title')?.textContent || '';
    const category = targetItem.querySelector('.gallery-tile-category')?.textContent || '';

    modalImg.src = imgSrc;
    modalTitle.textContent = title;
    modalCategory.textContent = category;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    modalImg.src = '';
    document.body.style.overflow = '';
  }

  function showNext() {
    const items = visibleImages();
    currentIndex = (currentIndex + 1) % items.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    const items = visibleImages();
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    openLightbox(currentIndex);
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const items = visibleImages();
      const idx = items.indexOf(item);
      if (idx !== -1) openLightbox(idx);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeLightbox);
  if (btnNext) btnNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  if (btnPrev) btnPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
});
