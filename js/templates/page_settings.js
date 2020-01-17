import { dce } from '/js/shared/helpers.js';
import toggleSwitch from '/js/components/toggleswitch.js';
import { user } from '/js/shared/user.js';

class viewSettings {
  constructor() {
    let container = dce({el: 'SECTION', cssClass: 'page-settings'});

    let logoContainer = dce({el: 'DIV', cssClass: 'logo-container'});
    let logoImg = dce({el: 'IMG', source: '/images/napak_vector.svg', cssClass: 'logo'});
    let version = dce({el: 'SPAN', content: ' 0.x'});

    logoContainer.append(logoImg, version);

    user.storeObservers.push({key: 'ticks', id: 'appTicks', callback: updateAll });

    let loginInfo = dce({el: 'DIV', cssClass: 'login-info'});
    if(user.login.isLoggedIn) {
      let loginInfoTitle = dce({el: 'H3', cssClass: 'mt mb', content: `Logged in as ${user.name.userName} 😻`});
      let logoutButton = dce({el: 'A', cssClass: 'btn login-ling', content: 'Logout'});
      loginInfo.append(loginInfoTitle, logoutButton);

      logoutButton.addEventListener('click', () => {
        user.login.isLoggedIn = false;

        user.login = user.login;
      }, false)
    }
    else {
      let loginInfoTitle = dce({el: 'H3', cssClass: 'mt mb', content: `Not logged in. No data is saved`});
      let logInButton = dce({el: 'A', cssClass: 'btn login-ling', content: 'Login'});
      loginInfo.append(loginInfoTitle, logInButton)
    }
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

    let naviShadow = dce({el: 'DIV', cssClass: 'navi-shadow'});

    container.append(logoContainer, loginInfo, settingsContainer, naviShadow);

    this.render = () => {
      return container
    }
  }
}

export default viewSettings;
