import { dce } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';
import { store } from '/js/shared/store.js';

import modalWindow from '/js/components/modal.js';

class groupJoin {
  constructor(group) {
    let joinButton = dce({el: 'A', cssClass: 'btn mt', content:' Join this group'});
    joinButton.addEventListener('click', () => {

      let modalContent = document.createDocumentFragment();
      let joinMessage = dce({el: 'P', cssStyle: 'margin-top: 0', content: `Join ${group.title}?`});
      modalContent.appendChild(joinMessage);

      if(!group.public) {
        let passCodeForm = dce({el: 'FORM'});
        let passCodeInfo = dce({el: 'P', cssStyle: 'margin-top: 0', content: 'This is private group. You need a secret key to join'})
        let passCode = dce({el: 'INPUT', cssClass:'', attrbs: [['placeholder', 'Secret']] });
        passCodeForm.append(passCodeInfo, passCode);
        modalContent.appendChild(passCodeForm);
        }

      let modal = new modalWindow({
        title         : 'Confirm join group',
        modalContent  : modalContent,
        cssClass      : 'modal-small',
        buttons       : [
          ['Join', ()=>{
            this.joinGroup();
            modal.close();}],
          ['Cancel', () => {
            modal.close()}]
          ],
        open          : true //auto open modal
      });

      document.body.appendChild(modal.render())
    }, false)

    this.joinGroup = () => {
      store.add({
        store: 'groups',
        key: 'users',
        collectionId: globals.currentGroup,
        keydata: firebase.auth().currentUser.uid
        }, () =>{
          globals.standardMessage.unshift({
            message: `Joined ${group.title}`,
            timeout: 2
          });
          globals.standardMessage = globals.standardMessage;
        });
    }
    
    this.render = () => {
      return joinButton;
    }

  }
}

export default groupJoin;
