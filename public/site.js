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
