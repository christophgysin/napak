import { globals } from '/js/shared/globals.js';
import { store }  from '/js/shared/store.js';

const handler = {
  get: (obj, prop) => {
    return obj[prop];
  },

  set: (obj, prop, value) => {
    obj[prop] = value;

    for(let i=0, j = user.storeObservers.length; i<j; i++) {
      if(user[user.storeObservers[i].key] === obj[prop]) {
        user.storeObservers[i].callback();
      }
    }
    return true
  }
}

let userFromStorage = store.read({key: 'user', onlyLS: true});

let userObject = {
  storeObservers : [],
  name : {
    firstName: (userFromStorage.name) ? userFromStorage.name : false,
    lastName:  (userFromStorage.lastName) ? userFromStorage.lastName : false,
    userName:  (userFromStorage.userName) ? userFromStorage.userName : false,
    email:  (userFromStorage.email) ? userFromStorage.email : false,
    id:  (userFromStorage.id) ? userFromStorage.id : false
  },

  login : {
    isLoggedIn :  (userFromStorage.isLoggedIn) ? userFromStorage.isLoggedIn : null,
  },
  ticks : [...globals.ticks]
};


const user = new Proxy(userObject, handler);
// Expose this for debugging purposes
window.user = user;

export { user }
