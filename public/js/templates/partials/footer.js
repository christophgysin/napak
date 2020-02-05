import pulldownMenu from '/js/components/pulldown.js';

import { globals } from '/js/shared/globals.js';
import { user } from '/js/shared/user.js';
import { dce, updateScopeTicks} from '/js/shared/helpers.js';

import { route } from '/js/shared/route.js';

class footer {
    constructor(mother) {

// Footer
    let footer = dce({el: 'FOOTER', cssClass :'hidden'});
    let footerNav = dce({el: 'NAV'});

    // Change discipline
    let changeDiscipline = dce({el: 'a'});
    let changeDisciplineContainer = dce({el: 'SPAN'});
    let linkTickPageIcon = dce({el: 'IMG', source: 'images/rock.svg'})
    let linkTickPageTitle = dce({el: 'SPAN', content: globals.currentClimbingType});
    changeDisciplineContainer.append(linkTickPageIcon, linkTickPageTitle);
    changeDiscipline.append(changeDisciplineContainer);

    let udpateDiscipline = function () {
      updateScopeTicks();
      linkTickPageTitle.innerHTML = globals.currentClimbingType;
    };

    let disciplines = new pulldownMenu({
      options: [
        {title: 'Boulder', value:'boulder', selected: true, legend: globals.totalAscentsByType.boulder, val: 'totalAscentsByType.boulder'},  // icon: '/images/rock.svg'
        {title: 'Sport', value:'sport',  legend: globals.totalAscentsByType.sport, val: 'totalAscentsByType.sport'},                         // icon: '/images/climb.svg'
        {title: 'Top rope', value:'toprope', legend: globals.totalAscentsByType.toprope, val: 'totalAscentsByType.toprope'},                 // icon: '/images/rock.svg'
        {title: 'Trad', value:'trad', legend: globals.totalAscentsByType.trad, val: 'totalAscentsByType.trad'}                               // icon: '/images/rock.svg',
      ],
      targetObj: 'currentClimbingType',
      listen: 'ticks',
      callback: udpateDiscipline
    });

    changeDiscipline.appendChild(disciplines.render());

    changeDiscipline.addEventListener('click', () => {
      disciplines.toggle();
    }, false);

    /* / Indoors / Outdoors -> */
    let changeIndoorsOutdoors = dce({el: 'a', attrbs: [["label", "indoors or outdoors"]]});
    let changeIndoorsOutdoorsContainer = dce({el: 'SPAN'});
    let changeIndoorsOutdoorsIcon = dce({el: 'IMG', source: 'images/garden.svg'})
    let changeIndoorsOutdoorsTitle = dce({el: 'SPAN', content: globals.indoorsOutdoors});
    changeIndoorsOutdoorsContainer.append(changeIndoorsOutdoorsIcon, changeIndoorsOutdoorsTitle);
    changeIndoorsOutdoors.append(changeIndoorsOutdoorsContainer);

    let inOutScope = new pulldownMenu({
      options: [
        {title: 'Outdoors', value:'outdoors', selected: globals.indoorsOutdoors === 'outdoors' }, // icon: '/images/garden.svg',
        {title: 'Indoors', value:'indoors', selected: globals.indoorsOutdoors === 'indoors'} // icon: '/images/rock.svg',
      ],
      targetObj: 'indoorsOutdoors',
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
    let changeViewStatistics = dce({el: 'a', attrbs: [["label", "history"]]});
    let changeViewStatisticsContainer = dce({el: 'SPAN'});
    let linkStatisticsPageIcon = dce({el: 'IMG', source: 'images/stats.svg'})
    let linkStatisticsPageTitle = dce({el: 'SPAN', content: 'history'});
    changeViewStatisticsContainer.append(linkStatisticsPageIcon, linkStatisticsPageTitle);
    changeViewStatistics.append(changeViewStatisticsContainer);
    changeViewStatistics.addEventListener('click', () => {route('history')}, false);

    let routeLinks = function (type) {
      route(type)
    };

    let moreItemsMenu = dce({el: 'a', attrbs: [["label", "more options"]]});
    let moreItemsMenuContainer = dce({el: 'SPAN'});
    let moreItemsMenuIcon = dce({el: 'IMG', source: 'images/more.svg'})
    let moreItemsMenuTitle = dce({el: 'SPAN', content:'More'});
    moreItemsMenuContainer.append(moreItemsMenuIcon, moreItemsMenuTitle);
    moreItemsMenu.append(moreItemsMenuContainer);


    moreItemsMenu.addEventListener('click', () => {
     document.body.classList.toggle('otc');
    }, false);

    footerNav.append(changeDiscipline, changeIndoorsOutdoors, logoContainer, changeViewStatistics, moreItemsMenu);
    footer.appendChild(footerNav);

    let toggleVisibility = () => {
      if(user.login.isLoggedIn) {
        footer.classList.remove('hidden');
      }
      else {
        footer.classList.add('hidden');
      }
    };
    user.storeObservers.push({key: 'login', callback: toggleVisibility});

    toggleVisibility();

    this.render = () => {
      return footer;
    }
  }
}

export default footer;