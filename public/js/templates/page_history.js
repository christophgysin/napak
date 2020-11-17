/*

Observers

globals
  :currentClimbingType
  :indoorsOutdoors
    > updateHistory

*/

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

    let ticksContainer = dce({el: 'DIV', cssClass: 'tick-list'});

    let updateHistory = () => {
      ticksContainer.innerHTML = "";
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

        let headerTitle = dce({el: 'DIV', cssClass: 'session-header'});
        headerTitle.innerHTML = `${handleDate({dateString : key, dateFormat : 'dd.mm.yyyy'})} - <b>${ticksByDateContainer[key].length} routes</b>\r\nWeighted average grade: <b>${dateAvgGrade}</b>\r\nSession average: <b>${sessionAverage}</b>`;
        ticksContainer.appendChild(headerTitle);

        let sessionTicks = dce({el: 'DIV', cssClass: 'session-tick-container'});

        for( let i=ticks.length-1, j = 0; i>=j; i-- ) {          
          let row = dce({el: 'DIV', cssClass: 'session-tick'});
          let grade = dce({el: 'SPAN', cssClass: `grade-legend ${globals.difficulty[ticks[i].grade]}`, content: globals.grades.font[ticks[i].grade]});
          let ascentType = dce({el: 'SPAN', content: ticks[i].ascentType});
          let ascentPoints = dce({el: 'SPAN', cssClass: 'score', content: eightaNuScore(ticks[i])});
          let tickActionsContainer = dce({el: 'SPAN', cssClass: 'tick-actions'});

          let deleteTick = dce({el: 'A', cssClass: 'btn btn_tiny', content: 'x'});
          let editTickDetails = dce({el: 'A', cssClass: 'btn btn_tiny', content: 'Edit'});
          tickActionsContainer.append(deleteTick, editTickDetails);
          row.append(grade, ascentType, ascentPoints, tickActionsContainer);
          sessionTicks.appendChild(row);
  
          editTickDetails.addEventListener('click', ()=>{this.toggleModal();}); //console.log(new Date().getTime()); tickDetailsContainer.classList.toggle('hidden')}, false);
        }
        ticksContainer.appendChild(sessionTicks)
    }


      if(!ticks.length) {
        let row = dce({el: 'DIV', cssClass: 'no-history', content: 'Nothing to see here. Move along'});
        ticksContainer.appendChild(row);
      }
    }
    updateHistory();

    let disciplineSelector = new climbingTypeSelector();

    this.modal  = dce({el: 'DIV', cssClass: 'hidden', cssStyle: 'position: fixed;   border-radius: 20px; background: #fff; min-height: 300px;z-index: 3;left: 20px;right: 20px;top: 50%;transform: translateY(-50%); padding: 20px; color: #000'});
    let tickEditModalHeader = dce({el: 'DIV', content: `Grade: ${globals.grades.font[globals.ticks[0].grade]}`});
    /*
    ascentType: "redpoint"
  date: 1583216284437
​
grade: 7
​
indoorsOutdoors: "indoors"
​
location: false
​
type: "boulder"
​
uuid: "ca6a2500-ea73-40b5-896d-404ba0ff88ed"
*/
    this.modal.appendChild(tickEditModalHeader);

    scrollContainer.append(ticksContainer);
    historyContent.appendChild(scrollContainer);
    container.append(ticker.render(), disciplineSelector.render(), historyContent, this.modal);


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

    this.toggleModal = () => {
      this.modal.classList.toggle('hidden')
    }
  }
}

export default viewHistory;
