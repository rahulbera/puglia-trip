const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

async function getJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

function renderItinerary(days) {
  $('#itinerary-list').innerHTML = days.map((day, index) => `
    <article class="day-card ${index === 0 ? 'open' : ''}">
      <button class="day-button" aria-expanded="${index === 0}" aria-controls="day-${day.day}">
        <span class="day-number"><small>${day.date.split(' ')[0]}</small>${day.date.split(' ')[1]}</span>
        <span class="day-title"><b>${day.title}</b><span>Day ${String(day.day).padStart(2, '0')} · ${day.subtitle}</span></span>
        <span class="day-toggle" aria-hidden="true">+</span>
      </button>
      <div class="day-details" id="day-${day.day}"><div class="day-details-inner"><div class="day-timeline">
        <div class="day-slot"><small>Morning</small><p>${day.morning}</p></div>
        <div class="day-slot"><small>Afternoon</small><p>${day.afternoon}</p></div>
        <div class="day-slot"><small>Evening</small><p>${day.evening}</p></div>
        <div class="day-note"><b>Good to know:</b> ${day.note}</div>
      </div></div></div>
    </article>`).join('');

  $$('.day-button').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.day-card');
    card.classList.toggle('open');
    button.setAttribute('aria-expanded', card.classList.contains('open'));
  }));
}

function renderBeaches(beaches, filter = 'all') {
  const visible = filter === 'all' ? beaches : beaches.filter(beach => beach.town === filter);
  $('#beach-grid').innerHTML = visible.map(beach => `
    <article class="beach-card">
      <div class="beach-image"><img src="${beach.image}" alt="${beach.imageAlt}" loading="lazy" decoding="async"><span class="beach-badge">${beach.best}</span><span class="beach-rating">★ ${beach.rating.toFixed(1)}</span></div>
      <div class="beach-body"><h3>${beach.name}</h3><p class="beach-location">${beach.town} · ${beach.coast} coast</p>
        <div class="trait-grid"><div class="trait"><small>Shore</small><b>${beach.surface}</b></div><div class="trait"><small>Water</small><b>${beach.water}</b></div><div class="trait"><small>Crowds</small><b>${beach.crowds}</b></div></div>
        <p class="beach-notes">${beach.notes}</p>
        <a class="map-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${beach.name}, ${beach.town}, Italy`)}" target="_blank" rel="noreferrer">Open in Google Maps <span>↗</span></a>
      </div>
    </article>`).join('');
}

function renderTransport(transfers) {
  $('#transport-list').innerHTML = transfers.map(item => `
    <article class="transport-card">
      <div class="transfer-route"><small>Transfer</small><b>${item.from}<span>→</span>${item.to}</b></div>
      <div class="transfer-meta"><small>Route</small><b>${item.mode}</b></div>
      <div class="transfer-meta"><small>Time · leave</small><b>${item.duration} · ${item.depart}</b></div>
      <div class="transfer-icon" title="${item.tip}">↗</div>
    </article>`).join('');
}

function updateCountdown() {
  const now = new Date();
  let target = new Date(now.getFullYear(), 7, 7, 11);
  if (now > new Date(now.getFullYear(), 7, 16, 23, 59)) target = new Date(now.getFullYear() + 1, 7, 7, 11);
  const days = Math.ceil((target - now) / 86400000);
  $('#countdown').textContent = days === 0 ? 'Puglia starts today' : `${days} day${days === 1 ? '' : 's'} to go`;
}

function setupNavigation() {
  const navLinks = $$('.desktop-nav a, .mobile-nav a');
  navLinks.forEach(link => link.addEventListener('click', () => {
    navLinks.forEach(item => item.classList.toggle('active', item.getAttribute('href') === link.getAttribute('href')));
  }));
  const sections = $$('main section[id]');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  }), {rootMargin: '-25% 0px -65%'});
  sections.forEach(section => observer.observe(section));
}

function setupTheme() {
  const toggle = $('.theme-toggle');
  const savedTheme = localStorage.getItem('puglia-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const setTheme = dark => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    toggle.querySelector('span').textContent = dark ? '☀' : '☾';
    toggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
  };
  setTheme(savedTheme ? savedTheme === 'dark' : prefersDark);
  toggle.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme !== 'dark';
    setTheme(dark);
    localStorage.setItem('puglia-theme', dark ? 'dark' : 'light');
  });
}

async function init() {
  updateCountdown();
  setupNavigation();
  setupTheme();
  try {
    const [trip, beaches] = await Promise.all([getJSON('data/itinerary.json'), getJSON('data/beaches.json')]);
    renderItinerary(trip.days);
    renderTransport(trip.transfers);
    renderBeaches(beaches);
    $$('.filter').forEach(button => button.addEventListener('click', () => {
      $$('.filter').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      renderBeaches(beaches, button.dataset.filter);
    }));
  } catch (error) {
    console.error(error);
    $('#itinerary-list').innerHTML = '<p>Trip details could not be loaded. Please refresh the page.</p>';
  }
}

init();
