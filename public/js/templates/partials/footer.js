import { user } from '/js/shared/user.js';
import { dce, storeObserver } from '/js/shared/helpers.js';
import modalWindow from '/js/components/modal.js';
import { route } from '/js/shared/route.js';
import { globals } from '../../shared/globals.js';

class footer {
    constructor(mother) {

// Footer
    let footer = dce({el: 'FOOTER', cssClass :'hidden'});
    let footerNav = dce({el: 'NAV'});

    let gpsContainer = dce({el: 'SPAN', cssClass: `gps-container ${(globals.gpsTracking) ? '' : 'hidden'}`});
    gpsContainer.appendChild(dce({el: 'SPAN', cssClass: 'gps'}));

    gpsContainer.addEventListener('click', () => {
      let docFrag = document.createDocumentFragment();
      if ( !globals.gpsLocation ) {
        docFrag.appendChild(dce({el: 'P', content: 'Could not locate you 😿'}));
      }

      else {
        Object.keys(globals.gpsLocation).forEach(key => {
            docFrag.appendChild(dce({el: 'DIV', content: `${key.toUpperCase()} ${globals.gpsLocation[key]}`}))
          });
        }
      let modal = new modalWindow({
        title         : 'GPS location',
        modalContent  : docFrag,
        cssClass      : 'modal-small',
        open          : true
      });

      footer.parentNode.appendChild(modal.render())      
    }, false);

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

    footerNav.append(gpsContainer, logoContainer, moreItemsMenu);
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

    let toggleGpsIcon = () => {
      if(globals.gpsTracking) {
        gpsContainer.classList.remove('hidden')
      }
      else {
        gpsContainer.classList.add('hidden')
      }
    }

    storeObserver.add({
      store: user,
      key: 'login',
      callback: toggleVisibility,
      id: 'footerVisibility',
      removeOnRouteChange: false
      });

    storeObserver.add({
      store: globals,
      key: 'gpsTracking',
      callback: toggleGpsIcon,
      id: 'footerGpsIcon',
      removeOnRouteChange: false
      });
  
    toggleVisibility();

    this.render = () => {
      return footer;
    }
  }
}

export default footer;
