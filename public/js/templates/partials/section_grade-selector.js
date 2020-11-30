import { dce, vibrate } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';
import calendar from '/js/components/calendar.js';
import handleTick from '/js/shared/handle_tick.js';
import picker from '/js/components/picker.js';
import wheel from '/js/components/wheel.js';

class gradeWheel {
  constructor() {
    let gradePicker = new wheel();
    let datePicker = new calendar();
    let ascentTypeSelector = new picker({
      cssClass: 'horizontal-menu full-width small-legends',
      targetObj: 'currentAscentType',
      options: [
        { title: 'Redpoint', value: 'redpoint', selected: true, legend: globals.totalAscents.redpoint, val: 'totalAscents.redpoint' },
        { title: 'Flash', value: 'flash', legend: globals.totalAscents.flash, val: 'totalAscents.flash' },
        { title: 'Onsight', value: 'onsight', legend: globals.totalAscents.onsight, val: 'totalAscents.onsight', hide: 'currentClimbingType', hideValue: 'boulder' }]
    });

    let container = dce({ el: 'SECTION', cssClass: 'grade bgr-gradient' });
    let pickerElement = dce({ el: 'DIV', cssClass: 'grade-selector' });

    pickerElement.appendChild(gradePicker.render());
    pickerElement.appendChild(ascentTypeSelector.render());

    let buttonsContainer = dce({ el: 'DIV', cssClass: 'tick-buttons-container' });
    let buttonDec = dce({ el: 'A', cssClass: 'btn btn_white', content: 'Remove Tick' });
    let spacer = dce({ el: 'DIV', cssStyle: 'width: 20px; min-width: 20px;' });
    let buttonInc = dce({ el: 'A', cssClass: 'btn type-redpoint', content: 'Tick' });

    buttonInc.addEventListener('click', () => { if(globals.vibrate){vibrate();} handleTick({add: true}); }, false);
    buttonDec.addEventListener('click', () => { if(globals.vibrate){vibrate();} handleTick({add: false}); }, false);

    buttonsContainer.append(buttonDec, spacer, buttonInc);
    pickerElement.appendChild(buttonsContainer);

    pickerElement.appendChild(datePicker.render());
  
    container.append(pickerElement);

    this.render = () => {
      return container;
    }
  }
}

export default gradeWheel;
