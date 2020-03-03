import { dce } from '/js/shared/helpers.js';
import { user } from '/js/shared/user.js';
import { store } from '/js/shared/store.js';
import { route } from '/js/shared/route.js';


class viewSignup {
  constructor() {

    let container = dce({el: 'DIV', cssClass: 'signup-page'});
    let signupFormContainer = dce({el: 'SECTION', cssClass: 'signup-form'});

    let logoContainer = dce({el: 'DIV', cssClass: 'logo-container'});
    let logo = dce({el: 'IMG', source: '/images/napak_vector.svg', cssClass:'logo'});
    let version = dce({el: 'SPAN', content: '  0.x'})

    logoContainer.append(logo, version);

    let newAccount = dce({el: 'h3', cssClass: 'mb', content: 'Create new account'});
    let signupForm = dce({el: 'FORM', attrbs: [['name', 'napak-login']]});
    let userEmail = dce({el: 'INPUT', attrbs: [['placeholder', 'email'], ['name', 'email']]});
    let password = dce({el: 'INPUT', attrbs: [['placeholder', 'Password'], ['type', 'password'], ['name', 'pass']]});
    let passwordAgain = dce({el: 'INPUT', attrbs: [['placeholder', 'Password again'], ['type', 'password'], ['name', 'passagain']]});
    let signupError = dce({el: 'DIV', cssClass : 'signup-error'});
    let signupButton = dce({el: 'BUTTON', cssClass: '', content: 'Create account'});
    let goBack = dce({el: 'DIV', cssClass: '', content: 'Go back to '});
    let goBackLink = dce({el: 'A', cssClass: 'text-link', content: 'login page'});
    goBack.appendChild(goBackLink);

    goBackLink.addEventListener('click', ()=>{
      route('login');
    }, false)

    let doSignup = () => {
      if(password.value !== passwordAgain.value) {
        signupError.innerHTML = "PASSWORDS MISMATCH";
        return;
      }

      firebase.auth().createUserWithEmailAndPassword(userEmail.value, password.value).catch(function(error) {
        signupError.innerHTML = error.message;
      }).then((msg) => {
        user.name.email = msg.user.email;
        user.name.userName = '';
        user.name.id = msg.user.uid;

        store.write({
          key: 'user',
          keydata: { ...user.name}
        });
      });
    } 

    signupForm.addEventListener('submit', (e) => {
      event.preventDefault();
      doSignup();
      return;
    }, false);

    signupForm.append(userEmail, password, passwordAgain, signupError, signupButton);

    signupFormContainer.append(logoContainer, newAccount, signupForm, goBack);

    container.append(signupFormContainer);

    this.render = () => {
      return container
    }
  }
}

export default viewSignup;
