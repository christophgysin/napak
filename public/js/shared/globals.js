import { handleDate } from '/js/shared/date.js';
import { localStrg } from '/js/shared/localstorage.js';

//  Defaults
const handler = {
  get: (obj, prop) => {
    return obj[prop];
  },

  set: (obj, prop, value) => {
    obj[prop] = value;

    for(let i=0, j = globals.storeObservers.length; i<j; i++) {
      if(globals[globals.storeObservers[i].key] === obj[prop]) {
        globals.storeObservers[i].callback();
      }
    }
    return true
  }
}

// get settings fron local storage
let wheelPosition = localStrg.read({key: 'wheelPos'});
let useVibrate = localStrg.read({key: 'useVibrate'});
let useGPS = localStrg.read({key: 'useGPS'});


/*
  create container object for todays ticks;
*/

let containerObj = {};
let today = handleDate({dateString: new Date().getTime()});
let types = ['boulder', 'sport', 'trad', 'toprope'];

types.forEach((type) => {
  containerObj[type] = {}
  containerObj[type][today] = {
    indoors : {},
    outdoors: {}
  }
});

/*
  Globals
*/

let globalObjects = {
  routes: {},
  storeObservers : [],
  today: today,
  realToday: today,
  vibrate: (useVibrate) ? useVibrate : false,
  location: false,

  grades : {
    font: ["3", "4", "4+", "5", "5+", "6A", "6A+", "6B", "6B+", "6C", "6C+", "7A", "7A+", "7B", "7B+", "7C", "7C+", "8A", "8A+", "8B", "8B+", "8C", "8C+", "9A"],
  },

  difficulty : {
    0 : 'gray',
    1 : 'yellow',
    2 : 'yellow',
    3 : 'green',
    4 : 'green',
    5 : 'orange',
    6 : 'orange',
    7 : 'blue',
    8 : 'blue',
    9 : 'red',
    10 : 'red',
    11 : 'purple',
    12 : 'purple',
    13 : 'pink',
    14 : 'pink',
    15 : 'black',
    16 : 'black',
    17 : 'black',
    18 : 'black',
    19 : 'white',
    20 : 'white',
    21 : 'white',
    22 : 'white',
    23 : 'white'
  },

  currentAscentType : '',
  currentAscentGrade: (wheelPosition) ? wheelPosition : 6,
  indoorsOutdoors : 'indoors',
  currentClimbingType : 'boulder',

  scope: 'today',

  currentScore: [0,0,0,0,0],
  totalScore: 0,
  averageGrade: 'N/A',
  totalAscentCount: {
    'today': 0,
    'thirtydays': 0,
    'year': 0,
    'alltime': 0
  },

  graphMultiplier: {
    'today': 2,
    'thirtydays': 1,
    'year': 0.25,
    'alltime': 0.1
  },

  totalAscents : {
    redpoint: 0,
    flash: 0,
    onsight: 0,
    },

  totalAscentsByType : {
    boulder: 0,
    toprope: 0,
    sport: 0,
    trad: 0
  },

  totalScoreByType: {
    current: {
      boulder: 0,
      sport: 0,
      lead: 0,
      toprope: 0,
    }
  },


  // Ticks
  ticks: [],
  lastTick: false,
  lastTickeRemoved: false,
  serverMessage :[] ,
  standardMessage: [],

  // GPS
  gpsTracking: (useGPS) ? useGPS : false,
  gpsLocation: null,
  gpsLocationWatch: null
};


const globals = new Proxy(globalObjects, handler);

// Expose this for debugging purposes
window.globals = globals;

export { globals }
