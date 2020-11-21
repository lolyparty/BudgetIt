//cahe assets;
const cacheName = 'cache-v2';
const cachedAssets = [
    '/',
    '/index.html',
    'style.css',
    'app.js',
    'img/budget.jpeg',
    'icons/budgetit-48.png',
    'icons/budgetit-72.png',
    'icons/budgetit-96.png',
    'icons/budgetit-120.png',
    'icons/budgetit-144.png',
    'icons/budgetit-152.png',
    'icons/budgetit-167.png',
    'icons/budgetit-180.png',
    'icons/budgetit-192.png',
    'icons/budgetit-512.png',
]

self.addEventListener('install',(e)=>{
    e.waitUntil(caches.open(cacheName)
    .then((cache)=>{
        cache.addAll(cachedAssets)
    })
    .catch(error=>error)
    )
})

self.addEventListener('activate',(e)=>{
    e.waitUntil(caches.keys().then(keys=>{
        return Promise.all(keys
            .filter(key=>key !== cacheName)
            .map(key=>caches.delete(key)));
    })
    )}
)

self.addEventListener('fetch',(e)=>{
    e.respondWith(
        caches.match(e.request)
        .then(cacheRes=>{
            return cacheRes || fetch(e.request)
        })
        .catch(error=>error)
    )
})