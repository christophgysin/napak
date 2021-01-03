import { dce } from '/js/shared/helpers.js';
import picker from '/js/components/picker.js';
import toggleSwitch from '/js/components/toggleswitch.js';
import { globals } from '/js/shared/globals.js';

class climbingTypeSelector {
  constructor(params) {
    let container = dce({el: 'DIV', cssClass: 'in-out-menu hidden'});
    let climbingTypeSelectContainer = dce({el: 'DIV', cssClass: 'climbing-type-container'});

    let groupClimbingTypeSelector = new picker({
      cssClass: 'horizontal-menu full-width small-legends',
      targetObj: 'currentClimbingType',
      options: [
        { title: 'Boulder', value: 'boulder', selected: (globals.currentClimbingType === 'boulder') ? true: false, legend: globals.totalAscentsByType['boulder'], val: 'totalAscentsByType.boulder'},
        { title: 'Sport', value: 'sport', selected: (globals.currentClimbingType === 'sport') ? true: false, legend: globals.totalAscentsByType['sport'], val: 'totalAscentsByType.sport' },
        { title: 'Top rope', value: 'toprope', selected: (globals.currentClimbingType === 'toprope') ? true: false, legend: globals.totalAscentsByType['toprope'], val: 'totalAscentsByType.toprope' },
        { title: 'Trad', value: 'trad', selected: (globals.currentClimbingType === 'trad') ? true: false, legend: globals.totalAscentsByType['trad'], val: 'totalAscentsByType.trad' },
      ]
    });

    climbingTypeSelectContainer.append(groupClimbingTypeSelector.render())
    container.appendChild(climbingTypeSelectContainer);


    let indoorsOutdoorsSelector = new toggleSwitch({
      cssClass  : 'horizontal-menu full-width',
      targetObj : 'indoorsOutdoors',
      options   : [
        {title: 'Indoors', value: 'indoors', selected: (globals.indoorsOutdoors === 'indoors') ? true: false},
        {title: 'Outdoors', value: 'outdoors', selected: (globals.indoorsOutdoors === 'outdoors') ? true: false}]
    });

    container.append(indoorsOutdoorsSelector.render());

    this.render = () => {
      return container;
    }

    this.showMenu = () => {
      container.classList.toggle('hidden');
    }
  }
}

export default climbingTypeSelector;
