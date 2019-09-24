import { dce } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';

class toggleSwitch {
  constructor(params) {

    let switchElement = dce({el: 'DIV', cssClass: 'on-off-selector'});
    let firstOption = dce({el: 'SPAN', content: params.options[0].title});
    let secondOption = dce({el: 'SPAN', content: params.options[1].title});

    let switchEl = dce({el: 'DIV', cssClass: 'on-off-switch'});

    let switchStatus = params.options[0].selected ? false : true;
    if(switchStatus) {
        switchEl.classList.add('switched-off')
    };

    switchEl.addEventListener('click', function() {
        switchStatus = !switchStatus;
        this.classList.toggle('switched-off');
        globals[params.targetObj] = ( switchStatus ) ? params.options[1].value : params.options[0].value
      }, false);

    switchElement.append(firstOption, switchEl, secondOption);

    this.render = () => {
      return switchElement;
    }
  }
}

export default toggleSwitch;