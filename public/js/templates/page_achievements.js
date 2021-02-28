import { dce } from '/js/shared/helpers.js';
import toggleSwitch from '/js/components/toggleswitch.js';
import picker from '/js/components/picker.js';

class viewAchievements {
  constructor() {

    let container = dce({el: 'DIV', cssClass: 'page-achievements'});
    let temp = dce({el: 'SECTION', cssClass: 'achivements-container scroll-container'});

    let groupClimbingTypeSelectorContainer = dce({el: 'SECTION'})
    // discipline selector for ranking
    let groupClimbingTypeSelector = new picker({
      cssClass: 'horizontal-menu full-width',
      targetObj: 'currentClimbingType',
      options: [
        { title: 'Boulder', value: 'boulder', selected: (globals.currentClimbingType === 'boulder') ? true: false},
        { title: 'Sport', value: 'sport', selected: (globals.currentClimbingType === 'sport') ? true: false},
        { title: 'Top rope', value: 'toprope', selected: (globals.currentClimbingType === 'toprope') ? true: false},
        { title: 'Trad', value: 'trad', selected: (globals.currentClimbingType === 'trad') ? true: false},
      ]
    });


    let indoorsOutdoorsSelector = new toggleSwitch({
      cssClass  : 'horizontal-menu full-width',
      targetObj : 'indoorsOutdoors',
      options   : [
        {title: 'Indoors', value: 'indoors', selected: (globals.indoorsOutdoors === 'indoors') ? true: false},
        {title: 'Outdoors', value: 'outdoors', selected: (globals.indoorsOutdoors === 'outdoors') ? true: false}
      ]
    });

    let achievementsContainer = dce({el: 'DIV', cssStyle: 'align-self: center'});

    let topScoreContainer = dce({el: 'DIV', cssClass: 'achievements-row'});
    topScoreContainer.append(dce({el: 'h3', content: 'HIGHEST SCORE'}), dce({el: 'h2', content: '8657'}), dce({el: 'DIV', content: ' '}));


    let topGradeContainer = dce({el: 'DIV', cssClass: 'achievements-row'});
    topGradeContainer.append(dce({el: 'h3', content: 'Highest grade'}), dce({el: 'h2', content: '7B+'}), dce({el: 'DIV', content: ' '}));

    let topFlashGradeContainer = dce({el: 'DIV', cssClass: 'achievements-row'});
    topFlashGradeContainer.append(dce({el: 'h3', content: 'Top flash grade'}), dce({el: 'h2', content: '7B'}), dce({el: 'DIV', content: ' '}));

    let routesClimbedContainer = dce({el: 'DIV', cssClass: 'achievements-row'});
    routesClimbedContainer.append(dce({el: 'h3', content: 'Routes climbed'}), dce({el: 'h2', content: '2212'}), dce({el: 'DIV', content: ' '}));

    let routesClimbedByTypeContainerSport = dce({el: 'DIV', cssClass: 'achievements-row-split sport'});
    routesClimbedByTypeContainerSport.append(dce({el: 'h2', content: '1800'}), dce({el: 'h2', content: '410'}), dce({el: 'h2', content: '2'}), dce({el: 'h3', content: 'redpoint'}), dce({el: 'h3', content: 'FLASH'}), dce({el: 'h3', content: 'ONSIGHT'}));

    let routesClimbedByTypeContainer = dce({el: 'DIV', cssClass: 'achievements-row-split'});
    routesClimbedByTypeContainer.append(dce({el: 'h2', content: '1800'}), dce({el: 'h2', content: '412'}), dce({el: 'h3', content: 'REDPOINT'}), dce({el: 'h3', content: 'FLASH'}));

    
    achievementsContainer.append(topScoreContainer, topGradeContainer, topFlashGradeContainer, routesClimbedContainer, /*routesClimbedByTypeContainerSport,*/ routesClimbedByTypeContainer);

    groupClimbingTypeSelectorContainer.append(groupClimbingTypeSelector.render(), indoorsOutdoorsSelector.render())
    temp.append(achievementsContainer);

    container.append(groupClimbingTypeSelectorContainer, temp);

    this.render = () => {
      return container
    }
  }
}

export default viewAchievements;
