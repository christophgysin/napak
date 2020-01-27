import progress from '/js/partials/section_progress.js';
import gradeWheel from '/js/partials/section_grade-selector.js';
import statusTicker from '/js/partials/status_ticker.js';
import { globals } from '/js/shared/globals.js';
import { dce } from '/js/shared/helpers.js';

class viewHome {
  constructor() {
    let progressSection = new progress();
    let gradeSelector = new gradeWheel();
    let ticker = new statusTicker();

    let tickPage = dce({el: 'DIV', cssClass: 'page-tick'});


    globals.storeObservers.push({
      key: 'currentClimbingType',
      id: 'homepageCurrentClimbingType',
      callback: () => {
        currentTitle.innerHTML = currentClimbingTypeTitle();
      }
    });

    globals.storeObservers.push({
      key: 'indoorsOutdoors',
      id: 'homepageIndoorsOutdoors',
      callback: () => {
        currentTitle.innerHTML = currentClimbingTypeTitle();
      }
    });

    tickPage.appendChild(ticker.render());
    tickPage.appendChild(progressSection.render());
    tickPage.appendChild(gradeSelector.render());

    this.render = () => {
      return tickPage;
    }
  }
}

export default viewHome;
