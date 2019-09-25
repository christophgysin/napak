import viewHome from '/js/templates/page_home.js';
import { globals } from '/js/shared/globals.js';
import { store }  from '/js/shared/store.js';
import { countAscents, countTotalScore, countTopFive, averageGrade, countAscentsByType }  from '/js/shared/helpers.js';

let napak = {
  initialize : () => {
    let getTicks = store.read({key: 'ticks'});
    if(getTicks) {
      globals.ticks = getTicks;
    }

    // Update all globals 
    let updateAll = () => {
      globals.currentScore = countTotalScore(); // Array of top scores
      globals.totalScore = countTopFive();  // Top score counted together
      globals.averageGrade = averageGrade(globals.currentScore.reduce((a, b) => Number(a) + Number(b), 0), 5);
      globals.totalAscentsByType = countAscentsByType(); // Total ascents by type: Boulder, Sport, Trad, Toprope
      globals.totalAscents = countAscents();  // Total ascents by ascent type: Redpoint, onsight, flash
      globals.totalAscentCount = countAscents().total; // Total ascent count by scope : today, 30 days etc
    };

    updateAll();
// Listen to tick objects change and update 
    globals.storeObservers.push({key: 'ticks', callback: updateAll });

    // init app
    document.body.innerHTML = "";
    let home = new viewHome();
    document.body.appendChild(home.render());
  }
}

napak.initialize();
