import { dce } from '/js/shared/helpers.js';
import { user } from '/js/shared/user.js';

class viewLogin {
  constructor() {
    let container = dce({el: 'DIV', cssClass: 'login-page'});
    let loginFormContainer = dce({el: 'SECTION', cssClass: 'login-form'});

    let userName = dce({el: 'INPUT', attrbs: [['placeholder', 'User name']]});
    let password = dce({el: 'INPUT', attrbs: [['placeholder', 'Password'], ['type', 'password']]});

    let loginButton = dce({el: 'A', cssClass: 'btn mt mb', content: 'Login'});


    loginButton.addEventListener('click', () => {
      user.login.isLoggedIn = true;
      user.name.userName = userName.value;
      user.login = user.login;
    }, false);
    loginFormContainer.append(userName, password, loginButton)

    container.append(loginFormContainer);

    this.render = () => {
      return container
    }  
  }
}

export default viewLogin;
