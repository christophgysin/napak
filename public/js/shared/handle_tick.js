import { globals } from '/js/shared/globals.js';
import { UUID } from '/js/shared/uuid.js';
import { store } from '/js/shared/store.js';

/* Handle tick */

let handleTick = (add) => {
  if (globals.currentAscentGrade < 0) {
    return;
  }
  let grade = globals.currentAscentGrade;
  let ascentType = globals.currentAscentType;
  let ticks = globals.ticks;

  // Remove tick
  if (!add) {
    let ticksByGrade = [];
    for (let i = 0, j = ticks.length; i < j; i++) {
      let today = globals.today.split("-");
      today = new Date(today[0], today[1] - 1, today[2]).getTime();
      if (ticks[i].date >= today &&
        ticks[i].grade === grade &&
        ticks[i].ascentType === ascentType &&
        ticks[i].indoorsOutdoors === globals.indoorsOutdoors &&
        ticks[i].type === globals.currentClimbingType) {
        ticksByGrade.push(i);
      }
    }
    if (ticksByGrade.length) {
      ticks.splice(ticksByGrade[ticksByGrade.length - 1], 1)
      store.remove({
        key: 'ticks',
        keydata: ticks[ticksByGrade[ticksByGrade.length-1]]
      });  
    }
  }
  else {
    // Add tick
    let newTick = {
      type: globals.currentClimbingType,
      indoorsOutdoors: globals.indoorsOutdoors,
      grade: grade,
      ascentType: ascentType,
      date: new Date().getTime(),
      uuid: UUID(),
      location: false,
      synchronized: false
    };
    ticks.push(newTick);
    globals.ticks = ticks;


    if ((Number(globals.totalAscentCount['today']) + 1) % 5 === 0) {
      let cheer = ["Gamba!", "Venga!", "Allez 💪", "Joo joo!", "Kom igen!", "🔥", "Come on!"];
      globals.standardMessage.unshift({
        message: cheer[~~(Math.random() * cheer.length)],
        timeout: 1
      });
      globals.standardMessage = globals.standardMessage;
    }

    store.add({
      key: 'ticks',
      keydata: newTick
    });  
  }

  globals.ticks = ticks;
};

export default handleTick;
