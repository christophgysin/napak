import progress from '/js/templates/section_progress.js';
import gradeWheel from '/js/templates/section_grade-selector.js';
import otc from '/js/templates/section_otc.js';
import picker from '/js/components/picker.js';
import pulldownMenu from '/js/components/pulldown.js';
import toggleSwitch from '/js/components/toggleSwitch.js';

import { globals } from '/js/shared/globals.js';

import { dce, svg, countAscentsByType , updateScopeTicks} from '/js/shared/helpers.js';

class viewHome {
  constructor() {
    let progressSection = new progress();
    let gradeSelector = new gradeWheel();
    let otcMenu = new otc();


    let appContainer = dce({el: 'DIV', cssClass : 'app'});
    let templateContainer = dce({el: 'DIV', cssClass: 'page-content'});
    let tickPage = dce({el: 'DIV', cssClass: 'tick-page'});
    let inOutSelector = dce({el: 'DIV', cssClass: 'in-out-selector'});

    let current = dce({el: 'DIV', cssClass: 'current'});

    let currentClimbingTypeTitle = () => {
      if (globals.currentClimbingType === 'boulder') return `Bouldering ${globals.indoorsOutdoors}`;
      if (globals.currentClimbingType === 'sport') return `Climbing sport ${globals.indoorsOutdoors}`;
      if (globals.currentClimbingType === 'trad') return `Climbing trad ${globals.indoorsOutdoors}`;
      if (globals.currentClimbingType === 'toprope') return `Top roping ${globals.indoorsOutdoors}`;
      return globals.indoorsOutdoors;
    }

    let currentTitle = dce({el: 'H3', content: currentClimbingTypeTitle()});
    current.appendChild(currentTitle);
//console.log(globals.currentClimbingType);

    globals.storeObservers.push({key: 'currentClimbingType', callback: () => {
      currentTitle.innerHTML = currentClimbingTypeTitle();
    }}); 

    globals.storeObservers.push({key: 'indoorsOutdoors', callback: () => {
      currentTitle.innerHTML = currentClimbingTypeTitle();
    }}); 


    inOutSelector.appendChild(current);


    // Footer
    let footer = dce({el: 'FOOTER'});
    let footerNav = dce({el: 'NAV'});


    // Change discipline
    let changeDiscipline = dce({el: 'a'});
    let changeDisciplineContainer = dce({el: 'SPAN'});
    let linkTickPageIcon = dce({el: 'IMG', source: 'images/rock.svg'})
    let linkTickPageTitle = dce({el: 'SPAN', content: globals.currentClimbingType});
    changeDisciplineContainer.append(linkTickPageIcon, linkTickPageTitle);
    changeDiscipline.append(changeDisciplineContainer);

    let udpateDiscipline = function (type) {
      updateScopeTicks();
      linkTickPageTitle.innerHTML = globals.currentClimbingType;
    };
    
    let disciplines = new pulldownMenu({
      options   : [
        {title: 'Boulder', value:'boulder', icon: '/images/rock.svg', selected: true, legend: globals.totalAscentsByType.boulder, val: 'totalAscentsByType.boulder'},
        {title: 'Sport', value:'sport', icon: '/images/climb.svg',  legend: globals.totalAscentsByType.sport, val: 'totalAscentsByType.sport'},
        {title: 'Top rope', value:'toprope', icon: '/images/rock.svg', legend: globals.totalAscentsByType.toprope, val: 'totalAscentsByType.toprope'},
        {title: 'Trad', value:'trad', icon: '/images/rock.svg', legend: globals.totalAscentsByType.trad, val: 'totalAscentsByType.trad'}
      ],
      targetObj : 'currentClimbingType',
      callback: udpateDiscipline
    });

    changeDiscipline.appendChild(disciplines.render());

    changeDiscipline.addEventListener('click', () => {
      disciplines.toggle();

    }, false);



/* / Indoors / Outdoors -> */
    let changeIndoorsOutdoors = dce({el: 'a'});
    let changeIndoorsOutdoorsContainer = dce({el: 'SPAN'});
    let changeIndoorsOutdoorsIcon = dce({el: 'IMG', source: 'images/garden.svg'})
    let changeIndoorsOutdoorsTitle = dce({el: 'SPAN', content: globals.indoorsOutdoors});
    changeIndoorsOutdoorsContainer.append(changeIndoorsOutdoorsIcon, changeIndoorsOutdoorsTitle);
    changeIndoorsOutdoors.append(changeIndoorsOutdoorsContainer);
        
    let inOutScope = new pulldownMenu({
      options   : [
        {title: 'Outdoors', value:'outdoors', icon: '/images/garden.svg',selected: globals.indoorsOutdoors === 'outdoors' },
        {title: 'Indoors', value:'indoors', icon: '/images/rock.svg', selected: globals.indoorsOutdoors === 'indoors'}
        ],
      targetObj : 'indoorsOutdoors',
      callback: udpateDiscipline
    });

    changeIndoorsOutdoors.appendChild(inOutScope.render());

    changeIndoorsOutdoors.addEventListener('click', () => {
      inOutScope.toggle();
      changeIndoorsOutdoorsTitle.innerHTML = globals.indoorsOutdoors;

    }, false);

/* <- / Indoors / Outdoors */

/* settings --> 
      let changeSettings = dce({el: 'a'});
      let changeSettingsContainer = dce({el: 'SPAN'});
      let changeSettingsContainerIcon = dce({el: 'IMG', source: 'images/rock.svg'})
      let changeSettingsTitle = dce({el: 'SPAN', content: 'Settings'});
      changeSettingsContainer.append(changeSettingsContainerIcon, changeSettingsTitle);
      changeSettings.append(changeSettingsContainer);

 <-- settings  */

    footerNav.append(changeDiscipline, changeIndoorsOutdoors/*, changeSettings*/);

    footer.appendChild(footerNav);

    tickPage.appendChild(inOutSelector);
    tickPage.appendChild(progressSection.render());
    tickPage.appendChild(gradeSelector.render());
    templateContainer.appendChild(tickPage);
    appContainer.appendChild(templateContainer);
    appContainer.appendChild(footer);

    let naviShadow = dce({el: 'DIV', cssClass: 'navi-shadow'});
    appContainer.append(naviShadow, otcMenu.render());

    this.render = () => {
      return appContainer;
      }
		}
  }

export default viewHome;
