const db = firebase.firestore();

db.enablePersistence()
  .catch(function(err) {
    console.error('firestore persistence:', err.code);
  });

const store = {
  write: function(params){
      const user = firebase.auth().currentUser;
      db.collection('users').doc(user.uid).set({
        [params.key]: params.keydata,
      });
  },

  add: function(params){
    const user = firebase.auth().currentUser;
    let ref = db.collection('users').doc(user.uid);
    ref.update({
      [params.key]: firebase.firestore.FieldValue.arrayUnion(params.keydata),
    });
  },

  remove: function(params){
    const user = firebase.auth().currentUser;
    let ref = db.collection('users').doc(user.uid);
    ref.update({
      [params.key]: firebase.firestore.FieldValue.arrayRemove(params.keydata),
    });
  },

  read: function(params){
    const user = firebase.auth().currentUser;
    if(!user) return false;
    db.collection('users').doc(user.uid).get();
  }
}

export { store };
