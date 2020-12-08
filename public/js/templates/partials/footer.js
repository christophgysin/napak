import { user } from '/js/shared/user.js';
import { dce, storeObserver } from '/js/shared/helpers.js';

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

    let moreItemsMenu = dce({el: 'a'});
    let moreItemsMenuContainer = dce({el: 'SPAN', content: "→"});
    let moreItemsMenuTitle = dce({el: 'SPAN', content:'More'});
    moreItemsMenuContainer.appendChild(moreItemsMenuTitle);
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


    storeObserver.add({
      store: user,
      key: 'login',
      callback: toggleVisibility,
      id: 'footerVisibility',
      removeOnRouteChange: true
      });

    toggleVisibility();

    this.render = () => {
      return footer;
    }
  }
}

export default footer;
