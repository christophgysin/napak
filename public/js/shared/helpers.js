import { globals } from '/js/shared/globals.js';

let storeObserver = { 
  add : ( params ) => {
    let store = params.store;

    // remove existing observer if it has some ID
    store.storeObservers.forEach((o, count) => {
      if(params.id && o.id === params.id) {
        store.storeObservers.splice(count, 1)
      }
    });

    store.storeObservers.push({
      key: params.key,
      id: params.id,
      callback: params.callback,
      removeOnRouteChange: params.removeOnRouteChange
    });
  },

  remove: ( id ) => {
    console.log(id);
  },

  clear: () => {
    let remove = [];
    globals.storeObservers.forEach( (o, count) => {
      if(o.removeOnRouteChange) {
        remove.push(count)
       }
    });

    remove.slice().reverse().forEach((c)=>{
      globals.storeObservers.splice(c, 1)
    });
  }
};

// Create DOM element
let dce = (params) => {
  let element = document.createElement(params.el);

  if (params.cssClass) {
    element.className = params.cssClass;
  }

  if (params.source) {
    element.setAttribute('src', params.source);
  }

  if (params.cssStyle) {
    element.setAttribute('style', params.cssStyle);
  }

  if (params.id) {
    element.setAttribute('id', params.id);
  }

  if (params.content) {
    element.appendChild(document.createTextNode(params.content));
  }

  if (params.attrbs) {
    for (let i = 0, j = params.attrbs.length; i < j; i++) {
      element.setAttribute(params.attrbs[i][0], params.attrbs[i][1]);
    }
  }
  return element;
}

// Create SVG element
let svg = (params) => {
  let xlmns = 'http://www.w3.org/2000/svg';
  let element = document.createElementNS(xlmns, params.el);

  if (params.cssClass) {
    element.className = params.cssClass;
  }

  if (params.cssStyle) {
    element.setAttribute('style', params.cssStyle);
  }

  if (params.id) {
    element.setAttribute('id', params.id);
  }

  if (params.attrbs) {
    for (let i = 0, j = params.attrbs.length; i < j; i++) {
      element.setAttributeNS(null, params.attrbs[i][0], params.attrbs[i][1]);
    }
  }
  return element;
}

// vibrate
let vibrate = (params) => {
  let supportsVibrate = "vibrate" in navigator;
  let duration = [10, 0];
  if ( params && params.duration ) {
    duration = params.duration;
  }
  if(supportsVibrate) {
    window.navigator.vibrate(duration);
  }
}

// Custom events
let triggerCustomEvent = (params) => {
  let vent = new CustomEvent(params.vent, params.data);
  if (params.dispatch) {
    document.dispatchEvent(vent);
  }
}

// Count top 5 score
let countTopFive = () => {
  return countTotalScore().reduce((a, b) => Number(a) + Number(b), 0);
}

// Count average grade
let averageGrade = (amount) => {
  let ticks = handleScopeTicks({scope: globals.scope});
  let maxGrades = [];
  ticks.forEach(tick => {maxGrades.push(tick.grade)});
  if(maxGrades.length < 1) return 'N/A';
  maxGrades = maxGrades.sort(function (a, b) { return b - a }).slice(0, 5);
  maxGrades = maxGrades.reduce((a, b) => Number(a) + Number(b), 0);
  let avgr = maxGrades / amount;

  return globals.grades.font[Math.round(avgr)];
}


// Total score
let countTotalScore = () => {
  let ticks = handleScopeTicks({scope: globals.scope});
  let score = [0,0,0,0,0];

  ticks.forEach((tick) => {
    score.push(eightaNuScore({ 'type': tick.ascentType, grade: tick.grade, sport: tick.type }));
  })

  return score.sort(function (a, b) { return b - a }).slice(0, 5);
}


let eightaNuScore = (data) => {
  let score = 0;
  let bonusgrade = 0;
  let ontop = 0;

  if (data.type === 'flash') {
    bonusgrade = 1;
    ontop = 3;
  }

  if (data.type === 'onsight') {
    bonusgrade = (data.sport === 'boulder') ? 2 : 3; // Boulder onsight jumps two grades instead of three
    ontop = -5;
  }
  if (data.sport === 'toprope') {
    bonusgrade -= 1;
  }

  let grade = Number(data.grade) + bonusgrade;
  score = (grade + ((grade >= 5) ? 3 : 1)) * 50 + ontop;
  return score;
}

