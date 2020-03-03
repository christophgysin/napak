import { globals } from '/js/shared/globals.js';
import { handleDate } from '/js/shared/date.js';
import { dce, storeObserver, handleScopeTicks, eightaNuScore } from '/js/shared/helpers.js';
import statusTicker from '/js/templates/partials/status_ticker.js';

class viewHistory {
  constructor() {
    let container = dce({el: 'DIV', cssClass: 'page-history'});

    let ticker = new statusTicker({
      titlePrefix_boulder : 'Ticks archive - Bouldering',
      titlePrefix_sport : 'Ticks archive -  Sport',
      titlePrefix_trad : 'Ticks archive - Trad',
      titlePrefix_toprope: 'Ticks archive - Top rope',
      hideIndoorsOutdoors : true
    });


    let scrollContainer = dce({el: 'DIV', cssClass : 'scroll-container'});
    let historyContent = dce({el: 'DIV', cssClass: 'history-content'});

    let ticksContainer = dce({el: 'DIV', cssClass: 'today tick-list'});
    let el = dce({el: 'TABLE'});

    let updateHistory = () => {
      el.innerHTML = "";
      let ticks = handleScopeTicks({scope: 'alltime'});

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
          let headerTitle = dce({el: 'TH', content: handleDate({dateString : tickDate, dateFormat : 'yyyy-mm-dd'}), attrbs: [['colspan', 5]]});
          headerRow.appendChild(headerTitle);
          el.appendChild(headerRow);
          currentDate = tickDate
        }

        let row = dce({el: 'TR'});
        // let date = dce({el: 'TD', content: handleDate({dateString: ticks[i].date})});
        let indoors = dce({el: 'TD', content: ticks[i].indoorsOutdoors});
        let type = dce({el: 'TD', content: ticks[i].type});
        let gradeContainer = dce({el: 'TD'});
        let grade = dce({el: 'SPAN', cssClass: `grade-legend ${globals.difficulty[ticks[i].grade]}`, content: globals.grades.font[ticks[i].grade]});
        gradeContainer.appendChild(grade);
        let ascentType = dce({el: 'TD', content: ticks[i].ascentType});
        let ascentPoints = dce({el: 'TD', cssClass: 'score', content: eightaNuScore(ticks[i])});
        row.append(/*date,*/ gradeContainer, ascentType, type, indoors, ascentPoints);
        el.appendChild(row);

        let tickDetailsContainerRow = dce({el: 'TR', cssClass: 'hidden'});
        let tickDetailsContainerCell = dce({el: 'TD', attrbs: [['colspan', 5]]});
        let tickDetails = dce({el: 'DIV', cssClass: '', content : 'Edit actions for tick here...'});

        tickDetailsContainerCell.appendChild(tickDetails);
        tickDetailsContainerRow.appendChild(tickDetailsContainerCell);
        el.appendChild(tickDetailsContainerRow);

        row.addEventListener('click', ()=>{tickDetailsContainerRow.classList.toggle('hidden')}, false);

      }
      if(!ticks.length) {
        let row = dce({el: 'TR'});
        let col = dce({el: 'TD', cssClass: 'no-history', content: 'Nothing to see here. Move along'});
        row.appendChild(col);
        el.appendChild(row);
      }
    }
    updateHistory();

    let naviShadow = dce({el: 'DIV', cssClass: 'navi-shadow'});

    ticksContainer.appendChild(el);
    historyContent.append(ticksContainer);
    scrollContainer.appendChild(historyContent);
    container.append(ticker.render(), scrollContainer, naviShadow);

    storeObserver.add({
      store: globals,
      key: 'currentClimbingType', 
      callback: updateHistory,
      removeOnRouteChange: true
    });

    storeObserver.add({
      store: globals,
      key: 'indoorsOutdoors', 
      callback: updateHistory,
      removeOnRouteChange: true
    });

    this.render = () => {
      return container
    }
  }
}

export default viewHistory;
