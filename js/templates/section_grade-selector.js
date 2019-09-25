import { dce } from '/js/shared/helpers.js';
import wheel from '/js/components/wheel.js';
import picker from '/js/components/picker.js';
import { globals } from '/js/shared/globals.js';
import { store } from '/js/shared/store.js';

class gradeWheel {
  constructor() {
    let gradePicker =  new wheel();
    let ascentTypeSelector = new picker({
      cssClass  : 'horizontal-menu full-width',
      id        : 'ascent-type-selector',
      targetObj : 'currentAscentType',
      options   : [
        {title: 'Flash', value:'flash', legend: globals.totalAscents.flash, val: 'totalAscents.flash'},
        {title: 'Redpoint', value:'redpoint', selected: true, legend: globals.totalAscents.redpoint, val: 'totalAscents.redpoint'},
        {title: 'Onsight', value:'onsight', legend: globals.totalAscents.onsight, val: 'totalAscents.onsight'}]
      });

  	let container = dce({el:'SECTION', cssClass: 'grade bgr-gradient'});
    let pickerElement = dce({el: 'DIV', cssClass: 'grade-selector'});

    pickerElement.appendChild(gradePicker.render());
    pickerElement.appendChild(ascentTypeSelector.render());

    let buttonsContainer = dce({el: 'DIV', cssClass: 'tick-buttons-container'});
    let buttonDec = dce({el: 'A', cssClass : 'btn btn_white', content: 'Remove Tick'});
    let spacer = dce({el: 'DIV', cssStyle: 'width: 20px; min-width: 20px;'});
    let buttonInc = dce({el: 'A', cssClass : 'btn type-redpoint', content: 'Tick'});


    let handleTick = ( add ) => {
      let globalTicks = globals.ticks;  
      let grade = globals.currentAscentGrade;
      let ascentType = globals.currentAscentType;
      let count = (globalTicks[globals.currentClimbingType].today[grade] && globalTicks[globals.currentClimbingType].today[grade].ticks[ascentType] && globalTicks[globals.currentClimbingType].today[grade].ticks[ascentType].count) ? globalTicks[globals.currentClimbingType].today[grade].ticks[ascentType].count : '';

      if(!globalTicks[globals.currentClimbingType].today[grade]) {
        globalTicks[globals.currentClimbingType].today[grade] = {
          order: grade,
          ticks : {}
        };
      }

      // Remove tick
      if( !add ) {
        if(count > 0) {
          count--;
          globalTicks[globals.currentClimbingType].today[grade].ticks[ascentType] = {
              count: count
          }
        }
        else{
          delete globalTicks[globals.currentClimbingType].today[grade].ticks[ascentType];
        }
      }

      // Add tick
      else {
        let count = (globalTicks[globals.currentClimbingType].today[grade] && globalTicks[globals.currentClimbingType].today[grade].ticks && globalTicks[globals.currentClimbingType].today[grade].ticks[ascentType] && globalTicks[globals.currentClimbingType].today[grade].ticks[ascentType].count) ? globalTicks[globals.currentClimbingType].today[grade].ticks[ascentType].count : 0;
        count++;
        globalTicks[globals.currentClimbingType].today[grade].ticks[ascentType] = {
            count: count
          }
        }

      // Update type totals
      let typeTotal = 0;
      for (let keys in globalTicks[globals.currentClimbingType].today) {
        typeTotal+= (globalTicks[globals.currentClimbingType].today[keys].ticks[ascentType]) ? globalTicks[globals.currentClimbingType].today[keys].ticks[ascentType].count : 0;
      }

//      legendTag.innerHTML = ( typeTotal > 0 ) ? typeTotal : "";

      // Update today total
      let total = 0;
      for (let keys in globalTicks[globals.currentClimbingType].today) {
        for(let test in globalTicks[globals.currentClimbingType].today[keys]) {
          total+= (globalTicks[globals.currentClimbingType].today[keys][test].count) ? globalTicks[globals.currentClimbingType].today[keys][test].count : 0;
        }
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
    container.appendChild(pickerElement);

    this.render = () => {
      return container;
      }
  	}
  }

export default gradeWheel;
