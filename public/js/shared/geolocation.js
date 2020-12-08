import { globals } from '/js/shared/globals.js';
import { storeObserver }  from '/js/shared/helpers.js';


class geoLocation {
    constructor() {
        // geolocation options
        const options = {
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 0
            };

        this.enableTracking = () => {
            if ( globals.gpsTracking ) {
                let newStatusMessage = {
                    message : 'Found you',
                    timeout: 1,
                    id : 'GPSLocation'
                  };
            
                globals.standardMessage.push(newStatusMessage);
                globals.standardMessage = globals.standardMessage;
                globals.gpsLocationWatch = navigator.geolocation.watchPosition(this.geolocSuccess, this.geolocError, options);
            }
            else {
                navigator.geolocation.clearWatch(globals.gpsLocationWatch);
                globals.gpsLocationWatch = null;
                globals.gpsLocation = null;
                
                }
        }

        this.handleLocationError = (browserHasGeolocation, infoWindow, pos) => {}

        this.geolocSuccess = (position) => {
            let lat = Math.floor(position.coords.latitude*1000+0.5)/1000;
            let lon = Math.floor(position.coords.longitude*1000+0.5)/1000;
            globals.gpsLocation = {lat: lat, lon:lon}

            console.log(globals.gpsLocation)
        }

        this.geolocError = (err) => {
            console.warn('ERROR(' + err.code + '): ' + err.message);
            globals.gpsTracking = false;
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
