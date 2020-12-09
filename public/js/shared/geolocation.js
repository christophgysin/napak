import { globals } from '/js/shared/globals.js';
import { storeObserver }  from '/js/shared/helpers.js';


class geoLocation {
    constructor() {
        // geolocation options
        const options = {
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 60000
            };

        this.enableTracking = () => {
            if ( globals.gpsTracking ) {
                navigator.geolocation.getCurrentPosition(function () {}, function () {}, {});
                globals.gpsLocationWatch = navigator.geolocation.watchPosition(this.geolocSuccess, this.geolocError, options);            
            }
            else {
                navigator.geolocation.clearWatch(globals.gpsLocationWatch);
                globals.gpsLocationWatch = null;
                globals.gpsLocation = null;
                }
        }

        this.geolocSuccess = (position) => {
            let loc = {
                accuracy: position.coords.accuracy,
                altitude: position.coords.altitude,
                altitudeAccuracy: position.coords.altitudeAccuracy,
                heading: position.coords.heading,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                speed: position.coords.speed,
            };
            globals.gpsLocation = loc;
        }

        this.geolocError = (err) => {
            let newStatusMessage = {
                message : 'Could not locate you 😿',
                timeout: 3,
                id : 'GPSLocationError'
              };

            globals.standardMessage.push(newStatusMessage);
            globals.standardMessage = globals.standardMessage;

            // user denied 
            if(err.code === 1) {
                globals.gpsTracking = false;
            }
            console.warn('ERROR(' + err.code + '): ' + err.message);
        }

        storeObserver.add({
            store: globals,
            key : 'gpsTracking',
            id  : 'appGeolocate',
            callback: () => {
                this.enableTracking()
            },
            removeOnRouteChange: false
          });
        
        this.enableTracking();
    }
}

export default geoLocation;
