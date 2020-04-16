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
    let userEmail = dce({el: 'INPUT', attrbs: [['placeholder', 'email'], ['name', 'email']]});
    let password = dce({el: 'INPUT', attrbs: [['placeholder', 'Password'], ['type', 'password'], ['name', 'pass']]});
    let loginError = dce({el: 'DIV', cssClass : 'login-error'});
    let loginButton = dce({el: 'BUTTON', cssClass: 'mb', content: 'Login'});
    let noAccount = dce({el: 'DIV', cssClass: '', content: 'No account? '});
    let createAccountLink = dce({el: 'A', cssClass: 'text-link', content: 'Create one!'});
    noAccount.appendChild(createAccountLink);
    createAccountLink.addEventListener('click', ()=>{
      route('signup');
    }, false)

    let forgotPasswordContainer = dce({el: 'DIV', cssClass: 'mt mb'});
    let forgotPasswordLink = dce({el: 'A', cssClass: 'mb mt text-link', content: 'Forgot password'})
    forgotPasswordContainer.appendChild(forgotPasswordLink);

    forgotPasswordLink.addEventListener('click', ()=>{
      route('resetPassword');
    }, false)


    let doLogin = () => {
      firebase.auth().signInWithEmailAndPassword(userEmail.value, password.value)
        .then(function(result) {
          user.login.isLoggedIn = true;
          user.name.email = result.user.email;
          user.name.id = result.user.uid;
          user.login = user.login;
        })
          // result.user.tenantId sho
        .catch(function(error) {
        // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            loginError.innerHTML = "Wrong password";
          } else {
            loginError.innerHTML = errorMessage; //body.error.message.replace(/_/g, " ");
          }
          console.log(error);
          });
    } 

    loginForm.addEventListener('submit', (e) => {
      event.preventDefault();
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
