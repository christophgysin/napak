import progress from '/js/templates/partials/section_progress.js';
import gradeWheel from '/js/templates/partials/section_grade-selector.js';
import statusTicker from '/js/templates/partials/status_ticker.js';
import { dce, fireStoreParser, unmarshal } from '/js/shared/helpers.js';
import { user } from '/js/shared/user.js';
import { globals } from '/js/shared/globals.js';
import { store } from '/js/shared/store.js';
 
class viewHome {
  constructor() {
    let ticker = new statusTicker({
      titlePrefix_boulder : 'Bouldering ',
      titlePrefix_sport : 'Climbing sport ',
      titlePrefix_trad : 'Trad climbing ',
      titlePrefix_toprope: 'Top roping '
    });
    let progressSection = new progress();
    let gradeSelector = new gradeWheel();

    let tickPage = dce({el: 'DIV', cssClass: 'page-tick'});
    
    tickPage.appendChild(ticker.render());
    tickPage.appendChild(progressSection.render());
    tickPage.appendChild(gradeSelector.render());

  /* emulate network request */
  let newStatusMessage = {
    message : 'Synchronizing ticks',
    spinner: true,
    id : 'tick-sync'
  };

  globals.serverMessage.push(newStatusMessage);
  globals.serverMessage = globals.serverMessage;


  // Move this somewhere else 
  let mergeTicks = (myJson) => {
    let data = fireStoreParser(myJson);
    let serverTicks = data.documents[0].fields.user.ticks ? data.documents[0].fields.user.ticks :  [];
    let userFromStorage = store.read({key: 'user'});
    let userTicks = (userFromStorage.ticks) ? userFromStorage.ticks : []; 

    // set of unique id's
    var ids = new Set(userTicks.map(d => d.uuid));
    // merge arrays and filter out duplicates
    var merged = [...userTicks, ...serverTicks.filter(d => !ids.has(d.uuid))];

    // update local storage
    userFromStorage.ticks = merged;
    store.write({
      key: 'user',
      keydata: userFromStorage
    });

    // update user and global ticks
    user.ticks = merged;
    globals.ticks = merged;

    globals.serverMessage[0].finished = true; 
    globals.serverMessage = globals.serverMessage;
  }

  /*
  fetch(`https://firestore.googleapis.com/v1/projects/napak-13839/databases/(default)/documents/users?auth=${JSON.parse(localStorage.getItem("user")).idToken}`)
    .then((response) => {
      let newStatusMessage = {
        message : 'Synchronizing ticks',
        spinner: true,
        timeout: -1,
        id : 'tick-sync'
      };
      return response.json();
    })
    .then((myJson) => {
      mergeTicks(myJson)
  });
*/


    this.render = () => {
      return tickPage;
    }
  }
}

export default viewHome;
