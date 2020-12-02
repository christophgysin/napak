import progress from '/js/templates/partials/section_progress.js';
import gradeWheel from '/js/templates/partials/section_grade-selector.js';
import statusTicker from '/js/templates/partials/status_ticker.js';
import climbingTypeSelector from '/js/templates/partials/climbing_type-selector.js';
import { dce } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';
import { user } from '/js/shared/user.js';



class viewHome {
  constructor() {
    const db = firebase.firestore();
    const dbuser = firebase.auth().currentUser;

    let disciplineSelector = new climbingTypeSelector();

    let ticker = new statusTicker({
      titlePrefix_boulder : 'Bouldering ',
      titlePrefix_sport : 'Climbing sport ',
      titlePrefix_trad : 'Trad climbing ',
      titlePrefix_toprope: 'Top roping ',
      tapAction: () => { disciplineSelector.showMenu()}
    });
    let progressSection = new progress();
    let gradeSelector = new gradeWheel();

    let tickPage = dce({el: 'DIV', cssClass: 'page-tick'});



    tickPage.append(ticker.render(), disciplineSelector.render(), progressSection.render(), gradeSelector.render());

    let newStatusMessage = {
      message : 'Synchronizing ticks',
      spinner: true,
      timeout: -1,
      id : 'tick-sync'
    };

    globals.serverMessage.push(newStatusMessage);
    globals.serverMessage = globals.serverMessage;

    db.collection('users').doc(dbuser.uid).get().then( (doc) => {
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
