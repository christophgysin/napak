const db = firebase.firestore();

db.enablePersistence()
  .catch(function(err) {
    console.error('firestore persistence:', err.code);
  });

const store = {
  supported: (() => {return 'localStorage' in window })(),

  format: function() {
    localStorage.clear();
    },

  write: function(params){
    localStorage.setObject(params.key, params.keydata);
    // TODO: use user.uid as key instead
    if(localStorage.getItem("user")) {
      let user = JSON.parse(localStorage.getItem("user")).localId;
      db.collection('users').doc(user).set({
        [params.key]: params.keydata,
      });
    }
  },

  read: function(params){
    console.log(firebase.app().options.DatabaseUrl)
    
    /*
    if(localStorage.getItem("user")) {
      let user = JSON.parse(localStorage.getItem("user")).localId;
      db.collection('users').doc(user).get();
    }
    */
    // TODO: return data from DB when caller supports async invocation

    if(localStorage.getObject(params.key)) {
      return localStorage.getObject(params.key);
    }
    else return false;
  }
}

Storage.prototype.setObject = function(key, value, usedb) {
  try {
    this.removeItem(key);
    this.setItem(key, JSON.stringify(value));
  }
  catch(e) {
    console.log(e);
  }
};

Storage.prototype.getObject = function(key, usedb) {
  return JSON.parse(this.getItem(key));
};

export { store };
