
// Set a name for the current cache
var cacheName = 'v1.2';


// Default files to always cache
var cacheFiles = [
  '/',
  '/__/firebase/8.2.1/firebase-app.js',
  '/__/firebase/8.2.1/firebase-auth.js',
  '/__/firebase/8.2.1/firebase-firestore.js',
  '/__/firebase/init.js',
  '/index.html',
  '/js/',
  '/js/app.js',
  '/js/components/calendar.js',
  '/js/components/charts.js',
  '/js/components/dropdown.js',
  '/js/components/modal.js',
  '/js/components/picker.js',
  '/js/components/toggleswitch.js',
  '/js/components/wheel.js',
  '/js/shared/animate.js',
  '/js/shared/crypto.js',
  '/js/shared/geolocation.js',
  '/js/shared/globals.js',
  '/js/shared/handle_tick.js',
  '/js/shared/helpers.js',
  '/js/shared/localstorage.js',
  '/js/shared/route.js',
  '/js/shared/store.js',
  '/js/shared/user.js',
  '/js/templates/partials/climbing_type-selector.js',
  '/js/templates/partials/footer.js',
  '/js/templates/partials/group_join.js',
  '/js/templates/partials/group_options.js',
  '/js/templates/partials/group_part.js',
  '/js/templates/partials/group_standing.js',
  '/js/templates/partials/section_grade-selector.js',
  '/js/templates/partials/section_otc.js',
  '/js/templates/partials/section_progress.js',
  '/js/templates/partials/status_ticker.js',
  '/js/templates/page_groups.js',
  '/js/templates/page_history.js',
  '/js/templates/page_home.js',
  '/js/templates/page_login.js',
  '/js/templates/page_profile.js',
  '/js/templates/page_reset-password.js',
  '/js/templates/page_signup.js',
  '/js/templates/page_statistics.js',
  /* CSS */
  '/css/animations.css',
  '/css/buttons.css',
  '/css/calendar.css',
  '/css/dropdown.css',
  '/css/fonts.css',
  '/css/footer.css',
  '/css/groups.css',
  '/css/history.css',
  '/css/horizontal_menu.css',
  '/css/legends.css',
  '/css/login.css',
  '/css/main.css',
  '/css/modal.css',
  '/css/otc.css',
  '/css/profile.css',
  '/css/progress.css',
  '/css/status_ticker.css',
  '/css/toggle.css',
  '/css/variables.css',
  /* IMAGES */
  '/images/bgr_history.jpg',
  '/images/bgr_indoors.jpg',
  '/images/bgr_outdoors.jpg',
  '/images/gear.svg',
  '/images/napak_vector_black.svg',
  '/images/napak_vector.svg'
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


self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => {
      return response || fetch(event.request);
    })
  );
});
