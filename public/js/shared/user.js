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

let userObject = {
  storeObservers : [],
  name : {
    displayName: null,
    email:  null,
    id:  null
  },

  login : {
    isLoggedIn :  null,
  }
};


const user = new Proxy(userObject, handler);
// Expose this for debugging purposes
window.user = user;

export { user }
