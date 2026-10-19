// Navbar: add a background once the page is scrolled
const nb = document.getElementById('nb');
window.addEventListener('scroll', () => nb.classList.toggle('scrolled', scrollY > 36));

// Mobile menu
const MENU_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="width:22px;height:22px;display:block"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
const CLOSE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="width:22px;height:22px;display:block"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
const mobBtn = document.getElementById('mobBtn');
const mobDraw = document.getElementById('mobDraw');
let mOpen = false;

function setDrawer(open) {
  mOpen = open;
  mobDraw.classList.toggle('open', open);
  mobBtn.innerHTML = open ? CLOSE_ICON : MENU_ICON;
  mobBtn.setAttribute('aria-expanded', String(open));
}
mobBtn.addEventListener('click', () => setDrawer(!mOpen));
mobDraw.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setDrawer(false)));

// FAQ accordion (height is measured, so long answers are never cut off)
function setFaq(item, open) {
  const answer = item.querySelector('.faq-a');
  item.classList.toggle('open', open);
  answer.style.maxHeight = open ? answer.scrollHeight + 18 + 'px' : '0px';
  item.querySelector('.faq-q').setAttribute('aria-expanded', String(open));
}
function toggleFaq(el) {
  const item = el.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach((i) => setFaq(i, false));
  if (!wasOpen) setFaq(item, true);
}
document.querySelectorAll('.faq-q').forEach((q) => {
  q.addEventListener('click', () => toggleFaq(q));
  q.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFaq(q);
    }
  });
});

// Fade-in on scroll
const obs = new IntersectionObserver(
  (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));

// Contact form (collected by Netlify Forms)
const form = document.getElementById('cForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const label = btn.textContent;
    const err = document.getElementById('fErr');
    err.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Sending…';
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!res.ok) throw new Error('Request failed');
      form.style.display = 'none';
      document.getElementById('fSucc').style.display = 'block';
      form.reset();
    } catch (_) {
      err.style.display = 'block';
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  });
}
