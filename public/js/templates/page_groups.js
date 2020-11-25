/*

Observers

globals
  :currentGroup
    > getGroupStanding
  :currentClimbingType
    > updateGroupStanding
*/

import { dce, storeObserver, countTopX, averageGrade } from '/js/shared/helpers.js';
import picker from '/js/components/picker.js';
import dropdownMenu from '/js/components/dropdown.js';
import statusTicker from '/js/templates/partials/status_ticker.js';
import { store } from '../shared/store.js';

class viewGroups {
  constructor() {
    const db = firebase.firestore();
    const dbuser = firebase.auth().currentUser;

    let groups = {};

    // DOM
    let container = dce({el: 'DIV', cssClass: 'page-groups'});
    let groupSelectContainer = dce({el: 'SECTION', cssClass: 'group-select'});

    let ticker = new statusTicker();

    let groupTypeSelector = new picker({
      cssClass: 'horizontal-menu full-width',
      targetObj: 'groupType',
      options: [
        { title: 'Your groups', value: 'userGroups', selected: true },
        { title: 'Public groups', value: 'publicGroups' }],
      callback : () => {
        let dropdownElements = updateItems();
        globals.currentGroup = null;
        groupSelect.createItems(dropdownElements);
      }
    });

    let groupSelect = new dropdownMenu({
      cssClass: 'horizontal-menu full-width',
      id: 'groupSelector',
      targetObj: 'currentGroup',
    });

    groupSelectContainer.append(groupTypeSelector.render(), groupSelect.render());
    
    let rankingContainer = dce({el: 'SECTION', cssClass: 'ranking scroll-container'});

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

    let groupStanding = dce({el: 'UL', cssClass: 'group-toplist mt'});

    rankingContainer.append(groupClimbingTypeSelector.render(), groupStanding)

    let createNewGroupButton = dce({el: 'a', cssClass: 'btn mt mb'});
    let plusIcon = dce({el: 'IMG', source: '/images/icon_plus.svg'});
    let buttonTitle = document.createTextNode('Create new group');
    createNewGroupButton.append(plusIcon, buttonTitle);
    rankingContainer.append(createNewGroupButton);

    container.append(ticker.render(), groupSelectContainer, rankingContainer);



   // get group standing
   let getGroupStanding = () => {
    if(!globals.currentGroup) {updateGroupStanding(); return;}
    let groupUsers = groups[globals.groupType][globals.currentGroup].users;
    if(!groupUsers) {updateGroupStanding(); return;}
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
        // fires n times - should be called when it's ready
        if(i === groupUsers.length-1) {updateGroupStanding();}
      });
    }
  }

  let showJoinGroupOptions = () => {
    let joinButton = dce({el: 'A', cssClass: 'btn', content:' Join this group'});
    joinButton.addEventListener('click', () => {
      store.add({
        store: 'groups',
        key: 'users',
        collectionId: globals.currentGroup,
        keydata: firebase.auth().currentUser.uid
        }, () =>{
          delete groups['publicGroups'][globals.currentGroup]['selected']
          if(!groups['publicGroups'][globals.currentGroup]['users']) {
            groups['publicGroups'][globals.currentGroup]['users'] = [];
            }
          groups['publicGroups'][globals.currentGroup]['users'].push(firebase.auth().currentUser.uid);
          groups['userGroups'][globals.currentGroup] = groups['publicGroups'][globals.currentGroup];
          delete groups['publicGroups'][globals.currentGroup];

          let dropdownElements = updateItems();
          groupSelect.createItems(dropdownElements);
        });

    }, false)
    groupStanding.appendChild(joinButton)
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

      // Sort users - highest score first
      data.sort(function(a, b) {
        var keyA = new Date(a.current[globals.currentClimbingType]),
          keyB = new Date(b.current[globals.currentClimbingType]);

          if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });

      for(let i = 0, j = data.length; i < j; i++) {
        let score = data[i].current[globals.currentClimbingType];
        let avgGrade = averageGrade({count:10, scope: 'thirtydays'});
        let groupEntry = dce({el: 'LI', cssClass: 'entry-container'});
        let entryPos = dce({el: 'SPAN', content: `${i+1}.`});
        let entryName = dce({el: 'SPAN', content:  data[i].displayName});
        let entryPointsContainer = dce({el: 'SPAN', content: (score) ? score: '-'});
        let entryPointsDirection = dce({el: 'SPAN', cssClass : 'dir', content: ['↓', '↑', '-'][~~(3 * Math.random())]});
        entryPointsContainer.appendChild(entryPointsDirection);
        let entryAvgGrade = dce({el: 'SPAN', content: avgGrade});

        groupEntry.append(entryPos, entryName, entryPointsContainer, entryAvgGrade);
        groupStanding.append(groupEntry, groupEntry);
      }
    }
    if(globals.groupType === 'publicGroups') {
      showJoinGroupOptions()
    }
  }

  // Load public groups
  let loadUserGroups = () => {
    db.collection("groups")
    .get()
    .then(function(querySnapshot) {
      let newStatusMessage = {
        message : 'Synchronizing groups data',
        spinner: true,
        timeout: -1,
        id : 'tick-sync'
      };
  
      globals.serverMessage.push(newStatusMessage);
      globals.serverMessage = globals.serverMessage;
  
      groups = {
        userGroups : {},
        publicGroups : {}
      };

      let i=0, j = 0;
      querySnapshot.forEach(function(doc) {
        let groupData = doc.data();
        // show only groups where user is not a member already
        if(groupData.users && groupData.users.includes(dbuser.uid)) {
          groups['userGroups'][doc.id] = {
            title: groupData.name,
            value: doc.id, 
            users: groupData.users,
            id: doc.id,
            selected: (i == 0) ? true : false
            };
          i++;
          }
        if(groupData.public && (groupData.users && !groupData.users.includes(dbuser.uid))  || !groupData.users) {
          groups['publicGroups'][doc.id] = {
            title: groupData.name,
            value: doc.id, 
            users: groupData.users,
            id: doc.id,
            selected: (j == 0) ? true : false
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

    this.render = () => {
      return container
    }
  }
}

export default viewGroups;
