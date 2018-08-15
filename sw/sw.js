const staticCacheName = 'restaurant-static-v3';

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(staticCacheName).then(function(cache) {
			return cache
				.addAll([
					'/',
					'/index.html',
					'/restaurant.html',
					'/js/main.js',
					'/js/restaurant_info.js',
					'/js/dbhelper.js',
					'/css/styles.css',
					'/css/responsive.css',
					'/img/',
					'/data/restaurants.json',
					'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js'
				])
				.catch((error) => {
					console.log(error);
				});
		})
	);
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames
					.filter(function(cacheName) {
						return cacheName.startsWith('restaurant-') && cacheName != staticCacheName;
					})
					.map(function(cacheName) {
						return caches.delete(cacheName);
					})
			);
		})
	);
});

self.addEventListener('fetch', function(event) {
	let requestUrl = new URL(event.request.url);

	if (requestUrl.origin === location.origin) {
		if (requestUrl.pathname === '/') {
			event.respondWith(caches.match('/'));
			return;
		}
	}

	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});

self.addEventListener('message', function(event) {
	if (event.data.action === 'skipWaiting') {
		self.skipWaiting();
	}
});
