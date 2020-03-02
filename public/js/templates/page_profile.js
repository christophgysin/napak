import { dce } from '/js/shared/helpers.js';
import { user } from '/js/shared/user.js';
import { store } from '/js/shared/store.js';

class viewProfile {
  constructor() {

    document.body.classList.remove('otc');
    let container = dce({el: 'DIV', cssClass: 'page-profile'});
    let loginFormContainer = dce({el: 'SECTION', cssClass: 'login-form'});

    let logoContainer = dce({el: 'DIV', cssClass: 'logo-container'});
    let logo = dce({el: 'IMG', source: '/images/napak_vector.svg', cssClass:'logo'});
    let version = dce({el: 'SPAN', content: '  0.x'})

    logoContainer.append(logo, version);

    let pageTitle = dce({el: 'h3', cssClass: 'mb', content: 'Profile'});

    let userProfileForm = dce({el: 'FORM', attrbs: [['name', 'napak-profile']]});
    let userNameTitle = dce({el: 'H3', content: 'User name: '});
    let userName = dce({el: 'INPUT', attrbs: [['placeholder', 'user name'], ['name', 'username'], ['value', firebase.auth().currentUser.displayName]]});
    let updateProfileButton = dce({el: 'BUTTON', cssClass: '', content: 'Update'});

    userProfileForm.append(userNameTitle, userName, updateProfileButton);

    loginFormContainer.append(logoContainer, pageTitle, userProfileForm);

    container.append(loginFormContainer);


    let updateProfile = () => {
      let dbUser = firebase.auth().currentUser;

      dbUser.updateProfile({
        displayName: userName.value
      }).then(function() {
        user.name.displayName = userName.value; 
        user.name = user.name; // touch user login to update OTC element
      alert('user name updated')
      }).catch(function(error) {
        alert('fail')
      });
      
    } 

    userProfileForm.addEventListener('submit', (e) => {
      event.preventDefault();
      updateProfile();
      return;
    }, false);
    
    this.render = () => {
      return container
    }
  }
}

export default viewProfile;
