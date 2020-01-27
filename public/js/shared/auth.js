import { user } from '/js/shared/user.js';
import { store } from '/js/shared/store.js';

const initAuth = () => {
  firebase.auth().onAuthStateChanged((data) => {
    if (data) {
      console.log('login:', JSON.stringify(data, null, 2));

      user.name.id = data.uid;
      user.name.userName = data.displayName;
      user.name.email = data.email;
      user.login.isLoggedIn = true;

      store.write({
        key: 'user',
        keydata: { ...user.name, ...user.login },
      });
    }
  });
};

const renderAuthUI = () => {
  const ui = new firebaseui.auth.AuthUI(firebase.auth());
  ui.start('#auth-container', {
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
    ],
    signInSuccessUrl: '/',
  });
};

const logout = () => {
  console.log('logout');

  user.login.isLoggedIn = false;
  store.write({
    key: 'user',
    keydata: { ...user.name, ...user.login },
  });

  firebase.auth().signOut();

  window.location.pathname = '/login';
};

export {
  initAuth,
  renderAuthUI,
  logout,
};
