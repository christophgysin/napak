import { globals } from '/js/shared/globals.js';
import { user } from '/js/shared/user.js';
import { dce } from '/js/shared/helpers.js';

import { route } from '/js/shared/route.js';

class footer {
    constructor(mother) {

// Footer
    let footer = dce({el: 'FOOTER', cssClass :'hidden'});
    let footerNav = dce({el: 'NAV'});

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

    footerNav.append(logoContainer, moreItemsMenu);
    footer.appendChild(footerNav);

    let toggleVisibility = () => {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          footer.classList.remove('hidden');
        } else {
          footer.classList.add('hidden');
        }
      });
    };

    user.storeObservers.push({key: 'login', callback: toggleVisibility});

    toggleVisibility();

    this.render = () => {
      return footer;
    }
  }
}

export default footer;
