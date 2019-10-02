import { globals } from '/js/shared/globals.js';

// Create DOM element
let dce = ( params ) => {
      let element = document.createElement(params.el);

      if(params.cssClass) {
      element.className = params.cssClass;
    }

    if(params.source) {
      element.setAttribute('src', params.source);
    }

    if(params.cssStyle) {
      element.setAttribute('style', params.cssStyle);
    }

    if(params.id) {
      element.setAttribute('id', params.id);
    }

    if(params.content) {
      element.appendChild(document.createTextNode(params.content));
    }

    if(params.attrbs) {
      for(let i=0, j=params.attrbs.length; i<j; i++) {
        element.setAttribute(params.attrbs[i][0], params.attrbs[i][1]);
      }
    }
  return element;
}


// Create SVG element
let svg = ( params ) => {
  let xlmns = 'http://www.w3.org/2000/svg';
  let element = document.createElementNS(xlmns, params.el);

  if(params.cssClass) {
    element.className = params.cssClass;
  }

  if(params.cssStyle) {
    element.setAttribute('style', params.cssStyle);
  }

  if(params.id) {
    element.setAttribute('id', params.id);
  }

  if(params.attrbs) {
    for(let i=0, j=params.attrbs.length; i<j; i++) {
      element.setAttributeNS(null, params.attrbs[i][0], params.attrbs[i][1]);
    }
  }
return element;
}


// Custom events
let triggerCustomEvent = ( params ) => {
  let vent = new CustomEvent(params.vent, params.data);
  if(params.dispatch) {
    document.dispatchEvent(vent);
  }
}


// Count top 5 score
let countTopFive = ( ) => {
  return globals.currentScore.reduce((a, b) => Number(a) + Number(b), 0);

}

// Count average grade
let averageGrade = ( grades, amount ) => {
  if(!grades) {
    return 'N/A'
  }
  let avgr = grades / amount;
  let closest = globals.grades.font.reduce(function(prev, curr) {
    return (Math.abs(curr - avgr) < Math.abs(prev - avgr) ? curr : prev);
  });

  return globals.grades.font[globals.grades.font.indexOf(closest)];
}


// Total score
// this is retarded
let countTotalScore = () => {
  let score = [];
  if(globals.ticks && globals.ticks[globals.currentClimbingType].today && globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors]) {
    for (let i in globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors]) {
      let val = globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors][i].order;
      let ascentTypes = Object.keys(globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors][i].ticks);
      ascentTypes.forEach((type) => {
        if(globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors][i].ticks[type]) {
          let count = globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors][i].ticks[type].length;
          if(count) {
            let temp = Array(count).fill(Number(eightaNuScore({'type': type, grade: i, sport: globals.currentClimbingType})));
            score.push(temp.flat(Infinity));
          }
        }
      })
    }

    score = score.flat(Infinity).sort(function(a, b){return b-a});
    return score.slice(0, 5);
  }
  else {
    return [0,0,0,0,0];
  }
}


let eightaNuScore = (data) => {
  let score = 0;
  let bonusgrade = 0;
  let ontop = 0;

  if(data.type === 'flash') {
    bonusgrade=1; 
    ontop = 3;
  }

  if(data.type === 'onsight') {
    bonusgrade= (data.sport === 'boulder') ? 2 : 3; // Boulder onsight jumps two grades instead of three
    ontop = -5;
  }
  if(data.sport === 'toprope') {
    bonusgrade-= 1;
  }

  let grade = Number(data.grade)+bonusgrade;
  score = ( grade + ( ( grade >= 5 ) ? 3: 1 ) ) * 50 + ontop;
  return score;
}

// Get ascents
let countAscents = () => {
  let ascents = {
    redpoint : 0,
    onsight: 0,
    flash: 0,
    total: 0
  };

  if(globals.ticks && globals.ticks[globals.currentClimbingType].today && globals.ticks[globals.currentClimbingType].today[[globals.indoorsOutdoors]]) {

    for (let i in globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors]) {
      let val = globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors][i].order;
      let ascentTypes = Object.keys(globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors][i].ticks);

      ascentTypes.forEach((type) => {
        if(globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors][i].ticks[type]) {
          if(ascents.hasOwnProperty(type)) {
            ascents[type]+=Number(globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors][i].ticks[type].length);
          }
          if(globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors][i].ticks[type].length > 0) {
            ascents.total+=Number(globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors][i].ticks[type].length);
          }
        }
      });
    }
  }
  return ascents;
}

// Get ascents by difficulty
let countAscentsByDifficulty = () => {
  let ascents = {
    redpoint : {},
    onsight: {},
    flash: {}
  };

  if(globals.ticks && globals.ticks[globals.currentClimbingType].today && globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors]) {

    for (let i in globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors]) {
      let val = globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors][i].order;
      let ascentTypes = Object.keys(globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors][i].ticks);

      ascentTypes.forEach((type) => {
        let count;
        if(globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors][i].ticks[type]) {
          if(ascents.hasOwnProperty(type)) {
            count = globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors][i].ticks[type].length;
          }
          else {
            count = 0;            
          }
        }
        ascents[type][val] = {count: count};
      });
    }
  }
  return ascents;
}

// Get ascents by difficulty
let countAscentsByType = () => {
  let types = {
    boulder : 0,
    sport : 0,
    toprope: 0,
    trad:0
  };


  let temp = Object.keys(types);
  temp.forEach((type) => {
    for( let i in globals.ticks[type].today[globals.indoorsOutdoors] ) {
      for( let j in globals.ticks[type].today[globals.indoorsOutdoors][i].ticks) {
        types[type]+= globals.ticks[type].today[globals.indoorsOutdoors][i].ticks[j].length;
      }
    }
  });
  return types;
}


let updateScopeTicks = () => {
    // Clear legends
    // do this somewhere else
    let legends = document.querySelector('.select-dialog').querySelectorAll('.legends-holder');    
    legends.forEach((nodes) => {
      while (nodes.childNodes.length > 0) {
        nodes.removeChild(nodes.lastChild);
      }        
    })
        
    globals.currentScore = countTotalScore();
    globals.totalScore = countTopFive();
    globals.averageGrade = averageGrade(globals.currentScore.reduce((a, b) => Number(a) + Number(b), 0), 5);
    globals.totalAscentCount = countAscents().total;
    globals.totalAscents = countAscents();
    let getTicks = globals.ticks;
    globals.ticks = getTicks;
    globals.totalAscentsByType = countAscentsByType();
}


/* Handle dates */
let handleDate = (params) => {
  if (!params.dateString) {return;}
    
  let dateString = new Date(params.dateString),
    dateFormat = (params.dateFormat) ? params.dateFormat : 'yyyy-mm-dd';

  let json = {
      dd: dateString.getDate(),
      yyyy: dateString.getFullYear(),
      mm: dateString.getMonth() + 1,
      HH: ('0' + dateString.getHours()).substr(-2),
      MM: ('0' + dateString.getMinutes()).substr(-2),
      SS: ('0' + dateString.getSeconds()).substr(-2),
      MS: ('0' + dateString.getMilliseconds()).substr(-2)
  };

  for (let i in json) {
      let patt = new RegExp(i, 'gm');
      if (dateFormat.match(patt) !== null) {
          dateFormat = dateFormat.replace(patt, json[i]);
      }
  }
  return dateFormat;
};


export {
  dce, 
  svg, 
  triggerCustomEvent, 
  countTopFive, 
  averageGrade, 
  countTotalScore, 
  countAscents, 
  countAscentsByDifficulty,
  countAscentsByType,
  updateScopeTicks,
  handleDate
}
