import { dce } from '/js/shared/helpers.js';
import { user } from '/js/shared/user.js';
import { route } from '../shared/route.js';
import { store } from '../shared/store.js';

class viewProfile {
  constructor() {

    document.body.classList.remove('otc');
    let container = dce({el: 'DIV', cssClass: 'page-profile'});
    let loginFormContainer = dce({el: 'SECTION', cssClass: 'login-form'});

    let logoContainer = dce({el: 'DIV', cssClass: 'logo-container'});
    let logo = dce({el: 'IMG', source: '/images/napak_vector.svg', cssClass:'logo'});
    let version = dce({el: 'SPAN', content: '  0.x'})

    logoContainer.append(logo, version);

    let userProfileForm = dce({el: 'FORM', attrbs: [['name', 'napak-profile']]});
    let userNameTitle = dce({el: 'H3', cssClass: 'mb', content: 'User name: '});
    let userName = dce({el: 'INPUT', attrbs: [['placeholder', 'user name'], ['name', 'username'], ['value', firebase.auth().currentUser.displayName]]});
    let updateProfileButton = dce({el: 'BUTTON', cssClass: 'mb', content: 'Update'});

    let errorMessage = dce({el: 'DIV', cssClass : 'error'});
    let successMessage = dce({el: 'DIV', cssClass : 'success', content: 'Profile updated. Take me '});
    let successMessageLink = dce({el: 'A', cssClass : 'text-link', content: 'back to the wall'});
    successMessageLink.addEventListener('click', () => {
      route('home');
    }, false);

    successMessage.appendChild(successMessageLink);

    userProfileForm.append(userNameTitle, userName, updateProfileButton);

    loginFormContainer.append(logoContainer, userProfileForm);

    container.append(loginFormContainer);

    let updateProfile = () => {
      let dbUser = firebase.auth().currentUser;

      dbUser.updateProfile({
        displayName: userName.value
      }).then(function(msg) {
        user.name.displayName = userName.value; 
        user.name = user.name; // touch user login to update OTC element
        store.update({
          store: 'users',
          key: 'user.displayName',
          keydata:  user.name.displayName
        });

        loginFormContainer.appendChild(successMessage);
      }).catch(function(error) {
        errorMessage.innerHMTL = error;
        loginFormContainer.appendChild(errorMessage);
      });
      
    } 

    userProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      updateProfile();
      return;
    }, false);
    
    this.render = () => {
      return container
    }
  }
}

export default viewProfile;