// Get ascents
let countAscents = (scope) => {
  let types = ['redpoint', 'onsight', 'flash'];

  let ascents = {
    redpoint: 0,
    onsight: 0,
    flash: 0,
    total: 0
  };

  let ticks = handleScopeTicks({scope: scope});

  types.forEach((type) => {
    let ticksByDiscipline = ticks.filter(obj => {
      return obj.ascentType === type &&
      obj.type === globals.currentClimbingType &&
      obj.indoorsOutdoors === globals.indoorsOutdoors
    });
    ascents[type] = ticksByDiscipline.length;
    ascents.total+=ticksByDiscipline.length;
  });

  return ascents;
}

// Get ascents by difficulty
let countAscentsByDifficulty = () => {
  let temp = globals.grades.font.length;
  let tempObj = {}
  for(let i=0, j=temp; i<j;i++) {
    tempObj[i] = 0;
  }
  let ascents = {
    redpoint: {...tempObj},
    flash: {...tempObj},
    onsight: {...tempObj}
  };

  let ticks = handleScopeTicks({scope: 'today'});
  ticks.forEach((tick) => {
    if(tick.indoorsOutdoors === globals.indoorsOutdoors &&
      tick.type === globals.currentClimbingType) {
        if(!ascents[tick.ascentType][tick.grade]) {
          ascents[tick.ascentType][tick.grade] = 0;
        }
        ascents[tick.ascentType][tick.grade]+= 1;
      }
  });
  return ascents;
}

// Get ascents by difficulty
let countAscentsByType = () => {
  let types = {
    boulder: 0,
    sport: 0,
    toprope: 0,
    trad: 0
  };

  let ticks = handleScopeTicks({scope: 'today', allTypes: true});

  let temp = Object.keys(types);
  temp.forEach((type) => {
    let ticksByDiscipline = ticks.filter(obj => {
      return obj.type === type && obj.indoorsOutdoors === globals.indoorsOutdoors
    })
    types[type] = ticksByDiscipline.length;
  });
  return types;
}

// Get ascents by grade
let countAscentsByGrade = (params) => {
  let ticks = handleScopeTicks({scope: params.scope});

  let ascentsByGrade = new Array(globals.grades.font.length).fill(0);
  let type = globals.currentClimbingType;
  ascentsByGrade.forEach((grade, count) => {
    let ticksByGrade = ticks.filter(obj => {
      return obj.type === type &&
              obj.indoorsOutdoors === ((params.indoorsOutdoors) ? params.indoorsOutdoors : globals.indoorsOutdoors) &&
              obj.grade === count
    })
    ascentsByGrade[count] = ticksByGrade.length;
  });
  return ascentsByGrade;
}

// Return all ticks matching the scope
let handleScopeTicks = (params) => {
  let fromNow;
  let fromNowArray = globals.today.split('-');
  let year = Number(fromNowArray[0]);
  let month = Number(fromNowArray[1]);
  let day = Number(fromNowArray[2]);

  if(params.scope === 'thirtydays')  {month-=1;}
  if(params.scope === 'year')        {year-=1;}
  if(params.scope === 'alltime')     {year = 2000; month = 1; day = 1;}

  fromNow = new Date(Number(year), Number(month) - 1, Number(day)).getTime();
  let ticks = [];

  globals.ticks.forEach((tick) => {
      if(tick.date >= fromNow) {
        if ( tick.type === globals.currentClimbingType && tick.indoorsOutdoors === globals.indoorsOutdoors ) {
         ticks.push(tick)
      }
    }
  })

  return ticks;
}

let updateScopeTicks = () => {
  globals.currentScore = countTotalScore();
  globals.totalScore = countTopFive();
  globals.totalAscentCount['today'] = countAscents('today').total;
  globals.totalAscentCount['thirtydays'] = countAscents('thirtydays').total;
  globals.totalAscentCount['year'] = countAscents('year').total;
  globals.totalAscentCount['alltime'] = countAscents('alltime').total;
  globals.totalAscents = countAscents('today');

  // Trigger
  let getTicks = globals.ticks;
  globals.ticks = getTicks;

  globals.totalAscentsByType = countAscentsByType();
  globals.averageGrade = averageGrade(5);
}


export {
  storeObserver,
  dce,
  svg,
  vibrate,
  triggerCustomEvent,
  countTopFive,
  averageGrade,
  eightaNuScore,
  countTotalScore,
  countAscents,
  countAscentsByDifficulty,
  countAscentsByType,
  countAscentsByGrade,
  handleScopeTicks,
  updateScopeTicks
}
