/* Rankova Arcade service worker: гра працює офлайн, рейтинг оновлюється, коли є мережа.
   Після зміни будь-якого файлу гри збільште VERSION, щоб телефони підтягнули нову версію. */
const VERSION = 'v1';
const SHELL = 'rankova-shell-' + VERSION;
const EXT = 'rankova-ext-' + VERSION;
const SHELL_FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'favicon.svg',
  'favicon-32.png',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png'
];
/* Шрифти та Firebase SDK кешуємо після першого завантаження. Сам Firestore не чіпаємо. */
const EXT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
const EXT_PREFIX = 'https://www.gstatic.com/firebasejs/';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('rankova-') && k !== SHELL && k !== EXT).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Сторінка гри: спершу мережа (щоб оновлення приходили одразу), без мережі — з кешу.
  if (req.mode === 'navigate' && url.origin === location.origin) {
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok) { const copy = res.clone(); caches.open(SHELL).then(c => c.put('index.html', copy)); }
          return res;
        })
        .catch(() => caches.match('index.html'))
    );
    return;
  }

  // Іконки й маніфест: з кешу, у фоні оновлюємо.
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(req, { ignoreSearch: true }).then(hit => {
        const net = fetch(req).then(res => {
          if (res.ok) { const copy = res.clone(); caches.open(SHELL).then(c => c.put(req, copy)); }
          return res;
        }).catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  // Шрифти й Firebase SDK: версіоновані, тож кеш назавжди.
  if (EXT_HOSTS.includes(url.hostname) || req.url.startsWith(EXT_PREFIX)) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(EXT).then(c => c.put(req, copy)); }
        return res;
      }))
    );
  }
});
