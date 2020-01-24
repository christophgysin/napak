import { dce } from '/js/shared/helpers.js';
import { user } from '/js/shared/user.js';
import { store } from '/js/shared/store.js';
import { renderAuthUI } from '/js/shared/auth.js';

class viewLogin {
  constructor() {
    let container = dce({el: 'DIV', cssClass: 'login-page'});
    let loginFormContainer = dce({el: 'SECTION', cssClass: 'login-form'});

    let logoContainer = dce({el: 'DIV', cssClass: 'logo-container'});
    let logo = dce({el: 'IMG', source: '/images/napak_vector.svg', cssClass:'logo'});
    let version = dce({el: 'SPAN', content: '  0.x'})

    logoContainer.append(logo, version);

    let authContainer = dce({ el: 'DIV', id: 'auth-container' });

    loginFormContainer.append(logoContainer, authContainer);

    container.append(loginFormContainer);

    this.render = () => {
      setTimeout(renderAuthUI, 0)
      return container;
    };
  }
}

export default viewLogin;
