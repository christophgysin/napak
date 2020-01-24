import { dce } from '/js/shared/helpers.js';
import { user } from '/js/shared/user.js';
import { store } from '/js/shared/store.js';

class viewLogin {
  constructor() {
    let container = dce({el: 'DIV', cssClass: 'login-page'});
    let loginFormContainer = dce({el: 'SECTION', cssClass: 'login-form'});

    let logoContainer = dce({el: 'DIV', cssClass: 'logo-container'});
    let logo = dce({el: 'IMG', source: '/images/napak_vector.svg', cssClass:'logo'});
    let version = dce({el: 'SPAN', content: '  0.x'})

    logoContainer.append(logo, version);

    let userName = dce({el: 'INPUT', attrbs: [['placeholder', 'User name']]});
    let password = dce({el: 'INPUT', attrbs: [['placeholder', 'Password'], ['type', 'password']]});
    let loginButton = dce({el: 'A', cssClass: 'btn mt mb', content: 'Login'});

    const login = () => {
      user.login.isLoggedIn = true;
      user.name.userName = userName.value;
      user.login = user.login;
      store.write({
        key: 'user',
        keydata: { ...user.name, ...user.login}
      });
    };

    const onEnter = func => ({keyCode}) => (keyCode === 13) && func();

    userName.addEventListener('keydown', onEnter(() => password.focus()), false);
    password.addEventListener('keydown', onEnter(login), false);
    loginButton.addEventListener('click', login, false);

    loginFormContainer.append(logoContainer, userName, password, loginButton)

    container.append(loginFormContainer);

    this.render = () => {
      return container
    }
  }
}

export default viewLogin;
