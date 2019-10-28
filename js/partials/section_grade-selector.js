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
        { title: 'Redpoint', value: 'redpoint', selected: true, legend: globals.totalAscents.redpoint, val: 'totalAscents.redpoint' },
        { title: 'Flash', value: 'flash', legend: globals.totalAscents.flash, val: 'totalAscents.flash' },
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
      let grade = globals.currentAscentGrade;
      let ascentType = globals.currentAscentType;
      let ticks = globals.ticks;

      // Remove tick
      if (!add) {
        let ticksByGrade = [];
        for(let i=0, j=ticks.length; i<j;i++) {
          let today = globals.today.split("-");
          today = new Date(today[0], today[1], today[2]).getTime();
          if(ticks[i].date >= today &&
            ticks[i].grade === grade &&
            ticks[i].ascentType === ascentType &&
            ticks[i].indoorsOutdoors === globals.indoorsOutdoors && 
            ticks[i].type === globals.currentClimbingType ){
              ticksByGrade.push(i);
            }
        }
        if(ticksByGrade.length) {
          ticks.splice(ticksByGrade[ticksByGrade.length-1], 1)
        }
      }
      else {
        // Add tick
        ticks.push({
            type: globals.currentClimbingType,
            indoorsOutdoors: globals.indoorsOutdoors,
            grade: grade,
            ascentType: ascentType,
            date: new Date().getTime()
          });
        }
      // update local storage
      store.write({
        key: 'ticks',
        keydata: globals.ticks
      });

      globals.ticks = ticks;
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
