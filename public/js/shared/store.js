const db = firebase.firestore();

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

  add: function(params, callback){
    let id = firebase.auth().currentUser.uid;
    if(params.collectionId) {
      id = params.collectionId;
    }

    let ref = db.collection(params.store).doc(id);
    ref.update({
      [params.key]: firebase.firestore.FieldValue.arrayUnion(params.keydata),
    })
    .then(()=>{
      if(callback) {callback();}
    })
    .catch(function(error) {
      console.log("Error updating document: ", error);
    });
  },


  remove: function(params, callback){
    let ref = db.collection(params.store).doc(params.collectionId);
    ref.update({
      [params.key]: firebase.firestore.FieldValue.arrayRemove(params.keydata),
    })
    .then(()=>{
      if(callback) {callback();}
    })
    .catch(function(error) {});
  },

/*
  remove: function(params){
    const user = firebase.auth().currentUser;
    let ref = db.collection(params.store).doc(user.uid);
    ref.update({
      [params.key]: firebase.firestore.FieldValue.arrayRemove(params.keydata),
    });
  },
*/
  read: function(params, callback){
    const user = firebase.auth().currentUser;
    let ref = db.collection(params.store).doc(user.uid);

    ref.get().then((doc)=> {
      if (doc.exists) {
        console.log(doc.data())
        return doc.data();
      }
      else {
        return {};
      }
    }).catch(function(error) {
    console.log("Error getting document:", error);
    });
  },

  update: function(params){
    let id = firebase.auth().currentUser.uid;
    if(params.collectionId) {
      id = params.collectionId;
    }

    db.collection(params.store).doc(id).set({
      [params.key]: params.keydata,
    }, {merge: true});
},

}

export { store };
