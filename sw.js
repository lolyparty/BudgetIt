//cahe assets;
const cacheName = 'cache-v4';
const cachedAssets = [
    '/',
    '/index.html',
    'style.css',
    'app.js',
    'img/budget.jpeg'
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