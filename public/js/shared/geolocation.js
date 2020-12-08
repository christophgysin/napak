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
            let lat = Math.floor(position.coords.latitude*1000+0.5)/1000;
            let lon = Math.floor(position.coords.longitude*1000+0.5)/1000;
            globals.gpsLocation = {lat: lat, lon:lon}

            console.log(globals.gpsLocation)
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
