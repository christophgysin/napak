import { globals } from '/js/shared/globals.js';
import { handleDate} from '/js/shared/date.js';
import { dce } from '/js/shared/helpers.js';

class viewHistory {
  constructor() {
    let ticks = globals.ticks;

    let container = dce({el: 'SECTION', cssClass: 'ticks-page'});
    let nakki = dce({el: 'H3', content: 'meh'});

    let ticksContainer = dce({el: 'DIV', cssClass: 'today tick-list'});
    let el = dce({el: 'TABLE'});

    ticks.sort(function(a, b){
      var keyA = a.date,
          keyB = b.date;
      // Compare the 2 dates
      if(keyA < keyB) return -1;
      if(keyA > keyB) return 1;
      return 0;
  });

    for( let i=ticks.length-1, j = 0; i>=j; i-- ) {
      let row = dce({el: 'TR'});
      let date = dce({el: 'TD', content: handleDate({dateString: ticks[i].date})});
      let indoors = dce({el: 'TD', content: ticks[i].indoorsOutdoors});
      let type = dce({el: 'TD', content: ticks[i].type});
      let grade = dce({el: 'TD', content: globals.grades.font[ticks[i].grade]});
      let ascentType = dce({el: 'TD', content: ticks[i].ascentType});
      row.append(date, indoors, type, grade, ascentType);
      el.appendChild(row);
    }
    ticksContainer.appendChild(el);
    container.append(nakki, ticksContainer)
    this.render = () => {
      return container
    }  
  }
}

export default viewHistory;
