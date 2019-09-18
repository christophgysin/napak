import { dce, triggerCustomEvent } from '/js/shared/helpers.js';
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
            {title: 'Onsight', value:'onsight', legend: globals.totalAscents.flash}],
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
      let currentGrade = globals.currentAscentGrade; //Grade selected with the wheel
      let count = 0;


      if(document.querySelector('.select-dialog').childNodes[currentGrade].querySelector(`.legends-holder .type-${globals.currentAscentType}`)) {
        count = parseInt(document.querySelector('.select-dialog').childNodes[currentGrade].querySelector(`.legends-holder .type-${globals.currentAscentType}`).innerHTML);
        if(isNaN(count)) {count = 0;}
        count+= ( add ) ? 1 : -1
        document.querySelector('.select-dialog').childNodes[currentGrade].querySelector(`.legends-holder .type-${globals.currentAscentType}`).innerHTML = (count > 0) ? count : '' ;
      }
      else {
        let holder = dce({el: 'SPAN', cssClass: `legend type-${globals.currentAscentType}`, content: ''});
        document.querySelector('.select-dialog').childNodes[currentGrade].querySelector('.legends-holder').appendChild(holder);
      }

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
