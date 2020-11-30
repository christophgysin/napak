/*

Observers

globals
  :score
  :ticks
    > updateGroupScore
    > updateAll
  :indoorsOutdoors
    > updateAll
  :currentClimbingType
    > updateAll
  :currentClimbingType
    > updateGroupStanding
*/


import viewGroups from '/js/templates/page_groups.js';
import viewHistory from '/js/templates/page_history.js';
import viewHome from '/js/templates/page_home.js';
import viewLogin from '/js/templates/page_login.js';
import viewProfile from '/js/templates/page_profile.js';
import viewSignup from '/js/templates/page_signup.js';
import viewStatistics from '/js/templates/page_statistics.js';
import viewResetPassword from '/js/templates/page_reset-password.js';
import footer from '/js/templates/partials/footer.js';
import otc from '/js/templates/partials/section_otc.js';
import { route } from '/js/shared/route.js';

import { globals } from '/js/shared/globals.js';
import { user } from '/js/shared/user.js';
import { dce, storeObserver, countAscents, countTotalScore, countGroupScore, countTopX, averageGrade, countAscentsByType }  from '/js/shared/helpers.js';

import { store } from '/js/shared/store.js';

let napak = {
  initialize : () => {
    globals.routes.groups = viewGroups;
    globals.routes.history = viewHistory;
    globals.routes.home = viewHome;
    globals.routes.login = viewLogin;
    globals.routes.profile = viewProfile;
    globals.routes.signup = viewSignup;
    globals.routes.statistics = viewStatistics;
    globals.routes.resetPassword = viewResetPassword;

    let gridContainer = dce({el: 'DIV', cssClass: 'grid-container'});
    let appContainer = dce({el: 'DIV', cssClass : 'app'});
    let appContentContainer = dce({el: 'DIV', cssClass : 'page-content'});
    let pageFooter = new footer();
    let otcMenu = new otc();

    // Update all globals
    let updateAll = () => {
      globals.currentScore = countTotalScore({count : 10}); // Array of top scores
      globals.totalScore = countTopX({count: 10});  // Top score counted together
      globals.averageGrade = averageGrade({count: 10});
      globals.totalAscentsByType = countAscentsByType(); // Total ascents by type: Boulder, Sport, Trad, Toprope
      globals.totalAscents = countAscents('today');  // Total ascents by ascent type: Redpoint, onsight, flash

      globals.totalAscentCount['today'] = countAscents('today').total;
      globals.totalAscentCount['thirtydays'] = countAscents('thirtydays').total;
      globals.totalAscentCount['year'] = countAscents('year').total;
      globals.totalAscentCount['alltime'] = countAscents('alltime').total;

      // Update background image
      if(globals.indoorsOutdoors === 'indoors') {document.body.classList.add('indoors');}
      else {document.body.classList.remove('indoors');}
    };

//    updateAll();

    // update user score to firebase
    let updateGroupScore = () => {
      globals.totalScoreByType = countGroupScore();
      store.update({
        store: 'score',
        key: 'current',
        keydata: globals.totalScoreByType
      });
    }

    // listen ticks - update score to firebase
    storeObserver.add({
      store: globals,
      key: 'ticks',
      id: 'appGroupScore',
      callback: updateGroupScore
    });

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

    storeObserver.add({
      store: globals,
      key: 'currentClimbingType',
      id: 'appCurrentClimbingType',
      callback: updateAll
    });

    // init app
    document.body.innerHTML = "";
    appContainer.append(appContentContainer, pageFooter.render(appContainer), otcMenu.render());

    let naviShadow = dce({el: 'DIV', cssClass: 'navi-shadow'});

    naviShadow.addEventListener('click', () => {
      document.body.classList.remove('otc');
    }, false);
    appContainer.append(naviShadow);

    gridContainer.appendChild(appContainer);
    document.body.appendChild(gridContainer);

    let loginStatus = () => {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          route('home');
        } else {
          route('login');
        }
      });
    }

    user.storeObservers.push({key: 'login', callback: loginStatus})

    loginStatus();
  }
}

napak.initialize();
