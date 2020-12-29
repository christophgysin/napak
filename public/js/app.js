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

import { dce, storeObserver, countAscents, countTotalScore, countGroupScore, countTopX, averageGrade, countAscentsByType }  from '/js/shared/helpers.js';

import { globals } from '/js/shared/globals.js';
import { user } from '/js/shared/user.js';

import { store } from '/js/shared/store.js';
import { animate } from '/js/shared/animate.js';

import geoLocation from '/js/shared/geolocation.js';

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
        keydata: globals.totalScoreByType,
        removeOnRouteChange: false
      });
    }

    // listen ticks - update score to firebase
    storeObserver.add({
      store: globals,
      key: 'ticks',
      id: 'appGroupScore',
      callback: updateGroupScore,
      removeOnRouteChange: false
    });

    // Listen to tick objects change and update
    storeObserver.add({
      store: globals,
      key: 'ticks',
      id: 'appTicks',
      callback: updateAll,
      removeOnRouteChange: false
    });

    storeObserver.add({
      store: globals,
      key: 'indoorsOutdoors',
      id: 'appIndoorsOutdoors',
      callback: updateAll,
      removeOnRouteChange: false
    });

    storeObserver.add({
      store: globals,
      key: 'currentClimbingType',
      id: 'appCurrentClimbingType',
      callback: updateAll,
      removeOnRouteChange: false
    });


    const trackMe = new geoLocation();

    // init app
    appContainer.append(appContentContainer, pageFooter.render(appContainer), otcMenu.render());

    let naviShadow = dce({el: 'DIV', cssClass: 'navi-shadow'});

    naviShadow.addEventListener('click', () => {
      document.body.classList.remove('otc');
    }, false);
    appContainer.append(naviShadow);

    gridContainer.appendChild(appContainer);
    document.body.appendChild(gridContainer);

    // check user login status
    let loginStatus = () => {
      firebase.auth().onAuthStateChanged(function(fbUser) {
        // hide splash screen
        let el =  document.body.querySelector('.splash');
        if(el) {
          el.style['animation'] = "fadeout 1000ms ease-in-out";
          animate.watch({
            el: el,
            execute: () => {el.parentNode.removeChild(el)},
            unwatch: true
            });
          }

        // user is logged in
        if (fbUser) {
          const db = firebase.firestore();
          const dbuser = firebase.auth().currentUser;
          
          db.collection('users').doc(dbuser.uid).get().then( (doc) => {
            const data = doc.data();
            user.name = data.user;

            // enable geolocation (if set on)
            new geoLocation();

            // update user name to highscore store (is this needed)
            store.update({
              store: 'score',
              key: 'displayName',
              keydata:  user.name.displayName
              });
            }).catch((err)=>{console.log(err)})

            // Get user ticks
            db.collection('users').doc(dbuser.uid).get().then( (doc) => {
              // show status ticker for tick sync
              let newStatusMessage = {
                message : 'Synchronizing ticks',
                spinner: true,
                timeout: -1,
                id : 'tick-sync'
              };
          
              globals.serverMessage.push(newStatusMessage);
              globals.serverMessage = globals.serverMessage;
  
              const data = doc.data();
              if(data.ticks) {
                globals.ticks = data.ticks;
              }
            // route uset to home after login
            }).then( () => {
              // user is logged in, route 
              let routePath = window.location.pathname.slice(1);
              route({page: (routePath !== "" && routePath !== 'login') ? routePath : 'home'});
              // ticks are synced - removed ticker
              globals.serverMessage[0].finished = true;
              globals.serverMessage = globals.serverMessage;
          });
          } else {
            route({page: 'login'});
          }
      });
    }

/* Swipe to open otc menu -> */
    let startX = 0;
    let startY = 0;

    appContentContainer.addEventListener('touchstart', handleTouchStart, false);
    appContentContainer.addEventListener('touchend', handleTouchEnd, false);

    naviShadow.addEventListener('touchstart', handleTouchStart, false);
    naviShadow.addEventListener('touchend', handleTouchEnd, false);
    
    function handleTouchStart(e) {
      startX = e.changedTouches[0].screenX;
      startY = e.changedTouches[0].screenY;
    }

    function handleTouchEnd(e) {
      // prevent opening OTC menu when modal is open
      if(document.body.classList.contains('modal-open')){
        return;
      }
      const diffX = e.changedTouches[0].screenX - startX;
      const diffY = e.changedTouches[0].screenY - startY;
      const ratioX = Math.abs(diffX / diffY);
      const ratioY = Math.abs(diffY / diffX);
      const absDiff = Math.abs(ratioX > ratioY ? diffX : diffY);

      if (absDiff < 30) {return;}

      if (ratioX > ratioY) {
        if (diffX >= 0) {document.body.classList.remove('otc')}  // right
        else {document.body.classList.add('otc')} // left
      } else {
        if (diffY >= 0) {} // down
        else {} // up
      }
    }
/* <- Swipe to open otc menu  */
/*
    storeObserver.add({
      store: user,
      key: 'login',
      id: 'userLogin',
      callback: loginStatus,
      removeOnRouteChange: false
    });
*/

// handle pop state events
  window.addEventListener('popstate', (evt) => {
    let parseURL =  window.location.pathname.slice(1);
    let params = new Array();
		let routeParams = parseURL.split("/");
		for(let i=1; i < routeParams.length; i++){
			params.push(routeParams[i]);
      };
    route({page: parseURL, params: params})
  }, false);


    loginStatus();
  }
}

napak.initialize();
