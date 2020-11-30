import { globals } from '/js/shared/globals.js';
import { UUID } from '/js/shared/uuid.js';
import { store } from '/js/shared/store.js';
import { handleDate } from '/js/shared/date.js';
import { parseDate } from '/js/shared/helpers.js';
/* Handle tick */

let handleTick = ({
    add = true, 
    grade = globals.currentAscentGrade, 
    ascentType = globals.currentAscentType, 
    ticks = globals.ticks, 
    tickDate = globals.today,
    indoorsOutdoors = globals.indoorsOutdoors,
    type = globals.currentClimbingType

  } = {}) => {
  if (globals.currentAscentGrade < 0 || globals.currentAscentGrade > globals.grades.font) {
    return;
  }

  // Remove tick
  if (!add) {
    let ticksByGrade = [];
    for (let i = 0, j = ticks.length; i < j; i++) {
      let today = parseDate(tickDate);
      today = new Date(today.year, today.month-1, today.date).getTime();
      if (ticks[i].date >= today &&
        ticks[i].grade === grade &&
        ticks[i].ascentType === ascentType &&
        ticks[i].indoorsOutdoors === indoorsOutdoors &&
        ticks[i].type === type) {
        ticksByGrade.push(i);
      }
    }
    if (ticksByGrade.length) {
      let indx = ticksByGrade.length - 1;
      store.remove({
          store: 'users',
          key: 'ticks',
          keydata: ticks[ticksByGrade[indx]]
        });
      ticks.splice(ticksByGrade[indx], 1);
      globals.lastTickRemoved = {grade: grade, ascentType: ascentType};
    }
    globals.lastTick = false;
  }
  else {
    let todayParsed = parseDate(globals.today);

    let tickDate = (globals.today === handleDate({dateString: new Date().getTime()})) ? new Date().getTime() : new Date(todayParsed.year, todayParsed.month-1, todayParsed.date ).getTime()
    // Add tick
    let newTick = {
      type: type,
      indoorsOutdoors: indoorsOutdoors,
      grade: grade,
      ascentType: ascentType,
      date: tickDate,
      uuid: UUID(),
      location: false
    };
    ticks.push(newTick);
    globals.lastTick = newTick;
    globals.lastTickRemoved = false;


    if ((Number(globals.totalAscentCount['today'])) % 5 === 0) {
      let cheer = ["Gamba!", "Venga!", "Allez 💪", "Joo joo!", "Kom igen!", "🔥", "Come on!", "Nice"];
      globals.standardMessage.unshift({
        message: cheer[~~(Math.random() * cheer.length)],
        timeout: 1
      });
      globals.standardMessage = globals.standardMessage;
    }

    store.add({
      store: 'users',
      key: 'ticks',
      keydata: newTick
    });
  }
  globals.ticks = ticks;
};

export default handleTick;
