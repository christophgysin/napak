import progress from '/js/partials/section_progress.js';
import gradeWheel from '/js/partials/section_grade-selector.js';

import { globals } from '/js/shared/globals.js';
import { dce } from '/js/shared/helpers.js';

class viewHome {
  constructor() {
    let progressSection = new progress();
    let gradeSelector = new gradeWheel();

    let tickPage = dce({el: 'DIV', cssClass: 'tick-page'});
    let inOutSelector = dce({el: 'DIV', cssClass: 'in-out-selector'});

    let current = dce({el: 'DIV', cssClass: 'current'});

    let currentClimbingTypeTitle = () => {
      if (globals.currentClimbingType === 'boulder') return `Bouldering ${globals.indoorsOutdoors}`;
      if (globals.currentClimbingType === 'sport') return `Climbing sport ${globals.indoorsOutdoors}`;
      if (globals.currentClimbingType === 'trad') return `Climbing trad ${globals.indoorsOutdoors}`;
      if (globals.currentClimbingType === 'toprope') return `Top roping ${globals.indoorsOutdoors}`;
      return globals.indoorsOutdoors;
    }

    let currentTitle = dce({el: 'H3', content: currentClimbingTypeTitle()});
    current.appendChild(currentTitle);

    globals.storeObservers.push({key: 'currentClimbingType', callback: () => {
      currentTitle.innerHTML = currentClimbingTypeTitle();
    }}); 

    globals.storeObservers.push({key: 'indoorsOutdoors', callback: () => {
      currentTitle.innerHTML = currentClimbingTypeTitle();
    }}); 


    inOutSelector.appendChild(current);

    tickPage.appendChild(inOutSelector);
    tickPage.appendChild(progressSection.render());
    tickPage.appendChild(gradeSelector.render());

    this.render = () => {
      return tickPage;
      }
		}
  }

export default viewHome;
