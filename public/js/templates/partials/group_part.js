import { dce } from '/js/shared/helpers.js';
import { store } from '/js/shared/store.js';
import modalWindow from '/js/components/modal.js';

class groupPart {
  constructor( { group = { }, groups = {} } = {} ) {    
    let leaveButton = dce({el: 'A', cssClass: 'btn btn_small mt mt_tall', cssStyle: 'margin: 0 auto 0', content:' Leave this group'});
    leaveButton.addEventListener('click', () => {

      let modal = new modalWindow({
        title         : 'Confirm leave group',
        modalContent  : dce({el: 'DIV', content: `Really want to leave ${group.title}? You shall be missed 😿`}),
        cssClass      : 'modal-small',
        buttons       : [
          ['Leave', ()=>{
            this.leaveGroup();
            modal.close();},
          'preferred'],
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
          group.selected = false;
          // remove user id from user list
          let uid = group.users.indexOf(firebase.auth().currentUser.uid);
          group.users.splice(uid, 1);

          // remove user score 
          group.userScore = group.userScore.filter(function( obj ) {
            return obj.id !== firebase.auth().currentUser.uid;
          });

          // move group back to public groups
          groups.publicGroups[`${group.value}`] = JSON.parse(JSON.stringify(group));
          // ... and delete from user groups
          delete groups.userGroups[group.value]
          
          groups.updateGroups();

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
