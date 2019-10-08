import { dce } from '/js/shared/helpers.js';
import wheel from '/js/components/wheel.js';
import picker from '/js/components/picker.js';
import { globals } from '/js/shared/globals.js';
import { store } from '/js/shared/store.js';

class gradeWheel {
  constructor() {
    let gradePicker = new wheel();
    let ascentTypeSelector = new picker({
      cssClass: 'horizontal-menu full-width',
      id: 'ascent-type-selector',
      targetObj: 'currentAscentType',
      options: [
        { title: 'Flash', value: 'flash', legend: globals.totalAscents.flash, val: 'totalAscents.flash' },
        { title: 'Redpoint', value: 'redpoint', selected: true, legend: globals.totalAscents.redpoint, val: 'totalAscents.redpoint' },
        { title: 'Onsight', value: 'onsight', legend: globals.totalAscents.onsight, val: 'totalAscents.onsight' }]
    });

    let container = dce({ el: 'SECTION', cssClass: 'grade bgr-gradient' });
    let pickerElement = dce({ el: 'DIV', cssClass: 'grade-selector' });

    pickerElement.appendChild(gradePicker.render());
    pickerElement.appendChild(ascentTypeSelector.render());

    let buttonsContainer = dce({ el: 'DIV', cssClass: 'tick-buttons-container' });
    let buttonDec = dce({ el: 'A', cssClass: 'btn btn_white', content: 'Remove Tick' });
    let spacer = dce({ el: 'DIV', cssStyle: 'width: 20px; min-width: 20px;' });
    let buttonInc = dce({ el: 'A', cssClass: 'btn type-redpoint', content: 'Tick' });


    let handleTick = (add) => {
      if (globals.currentAscentGrade < 0) {
        return;
      }
      let globalTicks = globals.ticks;
      let grade = globals.currentAscentGrade;
      let ascentType = globals.currentAscentType;

      // create object for current grade if doesn't exists
      if (!globalTicks[globals.currentClimbingType][globals.today][globals.indoorsOutdoors][grade]) {
        globalTicks[globals.currentClimbingType][globals.today][globals.indoorsOutdoors][grade] = {
          order: grade,
          ticks: {},
        };
      }

      // Remove tick
      if (!add) {
        if (globalTicks[globals.currentClimbingType][globals.today][globals.indoorsOutdoors][grade].ticks[ascentType] && globalTicks[globals.currentClimbingType][globals.today][globals.indoorsOutdoors][grade].ticks[ascentType].length) {
          globalTicks[globals.currentClimbingType][globals.today][globals.indoorsOutdoors][grade].ticks[ascentType] = globalTicks[globals.currentClimbingType][globals.today][globals.indoorsOutdoors][grade].ticks[ascentType].slice(0, -1);
        }
        else {
          delete globalTicks[globals.currentClimbingType][globals.today][globals.indoorsOutdoors][grade].ticks[ascentType];
        }
      }

      // Add tick
      else {
        if (!globalTicks[globals.currentClimbingType][globals.today][globals.indoorsOutdoors][grade].ticks[ascentType]) {
          globalTicks[globals.currentClimbingType][globals.today][globals.indoorsOutdoors][grade].ticks[ascentType] = [];
        }
        globalTicks[globals.currentClimbingType][globals.today][globals.indoorsOutdoors][grade].ticks[ascentType].push({
          date: new Date().getTime()
        });
      }

      globals.ticks = globalTicks;

      // update local storage
      store.write({
        key: 'ticks',
        keydata: globals.ticks
      })
    };

    buttonInc.addEventListener('click', () => { handleTick(true); }, false);
    buttonDec.addEventListener('click', () => { handleTick(false); }, false);


    buttonsContainer.append(buttonDec, spacer, buttonInc);
    pickerElement.appendChild(buttonsContainer);

    let naviShadow = dce({el: 'DIV', cssClass: 'navi-shadow'});

    container.append(pickerElement, naviShadow);

    this.render = () => {
      return container;
    }
  }
}

export default gradeWheel;
