import { dce, storeObserver } from '/js/shared/helpers.js';
import toggleSwitch from '/js/components/toggleswitch.js';
import { user } from '/js/shared/user.js';
import { route } from '/js/shared/route.js';
import { globals } from '/js/shared/globals.js';
import { localStrg } from '/js/shared/localstorage.js';
import modalWindow from '/js/components/modal.js';


class otc {
  constructor() {
    let container = dce({el: 'DIV', cssClass: 'otc-navigation'});

    let otcLinksContainer = dce({el: 'DIV', cssClass: 'otc-links-container'});

    let logoContainer = dce({el: 'DIV', cssClass: 'logo-container'});
    let logoImg = dce({el: 'IMG', source: '/images/napak_vector.svg', cssClass: 'logo'});
    let version = dce({el: 'SPAN', content: ` ${globals.version}`});
    let about = dce({el: 'P', content: 'About'});

    about.addEventListener('click', () => {
      let modalContent = dce({el: 'P'});
      modalContent.appendChild(dce({el: 'H3', content : 'New in this version'}));
      let nakki = dce({el: 'UL'});

      nakki.appendChild(dce({el: 'LI', content : '- Password protected groups'}));
      nakki.appendChild(dce({el: 'LI', content : '- Updated scope handling'}));

      modalContent.appendChild(nakki);

      let modal = new modalWindow({
        title         : `About Napak ${globals.version}`,
        modalContent  : modalContent,
        open          : true          });
  
      document.body.appendChild(modal.render())  
    }, false);

    logoContainer.append(logoImg, version, about);

    let loginInfo = dce({el: 'DIV', cssClass: 'login-info'});

    let userName = user.name.displayName;
    let loginInfoTitle = dce({el: 'H3', cssClass: 'mt mb username', content: `Logged in as ${userName} 😻`});
    let logoutButton = dce({el: 'A', cssClass: 'btn login-link', content: 'Logout'});
    loginInfo.appendChild(loginInfoTitle)

    let updateProfile = dce({el: 'h3', cssClass: 'hidden', content: 'What kind of user name is that? '});
    let updateProfileLink = dce({el: 'A', cssClass: 'text-link', content: 'Update your profile'});
    updateProfileLink.addEventListener('click', ()=>{
      route({page: 'profile'});
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
      let userName = user.name.displayName;
      loginInfo.querySelector('H3.username').innerHTML = `Logged in as ${userName} 😻`;
      if(!userName) {
        updateProfile.classList.remove('hidden');
      }
      else {
        updateProfile.classList.add('hidden');
      }
    }

    
    storeObserver.add({
      store: user,
      key : 'login',
      id  : 'userLogin',
      callback: () => {loginStatus()},
      removeOnRouteChange: false
    });
    
    storeObserver.add({
      store: user,
      key : 'name',
      id  : 'userNameChange',
      callback: () => {loginStatus()},
      removeOnRouteChange: false
   });

    let settingsContainer = dce({el: 'DIV', cssClass: 'settings'});

    let vibrateContainer = dce({el: 'DIV', cssClass: 'mb'});
    let vibrateTitle = dce({el: 'H3', content: 'Haptics', cssClass: 'mb'});
    let vibrateOnOff = new toggleSwitch({
      cssClass  : 'horizontal-menu full-width',
      targetObj : 'vibrate',
      options   : [
        {title: 'On', value: true, selected: (globals.vibrate) ? true : false },
        {title: 'Off', value: false, selected: (!globals.vibrate) ? true : false }]
    });
    let supportsVibrate = "vibrate" in navigator;
    if(supportsVibrate) {
      vibrateContainer.append(vibrateTitle, vibrateOnOff.render());
      settingsContainer.appendChild(vibrateContainer);
    }


// not in use yet
    let locationContainer = dce({el: 'DIV', cssClass: 'mt'});
    let locationTitle = dce({el: 'H3', cssClass: 'mt mb', content: 'LOCATION TRACKING'});
    let locationOnOff = new toggleSwitch({
      cssClass  : 'horizontal-menu full-width',
      targetObj : 'gpsTracking',
      options   : [
        {title: 'On', value: true, selected: (globals.gpsTracking) ? true : false},
        {title: 'Off', value: false, selected: (globals.gpsTracking) ? true : false}]
    });
    locationContainer.append(locationTitle, locationOnOff.render());
    settingsContainer.appendChild(locationContainer);


    // Page links
    let sideNavLinks = dce({el: 'SECTION', cssClass: 'sidenav-links'});

    let btnHome = dce({el: 'DIV', attrbs: [['data-route', 'home']]});
    let bthHomeText = dce({el: 'SPAN', content: 'Home'});
    btnHome.appendChild(bthHomeText)

    let btnProfile = dce({el: 'DIV', attrbs: [['data-route', 'profile']] });
    let btnProfileText = dce({el: 'SPAN', content: 'Profile'});
    btnProfile.appendChild(btnProfileText)

    let btnStatistics = dce({el: 'DIV', attrbs: [['data-route', 'statistics']] });
    let btnStatisticsText = dce({el: 'SPAN', content: 'Statistics'});
    btnStatistics.appendChild(btnStatisticsText)

    let btnHistory = dce({el: 'DIV', attrbs: [['data-route', 'history']] });
    let btnHistoryText = dce({el: 'SPAN', content: 'History'});
    btnHistory.appendChild(btnHistoryText)

    let btnGroups = dce({el: 'DIV', attrbs: [['data-route', 'groups']] });
    let btnGroupsText = dce({el: 'SPAN', content: 'Groups'});
    btnGroups.appendChild(btnGroupsText)


    btnHome.addEventListener('click', () => {
      route({page: 'home'});
      document.body.classList.remove('otc')
    }, false);


    btnProfile.addEventListener('click', () => {
      route({page: 'profile'});
      document.body.classList.remove('otc')
    }, false);

    btnGroups.addEventListener('click', () => {
      route({page: 'groups'});
      document.body.classList.remove('otc')
    }, false);

    btnStatistics.addEventListener('click', () => {
      route({page: 'statistics'});
      document.body.classList.remove('otc')
    }, false);

    btnHistory.addEventListener('click', () => {
      route({page: 'history'});
      document.body.classList.remove('otc')
    }, false);

    sideNavLinks.append(btnHome, btnProfile, /*btnStatistics,*/ btnHistory, btnGroups);

    otcLinksContainer.append(logoContainer, loginInfo, settingsContainer,sideNavLinks);

    container.append(otcLinksContainer);

    this.updateSelected = () => {
      let btns = sideNavLinks.querySelectorAll('DIV');
      btns.forEach((el)=>{
        el.classList.remove('selected');
        if(el.getAttribute('data-route') === globals.route) {
          el.classList.add('selected');
        }
      })
    }

    storeObserver.add({
      store: globals,
      key : 'vibrate',
      id  : 'settingsVibrate',
      callback: () => {
        localStrg.write({key: 'useVibrate', keydata: globals.vibrate});
      },
      removeOnRouteChange: false
    });

    storeObserver.add({
      store: globals,
      key : 'gpsTracking',
      id  : 'settingsGPS',
      callback: () => {
        localStrg.write({key: 'useGPS', keydata: globals.gpsTracking});
      },
      removeOnRouteChange: false

    });

    
    storeObserver.add({
      store: globals,
      key: 'route',
      id: 'otcUpdateLocation',
      callback: this.updateSelected,
      removeOnRouteChange: false

    });

    this.render = () => {
      return container
    }
  }
}

export default otc;
