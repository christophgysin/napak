import { dce } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';

class statusTicker {
  constructor() {
    let container = dce({el: 'DIV', cssClass: 'current status-ticker'});

    let currentClimbingTypeTitle = () => {
      if (globals.currentClimbingType === 'boulder') return `Bouldering ${globals.indoorsOutdoors}`;
      if (globals.currentClimbingType === 'sport') return `Climbing sport ${globals.indoorsOutdoors}`;
      if (globals.currentClimbingType === 'trad') return `Climbing trad ${globals.indoorsOutdoors}`;
      if (globals.currentClimbingType === 'toprope') return `Top roping ${globals.indoorsOutdoors}`;
      return globals.indoorsOutdoors;
    }
/* Move this to new component -> */

    let currentTitle = dce({el: 'DIV'});
    let currentTitleContent = dce({el: 'H3', content: currentClimbingTypeTitle()});
    currentTitle.appendChild(currentTitleContent);
    container.appendChild(currentTitle);

    let currentStatus = dce({el: 'DIV', cssClass: 'network'});
    let currentStatusContent = dce({el: 'H3', content: 'Synchronizing ticks'});
    currentStatus.appendChild(currentStatusContent)
    container.appendChild(currentStatus);

    if(container.childNodes.length > 0 ) {
      container.classList.add('show-message')
    }


    globals.storeObservers.push({
      key: 'currentClimbingType',
      id: 'homepageCurrentClimbingType',
      callback: () => {
        currentTitleContent.innerHTML = currentClimbingTypeTitle();
      }
    });

    globals.storeObservers.push({
      key: 'indoorsOutdoors',
      id: 'homepageIndoorsOutdoors',
      callback: () => {
        currentTitleContent.innerHTML = currentClimbingTypeTitle();
      }
    });

    setTimeout(() => {container.classList.remove('show-message')}, 3000)
/* <- Move this to new component */

    this.render = () => {
      return container;
    }
  }
}

export default statusTicker;
