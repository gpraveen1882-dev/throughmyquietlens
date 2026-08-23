const button = document.querySelector('.menu-button');
const links = document.querySelector('.nav-links');
if (button && links) {
  button.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
  });
}
document.querySelectorAll('.year').forEach((el) => el.textContent = new Date().getFullYear());

// Image carousel: horizontal scroll-snap with dot navigation
document.querySelectorAll('.img-carousel').forEach((car) => {
  const track = car.querySelector('.img-carousel-track');
  const dots = [...car.querySelectorAll('.img-carousel-dot')];
  if (!track || !dots.length) return;
  const slides = [...track.children];
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      slides[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    });
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const idx = slides.indexOf(entry.target);
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }
    });
  }, { root: track, threshold: 0.6 });
  slides.forEach((s) => io.observe(s));
});

// Library search filter
const librarySearch = document.getElementById('library-search');
const libraryAll = document.getElementById('library-all');
const libraryEmpty = document.getElementById('library-search-empty');
if (librarySearch && libraryAll) {
  const items = [...libraryAll.querySelectorAll('article')];
  librarySearch.addEventListener('input', () => {
    const q = librarySearch.value.trim().toLowerCase();
    let visible = 0;
    items.forEach((item) => {
      const match = !q || (item.dataset.search || '').includes(q);
      item.hidden = !match;
      if (match) visible++;
    });
    if (libraryEmpty) libraryEmpty.hidden = visible !== 0;
  });
}


// Quiet article sharing
document.querySelectorAll('[data-share]').forEach((share) => {
  const url = window.location.href;
  const title = document.title;

  const linkedin = share.querySelector('.linkedin-share');
  const nativeButton = share.querySelector('.native-share');
  const copyButton = share.querySelector('.copy-share');
  const feedback = share.querySelector('.share-feedback');

  if (linkedin) {
    linkedin.href =
      'https://www.linkedin.com/sharing/share-offsite/?url=' +
      encodeURIComponent(url);
    linkedin.target = '_blank';
  }

  if (nativeButton) {
    if (!navigator.share) {
      nativeButton.hidden = true;
    } else {
      nativeButton.addEventListener('click', async () => {
        try {
          await navigator.share({ title, url });
        } catch (err) {
          if (err && err.name !== 'AbortError') console.error(err);
        }
      });
    }
  }

  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(url);
        if (feedback) feedback.textContent = 'Link copied';
        setTimeout(() => {
          if (feedback) feedback.textContent = '';
        }, 2000);
      } catch (err) {
        window.prompt('Copy this link:', url);
      }
    });
  }
});
