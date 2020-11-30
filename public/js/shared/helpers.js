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

// Parse date 
let parseDate = (d) => {
  let parsed = d.split("-");
  return {
    year: parsed[0],
    month: parsed[1],
    date : parsed[2]
  }
}

// vibrate
let vibrate = (params) => {
  let supportsVibrate = "vibrate" in navigator;
  let duration = [10, 0];
  if ( params && params.duration ) {
    duration = params.duration;
  }
  if(supportsVibrate) {
    navigator.vibrate(0);
    navigator.vibrate(duration);
  }
}

// Custom events
let triggerCustomEvent = (params) => {
  let vent = new CustomEvent(params.vent, params.data);
  if (params.dispatch) {
    document.dispatchEvent(vent);
  }
}

// Count top x score
let countTopX = ({count = 10, tickSet = false} = {}) => {
  if(tickSet) {
    return countTotalScore({tickSet: tickSet, count: count}).reduce((a, b) => Number(a) + Number(b), 0);
  }
  return countTotalScore({count: count}).reduce((a, b) => Number(a) + Number(b), 0);
}

// Count average grade
let averageGrade = ({count= 10, scope = globals.scope, tickSet = false} = {}) => {
  const ticks = tickSet ? tickSet : handleScopeTicks({scope: scope});

  if (ticks.length === 0)
    return 'N/A';

  const maxGrades = ticks
    .map(tick => tick.grade)
    .sort()
    .slice(-count)

  const average = maxGrades
    .reduce((a, b) => a + b, 0)
    / maxGrades.length;

  return globals.grades.font[Math.round(average)];
}


// Total score
let countTotalScore = ({count= 10, scope = globals.scope, tickSet = false, returnTicks = false} = {}) => {
  let ticks = (tickSet) ? tickSet : handleScopeTicks({scope: scope});
  let score = Array(count).fill(0); // this is wrong. It no adds x empty ticks (by grade of 3) to the array 

  let returnTickSet = [];

// return with tick data
  if(returnTicks) {
    ticks.forEach((tick) => {
      let score = eightaNuScore({ ascentType: tick.ascentType, grade: tick.grade, sport: tick.type });
      tick.score = score;
      returnTickSet.push(tick);
    })
    return returnTickSet.sort(function(a, b) {
      var keyA = a.score,
        keyB = b.score;
      if (keyA < keyB) return 1;
      if (keyA > keyB) return -1;
      return 0;
    }).slice(0, count);
  }

// return with top score only
  ticks.forEach((tick) => {
    score.push(eightaNuScore({ ascentType: tick.ascentType, grade: tick.grade, sport: tick.type }));
  })
  return score.sort(function (a, b) { return b - a }).slice(0, count);
}


