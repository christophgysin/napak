import { handleDate } from '/js/shared/date.js';

//  Defaults
const handler = {
  get: (obj, prop) => {
//    console.log(`getting property ${prop} for ${obj}`);
    return obj[prop];
  },

  set: (obj, prop, value) => {
    obj[prop] = value;
    console.log(`setting property ${prop} : ${obj[prop]}`);

    for(let i=0, j = globals.storeObservers.length; i<j; i++) {
      if(globals[globals.storeObservers[i].key] === obj[prop]) {
        globals.storeObservers[i].callback();
      }
    }
    return true
  }
}


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
  openMenus: [],
  today: today,

  grades : {
    font: ["3", "4", "4+", "5", "5+", "6A", "6A+", "6B", "6B+", "6C", "6C+", "7A", "7A+", "7B", "7B+", "7C", "7C+", "8A", "8A+", "8B", "8B+", "8C", "8C+", "9A"]
  },

  currentAscentType : '',
  currentAscentGrade: 0,
  indoorsOutdoors : 'indoors',
  currentClimbingType : 'boulder',

  scope: 'today',

  currentScore: [0,0,0,0,0],
  totalScore: 0,
  averageGrade: 'N/A',
  totalAscentCount: [{
    'today': 0,
    'alltime': 0,
    'thirtydays': 0,
    'year': 0
  }],
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


  // Ticks
  ticks: []
};


const globals = new Proxy(globalObjects, handler);

export { globals }
