import { globals } from '/js/shared/globals.js';

// Create DOM element
let dce = ( params ) => {
    let element = document.createElement(params.el);

    if(params.cssClass) {
      element.className = params.cssClass;
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
  if(globals.ticks && globals.ticks.boulder.today) {
    for (let i in globals.ticks.boulder.today) {
      let val = globals.ticks.boulder.today[i].order;
      let ascentTypes = Object.keys(globals.ticks.boulder.today[i].ticks);
      ascentTypes.forEach((type) => {
        if(globals.ticks.boulder.today[i].ticks[type]['count']) {
          let count = Number(globals.ticks.boulder.today[i].ticks[type]['count']);
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

  if(globals.ticks && globals.ticks.boulder.today) {

    for (let i in globals.ticks.boulder.today) {
      let val = globals.ticks.boulder.today[i].order;
      let ascentTypes = Object.keys(globals.ticks.boulder.today[i].ticks);

      ascentTypes.forEach((type) => {
        if(globals.ticks.boulder.today[i].ticks[type]['count']) {
          if(ascents.hasOwnProperty(type)) {
            ascents[type]+=Number(globals.ticks.boulder.today[i].ticks[type]['count']);
          }
          if(globals.ticks.boulder.today[i].ticks[type]['count'] > 0) {
            ascents.total+=Number(globals.ticks.boulder.today[i].ticks[type]['count']);
          }
        }
      });
    }
  }
  return ascents;
}


export { dce, triggerCustomEvent , countTopFive, averageGrade, countTotalScore, countAscents}
