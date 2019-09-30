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
//

let globalObjects = {
  storeObservers : [],

  grades : {
    font: ["3", "4", "4+", "5", "5+", "6A", "6A+", "6B", "6B+", "6C", "6C+", "7A", "7A+", "7B", "7B+", "7C", "7C+", "8A", "8A+", "8B", "8B+", "8C", "8C+", "9A"],
    hueco: ["V0", "V1", "V2", "V3","V4", "V5", "V6", "V7","V8", "V9", "V10", "V11","V12", "V13", "V14", "V15","V16", "V17"],
  },
  score: {
    inc : 50,
    start: 100,
    font: [100, 150, 200, 250, 300, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300],
  },


  currentAscentType : '',
  currentAscentGrade: 0,
  indoorsOutdoors : 'indoors',
  currentClimbingType : 'boulder',

  currentScore: [0,0,0,0,0],
  totalScore: 0,
  averageGrade: 'N/A',
  totalAscentCount: 0,
  totalAscents : {
    redpoint: 0,
    flash: 0,
    onsight: 0,
    },
 
  totalAscentsByType : {
    boulder: '',
    toprope: '',
    sport: '',
    trad: ''
  },

  // Ticks
  ticks: {
    boulder : {
      today: {
        indoors: {},
        outdoors: {}
      }
    },
    sport : {
      today: {
        indoors: {},
        outdoors: {}
      }
    },
    trad : {
      today: {
        indoors: {},
        outdoors: {}
      }
    },
    toprope : {
      today: {
        indoors: {},
        outdoors: {}
      }
    }
  }
};


const globals = new Proxy(globalObjects, handler);

export { globals }
