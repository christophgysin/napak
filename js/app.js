import viewHome from '/js/templates/page_home.js';
import { globals } from '/js/shared/globals.js';
import { store }  from '/js/shared/store.js';
import { countTotalScore, countTopFive, countAscents, averageGrade }  from '/js/shared/helpers.js';

let napak = {
  initialize : () => {
    let getTicks = store.read({key: 'ticks'});
    if(getTicks) {
      globals.ticks = getTicks;
    }

    countAscents();
    // Count total score
    globals.currentScore = countTotalScore();
    // Count top 5 score
    globals.totalScore = countTopFive();
    // Count average grade
    globals.averageGrade = averageGrade(globals.currentScore.reduce((a, b) => Number(a) + Number(b), 0), 5);
    // get ascents
    globals.totalAscentCount = countAscents().total;
    globals.totalAscents = countAscents();



    document.body.innerHTML = "";
    let home = new viewHome();
    document.body.appendChild(home.render());
  }
}

napak.initialize();
