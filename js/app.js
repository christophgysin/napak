import viewHome from '/js/templates/page_home.js';
import { globals } from '/js/shared/globals.js';
import { store }  from '/js/shared/store.js';
import { countAscents, countTotalScore, countTopFive, averageGrade, countAscentsByType, allTime}  from '/js/shared/helpers.js';

let napak = {
  initialize : () => {
    // Update all globals 
    let updateAll = () => {
      globals.currentScore = countTotalScore(); // Array of top scores
      globals.totalScore = countTopFive();  // Top score counted together
      globals.averageGrade = averageGrade(globals.currentScore.reduce((a, b) => Number(a) + Number(b), 0), 5);
      globals.totalAscentsByType = countAscentsByType(); // Total ascents by type: Boulder, Sport, Trad, Toprope
      globals.totalAscents = countAscents();  // Total ascents by ascent type: Redpoint, onsight, flash
      globals.totalAscentCount = countAscents().total; // Total ascent count by scope : today, 30 days etc
    };

// Listen to tick objects change and update 
    globals.storeObservers.push({key: 'ticks', callback: updateAll });
    globals.storeObservers.push({key: 'indoorsOutdoors', callback: updateAll });

  // Get old ticks from local storage
    let getTicks = store.read({key: 'ticks'});
    
    if(getTicks) {
      // Merge 
      for(let i in getTicks) {
        globals.ticks[i] = {...globals.ticks[i], ...getTicks[i]}
      }
    }

    globals.ticks = globals.ticks;

    allTime();


    // init app
    document.body.innerHTML = "";
    let home = new viewHome();
    document.body.appendChild(home.render());
  }
}

napak.initialize();
