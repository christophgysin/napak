import viewHome from '/js/templates/page_home.js';
import viewHistory from '/js/templates/page_history.js';
import viewStatistics from '/js/templates/page_statistics.js';
import footer from '/js/partials/footer.js';
import otc from '/js/partials/section_otc.js';

import { globals } from '/js/shared/globals.js';
import { store }  from '/js/shared/store.js';
import { dce, countAscents, countTotalScore, countTopFive, averageGrade, countAscentsByType}  from '/js/shared/helpers.js';

let napak = {
  initialize : () => {
    globals.routes.home = viewHome;
    globals.routes.history = viewHistory;
    globals.routes.statistics = viewStatistics;

    let appContainer = dce({el: 'DIV', cssClass : 'app'});
    let appContentContainer = dce({el: 'DIV', cssClass : 'page-content'});
    let pageFooter = new footer();
    let otcMenu = new otc();


    // Update all globals 
    let updateAll = () => {
      globals.currentScore = countTotalScore(); // Array of top scores
      globals.totalScore = countTopFive();  // Top score counted together
      globals.averageGrade = averageGrade(5);
      globals.totalAscentsByType = countAscentsByType(); // Total ascents by type: Boulder, Sport, Trad, Toprope
      globals.totalAscents = countAscents('today');  // Total ascents by ascent type: Redpoint, onsight, flash

      globals.totalAscentCount['today'] = countAscents('today').total;
      globals.totalAscentCount['thirtydays'] = countAscents('thirtydays').total;
      globals.totalAscentCount['year'] = countAscents('year').total;
      globals.totalAscentCount['alltime'] = countAscents('alltime').total;
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

    // init app
    document.body.innerHTML = "";
    let home = new viewHome();
    appContentContainer.appendChild(home.render())
    appContainer.append(appContentContainer, pageFooter.render(appContainer));

    let naviShadow = dce({el: 'DIV', cssClass: 'navi-shadow'});
    appContainer.append(naviShadow, otcMenu.render());

    document.body.appendChild(appContainer);
  }
}

napak.initialize();
