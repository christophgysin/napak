import viewHome from '/js/templates/page_home.js';
import viewLogin from '/js/templates/page_login.js';
import viewHistory from '/js/templates/page_history.js';
import viewStatistics from '/js/templates/page_statistics.js';
import viewSettings from '/js/templates/page_settings.js';
import viewGroups from '/js/templates/page_groups.js';
import viewSignup from '/js/templates/page_signup.js';
import footer from '/js/templates/partials/footer.js';
import otc from '/js/templates/partials/section_otc.js';
import { route } from '/js/shared/route.js';

import { globals } from '/js/shared/globals.js';
import { user } from '/js/shared/user.js';
import { dce, storeObserver, countAscents, countTotalScore, countTopFive, averageGrade, countAscentsByType }  from '/js/shared/helpers.js';


let napak = {
  initialize : () => {
    globals.routes.home = viewHome;
    globals.routes.history = viewHistory;
    globals.routes.statistics = viewStatistics;
    globals.routes.settings = viewSettings;
    globals.routes.groups = viewGroups;
    globals.routes.login = viewLogin;
    globals.routes.signup = viewSignup;

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

    updateAll();

    // Listen to tick objects change and update
    storeObserver.add({
      store: globals,
      key: 'ticks', 
      id: 'appTicks', 
      callback: updateAll 
    });

    storeObserver.add({
      store: globals,
      key: 'indoorsOutdoors', 
      id: 'appIndoorsOutdoors', 
      callback: updateAll 
    });

    // init app
    document.body.innerHTML = "";
    appContainer.append(appContentContainer, pageFooter.render(appContainer), otcMenu.render());

    let naviShadow = dce({el: 'DIV', cssClass: 'navi-shadow'});
    appContainer.append(naviShadow);

    document.body.appendChild(appContainer);

    let loginStatus = () => {
      if(!user.login.isLoggedIn) {route('login');}
      else {route('home');}
    }
    
    user.storeObservers.push({key: 'login', callback: loginStatus})

    loginStatus();
  }
}

napak.initialize();