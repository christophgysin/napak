import { globals } from '/js/shared/globals.js';
import { store }  from '/js/shared/store.js';

const handler = {
  get: (obj, prop) => {
    return obj[prop];
  },

  set: (obj, prop, value) => {
    obj[prop] = value;
    console.log(`setting property ${prop} : ${obj[prop]}`);

    for(let i=0, j = user.storeObservers.length; i<j; i++) {
      if(user[user.storeObservers[i].key] === obj[prop]) {
        user.storeObservers[i].callback();
      }
    }
    return true
  }
}

let userFromStorage = store.read({key: 'user'});
/*
  User
*/
let userObject = {
  storeObservers : [],
  name : {
    firstName: (userFromStorage.name) ? userFromStorage.name : null,
    lastName:  (userFromStorage.lastName) ? userFromStorage.lastName : null,
    userName:  (userFromStorage.userName) ? userFromStorage.userName : null,
    email:  (userFromStorage.email) ? userFromStorage.email : null,
    id:  (userFromStorage.id) ? userFromStorage.id : null
  },

  login : {
    isLoggedIn :  (userFromStorage.isLoggedIn) ? userFromStorage.isLoggedIn : null,
  },
  ticks : [...globals.ticks]
};


const user = new Proxy(userObject, handler);

export { user }
