import { dce } from '/js/shared/helpers.js';
import { user } from '/js/shared/user.js';

class viewProfile {
  constructor() {

    document.body.classList.remove('otc');
    let container = dce({el: 'DIV', cssClass: 'profile-page'});
    let loginFormContainer = dce({el: 'SECTION', cssClass: 'login-form'});

    let logoContainer = dce({el: 'DIV', cssClass: 'logo-container'});
    let logo = dce({el: 'IMG', source: '/images/napak_vector.svg', cssClass:'logo'});
    let version = dce({el: 'SPAN', content: '  0.x'})

    logoContainer.append(logo, version);

    let pageTitle = dce({el: 'h3', cssClass: 'mb', content: 'Profile'});

    loginFormContainer.append(logoContainer, pageTitle);

    container.append(loginFormContainer);

    this.render = () => {
      return container
    }
  }
}

export default viewProfile;
