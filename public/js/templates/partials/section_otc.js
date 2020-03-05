import { dce } from '/js/shared/helpers.js';
import toggleSwitch from '/js/components/toggleswitch.js';
import { user } from '/js/shared/user.js';
import { route } from '/js/shared/route.js';

class otc {
  constructor() {
    let container = dce({el: 'DIV', cssClass: 'otc-navigation'});

    let otcLinksContainer = dce({el: 'DIV', cssClass: 'otc-links-container'});

    let logoContainer = dce({el: 'DIV', cssClass: 'logo-container'});
    let logoImg = dce({el: 'IMG', source: '/images/napak_vector.svg', cssClass: 'logo'});
    let version = dce({el: 'SPAN', content: ' 0.x'});

    logoContainer.append(logoImg, version);

    let loginInfo = dce({el: 'DIV', cssClass: 'login-info'});

    let userName = (firebase.auth().currentUser && firebase.auth().currentUser.displayName) ? firebase.auth().currentUser.displayName : false;
    let loginInfoTitle = dce({el: 'H3', cssClass: 'mt mb username', content: `Logged in as ${userName} 😻`});
    let logoutButton = dce({el: 'A', cssClass: 'btn login-link', content: 'Logout'});
    loginInfo.appendChild(loginInfoTitle)

    let updateProfile = dce({el: 'h3', cssClass: 'hidden', content: 'What kind of user name is that? '});
    let updateProfileLink = dce({el: 'A', cssClass: 'text-link', content: 'Update your profile'});
    updateProfileLink.addEventListener('click', ()=>{
      route('profile');
    }, false);

    if(!userName) {updateProfile.classList.remove('hidden'); }
    updateProfile.appendChild(updateProfileLink);
    loginInfo.appendChild(updateProfile);

    loginInfo.appendChild(logoutButton);

    logoutButton.addEventListener('click', () => {
      firebase.auth().signOut().then(function() {
        document.body.classList.remove('otc')
        user.login.isLoggedIn = false;
        user.login = user.login;
        }, function(error) {
        // An error happened.
      });      
    }, false)

    // Listen and update details when login/logout. This is retarded. Fix it at some point
    let loginStatus = () => {
      let userName = (firebase.auth().currentUser && firebase.auth().currentUser.displayName) ? firebase.auth().currentUser.displayName : false;
      loginInfo.querySelector('H3.username').innerHTML = `Logged in as ${userName} 😻`;
      if(!userName) {
        updateProfile.classList.remove('hidden');
      }
      else {
        updateProfile.classList.add('hidden');
      }
    }
    user.storeObservers.push({key: 'login', callback: loginStatus});
    user.storeObservers.push({key: 'name', callback: loginStatus});

    let settingsContainer = dce({el: 'DIV', cssClass: 'settings'});

    let vibrateTitle = dce({el: 'H3', content: 'VIBRATE WHEN TICKING'});
    let vibrateOnOff = new toggleSwitch({
      cssClass  : 'horizontal-menu full-width',
      targetObj : 'vibrate',
      options   : [
        {title: 'On', value: true, selected: true},
        {title: 'Off', value: false}]
    });

    let locationTitle = dce({el: 'H3', content: 'LOCATION TRACKING'});
    let locationOnOff = new toggleSwitch({
      cssClass  : 'horizontal-menu full-width',
      targetObj : 'location',
      options   : [
        {title: 'On', value: true},
        {title: 'Off', value: false, selected: true}]
    });
    settingsContainer.append(vibrateTitle, vibrateOnOff.render(), locationTitle, locationOnOff.render())

    // Page links

    let sideNavLinks = dce({el: 'SECTION', cssClass: 'sidenav-links'});

    let btnProfile = dce({el: 'A', content: 'Profile' })
    let btnGroups = dce({el: 'A', content: 'Groups' })
    let btnStatistics = dce({el: 'A', content: 'Statistics' })

    btnProfile.addEventListener('click', () => {
      route('profile');
      document.body.classList.remove('otc')
    }, false);

    btnGroups.addEventListener('click', () => {
      route('groups');
      document.body.classList.remove('otc')
    }, false);

    btnStatistics.addEventListener('click', () => {
      route('statistics');
      document.body.classList.remove('otc')
    }, false);

    sideNavLinks.append(btnProfile, btnGroups, btnStatistics);

    otcLinksContainer.append(logoContainer, loginInfo, settingsContainer,sideNavLinks);

    container.append(otcLinksContainer);

    this.render = () => {
      return container
    }
  }
}

export default otc;
