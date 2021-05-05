'use strict';

const CACHE_NAME = 'shooter-cache-v1';

const FILES_TO_CACHE = [
    '/offline.html',
    '/index.html',
    '/main.js',
    '/Game.js',
    '/game.css',
    '/Entity.js',
    '/Character.js',
    '/Player.js',
    '/Opponent.js',
    '/Shot.js',
    '/assets/bueno_muerto.png',
    '/assets/bueno.png',
    '/assets/game_over.png',
    '/assets/jefe_muerto.png',
    '/assets/jefe.png',
    '/assets/malo_muerto.png',
    '/assets/malo.png',
    '/assets/shot1.png',
    '/assets/shot2.png',
    '/assets/you_win.png',
    '/files/install.js'
];

self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Install');
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Opened cache');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) { return r; }
        const response = await fetch(e.request);
        const cache = await caches.open(CACHE_NAME);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
    })());
    /*
    evt.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
          return cache.match(evt.request)
              .then((response) => {
                console.log("RESP", response);
                return response || fetch(evt.request);
              });
        })
    );
    e.respondWith((async () => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) { return r; }
        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
    })());*/
});
