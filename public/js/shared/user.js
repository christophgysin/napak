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
    displayName:  (userFromStorage.userName) ? userFromStorage.userName : false,
    email:  (userFromStorage.email) ? userFromStorage.email : false,
    id:  (userFromStorage.id) ? userFromStorage.id : false
  },

  groups : (userFromStorage.groups) ? userFromStorage.groups : [],
 
  login : {
    isLoggedIn :  (userFromStorage.isLoggedIn) ? userFromStorage.isLoggedIn : null,
  }
};


const user = new Proxy(userObject, handler);
// Expose this for debugging purposes
window.user = user;

export { user }
