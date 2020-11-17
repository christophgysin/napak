import { dce, countTopFive, averageGrade } from '/js/shared/helpers.js';
import picker from '/js/components/picker.js';
import dropdownMenu from '/js/components/dropdown.js';
import statusTicker from '/js/templates/partials/status_ticker.js';
import { user } from '/js/shared/user.js';

class viewGroups {
  constructor() {
    const db = firebase.firestore();
    const dbuser = firebase.auth().currentUser;


    let container = dce({el: 'DIV', cssClass: 'page-groups'});
    let groupSelectContainer = dce({el: 'SECTION', cssClass: 'group-select'});

    // Status ticker
    let ticker = new statusTicker();

    let groupTypeSelector = new picker({
      cssClass: 'horizontal-menu centerize',
      id: 'ascent-type-selector',
      targetObj: 'groupType',
      options: [
        { title: 'Your groups', value: 'userGroups', selected: true },
        { title: 'Public groups', value: 'publicGroups' }]
    });

    let groupSelect = new dropdownMenu({
      cssClass: 'horizontal-menu full-width',
      id: 'ascent-type-selector',
      targetObj: 'currentGroup',
/*      options: [
        { title: '🍆 Sendipallit', value: 'sendipallit', selected: true },
        { title: '🍑 bk climbers', value: 'bkclimbers' },
        { title: '🥑 Top ropers', value: 'topropers' }]
        */
    });

    groupSelectContainer.append(groupTypeSelector.render(), groupSelect.render());

    let rankingContainer = dce({el: 'SECTION', cssClass: 'ranking scroll-container'});

    let groupClimbingTypeSelector = new picker({
      cssClass: 'horizontal-menu full-width',
      id: 'ascent-type-selector',
      targetObj: 'currentAscentType',
      options: [
        { title: 'Boulder', value: 'boulder', selected: true },
        { title: 'Sport', value: 'sport' },
        { title: 'Top rope', value: 'toprope' },
        { title: 'Trad', value: 'trad' },
      ]
    });

    let groupStanding = dce({el: 'UL', cssClass: 'group-toplist'});

    // get all users in group.... somehow?
//    for(let i = 0, j = 10; i < j; i++) {
    for(let i = 0, j = 1; i < j; i++) {
      let score = countTopFive('thirtydays');
      let avgGrade = averageGrade(5, 'thirtydays');
      let groupEntry = dce({el: 'LI', cssClass: 'entry-container'});
      let entryPos = dce({el: 'SPAN', content: `${i+1}.`});
      let entryName = dce({el: 'SPAN', content: firebase.auth().currentUser.displayName});
      let entryPointsContainer = dce({el: 'SPAN', content: score});
      let entryPointsDirection = dce({el: 'SPAN', cssClass : 'dir', content: ['↓', '↑', '-'][~~(3 * Math.random())]});
      entryPointsContainer.appendChild(entryPointsDirection);
      let entryAvgGrade = dce({el: 'SPAN', content: avgGrade});

      groupEntry.append(entryPos, entryName, entryPointsContainer, entryAvgGrade);
      groupStanding.append(groupEntry, groupEntry);
    }
    rankingContainer.append(groupClimbingTypeSelector.render(), groupStanding)

    let createNewGroupButton = dce({el: 'a', cssClass: 'btn mt mb'});
    let plusIcon = dce({el: 'IMG', source: '/images/icon_plus.svg'});
    let buttonTitle = document.createTextNode('Create new group');
    createNewGroupButton.append(plusIcon, buttonTitle);
    rankingContainer.append(createNewGroupButton);


    container.append(ticker.render(), groupSelectContainer, rankingContainer);

// sync user groups
    let newStatusMessage = {
      message : 'Synchronizing groups data',
      spinner: true,
      timeout: -1,
      id : 'tick-sync'
    };

    globals.serverMessage.push(newStatusMessage);
    globals.serverMessage = globals.serverMessage;

    db.collection('users').doc(dbuser.uid).get().then( (doc) => {
      let userGroups = doc.data().user.groups;
      for(let i=0, j=userGroups.length; i<j; i++) {
        db.collection('groups').doc(userGroups[i]).get().then( (doc) => {
          let group = {
            title: doc.data().name,
            value: userGroups[i],
            selected: (i === 0) ? true : false
          }
          groupSelect.pushItem(group)
        });
        
      }
      globals.serverMessage[0].finished = true; 
      globals.serverMessage = globals.serverMessage;
    });

    this.render = () => {
      return container
    }
  }
}

export default viewGroups;
