import { dce, triggerCustomEvent, countAscentsByDifficulty } from '/js/shared/helpers.js';
import wheel from '/js/components/wheel.js';
import picker from '/js/components/picker.js';
import { globals } from '/js/shared/globals.js';

class gradeWheel {
  constructor() {

    let gradePicker =  new wheel();
    let ascentTypeSelector = new picker({
      cssClass  : 'horizontal-menu full-width',
      id        : 'ascent-type-selector',
      targetObj : 'currentAscentType',
      options   : [
        {title: 'Flash', value:'flash', legend: globals.totalAscents.flash},
        {title: 'Redpoint', value:'redpoint', selected: true, legend: globals.totalAscents.redpoint},
        {title: 'Onsight', value:'onsight', legend: globals.totalAscents.onsight}],
      bindEvents: true,
      bindEventsPrefix : 'tick-'
      });

  	let container = dce({el:'SECTION', cssClass: 'grade bgr-gradient'});
    let pickerElement = dce({el: 'DIV', cssClass: 'grade-selector'});

    pickerElement.appendChild(gradePicker.render());
    pickerElement.appendChild(ascentTypeSelector.render());

    let buttonsContainer = dce({el: 'DIV', cssClass: 'tick-buttons-container'});
    let buttonDec = dce({el: 'A', cssClass : 'btn btn_white', content: 'Remove Tick'});
    let spacer = dce({el: 'DIV', cssStyle: 'width: 20px; min-width: 20px;'});
    let buttonInc = dce({el: 'A', cssClass : 'btn type-redpoint', content: 'Tick'});

// tick....
// move this somewhere else maybe
// .... refactor

    let handleTick = ( add ) => {
      triggerCustomEvent({
        vent: `tick-${globals.currentAscentType}`,
        data: {
          detail: {
            add: add,
            type: globals.currentAscentType,
            grade: globals.currentAscentGrade,
            time: new Date().getTime
            }
          },
        dispatch: true
      });

      triggerCustomEvent({
        vent: `update-chart`,
        data: {},
        dispatch: true
      });

    };

    buttonInc.addEventListener('click', () => { handleTick(true); }, false);
    buttonDec.addEventListener('click', () => { handleTick(false); }, false);


    buttonsContainer.append(buttonDec, spacer, buttonInc);
    pickerElement.appendChild(buttonsContainer);
    container.appendChild(pickerElement);

    this.render = () => {
      return container;
      }
  	}
  }

export default gradeWheel;
