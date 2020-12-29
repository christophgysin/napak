import { dce } from '/js/shared/helpers.js';
import { user } from '/js/shared/user.js';
import { route } from '/js/shared/route.js';
import { globals } from '/js/shared/globals.js';


class viewLogin {
  constructor() {
    const db = firebase.firestore();
    const dbuser = firebase.auth().currentUser;

    let container = dce({el: 'DIV', cssClass: 'login-page'});
    let loginFormContainer = dce({el: 'SECTION', cssClass: 'login-form'});

    let logoContainer = dce({el: 'DIV', cssClass: 'logo-container'});
    let logo = dce({el: 'IMG', source: '/images/napak_vector.svg', cssClass:'logo'});
    let version = dce({el: 'SPAN', content: ` ${globals.version}`})

    logoContainer.append(logo, version);

    let loginTitle = dce({el: 'h3', cssClass: 'mb', content: 'Login'});
    let loginForm = dce({el: 'FORM', attrbs: [['name', 'napak-login']]});
    let userEmail = dce({el: 'INPUT', attrbs: [['placeholder', 'email'], ['name', 'email']]});
    let password = dce({el: 'INPUT', attrbs: [['placeholder', 'Password'], ['type', 'password'], ['name', 'pass']]});
    let loginError = dce({el: 'DIV', cssClass : 'login-error'});
    let loginButton = dce({el: 'BUTTON', cssClass: 'mb', content: 'Login'});
    let noAccount = dce({el: 'DIV', cssClass: '', content: 'No account? '});
    let createAccountLink = dce({el: 'A', cssClass: 'text-link', content: 'Create one!'});
    noAccount.appendChild(createAccountLink);
    createAccountLink.addEventListener('click', ()=>{
      route({page: 'signup'});
    }, false)

    let forgotPasswordContainer = dce({el: 'DIV', cssClass: 'mt mb'});
    let forgotPasswordLink = dce({el: 'A', cssClass: 'mb mt text-link', content: 'Forgot password'})
    forgotPasswordContainer.appendChild(forgotPasswordLink);

    forgotPasswordLink.addEventListener('click', ()=>{
      route({page: 'resetPassword'});
    }, false)


    let doLogin = () => {
      firebase.auth().signInWithEmailAndPassword(userEmail.value, password.value)
        .then(function(result) {
          user.login.isLoggedIn = true;
          user.login = user.login;
        })
        .catch(function(error) {
          loginError.innerHTML = "Incorrect username or password";
        });
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      doLogin();
      return;
    }, false)


    loginForm.append(userEmail, password, loginError, loginButton)
    loginFormContainer.append(logoContainer, loginTitle, loginForm, noAccount, forgotPasswordContainer);

    container.append(loginFormContainer);

    this.render = () => {
      return container
    }
  }
}

export default viewLogin;
