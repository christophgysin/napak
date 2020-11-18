const db = firebase.firestore();

db.clearPersistence().catch(error => {
  console.error('Could not enable persistence:', error.code);
})

db.enablePersistence()
  .catch(function(err) {
    console.error('firestore persistence:', err.code);
  });

const store = {
  write: function(params){
      const user = firebase.auth().currentUser;
      db.collection(params.store).doc(user.uid).set({
        [params.key]: params.keydata,
      });
  },

  add: function(params){
    const user = firebase.auth().currentUser;
    let ref = db.collection(params.store).doc(user.uid);
    ref.update({
      [params.key]: firebase.firestore.FieldValue.arrayUnion(params.keydata),
    });
  },

  remove: function(params){
    const user = firebase.auth().currentUser;
    let ref = db.collection(params.store).doc(user.uid);
    ref.update({
      [params.key]: firebase.firestore.FieldValue.arrayRemove(params.keydata),
    });
  },

  read: function(params){
    const user = firebase.auth().currentUser;
    if(!user) return false;
    db.collection(params.store).doc(user.uid).get();
  },

  update: function(params){
    const user = firebase.auth().currentUser;
    db.collection(params.store).doc(user.uid).update({
      [params.key]: params.keydata,
    });
},

}

export { store };
