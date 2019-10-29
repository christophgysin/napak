import { globals } from '/js/shared/globals.js';
import { dce } from '/js/shared/helpers.js';
import charts from '/js/components/charts.js';

class viewStatistics {
  constructor() {
    let ticks = globals.ticks;

    let container = dce({el: 'SECTION', cssClass: 'ticks-page'});
    let nakki = dce({el: 'H3', content: 'pöh'});

    let lempo = new charts();

    container.append(nakki, lempo.render())
    this.render = () => {
      return container
    }  
  }
}

export default viewStatistics;
