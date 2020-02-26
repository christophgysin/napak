
// Set a name for the current cache
var cacheName = 'v1'; 

// Default files to always cache
var cacheFiles = [
  '/',
  '/__/firebase/7.7.0/firebase-app.js',
  '/__/firebase/7.7.0/firebase-auth.js',
  '/__/firebase/7.7.0/firebase-firestore.js',
  '/__/firebase/init.js',
  '/index.html',
  '/js/',
  '/js/components/charts.js',
  '/js/components/dropdown.js',
  '/js/components/picker.js',
  '/js/components/pulldown.js',
  '/js/components/toggleswitch.js',
  '/js/components/wheel.js',
  '/js/shared/animate.js',
  '/js/shared/auth.js',
  '/js/shared/date.js',
  '/js/shared/globals.js',
  '/js/shared/handle_tick.js',
  '/js/shared/helpers.js',
  '/js/shared/route.js',
  '/js/shared/store.js',
  '/js/shared/user.js',
  '/js/shared/uuid.js',
  '/js/templates/partials/footer.js',
  '/js/templates/partials/section_grade-selector.js',
  '/js/templates/partials/section_otc.js',
  '/js/templates/partials/section_progress.js',
  '/js/templates/partials/status_ticker.js',
  '/js/templates/page_groups.js',
  '/js/templates/page_home.js',
  '/js/templates/page_history.js',
  '/js/templates/page_login.js',
  '/js/templates/page_settings.js',
  '/js/templates/page_signup.js',
  '/js/templates/page_statistics.js',
  '/js/app.js',
  /* CSS */
  '/css/animations.css',
  '/css/buttons.css',
  '/css/fonts.css',
  '/css/footer.css',
  '/css/groups.css',
  '/css/history.css',
  '/css/horizontal_menu.css',
  '/css/legends.css',
  '/css/login.css',
  '/css/main.css',
  '/css/otc.css',
  '/css/status_ticker.css',
  '/css/variables.css'

]


self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Installed');

    // e.waitUntil Delays the event until the Promise is resolved
    e.waitUntil(

    	// Open the cache
	    caches.open(cacheName).then(function(cache) {

	    	// Add all the default files to the cache
			console.log('[ServiceWorker] Caching cacheFiles');
			return cache.addAll(cacheFiles);
	    })
	); // end e.waitUntil
});


self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activated');

    e.waitUntil(

    	// Get all the cache keys (cacheName)
		caches.keys().then(function(cacheNames) {
			return Promise.all(cacheNames.map(function(thisCacheName) {

				// If a cached item is saved under a previous cacheName
				if (thisCacheName !== cacheName) {

					// Delete that cached file
					console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
					return caches.delete(thisCacheName);
				}
			}));
		})
	); // end e.waitUntil

});


self.addEventListener('fetch', function(e) {
	console.log('[ServiceWorker] Fetch', e.request.url);

	// e.respondWidth Responds to the fetch event
	e.respondWith(

		// Check in cache for the request being made
		caches.match(e.request)


			.then(function(response) {

				// If the request is in the cache
				if ( response ) {
					console.log("[ServiceWorker] Found in Cache", e.request.url, response);
					// Return the cached version
					return response;
				}

				// If the request is NOT in the cache, fetch and cache

				var requestClone = e.request.clone();
				fetch(requestClone)
					.then(function(response) {

						if ( !response ) {
							console.log("[ServiceWorker] No response from fetch ")
							return response;
						}

						var responseClone = response.clone();

						//  Open the cache
						caches.open(cacheName).then(function(cache) {

							// Put the fetched response in the cache
							cache.put(e.request, responseClone);
							console.log('[ServiceWorker] New Data Cached', e.request.url);

							// Return the response
							return response;
			
				        }); // end caches.open

					})
					.catch(function(err) {
						console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
					});


			}) // end caches.match(e.request)
	); // end e.respondWith
});
