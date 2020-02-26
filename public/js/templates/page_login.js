import { dce } from '/js/shared/helpers.js';
import { user } from '/js/shared/user.js';
import { store } from '/js/shared/store.js';
import { route } from '/js/shared/route.js';


class viewLogin {
  constructor() {

    let container = dce({el: 'DIV', cssClass: 'login-page'});
    let loginFormContainer = dce({el: 'SECTION', cssClass: 'login-form'});

    let logoContainer = dce({el: 'DIV', cssClass: 'logo-container'});
    let logo = dce({el: 'IMG', source: '/images/napak_vector.svg', cssClass:'logo'});
    let version = dce({el: 'SPAN', content: '  0.x'})

    logoContainer.append(logo, version);

    let loginTitle = dce({el: 'h3', cssClass: 'mb', content: 'Login'});
    let loginForm = dce({el: 'FORM', attrbs: [['name', 'napak-login']]});
    let userName = dce({el: 'INPUT', attrbs: [['placeholder', 'email'], ['name', 'email']]});
    let password = dce({el: 'INPUT', attrbs: [['placeholder', 'Password'], ['type', 'password'], ['name', 'pass']]});
    let loginError = dce({el: 'DIV', cssClass : 'login-error'});
    let loginButton = dce({el: 'BUTTON', cssClass: '', content: 'Login'});
    let noAccount = dce({el: 'DIV', cssClass: '', content: 'No account? '});
    let createAccountLink = dce({el: 'A', cssClass: 'text-link', content: 'Create one!'});
    noAccount.appendChild(createAccountLink);

    createAccountLink.addEventListener('click', ()=>{
      route('signup');
    }, false)


    let doLogin = () => {

      (async () => {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebase.app().options.apiKey}`, {
          method: 'POST',
          mode: 'cors',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            "email": userName.value, 
            "password": password.value,
            "returnSecureToken": true
          })
        });
        const body = await response.json();
        if(body.error) {
          loginError.innerHTML = body.error.message.replace(/_/g, " ");
        }
        else {
          user.login.isLoggedIn = true;
          user.name.userName = body.displayName;
          user.name.emaio
          user.login = user.login;
          store.write({
            key: 'user',
            keydata: { ...user.name, ...user.login, ...body}
          });
        }
      })()

    } 

    loginForm.addEventListener('submit', (e) => {
      event.preventDefault();
      doLogin();
      return;
    }, false)


    loginForm.append(userName, password, loginError, loginButton)
    loginFormContainer.append(logoContainer, loginTitle, loginForm, noAccount);

    container.append(loginFormContainer);

    this.render = () => {
      return container
    }
  }
}

export default viewLogin;