let eightaNuScore = (data) => {
  let score = 0;
  let bonusgrade = 0;
  let ontop = 0;

  if (data.ascentType === 'flash') {
    bonusgrade = 1;
    ontop = 3;
  }

  if (data.ascentType === 'onsight') {
    bonusgrade = (data.sport === 'boulder') ? 2 : 3; // Boulder onsight jumps two grades instead of three
    ontop = -5;
  }
  if (data.ascentType === 'toprope') {
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
// get ticks only for selected day
  let limitTo = parseDate(globals.today);

  let onlyThisDay = new Date(limitTo.year, limitTo.month-1, limitTo.date, 23, 59);

  let ticks = handleScopeTicks({scope: 'today', limit: onlyThisDay});
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

// Get ascents by climbing type
let countAscentsByType = () => {
  let types = {
    boulder: 0,
    sport: 0,
    toprope: 0,
    trad: 0
  };

  let ticks = handleScopeTicks({scope: 'alltime', allTypes: true});

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

let countGroupScore = () => {
  let types = {
    boulder: {
      score: 0,
      average: 'n/a',
      ticks: []
    },
    sport: {
      score: 0,
      average: 'n/a',
      ticks: []
    },
    toprope: {
      score: 0,
      average: 'n/a',
      ticks: []
    },
    trad: {
      score: 0,
      average: 'n/a',
      ticks: []
    }
  }
  let indoorsCopy = JSON.parse(JSON.stringify(types));
  let outdoorsCopy = JSON.parse(JSON.stringify(types));
  let indoors = indoorsCopy;
  let outdoors = outdoorsCopy;

  let ticks = handleScopeTicks({scope: 'thirtydays', allTypes: true, ignoreIndoorsOutdoors: true});

  let temp = Object.keys(types);

  temp.forEach((type) => {
    let ticksByDisciplineIndoors = ticks.filter(obj => {
      return obj.type === type && obj.indoorsOutdoors === 'indoors'
    })
    let ticksByDisciplineOutdoors = ticks.filter(obj => {
      return obj.type === type && obj.indoorsOutdoors === 'outdoors'
    })

    let indoorsTopX = countTotalScore({count: 10, tickSet: ticksByDisciplineIndoors, returnTicks: true});
    let outdoorsTopX = countTotalScore({count: 10, tickSet: ticksByDisciplineOutdoors, returnTicks: true});
    
    indoors[type]['score'] = countTopX({count: 10, tickSet: indoorsTopX, returnTicks: true});
    indoors[type]['average'] = averageGrade({count: 10, tickSet: indoorsTopX}); // double work. Get average from topX data
    indoors[type]['ticks'] = indoorsTopX;

    outdoors[type]['score'] = countTopX({count: 10, tickSet: outdoorsTopX});
    outdoors[type]['average'] = averageGrade({count: 10, tickSet: outdoorsTopX});
    outdoors[type]['ticks'] = outdoorsTopX;
  });

  return {
    indoors: indoors, 
    outdoors: outdoors
  };
}

// Return all ticks matching the scope
let handleScopeTicks = ({scope = globals.scope, allTypes= false, tickSet = false, indoorsOutdoors = globals.indoorsOutdoors, ignoreIndoorsOutdoors = false} = {}) => {
  let fromNow;
  let limitTo;
  /* 
    if scope is set to Today, use globals.today which might be any date
    if scope is anything else, use globals.realToday which is allways the correct date
  */
  let fromNowArray = (scope === 'today') ? globals.today.split('-') : globals.realToday.split('-');
  let year = Number(fromNowArray[0]);
  let month = Number(fromNowArray[1]);
  let day = Number(fromNowArray[2]);

  let limitDay = day;
  let limitMonth = month;
  let limitYear = year;

  if(scope === 'thirtydays') {
    limitMonth=month;
    month-=1;
  }
  if(scope === 'year') {
    limitYear = year;
    year-=1;
  }
  if(scope === 'alltime'){
    year = 2000; month = 1; day = 1;
    limitYear = 2100;
  }

  fromNow = new Date(year, month-1, day).getTime();
  limitTo = new Date(limitYear, limitMonth-1 , limitDay, 23,59).getTime();

  let ticks = [];

  globals.ticks.forEach((tick) => {
      if(tick.date >= fromNow && tick.date <= limitTo) {
        if ( (tick.type === globals.currentClimbingType || allTypes ) && tick.indoorsOutdoors === indoorsOutdoors || ignoreIndoorsOutdoors) {
         ticks.push(tick)
      }
    }
  })

  return ticks;
}

let updateScopeTicks = () => {
  globals.currentScore = countTotalScore({count: 10});
  globals.totalScore = countTopX();
  globals.totalAscentCount['today'] = countAscents('today').total;
  globals.totalAscentCount['thirtydays'] = countAscents('thirtydays').total;
  globals.totalAscentCount['year'] = countAscents('year').total;
  globals.totalAscentCount['alltime'] = countAscents('alltime').total;
  globals.totalAscents = countAscents('today');

  // Trigger
  let getTicks = globals.ticks;
  globals.ticks = getTicks;

  globals.totalAscentsByType = countAscentsByType();
  globals.averageGrade = averageGrade({count:10});
}


export {
  storeObserver,
  dce,
  svg,
  vibrate,
  triggerCustomEvent,
  countTopX,
  averageGrade,
  eightaNuScore,
  countTotalScore,
  countAscents,
  countAscentsByDifficulty,
  countAscentsByType,
  countAscentsByGrade,
  countGroupScore,
  handleScopeTicks,
  updateScopeTicks,
  parseDate
}
