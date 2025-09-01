// Service Worker para Lembretes PWA
const CACHE_NAME = 'lembretes-pwa-v1';
const STATIC_CACHE_NAME = 'lembretes-static-v1';
const DYNAMIC_CACHE_NAME = 'lembretes-dynamic-v1';

// URLs para cache inicial
const STATIC_URLS = [
  '/',
  '/manifest.json',
  '/assets/icon.png',
  '/assets/favicon.png',
];

// URLs para cache dinâmico (APIs, imagens carregadas dinamicamente, etc.)
const DYNAMIC_CACHE_LIMIT = 50;

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_URLS);
      })
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Limpar caches antigos
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        return self.clients.claim();
      })
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Pular requests para chrome-extension e outras extensões
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Se encontrado no cache, retornar
        if (cachedResponse) {
          console.log('[SW] Cache hit:', request.url);
          return cachedResponse;
        }

        // Se não encontrado, fazer request e cachear se apropriado
        console.log('[SW] Cache miss:', request.url);
        return fetch(request)
          .then((response) => {
            // Só cachear responses válidos
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Decidir qual cache usar
            let cacheName = DYNAMIC_CACHE_NAME;
            
            // URLs estáticos vão para o cache estático
            if (STATIC_URLS.includes(url.pathname) || 
                url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
              cacheName = STATIC_CACHE_NAME;
            }

            // Clonar response para cache
            const responseClone = response.clone();
            
            caches.open(cacheName)
              .then((cache) => {
                // Limitar cache dinâmico
                if (cacheName === DYNAMIC_CACHE_NAME) {
                  limitCacheSize(cache, DYNAMIC_CACHE_LIMIT);
                }
                cache.put(request, responseClone);
              })
              .catch((error) => {
                console.error('[SW] Cache put failed:', error);
              });

            return response;
          })
          .catch((error) => {
            console.error('[SW] Fetch failed:', error);
            
            // Fallback para páginas offline
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/');
            }
            
            throw error;
          });
      })
  );
});

// Limitar tamanho do cache
function limitCacheSize(cache, maxItems) {
  cache.keys().then((keys) => {
    if (keys.length > maxItems) {
      cache.delete(keys[0]).then(() => {
        limitCacheSize(cache, maxItems);
      });
    }
  });
}

// Lidar com notificações push
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  
  const options = {
    body: 'Você tem um lembrete pendente!',
    icon: '/assets/icon.png',
    badge: '/assets/icon.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/',
      timestamp: Date.now(),
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir',
        icon: '/assets/icon.png',
      },
      {
        action: 'dismiss',
        title: 'Dispensar',
        icon: '/assets/icon.png',
      },
    ],
    requireInteraction: true,
    tag: 'lembrete',
    renotify: true,
  };

  if (event.data) {
    try {
      const data = event.data.json();
      options.body = data.body || options.body;
      options.data = { ...options.data, ...data };
    } catch (error) {
      console.error('[SW] Error parsing push data:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification('Lembrete PWA', options)
  );
});

// Lidar com cliques em notificações
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Abrir ou focar na janela do app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Se já tem uma janela aberta, focar nela
        for (const client of clientList) {
          if (client.url === self.registration.scope && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Se não tem janela aberta, abrir uma nova
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// Background sync (para quando voltar online)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-sync-reminders') {
    event.waitUntil(
      // Aqui você pode sincronizar dados com servidor quando disponível
      doBackgroundSync()
    );
  }
});

async function doBackgroundSync() {
  try {
    console.log('[SW] Performing background sync...');
    // Implementar lógica de sincronização aqui
    // Por exemplo: enviar lembretes pendentes para servidor
    return Promise.resolve();
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
    throw error;
  }
}

// Lidar com atualizações do app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] Service Worker loaded');
