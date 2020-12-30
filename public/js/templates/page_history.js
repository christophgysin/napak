/*

Observers

globals
  :currentClimbingType
  :indoorsOutdoors
    > updateHistory

*/

import { globals } from '/js/shared/globals.js';
import { dce, storeObserver, handleScopeTicks, eightaNuScore, averageGrade, handleDate } from '/js/shared/helpers.js';
import statusTicker from '/js/templates/partials/status_ticker.js';
import climbingTypeSelector from '/js/templates/partials/climbing_type-selector.js';
import modalWindow from '/js/components/modal.js';
import handleTick from '/js/shared/handle_tick.js';

class viewHistory {
  constructor() {
    let container = dce({el: 'DIV', cssClass: 'page-history'});

    let ticker = new statusTicker({
      titlePrefix_boulder : 'Ticks archive - Bouldering',
      titlePrefix_sport : 'Ticks archive -  Sport',
      titlePrefix_trad : 'Ticks archive - Trad',
      titlePrefix_toprope: 'Ticks archive - Top rope',
      hideIndoorsOutdoors : true,
      tapAction: () => { disciplineSelector.showMenu()}
    });


    let historyContent = dce({el: 'DIV', cssClass: 'history-content'});
    let scrollContainer = dce({el: 'DIV', cssClass : 'scroll-container'});

    let updateHistory = () => {
      scrollContainer.innerHTML = "";
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
          var keyA = a.grade,
            keyB = b.grade;
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });

        let dateAvgGrade = averageGrade({count: 10, tickSet: ticks});
        let sessionAverage = averageGrade({count: ticks.length, tickSet: ticks});

        let headerTitle = dce({el: 'DIV', cssClass: 'session-header'});
        // Date and route count
        let sessionDate = dce({el: 'DIV', cssClass: 'header-flex'});
        let date = dce({el: 'DIV', content: handleDate({dateString : key, dateFormat : 'dd.mm.yyyy'})});
        let routeCount = dce({el: 'DIV', content: `${ticksByDateContainer[key].length} routes`});
        sessionDate.append(date, routeCount);

        // session weighted average grade
        let weighted = dce({el: 'DIV', cssClass: 'header-flex'});
        let weightedTitle = dce({el: 'DIV', content: 'Weighted average grade'});
        let weightedAverage = dce({el: 'DIV', content: dateAvgGrade});
        weighted.append(weightedTitle, weightedAverage);

        // session average grade
        let avg = dce({el: 'DIV', cssClass: 'header-flex'});
        let avgTitle = dce({el: 'DIV', content: 'Session average'});
        let avgGrade = dce({el: 'DIV', content: sessionAverage});
        avg.append(avgTitle, avgGrade);

        headerTitle.append(sessionDate, weighted, avg);

        let sessionTicks = dce({el: 'DIV', cssClass: 'session-tick-container'});
        sessionTicks.appendChild(headerTitle);

        for( let i=ticks.length-1, j = 0; i>=j; i-- ) {
          let row = dce({el: 'DIV', cssClass: 'session-tick'});
          let gradeContainer = dce({el: 'DIV'});
          let grade = dce({el: 'DIV', cssClass: `grade-legend ${globals.difficulty[ticks[i].grade]}`, content: globals.grades.font[ticks[i].grade]});
          gradeContainer.appendChild(grade);
          let ascentType = dce({el: 'DIV', content: ticks[i].ascentType});
          let ascentPoints = dce({el: 'DIV', cssClass: 'score', content: eightaNuScore(ticks[i])});
          let tickActionsContainer = dce({el: 'DIV', cssClass: 'tick-actions'});

          let deleteTick = dce({el: 'A', cssClass: 'btn btn_tiny', content: 'x'});
          tickActionsContainer.appendChild(deleteTick);

          row.append(gradeContainer, ascentType, ascentPoints, tickActionsContainer);

          sessionTicks.appendChild(row);
          let tick = ticks[i];

          deleteTick.addEventListener('click', ()=>{
            let confirmationMessage = dce({el: 'DIV'});
            let tickGrade = dce({el: 'SPAN', cssStyle: 'margin-right: var(--padding-base-half)', cssClass: `grade-legend ${globals.difficulty[tick.grade]}`, content: globals.grades.font[tick.grade]});
            let tickDetails = dce({el: 'P', cssStyle: 'display: flex;'});
            tickDetails.append(tickGrade, document.createTextNode(` ${tick.ascentType[0].toUpperCase()}${tick.ascentType.slice(1)}, ${tick.score}p`));
            let confirm  = dce({el: 'P', content: 'Delete this tick? You might lose points! 🙀'});
            confirmationMessage.append(tickDetails, confirm);

            let tickInfo = tick; 
            let modal = new modalWindow({
              title         : 'Confirm delete tick',
              modalContent  : confirmationMessage,
              cssClass      : 'modal-small',
              buttons       : [
                ['Delete', ()=>{
                  this.deleteTick(tick);
                  modal.close();},
                'preferred'],
                ['Cancel', () => {
                  modal.close()}]
                ],
              open          : true //auto open modal
            });

            container.appendChild(modal.render())
          });
        }
      scrollContainer.appendChild(sessionTicks)
    }


      if(!ticks.length) {
        let row = dce({el: 'DIV', cssClass: 'no-history mt', content: 'Nothing to see here. Move along'});
        scrollContainer.appendChild(row);
      }
    }
    updateHistory();

    let disciplineSelector = new climbingTypeSelector();

    historyContent.appendChild(scrollContainer);
    container.append(ticker.render(), disciplineSelector.render(), historyContent);


    storeObserver.add({
      store: globals,
      id: 'historyClimbingType',
      key: 'currentClimbingType',
      callback: updateHistory,
      removeOnRouteChange: true
    });

    storeObserver.add({
      store: globals,
      id: 'historyIndoorsOutdoors',
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

    this.deleteTick = (tick) => {
      handleTick({
        add: false,
        ascentType: tick.ascentType,
        grade: tick.grade,
        indoorsOutdoors: tick.indoorsOutdoors,
        type: tick.type,
        tickDate: handleDate({dateString: tick.date})
      });
      updateHistory();
    }
  }
}

export default viewHistory;
