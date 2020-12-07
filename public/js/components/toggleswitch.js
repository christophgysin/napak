import { dce } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';

class toggleSwitch {
  constructor( { options = [], targetObj = null, targetStore = globals, callback = false} = {} ) {

    let switchElement = dce({el: 'DIV', cssClass: 'on-off-selector'});
    let firstOption = dce({el: 'SPAN', content: options[0].title});
    let secondOption = dce({el: 'SPAN', content:options[1].title});

    let switchEl = dce({el: 'DIV', cssClass: 'on-off-switch'});

    let switchStatus = options[0].selected ? false : true;
    if(targetStore) {
      globals[targetObj] = ( switchStatus ) ? options[1].value : options[0].value;
    }
    else {
      targetObj = ( switchStatus ) ? options[1].value : options[0].value;
    }

    if(switchStatus) {
        switchEl.classList.add('switched-off')
    };

    let toggle = () => {
      switchStatus = !switchStatus;
      switchEl.classList.toggle('switched-off');
      if(targetStore) {
        globals[targetObj] = ( switchStatus ) ? options[1].value : options[0].value;
      }
      else {
        targetObj = ( switchStatus ) ? options[1].value : options[0].value;
      }
  
      if( callback ) {
        callback(targetObj);
      }
    }
    switchEl.addEventListener('click', toggle, false);
    firstOption.addEventListener('click', toggle, false);
    secondOption.addEventListener('click', toggle, false);

    switchElement.append(firstOption, switchEl, secondOption);

    this.render = () => {
      return switchElement;
    }
  }
}

export default toggleSwitch;
