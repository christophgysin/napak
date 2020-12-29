import { dce } from '/js/shared/helpers.js';
import { user } from '/js/shared/user.js';
import { route } from '/js/shared/route.js';


class viewResetPassword {
  constructor() {

    let container = dce({el: 'DIV', cssClass: 'login-page'});
    let resetFormContainer = dce({el: 'SECTION', cssClass: 'reset-form'});

    let logoContainer = dce({el: 'DIV', cssClass: 'logo-container'});
    let logo = dce({el: 'IMG', source: '/images/napak_vector.svg', cssClass:'logo'});
    let version = dce({el: 'SPAN', content: '  0.x'})
    logoContainer.append(logo, version);

    let pageTitle = dce({el: 'h3', cssClass: 'mb', content: 'Forgot password'});
    let resetForm = dce({el: 'FORM', attrbs: [['name', 'napak-login']]});
    let userEmail = dce({el: 'INPUT', attrbs: [['placeholder', 'email'], ['name', 'email']]});

    let resetSuccess = dce({el: 'DIV', cssClass : 'api-message-success'});
    let resetError = dce({el: 'DIV', cssClass : 'api-message-error'});
    let resetButton = dce({el: 'BUTTON', cssClass: 'mb', content: 'RESET'});

    let goBack = dce({el: 'DIV', cssClass: 'mb mt', content: 'Go back to '});
    let goBackLink = dce({el: 'A', cssClass: 'text-link', content: 'login page'});
    goBack.appendChild(goBackLink);

    goBackLink.addEventListener('click', ()=>{
      route({page: 'login'});
    }, false)


    let resetPassword = () => {
      var emailAddress = userEmail.value;
      firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
        resetSuccess.innerHTML = 'Email sent. Follow the directions in the email to reset your password'
      }).catch(function(error) {
//        resetError.innerHTML = error.code + " " + error.message;
        resetSuccess.innerHTML = 'Email sent. Follow the directions in the email to reset your password'
      });
    }

    resetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let test = this.validateEmail(userEmail.value);
      if(!test) {
        resetError.innerHTML = "email address is not valid";
        resetSuccess.innerHTML = "";
        return;
      }
      else {
        resetError.innerHTML = "";
      }
      resetPassword();
      return;
    }, false)


    resetForm.append(userEmail, resetError, resetSuccess, resetButton, goBack)
    resetFormContainer.append(logoContainer, pageTitle, resetForm);

    container.append(resetFormContainer);

    this.render = () => {
      return container
    }

    this.validateEmail = (email) => {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
  }
}

export default viewResetPassword;
