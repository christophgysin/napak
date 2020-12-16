import { dce } from '/js/shared/helpers.js';
import { store } from '/js/shared/store.js';
import modalWindow from '/js/components/modal.js';

class groupPart {
  constructor(group) {

    let leaveButton = dce({el: 'A', cssClass: 'btn mt', content:' Leave this group'});
    leaveButton.addEventListener('click', () => {

      let modal = new modalWindow({
        title         : 'Confirm leave group',
        modalContent  : dce({el: 'DIV', content: `Really want to leave ${group.title}? You shall be missed 😿`}),
        cssClass      : 'modal-small',
        buttons       : [
          ['Leave', ()=>{
            this.leaveGroup();
            modal.close();}],
          ['Cancel', () => {
            modal.close()}]
          ],
        open          : true //auto open modal
      });

      document.body.appendChild(modal.render())
    }, false)

    this.leaveGroup = () => {
      store.remove({
        store: 'groups',
        key: 'users',
        collectionId: globals.currentGroup,
        keydata: firebase.auth().currentUser.uid
        }, () =>{
          globals.standardMessage.unshift({
            message: `Left ${group.title}`,
            timeout: 2
          });
          globals.standardMessage = globals.standardMessage;
        })
    }

    this.render = () => {
      return leaveButton;
    }
  }
}

export default groupPart;
