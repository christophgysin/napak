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
  let closest = globals.score.font.reduce(function(prev, curr) {
    return (Math.abs(curr - avgr) < Math.abs(prev - avgr) ? curr : prev);
  });

  return globals.grades.font[globals.score.font.indexOf(closest)];
}


// Total scrore
// this is retarded
let countTotalScore = () => {
  let score = [];
  if(globals.ticks && globals.ticks[globals.currentClimbingType].today) {
    for (let i in globals.ticks[globals.currentClimbingType].today) {
      let val = globals.ticks[globals.currentClimbingType].today[i].order;
      let ascentTypes = Object.keys(globals.ticks[globals.currentClimbingType].today[i].ticks);
      ascentTypes.forEach((type) => {
        if(globals.ticks[globals.currentClimbingType].today[i].ticks[type]['count']) {
          let count = Number(globals.ticks[globals.currentClimbingType].today[i].ticks[type]['count']);
          let temp = Array(count).fill(Number(val));
          score.push(temp.flat(Infinity));
        }
      })
    }

    score = score.flat(Infinity).sort( (a, b) => {return b - a}).map( (num) => {
        return globals.score.font[num];
    });
    return score.slice(0, 5).reverse();
  }
  else {
    return [0,0,0,0,0];
  }
}


// Get ascents
let countAscents = () => {
  let ascents = {
    redpoint : 0,
    onsight: 0,
    flash: 0,
    total: 0
  };

  if(globals.ticks && globals.ticks[globals.currentClimbingType].today) {

    for (let i in globals.ticks[globals.currentClimbingType].today) {
      let val = globals.ticks[globals.currentClimbingType].today[i].order;
      let ascentTypes = Object.keys(globals.ticks[globals.currentClimbingType].today[i].ticks);

      ascentTypes.forEach((type) => {
        if(globals.ticks[globals.currentClimbingType].today[i].ticks[type]['count']) {
          if(ascents.hasOwnProperty(type)) {
            ascents[type]+=Number(globals.ticks[globals.currentClimbingType].today[i].ticks[type]['count']);
          }
          if(globals.ticks[globals.currentClimbingType].today[i].ticks[type]['count'] > 0) {
            ascents.total+=Number(globals.ticks[globals.currentClimbingType].today[i].ticks[type]['count']);
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

  if(globals.ticks && globals.ticks[globals.currentClimbingType].today) {

    for (let i in globals.ticks[globals.currentClimbingType].today) {
      let val = globals.ticks[globals.currentClimbingType].today[i].order;
      let ascentTypes = Object.keys(globals.ticks[globals.currentClimbingType].today[i].ticks);

      ascentTypes.forEach((type) => {
        let count;
        if(globals.ticks[globals.currentClimbingType].today[i].ticks[type]['count']) {
          if(ascents.hasOwnProperty(type)) {
            count = globals.ticks[globals.currentClimbingType].today[i].ticks[type]['count'];
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
    for( let i in globals.ticks[type].today ) {
      for( let j in globals.ticks[type].today[i].ticks) {
        types[type]+= globals.ticks[type].today[i].ticks[j].count;
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
  updateScopeTicks
}
