import { dce } from '/js/shared/helpers.js';
import picker from '/js/components/picker.js';
import toggleSwitch from '/js/components/toggleswitch.js';

class climbingTypeSelector {
  constructor(params) {
    let container = dce({el: 'DIV', cssClass: 'in-out-menu hidden'});
    let climbingTypeSelectContainer = dce({el: 'DIV', cssClass: 'climbing-type-container'});

    let groupClimbingTypeSelector = new picker({
      cssClass: 'horizontal-menu full-width small-legends',
      id: 'ascent-type-selector',
      targetObj: 'currentClimbingType',
      options: [
        { title: 'Boulder', value: 'boulder', selected: true, legend: globals.totalAscentsByType['boulder'], val: 'totalAscentsByType.boulder'},
        { title: 'Sport', value: 'sport', legend: globals.totalAscentsByType['sport'], val: 'totalAscentsByType.sport' },
        { title: 'Top rope', value: 'toprope', legend: globals.totalAscentsByType['toprope'], val: 'totalAscentsByType.toprope' },
        { title: 'Trad', value: 'trad', legend: globals.totalAscentsByType['trad'], val: 'totalAscentsByType.trad' },
      ]
    });

    climbingTypeSelectContainer.append(groupClimbingTypeSelector.render())
    container.appendChild(climbingTypeSelectContainer);


    let indoorsOutdoorsSelector = new toggleSwitch({
      cssClass  : 'horizontal-menu full-width',
      targetObj : 'indoorsOutdoors',
      options   : [
        {title: 'Indoors', value: 'indoors', selected: true},
        {title: 'Outdors', value: 'outdoors'}]
    });

    container.append(indoorsOutdoorsSelector.render());

    this.render = () => {
      return container;
    }
  }
}

export default climbingTypeSelector;
