import progress from '/js/templates/partials/section_progress.js';
import gradeWheel from '/js/templates/partials/section_grade-selector.js';
import statusTicker from '/js/templates/partials/status_ticker.js';
import { globals } from '/js/shared/globals.js';
import { dce } from '/js/shared/helpers.js';

class viewHome {
  constructor() {
    let progressSection = new progress();
    let gradeSelector = new gradeWheel();
    let ticker = new statusTicker();

    let tickPage = dce({el: 'DIV', cssClass: 'page-tick'});

    tickPage.appendChild(ticker.render());
    tickPage.appendChild(progressSection.render());
    tickPage.appendChild(gradeSelector.render());

    this.render = () => {
      return tickPage;
    }
  }
}

export default viewHome;
