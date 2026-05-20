function initGalleryLightbox() {
  const triggers = document.querySelectorAll('[data-gallery]');
  if (!triggers.length) return;

  const images = Array.from(triggers).map((el) => ({
    src: el.dataset.src || el.querySelector('img')?.src || '',
    alt: el.dataset.alt || el.querySelector('img')?.alt || 'Gallery image'
  }));

  let currentIndex = 0;

  const lightbox = document.createElement('div');
  lightbox.className = 'gallery-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = `
    <div class="lightbox-backdrop" data-lightbox-close></div>
    <div class="lightbox-content">
      <button type="button" class="lightbox-close" aria-label="Close gallery">&times;</button>
      <button type="button" class="lightbox-prev" aria-label="Previous image">&#8249;</button>
      <button type="button" class="lightbox-next" aria-label="Next image">&#8250;</button>
      <img class="lightbox-image" src="" alt="">
      <p class="lightbox-caption"></p>
    </div>
  `;
  document.body.appendChild(lightbox);

  const imageEl = lightbox.querySelector('.lightbox-image');
  const captionEl = lightbox.querySelector('.lightbox-caption');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  function showImage(index) {
    currentIndex = (index + images.length) % images.length;
    const { src, alt } = images[currentIndex];
    imageEl.src = src;
    imageEl.alt = alt;
    captionEl.textContent = `${currentIndex + 1} / ${images.length}`;
    prevBtn.style.display = images.length > 1 ? '' : 'none';
    nextBtn.style.display = images.length > 1 ? '' : 'none';
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    lightbox.querySelector('.lightbox-close').focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    imageEl.src = '';
  }

  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => openLightbox(index));
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1);
  });
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex + 1);
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
}

document.addEventListener('DOMContentLoaded', initGalleryLightbox);
