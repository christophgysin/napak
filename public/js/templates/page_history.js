import { globals } from '/js/shared/globals.js';
import { handleDate} from '/js/shared/date.js';
import { dce } from '/js/shared/helpers.js';

class viewHistory {
  constructor() {
    let ticks = globals.ticks;

    let container = dce({el: 'SECTION', cssClass: 'page-tick'});
    let nakki = dce({el: 'H3', content: 'Ticks archive'});

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

    let currentDate = "0000-00-00";
    for( let i=ticks.length-1, j = 0; i>=j; i-- ) {
      let tickDate = handleDate({dateString: ticks[i].date});
      if(tickDate !== currentDate) {
        let headerRow = dce({el: 'TR', cssClass: 'header'});
        let headerTitle = dce({el: 'TH', content: tickDate, attrbs: [['colspan', 4]]});
        headerRow.appendChild(headerTitle);
        el.appendChild(headerRow);
        currentDate = tickDate
      }

      let row = dce({el: 'TR'});
      // let date = dce({el: 'TD', content: handleDate({dateString: ticks[i].date})});
      let indoors = dce({el: 'TD', content: ticks[i].indoorsOutdoors});
      let type = dce({el: 'TD', content: ticks[i].type});
      let gradeContainer = dce({el: 'TD'});
      let grade = dce({el: 'SPAN', cssClass: 'grade-legend', content: globals.grades.font[ticks[i].grade]});
      gradeContainer.appendChild(grade);
      let ascentType = dce({el: 'TD', content: ticks[i].ascentType});
      row.append(/*date,*/ gradeContainer, ascentType, type, indoors);
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
