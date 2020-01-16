import { dce } from '/js/shared/helpers.js';
import toggleSwitch from '/js/components/toggleswitch.js';
import { user } from '/js/shared/user.js';
import { route } from '/js/shared/route.js';

class otc {
  constructor() {
    let container = dce({el: 'DIV', cssClass: 'otc-navigation'});

    let navContainer = dce({el: 'NAV'});

    navContainer.addEventListener('click', () => {
        document.body.classList.toggle('otc');
    }, false);

    let otcLinksContainer = dce({el: 'DIV', cssClass: 'otc-links-container'});

    let logoContainer = dce({el: 'DIV', cssClass: 'logo-container'});
    let logoImg = dce({el: 'IMG', source: '/images/napak_vector.svg', cssClass: 'logo'});
    let version = dce({el: 'SPAN', content: ' 0.x'});

    logoContainer.append(logoImg, version);

    let loginInfo = dce({el: 'DIV', cssClass: 'login-info'});
    if(user.login.isLoggedIn) {
      let loginInfoTitle = dce({el: 'H3', cssClass: 'mt mb username', content: `Logged in as ${user.name.userName} 😻`});
      let logoutButton = dce({el: 'A', cssClass: 'btn login-link', content: 'Logout'});
      loginInfo.append(loginInfoTitle, logoutButton);

      logoutButton.addEventListener('click', () => {
        user.login.isLoggedIn = false;

        user.login = user.login;
        document.body.classList.remove('otc')
      }, false)
    }
    else {
      let loginInfoTitle = dce({el: 'H3', cssClass: 'mt mb', content: `Not logged in. No data is saved`});
      let logInButton = dce({el: 'A', cssClass: 'btn login-link', content: 'Login'});
      loginInfo.append(loginInfoTitle, logInButton)
    }


// Listen and update details when login/logout. This is retarded. Fix it at some point
    let loginStatus = () => {
      loginInfo.querySelector('H3.username').innerHTML = `Logged in as ${user.name.userName} 😻`
//      loginInfoTitle.innerHTML = 'MEH'
    }
    user.storeObservers.push({key: 'login', callback: loginStatus});



    let settingsContainer = dce({el: 'DIV', cssClass: 'settings'});

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


// Page links

      let sideNavLinks = dce({el: 'SECTION', cssClass: 'sidenav-links'});

      let btnGroups = dce({el: 'A', content: 'Groups' })
      let btnHistory = dce({el: 'A', content: 'History' })

      btnGroups.addEventListener('click', () => {
          route('groups');
          document.body.classList.remove('otc')
        }, false);

        btnHistory.addEventListener('click', () => {
        route('history');
        document.body.classList.remove('otc')
        }, false);
  

    sideNavLinks.append(btnGroups, btnHistory);

    otcLinksContainer.append(logoContainer, loginInfo, settingsContainer,sideNavLinks);

    container.append(otcLinksContainer, navContainer);
    
    this.render = () => {
      return container
    }  
  }
}

export default otc;
