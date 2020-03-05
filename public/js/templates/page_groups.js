import { dce } from '/js/shared/helpers.js';
import picker from '/js/components/picker.js';
import dropdownMenu from '/js/components/dropdown.js';

class viewGroups {
  constructor() {
    let container = dce({el: 'DIV', cssClass: 'page-groups'});
    let groupSelectContainer = dce({el: 'SECTION', cssClass: 'group-select'});

    let groupTypeSelector = new picker({
      cssClass: 'horizontal-menu centerize',
      id: 'ascent-type-selector',
      targetObj: 'groupType',
      options: [
        { title: 'Your groups', value: 'userGroups', selected: true, val: 'totalAscents.redpoint' },
        { title: 'Public groups', value: 'publicGroups', val: 'totalAscents.flash' }]
    });

    let groupSelect = new dropdownMenu({
      cssClass: 'horizontal-menu full-width',
      id: 'ascent-type-selector',
      targetObj: 'currentGroup',
      options: [
        { title: '🍆 Sendipallit', value: 'sendipallit', selected: true },
        { title: '🍑 bk climbers', value: 'bkclimbers' },
        { title: '🥑 Top ropers', value: 'topropers' }]
    });

    groupSelectContainer.append(groupTypeSelector.render(), groupSelect.render());

    // Group view

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

    for(let i = 0, j = 10; i < j; i++) {
      let groupEntry = dce({el: 'LI', cssClass: 'entry-container'});
      let entryPos = dce({el: 'SPAN', content: `${i+1}.`});
      let entryName = dce({el: 'SPAN', content: firebase.auth().currentUser.displayName});
      let entryPointsContainer = dce({el: 'SPAN', content: globals.totalScore});
      let entryPointsDirection = dce({el: 'SPAN', cssClass : 'dir', content: ['↓', '↑', '-'][~~(3 * Math.random())]});
      entryPointsContainer.appendChild(entryPointsDirection);
      let entryAvgGrade = dce({el: 'SPAN', content: globals.averageGrade});

      groupEntry.append(entryPos, entryName, entryPointsContainer, entryAvgGrade);
      groupStanding.append(groupEntry, groupEntry);
    }
    rankingContainer.append(groupClimbingTypeSelector.render(), groupStanding)

    let createNewGroupButton = dce({el: 'a', cssClass: 'btn mt mb'});
    let plusIcon = dce({el: 'IMG', source: '/images/icon_plus.svg'});
    let buttonTitle = document.createTextNode('Create new group');
    createNewGroupButton.append(plusIcon, buttonTitle);
    rankingContainer.append(createNewGroupButton);

    container.append(groupSelectContainer, rankingContainer);

    this.render = () => {
      return container
    }
  }
}

export default viewGroups;
