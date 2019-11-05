import pulldownMenu from '/js/components/pulldown.js';

import { globals } from '/js/shared/globals.js';
import { dce, updateScopeTicks} from '/js/shared/helpers.js';

import { route } from '/js/shared/route.js';

class footer {
    constructor(mother) {

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
      listen: 'ticks',
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

    let logoContainer = dce({el: 'DIV', cssClass: 'logo-container'});
    let logoImg = dce({el: 'IMG', source: '/images/napak_vector.svg', cssClass: 'logo'});

    logoContainer.appendChild(logoImg);
    logoContainer.addEventListener('click', () => {route('home')}, false);

    // statstics
    let changeViewStatistics = dce({el: 'a'});
    let changeViewStatisticsContainer = dce({el: 'SPAN'});
    let linkStatisticsPageIcon = dce({el: 'IMG', source: 'images/rock.svg'})
    let linkStatisticsPageTitle = dce({el: 'SPAN', content: 'statistics'});
    changeViewStatisticsContainer.append(linkStatisticsPageIcon, linkStatisticsPageTitle);
    changeViewStatistics.append(changeViewStatisticsContainer);
    changeViewStatistics.addEventListener('click', () => {route('statistics')}, false);


    // Settings
    let changeViewSettings = dce({el: 'a'});
    let changeViewSettingsContainer = dce({el: 'SPAN'});
    let linkSettingsPageIcon = dce({el: 'IMG', source: 'images/rock.svg'})
    let linkSettingsPageTitle = dce({el: 'SPAN', content: 'settings'});
    changeViewSettingsContainer.append(linkSettingsPageIcon, linkSettingsPageTitle);
    changeViewSettings.append(changeViewSettingsContainer);

    changeViewSettings.addEventListener('click', () => {route('settings')}, false);

    
    footerNav.append(changeDiscipline, changeIndoorsOutdoors, logoContainer, changeViewStatistics, changeViewSettings);
    footer.appendChild(footerNav);

    this.render = () => {
        return footer;
        }
    }
} 

export default footer;
