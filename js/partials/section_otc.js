import { dce, generateTicks } from '/js/shared/helpers.js';
import toggleSwitch from '/js/components/toggleSwitch.js';

class otc {
    constructor() {
        let container = dce({el: 'DIV', cssClass: 'otc-navigation'});

        let navContainer = dce({el: 'NAV'});
        let toggleNavigation = dce({el: 'SPAN', cssClass: 'menu-trigger'});
        let iconContainer = dce({el: 'SPAN'});
        let crossTop    = dce({el: 'I', cssClass: 'menu-trigger-bar top'});
        let crossMiddle = dce({el: 'I', cssClass: 'menu-trigger-bar middle'});
        let crossBottom = dce({el: 'I', cssClass: 'menu-trigger-bar bottom'});

        iconContainer.append(crossTop, crossMiddle, crossBottom);
        toggleNavigation.appendChild(iconContainer);
        navContainer.appendChild(toggleNavigation);

        toggleNavigation.addEventListener('click', () => {
            document.body.classList.toggle('otc');
        }, false);

        let linksContainer = dce({el: 'DIV', cssClass: 'otc-links-container'});

        let logoContainer = dce({el: 'DIV', cssClass: 'logo-container'});
        let logoImg = dce({el: 'IMG', source: '/images/napak_vector.svg', cssClass: 'logo'});
        let version = dce({el: 'SPAN', content: '0.x'});

        logoContainer.append(logoImg, version);

        let loginInfo = dce({el: 'DIV', cssClass: 'login-info'});
        let loginInfoTitle = dce({el: 'H3', content: 'Logged in as pyry 😻'});
        let logoutButton = dce({el: 'A', cssClass: 'btn login-ling', content: 'Logout'});

        loginInfo.append(loginInfoTitle, logoutButton);

        let settingsContainer = dce({el: 'SECTION', cssClass: 'settings'});

        let vibrateTitle = dce({el: 'H3', content: 'VIBRATE WHEN TICKING'});
        let vibrateOnOff = new toggleSwitch({
            cssClass  : 'horizontal-menu full-width',
            targetObj : 'vibrate',
            options   : [
              {title: 'On', value:'on'},
              {title: 'Off', value:'off'}]
          });

          let locationTitle = dce({el: 'H3', content: 'LOCATION TRACKING'});
          let locationOnOff = new toggleSwitch({
              cssClass  : 'horizontal-menu full-width',
              targetObj : 'vibrate',
              options   : [
                {title: 'On', value:'on'},
                {title: 'Off', value:'off'}]
            });
        settingsContainer.append(vibrateTitle, vibrateOnOff.render(), locationTitle, locationOnOff.render())

//        
        let sideNavLinksContainer = dce({el: 'SECTION', cssClass: 'sidenav-links'});

        let groupsLinkContainer = dce({el: 'A', href: '/groups', cssClass: 'selected'});
        groupsLinkContainer.appendChild(dce({el: 'SPAN', content: 'Groups'}));

        let statsLinkContainer = dce({el: 'A', href: '/#'});
        statsLinkContainer.appendChild(dce({el: 'SPAN', content: 'Statistics'}));

        let merchLinkContainer = dce({el: 'A', href: '/#'});
        merchLinkContainer.appendChild(dce({el: 'SPAN', content: 'NAPAK merch'}));

        let tickSome = dce({el: 'A', href: '/#'});
        tickSome.appendChild(dce({el: 'SPAN', content: 'Generate ticks [dev]'}));

        tickSome.addEventListener('click', () => {generateTicks(); return;}, false);


        sideNavLinksContainer.append(groupsLinkContainer, statsLinkContainer, merchLinkContainer, tickSome);

        linksContainer.append(logoContainer, loginInfo, settingsContainer, sideNavLinksContainer);
        container.append(navContainer, linksContainer);

    this.render = () => {
      return container;
      }
  	}
  }

export default otc;
