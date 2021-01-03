import { dce, countTotalScore, averageGrade } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';
import groupJoin from '/js/templates/partials/group_join.js';
import groupPart from '/js/templates/partials/group_part.js';
import modalWindow from '/js/components/modal.js';

class groupStanding {
  constructor( { mother = false } = { } ) {

    let container = dce({el: 'DIV'});
    let loadContainer = dce({el: 'DIV', cssStyle: 'display: flex; justify-content: center; align-items: center;', content: 'Loading group data'})
    let blink = dce({el: 'SPAN', cssClass: 'spinner spin360 spinner-white'});
    loadContainer.appendChild(blink)
    container.appendChild(loadContainer);

    this.update = ( { data = [], group = false } = {} ) => {
      container.innerHTML = "";

      let showRanking = true; 
      if(!group.public && group.users.indexOf(firebase.auth().currentUser.uid) === -1) {
        container.appendChild(dce({el: 'P', cssStyle: 'text-align: center;', content: 'This is very, very secretive group 🙀'}));
        showRanking = false;
      }
      if(data.length && showRanking) {
          let headerContainer = dce({el: 'DIV', cssClass: 'header-container'});
          let pos = dce({el: 'h3', content: '#'});
          let user = dce({el: 'h3', content: 'Name'});
          let score = dce({el: 'h3', content: 'Score'});
          let avg = dce({el: 'h3', content: 'avg'});

        headerContainer.append(pos, user, score, avg);
        container.appendChild(headerContainer);

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
          ticks = ticks.slice(0,10)
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
          let groupEntry = dce({el: 'DIV', cssClass: 'entry-container'});
          let entryPos = dce({el: 'SPAN', content: `${i+1}.`});
          let entryName = dce({el: 'SPAN', content:  data[i].displayName});
          let entryPointsContainer = dce({el: 'SPAN', content: (score) ? score: '-'});
/*          let entryPointsDirection = dce({el: 'SPAN', cssClass : 'dir', content: ['↓', '↑', '-'][~~(3 * Math.random())]});
          entryPointsContainer.appendChild(entryPointsDirection);
*/
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
          container.append(groupEntry, groupEntry);
        }
      }
      else {
        if(showRanking) {
          container.appendChild(dce({el: 'P', cssStyle: 'text-align: center;', content: 'No users in this group yet'}));
        }
      }
      if(globals.groupType === 'userGroups') {
//        console.log(params.mother.groups) update this after leave / part
        container.appendChild(new groupPart({group: group, groups: mother.groups}).render());
      }

      if(globals.groupType === 'publicGroups') {
//        console.log(params.mother.groups)
        container.appendChild(new groupJoin({group: group, groups: mother.groups}).render());
      }
    }

    this.render = () => {
      return container;
    }

  }
}

export default groupStanding;
