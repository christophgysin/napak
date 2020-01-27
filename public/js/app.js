import viewHome from '/js/templates/page_home.js';
import viewLogin from '/js/templates/page_login.js';
import viewHistory from '/js/templates/page_history.js';
import viewStatistics from '/js/templates/page_statistics.js';
import viewSettings from '/js/templates/page_settings.js';
import viewGroups from '/js/templates/page_groups.js';
import footer from '/js/partials/footer.js';
import otc from '/js/partials/section_otc.js';
import { route } from '/js/shared/route.js';
import { initAuth } from '/js/shared/auth.js';
import { globals } from '/js/shared/globals.js';
import { user } from '/js/shared/user.js';
import { store }  from '/js/shared/store.js';
import { dce, countAscents, countTotalScore, countTopFive, averageGrade, countAscentsByType }  from '/js/shared/helpers.js';

let napak = {
  initialize : () => {
    globals.routes.home = viewHome;
    globals.routes.history = viewHistory;
    globals.routes.statistics = viewStatistics;
    globals.routes.settings = viewSettings;
    globals.routes.groups = viewGroups;
    globals.routes.login = viewLogin;

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
    globals.storeObservers.push({key: 'ticks', id: 'appTicks', callback: updateAll });
    globals.storeObservers.push({key: 'indoorsOutdoors', id: 'appIndoorsOutdoors', callback: updateAll });

    initAuth();

    // init app
    document.body.innerHTML = "";
    appContainer.append(appContentContainer, pageFooter.render(appContainer), otcMenu.render());

    let naviShadow = dce({el: 'DIV', cssClass: 'navi-shadow'});
    appContainer.append(naviShadow);

    document.body.appendChild(appContainer);

    switch (window.location.pathname) {
      case '/login':
        route('login');
      break;

      default:
        if (!user.login.isLoggedIn) {
          window.location.pathname = '/login';
        } else {
          route('home');
        }
        break;
    }
  },
};

napak.initialize();
