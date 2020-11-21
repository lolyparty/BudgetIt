//cahe assets;
const cacheName = 'cache-v1';
const cachedAssets = [
    '/',
    '/index.html',
    'style.css',
    'app.js',
    'img/budget.jpeg'
]

//install event
self.addEventListener('install',(event)=>{
    event.waitUntil(caches.open(cacheName).then(cache=>{
         cache.addAll(cachedAssets)
    }))
})



// activate event
self.addEventListener('activate',evt=>{
    evt.waitUntil(
        caches.keys().then(keys=>{
            return Promise.all(keys
                .filter(key => key !== cacheName)
                .map(key=>caches.delete(key)))
        })
    )
})

self.addEventListener('fetch',evt=>{
    console.log('fetch request successful')
    evt.respondWith(
        caches.match(evt.request)
        .then(cacheRes=>{
            return cacheRes || fetch(evt.request)
        })
    )
})