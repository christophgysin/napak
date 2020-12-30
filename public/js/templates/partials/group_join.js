import { dce } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';
import { store } from '/js/shared/store.js';
import cryptPwd from '/js/shared/crypto.js';

import modalWindow from '/js/components/modal.js';

class groupJoin {
  constructor( { group = { }, groups = {} } = {} ) {
    const db = firebase.firestore();
    const dbuser = firebase.auth().currentUser;

    let joinButton = dce({el: 'A', cssClass: 'btn mt', content:' Join this group'});
    joinButton.addEventListener('click', () => {

      let modalContent = document.createDocumentFragment();
      let joinMessage = dce({el: 'P', cssStyle: 'margin-top: 0', content: `Join ${group.title}?`});
      modalContent.appendChild(joinMessage);

      if(!group.public) {
        let passCodeForm = dce({el: 'FORM', attrbs: [['autocomplete', 'off']]});
        let passCodeInfo = dce({el: 'P', cssStyle: 'margin-top: 0', content: 'This is private group. You need a secret key to join'})
        let passCode = dce({el: 'INPUT', cssClass:'', attrbs: [['placeholder', 'Secret'], ['autocomplete', 'off'], ['ID', 'pwd']] });
        let blink = dce({el: 'SPAN', cssClass: 'spinner spin360 spinner-white hidden', id: 'join-spinner'});
        let message = dce({el: 'DIV', cssClass: 'api-message-error hidden', content: '😼 You know nothing, Jon Snow', id: 'join-error'});

        passCodeForm.append(passCodeInfo, passCode, blink, message);
        modalContent.appendChild(passCodeForm);
        }

      this.modal = new modalWindow({
        title         : 'Confirm join group',
        modalContent  : modalContent,
        cssClass      : 'modal-small',
        buttons       : [
          ['Join', ()=>{
            this.joinGroup();
          },
          'preferred'],
          ['Cancel', () => {
            this.modal.close()}]
          ],
        open : true //auto open modal
      });

      document.body.appendChild(this.modal.render())
    }, false)

    this.joinGroup = ( ) => {  
      let join = () => {
        store.add({
          store: 'groups',
          key: 'users',
          collectionId: globals.currentGroup,
          keydata: dbuser.uid
          }, () =>{
            group.users.push(dbuser.uid);
            group.selected = false;
            // move group back to public groups
            groups.userGroups[`${group.value}`] = JSON.parse(JSON.stringify(group));

            // ... and delete from user groups
            delete groups.publicGroups[group.value];

            groups.updateGroups();

            globals.standardMessage.unshift({
              message: `Joined ${group.title}`,
              timeout: 2
            });
            globals.standardMessage = globals.standardMessage;
          });
          this.modal.close();
        }


      if(!group.public) {
        document.querySelector('#join-error').classList.add('hidden');
        document.querySelector('#join-spinner').classList.remove('hidden');
  
        let pwd = document.querySelector('#pwd').value;
        db.collection('groups').doc(group.id).get().then( (doc) => {
          document.querySelector('#join-spinner').classList.add('hidden');
          let kakka = doc.data();
          let crypter = new cryptPwd();
          crypter.decrypt({encryptedData: kakka.secret, password: pwd}).then((data)=>{
            if(data) {
              join()
            }
            else {
              document.querySelector('#join-error').classList.remove('hidden');
            }
          });
        });
      }

      else {
        join();
      }
    }
    
    this.render = () => {
      return joinButton;
    }
  }
}

export default groupJoin;
