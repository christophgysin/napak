/*

Observers

globals
  :currentGroup
    > getGroupStanding
  :currentClimbingType
    > updateGroupStanding
*/

import { dce, storeObserver, UUID, countTotalScore, averageGrade} from '/js/shared/helpers.js';
import picker from '/js/components/picker.js';
import modalWindow from '/js/components/modal.js';
import dropdownMenu from '/js/components/dropdown.js';
import toggleSwitch from '/js/components/toggleswitch.js';
import statusTicker from '/js/templates/partials/status_ticker.js';
import groupOptions from '/js/templates/partials/group_options.js';
import { store } from '/js/shared/store.js';

class viewGroups {
  constructor() {
    const db = firebase.firestore();
    const dbuser = firebase.auth().currentUser;

    let groups = {};
    let options = new groupOptions({
      options : [
        ['Edit group', () => { console.log('meh')}],
        ['Create new group', () => {this.createNewGroup()}]
      ]
    });

    // DOM
    let container = dce({el: 'DIV', cssClass: 'page-groups'});
    let groupSelectContainer = dce({el: 'SECTION', cssClass: 'group-select'});

    let ticker = new statusTicker({
      titlePrefix : 'Groups',
      tapAction: () => { options.showMenu() }
    });

    let groupTypeSelector = new picker({
      cssClass: 'horizontal-menu full-width',
      targetObj: 'groupType',
      options: [
        { title: 'Your groups', value: 'userGroups', selected: true },
        { title: 'Public groups', value: 'publicGroups' }],
      callback : () => {
        let dropdownElements = updateItems();
        globals.currentGroup = null; // maybe take this away from global ... 
        groupSelect.createItems(dropdownElements);
      }
    });

    // Dropdown menu
    let groupSelect = new dropdownMenu({
      cssClass: 'horizontal-menu full-width',
      id: 'groupSelector',
      targetObj: 'currentGroup',
    });

    groupSelectContainer.append(groupTypeSelector.render(), groupSelect.render());

    // ranking container
    let rankingContainer = dce({el: 'SECTION', cssClass: 'ranking scroll-container'});

    // discipline selector for ranking
    let groupClimbingTypeSelector = new picker({
      cssClass: 'horizontal-menu full-width',
      targetObj: 'currentClimbingType',
      options: [
        { title: 'Boulder', value: 'boulder', selected: true },
        { title: 'Sport', value: 'sport' },
        { title: 'Top rope', value: 'toprope' },
        { title: 'Trad', value: 'trad' },
      ]
    });


    let indoorsOutdoorsSelector = new toggleSwitch({
      cssClass  : 'horizontal-menu full-width',
      targetObj : 'indoorsOutdoors',
      options   : [
        {title: 'Indoors', value: 'indoors', selected: true},
        {title: 'Outdoors', value: 'outdoors'}]
    });

    let groupStanding = dce({el: 'UL', cssClass: 'group-toplist mt'});

    rankingContainer.append(groupClimbingTypeSelector.render(), indoorsOutdoorsSelector.render(), groupStanding)

    container.append(ticker.render(), options.render(), groupSelectContainer, rankingContainer);



    // get group standing
    let getGroupStanding = () => {
      if(!globals.currentGroup) {
        updateGroupStanding();
        return;
      }

      let groupUsers = groups[globals.groupType][globals.currentGroup].users;
      if(!groupUsers) {
        updateGroupStanding(); 
        return;
      }

      let groupStandingData = [];

      for (let i=0, j=groupUsers.length; i<j;i++) {
        db.collection('score').doc(groupUsers[i]).get().then( (doc) => {
          let userData = doc.data();
          if(userData) {
            let currentScore = userData.current;
            groupStandingData.push({id: groupUsers[i], current: currentScore, displayName: userData.displayName});
            }
        }).then( (doc) => {
          groups[globals.groupType][globals.currentGroup].userScore = groupStandingData;
          if(i === groupUsers.length-1) {
            updateGroupStanding();
          }
        });
      }
    }

// Show Join group button for public groups
    let showJoinGroupOptions = () => {
      let joinButton = dce({el: 'A', cssClass: 'btn mt', content:' Join this group'});
      joinButton.addEventListener('click', () => {

        let modalContent = document.createDocumentFragment();
        let joinMessage = dce({el: 'P', cssStyle: 'margin-top: 0', content: `Join ${groups[globals.groupType][globals.currentGroup].title}?`});
        modalContent.appendChild(joinMessage);

        if(!groups[globals.groupType][globals.currentGroup].public) {
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

        container.appendChild(modal.render())
      }, false)
      groupStanding.appendChild(joinButton)
    }

// Show leave group button for user groups
    let showLeaveGroupOptions = () => {
      let leaveButton = dce({el: 'A', cssClass: 'btn mt', content:' Leave this group'});
      leaveButton.addEventListener('click', () => {

        let modal = new modalWindow({
          title         : 'Confirm leave group',
          modalContent  : dce({el: 'DIV', content: 'Really want to leave this group? You shall be missed 😿'}),
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

        container.appendChild(modal.render())
      }, false)
      groupStanding.appendChild(leaveButton)
    }


// update group standing
    let updateGroupStanding = () => {
      groupStanding.innerHTML = "";
      if(!globals.currentGroup) {return;}
      let data = groups[globals.groupType][globals.currentGroup]['userScore'];
      if(data) {
          let headerContainer = dce({el: 'LI', cssClass: 'header-container'});
          let pos = dce({el: 'h3', content: '#'});
          let user = dce({el: 'h3', content: 'Name'});
          let score = dce({el: 'h3', content: 'Score'});
          let avg = dce({el: 'h3', content: 'avg'});

        headerContainer.append(pos, user, score, avg);
        groupStanding.appendChild(headerContainer);

      /* remove ticks that are more thatn 30 days old */
        let today = new Date().getTime();
        for(let i = 0, j = data.length; i<j; i++ ) {
          if(!data[i].current) data[i].current = {
            indoors  : {boulder: {ticks:[{}]}, sport: {ticks:[{}]}, toprope: {ticks:[{}]}, trad: {ticks:[{}]}},
            outdoors :  {boulder: {ticks:[{}]}, sport: {ticks:[{}]}, toprope: {ticks:[{}]}, trad: {ticks:[{}]}}
          }

          if(data[i].current[globals.indoorsOutdoors][globals.currentClimbingType].ticks) {
            let ticks = data[i].current[globals.indoorsOutdoors][globals.currentClimbingType].ticks;
            ticks = ticks.filter(obj => {
              return (today - obj.date) / (1000 * 3600 * 24) <= 30
            })
          data[i].current[globals.indoorsOutdoors][globals.currentClimbingType].ticks = ticks;

        /* Count score */
          let score = countTotalScore({count: ticks.length, tickSet: ticks, returnTicks:false}).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
          data[i].current[globals.indoorsOutdoors][globals.currentClimbingType]['score'] = score;

        /* Count average grade */
        data[i].current[globals.indoorsOutdoors][globals.currentClimbingType]['average'] = averageGrade({count: ticks.length, tickSet: ticks});
          }
        }

        
        // Sort users - highest score first
        data.sort(function(a, b) {
          if(!a.current || !a.current[globals.indoorsOutdoors]){return 1}
          if(!b.current || !b.current[globals.indoorsOutdoors]){return -1}
          var keyA = a.current[globals.indoorsOutdoors][globals.currentClimbingType]['score'],
            keyB = b.current[globals.indoorsOutdoors][globals.currentClimbingType]['score'];

            if (keyA < keyB) return 1;
          if (keyA > keyB) return -1;
          return 0;
        });

        for(let i = 0, j = data.length; i < j; i++) {
          let score = (data[i].current && data[i].current[globals.indoorsOutdoors]) ? data[i].current[globals.indoorsOutdoors][globals.currentClimbingType]['score'] : '-';
          let avgGrade = (data[i].current && data[i].current[globals.indoorsOutdoors]) ? data[i].current[globals.indoorsOutdoors][globals.currentClimbingType]['average'] : '-';
          let groupEntry = dce({el: 'LI', cssClass: 'entry-container'});
          let entryPos = dce({el: 'SPAN', content: `${i+1}.`});
          let entryName = dce({el: 'SPAN', content:  data[i].displayName});
          let entryPointsContainer = dce({el: 'SPAN', content: (score) ? score: '-'});
          let entryPointsDirection = dce({el: 'SPAN', cssClass : 'dir', content: ['↓', '↑', '-'][~~(3 * Math.random())]});
          entryPointsContainer.appendChild(entryPointsDirection);
          let entryAvgGrade = dce({el: 'SPAN', content: avgGrade});

          groupEntry.append(entryPos, entryName, entryPointsContainer, entryAvgGrade);

          groupEntry.addEventListener('click', () => {
            let userTopTicks = (data[i].current && data[i].current[globals.indoorsOutdoors]) ? data[i].current[globals.indoorsOutdoors][globals.currentClimbingType]['ticks'] : {};
            let modalData = document.createDocumentFragment();
            for(let k=0, l=userTopTicks.length; k<l;k++) {
              // Only show ticks if they are less than 31 days old
              if((new Date().getTime() - userTopTicks[k].date) / (1000 * 3600 * 24) <= 30) {
                let tickContainer = dce({el: 'DIV', cssClass: 'session-tick'});
                let tickGrade = dce({el: 'DIV', cssClass: `grade-legend  ${globals.difficulty[userTopTicks[k].grade]}`, content: globals.grades.font[userTopTicks[k].grade]});
                let tickType = dce({el: 'DIV', cssClass: '', content: userTopTicks[k].ascentType});
                let tickScore = dce({el: 'DIV', cssClass: '', content: userTopTicks[k].score});
                tickContainer.append(tickGrade, tickType, tickScore);
                modalData.appendChild(tickContainer);
              }
            }

            let modal = new modalWindow({
              title         : `${data[i].displayName}'s top ticks`,
              modalContent  : modalData,
              open          : true          });

            container.appendChild(modal.render())
          }, false);
          groupStanding.append(groupEntry, groupEntry);
        }
      }
      else {
        groupStanding.appendChild(dce({el: 'P', cssStyle: 'text-align: center;', content: 'No users in this group yet'}));
      }
      if(globals.groupType === 'userGroups') {
        showLeaveGroupOptions()
      }
      if(globals.groupType === 'publicGroups') {
        showJoinGroupOptions()
      }
    }


// Load user groups and public groups
    let loadUserGroups = () => {
      db.collection("groups")
      .get()
      .then(function(querySnapshot) {
        // Show spinner
        let newStatusMessage = {
          message : 'Synchronizing groups data',
          spinner: true,
          timeout: -1,
          id : 'group-sync'
        };

        globals.serverMessage.push(newStatusMessage);
        globals.serverMessage = globals.serverMessage;

        // groups container
        groups = {
          userGroups : {},
          publicGroups : {}
        };

        let i=0, j = 0;
        querySnapshot.forEach(function(doc) {
          let groupData = doc.data();
          // Groups where user is a member already
          if(groupData.users && groupData.users.length && groupData.users.includes(dbuser.uid)) {
            groups['userGroups'][doc.id] = {
              title: groupData.name,
              value: doc.id,
              users: groupData.users,
              id: doc.id,
              selected: (i == 0) ? true : false
              };
            i++;
            }
          // All other groups
          else {
            groups['publicGroups'][doc.id] = {
              title: groupData.name,
              value: doc.id,
              users: groupData.users,
              id: doc.id,
              selected: (j == 0) ? true : false,
              public: groupData.public,
              locked: (groupData.public) ? false : true
              };
            j++;
            }
          });
      })
      .then(()=>{
        globals.serverMessage[0].finished = true;
        globals.serverMessage = globals.serverMessage;
        // create array of object to create pulldown items
        let dropdownElements = updateItems();
        groupSelect.createItems(dropdownElements);
    })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
    }


    loadUserGroups();

// Update dropdown items
    let updateItems = () => {
      let items = [];
      for (let key in groups[globals.groupType]) {
        items.push(groups[globals.groupType][key])
      }
      return items;
    }

    storeObserver.add({
      store: globals,
      key: 'currentGroup',
      callback: getGroupStanding,
      removeOnRouteChange: true
    });

    storeObserver.add({
      store: globals,
      key: 'currentClimbingType',
      callback: updateGroupStanding,
      removeOnRouteChange: true
    });

    storeObserver.add({
      store: globals,
      key: 'indoorsOutdoors',
      callback: updateGroupStanding,
      removeOnRouteChange: true
    });



    this.leaveGroup = () => {
      store.remove({
        store: 'groups',
        key: 'users',
        collectionId: globals.currentGroup,
        keydata: firebase.auth().currentUser.uid
        }, () =>{
          let groupName = groups['userGroups'][globals.currentGroup]['title'];
          globals.standardMessage.unshift({
            message: `Left ${groupName}`,
            timeout: 2
          });
          globals.standardMessage = globals.standardMessage;

        })
    }



    this.joinGroup = () => {
      store.add({
        store: 'groups',
        key: 'users',
        collectionId: globals.currentGroup,
        keydata: firebase.auth().currentUser.uid
        }, () =>{
          let groupName = groups['publicGroups'][globals.currentGroup]['title'];

          delete groups['publicGroups'][globals.currentGroup]['selected']; // what is this?
          if(!groups['publicGroups'][globals.currentGroup]['users']) {
            groups['publicGroups'][globals.currentGroup]['users'] = [];
            }
          groups['publicGroups'][globals.currentGroup]['users'].push(firebase.auth().currentUser.uid);
          groups['userGroups'][globals.currentGroup] = groups['publicGroups'][globals.currentGroup];
          delete groups['publicGroups'][globals.currentGroup];

          let dropdownElements = updateItems();
          groupSelect.createItems(dropdownElements);

          globals.standardMessage.unshift({
            message: `Joined ${groupName}`,
            timeout: 2
          });
          globals.standardMessage = globals.standardMessage;
        });
    }


    this.createNewGroup = () => {
      let newGroupFormContainer = dce({el: 'FORM', cssClass: ''});
// Group name
      let groupNameTitle = dce({el: 'H3', cssClass: 'mb', content: 'Group name '});
      let groupName = dce({el: 'INPUT', cssClass:'', attrbs: [['placeholder', 'Group name']] });
      newGroupFormContainer.append(groupNameTitle, groupName);

      let isPublic = true;
      let groupPublicityTitle = dce({el: 'H3', cssClass: 'mb', content: 'Public'});
      let groupPublicity = new toggleSwitch({
        cssClass  : 'horizontal-menu full-width',
        targetObj : isPublic,
        targetStore: false,
        options   : [
          {title: 'Yes', value: true, selected: true},
          {title: 'No', value: false}],
        callback : (trgt) => {
          isPublic = trgt; 
          if(isPublic) {
            passCodeContainer.classList.add('hidden');
          }
          else {
            passCodeContainer.classList.remove('hidden');            
          }
        }
      });


      newGroupFormContainer.append(groupPublicityTitle, groupPublicity.render());

      let passCodeContainer = dce({el: 'DIV', cssClass: 'hidden'});
      let passcodeTitle = dce({el: 'H3', cssClass: 'mb', content: 'Passcode (6-10 characters) '});
      let passcode = dce({el: 'INPUT', cssClass:'', attrbs: [['placeholder', 'Passcode'], ['disabled', 'disable'], ['value', UUID()]] });
      passCodeContainer.append(passcodeTitle, passcode);
      newGroupFormContainer.appendChild(passCodeContainer);

      const addGroupToStore = (mother) => {
        console.log(mother)
        
        console.log(groupName);

        db.collection("groups").add({
          name: groupName.value,
          owner: dbuser.uid,
          public: isPublic,
          passphrase: passcode.value,
          users: [dbuser.uid]
      })
      .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
      }

      let modal = new modalWindow({
        title         : 'Create new group',
        modalContent  : newGroupFormContainer,
        buttons       : [
          ['Create', () => { addGroupToStore(this); modal.close(); }, 'preferred'],
          ['Cancel', () => { modal.close(); }],
          ],
        open          : true //auto open modal
      });

      container.appendChild(modal.render())
    }

    this.render = () => {
      return container
    }

  }
}

export default viewGroups;
