import { globals } from '/js/shared/globals.js';
import { handleDate } from '/js/shared/date.js';
import { dce, storeObserver, handleScopeTicks, eightaNuScore, averageGrade, countTopFive} from '/js/shared/helpers.js';
import statusTicker from '/js/templates/partials/status_ticker.js';
import climbingTypeSelector from '/js/templates/partials/climbing_type-selector.js';

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


    let historyContent = dce({el: 'DIV', cssClass: 'history-content'});
    let scrollContainer = dce({el: 'DIV', cssClass : 'scroll-container'});

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
      let ticksByDateContainer = {};

  
// Group ticks into object by date 
      for( let i=ticks.length-1, j = 0; i>=j; i-- ) {
        let tickDate = handleDate({dateString: ticks[i].date});
        if(tickDate !== currentDate) {
          ticksByDateContainer[tickDate] = [];
          currentDate = tickDate;
        }
        ticksByDateContainer[tickDate].push(ticks[i]);
      } 


// Count daily averages
      for( let key in ticksByDateContainer ) {
        let ticks = ticksByDateContainer[key];
        ticks.sort(function(a, b) {
          var keyA = new Date(a.grade),
            keyB = new Date(b.grade);
          // Compare the 2 dates
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });

        let dateAvgGrade = averageGrade(5, false, ticks);
        let sessionAverage = averageGrade(ticks.length, false, ticks);
        console.log(ticks.length)

        let headerRow = dce({el: 'TR', cssClass: 'header'});
        let headerTitle = dce({el: 'TH', content: `${handleDate({dateString : key, dateFormat : 'dd.mm.yyyy'})} - ${ticksByDateContainer[key].length} routes\r\nWeighted average grade: ${dateAvgGrade}\r\nSession average: ${sessionAverage}`, attrbs: [['colspan', 3]]});
        headerRow.appendChild(headerTitle);
        el.appendChild(headerRow);

        for( let i=ticks.length-1, j = 0; i>=j; i-- ) {          
          let row = dce({el: 'TR'});
          let indoors = dce({el: 'TD', content: ticks[i].indoorsOutdoors});
          let type = dce({el: 'TD', content: ticks[i].type});
          let gradeContainer = dce({el: 'TD'});
          let grade = dce({el: 'SPAN', cssClass: `grade-legend ${globals.difficulty[ticks[i].grade]}`, content: globals.grades.font[ticks[i].grade]});
          gradeContainer.appendChild(grade);
          let ascentType = dce({el: 'TD', content: ticks[i].ascentType});
          let ascentPoints = dce({el: 'TD', cssClass: 'score', content: eightaNuScore(ticks[i])});
          row.append(gradeContainer, ascentType, ascentPoints);
          el.appendChild(row);
  
          let tickDetailsContainerRow = dce({el: 'TR', cssClass: 'hidden'});
          let tickDetailsContainerCell = dce({el: 'TD', attrbs: [['colspan', 3]]});
          let tickDetails = dce({el: 'DIV', cssClass: '', cssStyle: 'padding: 10px 0; display: flex; justify-content: center'/*, content : 'Edit actions for tick here...'*/});
          
          let deleteTick = dce({el: 'A', cssClass: 'btn btn_small', content: 'Remove tick'});
          tickDetails.appendChild(deleteTick);

          tickDetailsContainerCell.appendChild(tickDetails);
          tickDetailsContainerRow.appendChild(tickDetailsContainerCell);
          el.appendChild(tickDetailsContainerRow);
  
          row.addEventListener('click', ()=>{tickDetailsContainerRow.classList.toggle('hidden')}, false);
        }
    }


      if(!ticks.length) {
        let row = dce({el: 'TR'});
        let col = dce({el: 'TD', cssClass: 'no-history', content: 'Nothing to see here. Move along'});
        row.appendChild(col);
        el.appendChild(row);
      }
    }
    updateHistory();

    let disciplineSelector = new climbingTypeSelector();

    ticksContainer.appendChild(el);
    scrollContainer.append(ticksContainer);
    historyContent.appendChild(scrollContainer);
    container.append(ticker.render(), disciplineSelector.render(), historyContent);

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
