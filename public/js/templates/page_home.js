import progress from '/js/templates/partials/section_progress.js';
import gradeWheel from '/js/templates/partials/section_grade-selector.js';
import statusTicker from '/js/templates/partials/status_ticker.js';
import { dce } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';
 
class viewHome {
  constructor() {
    const db = firebase.firestore();
    const user = firebase.auth().currentUser;
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

    let newStatusMessage = {
      message : 'Synchronizing ticks',
      spinner: true,
      timeout: -1,
      id : 'tick-sync'
    };

    globals.serverMessage.push(newStatusMessage);
    globals.serverMessage = globals.serverMessage;

    db.collection('users').doc(user.uid).get().then( (doc) => {
      const data = doc.data();
      globals.serverMessage[0].finished = true; 
      globals.serverMessage = globals.serverMessage;
      if(data.ticks) {
        globals.ticks = data.ticks;
      }
    });

    this.render = () => {
      return tickPage;
    }
  }
}

export default viewHome;
