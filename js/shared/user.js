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

/* 
  User 
  */
let userObject = {
  storeObservers : [],
  name : {
    firstName: 'Pyry',
    lastName: 'Ahlfors',
    userName: 'Pyry',
    id: false
  },
  login : {
    isLoggedIn : true
  }
};


const user = new Proxy(userObject, handler);

export { user }
