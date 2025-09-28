// NinjaTech QR Helper Service Worker
const CACHE_NAME = 'ninjatech-qr-helper-v1.0.0';
const STATIC_CACHE = 'ninjatech-static-v1.0.0';
const DYNAMIC_CACHE = 'ninjatech-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // External libraries (will be cached when requested)
  'https://cdn.jsdelivr.net/npm/kjua@0.9.0/dist/kjua.min.js',
  'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] Caching static files...');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') return;

  // Handle different caching strategies
  if (url.pathname.startsWith('/api/')) {
    // Network-first for API calls
    event.respondWith(networkFirst(request));
  } else if (STATIC_FILES.some(staticFile => request.url.includes(staticFile))) {
    // Cache-first for static files
    event.respondWith(cacheFirst(request));
  } else {
    // Network-first with cache fallback for other resources
    event.respondWith(networkFirst(request));
  }
});

// Cache-first strategy
function cacheFirst(request) {
  return caches.match(request)
    .then((response) => {
      if (response) {
        return response;
      }
      return fetch(request)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, response.clone());
              return response;
            });
        })
        .catch((error) => {
          console.error('[Service Worker] Cache-first failed:', error);
          // Return offline fallback for HTML requests
          if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/index.html');
          }
        });
    });
}

// Network-first strategy
function networkFirst(request) {
  return fetch(request)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          cache.put(request, response.clone());
          return response;
        });
    })
    .catch((error) => {
      console.log('[Service Worker] Network failed, trying cache:', error);
      return caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          // Return offline fallback for HTML requests
          if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/index.html');
          }
          throw error;
        });
    });
}

// Background sync for offline actions (if supported)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync triggered:', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle any offline actions that need to be synced
  console.log('[Service Worker] Performing background sync...');
  // This could be used for syncing any offline-generated QR codes or settings
}

// Push notifications (for future features)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received:', event);

  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('NinjaTech QR Helper', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click:', event);

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handler for communication with the main thread
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
