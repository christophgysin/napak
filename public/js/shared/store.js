const store = {
  supported: (() => {return 'localStorage' in window })(),

  format: function() {
    localStorage.clear();
    },

  write: function(params){
    localStorage.setObject(params.key, params.keydata);
  },

  read: function(params){
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
