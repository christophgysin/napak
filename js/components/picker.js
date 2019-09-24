import { dce, countTotalScore, countTopFive, averageGrade, countAscents } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';
import { store } from '/js/shared/store.js';

class picker {
  constructor(params) {
    this.selected = false;
    this.targetObj = params.targetObj;

    let pickerElement = dce({el: 'UL', cssClass: params.cssClass, id: params.id});

    for(let i=0, j=params.options.length; i<j;i++) {
      let option = dce({el: 'LI'});
      if(params.options[i].selected) {
        option.classList.add('selected');
        this.selected = params.options[i];
        globals[params.targetObj] = params.options[i].value;
      }
      let optionLink = dce({el: 'A'});
      optionLink.value = params.options[i].value;
      let optionLinkText = dce({el: 'SPAN', cssClass: 'menu-title', content: params.options[i].title});

      let temp = params.options[i];
      optionLink.addEventListener('click', () => {this.set(optionLink, temp)}, false);

      optionLink.appendChild(optionLinkText);

// Legends tag
      let legensHolder = dce({el: 'SPAN', cssClass: 'legends-holder'});
      let legendTag = dce({el: 'SPAN', cssClass: `legend type-${params.options[i].value}`, content: (params.options[i].legend) ? params.options[i].legend : ''});
      legensHolder.appendChild(legendTag);
      optionLink.appendChild(legensHolder);


      if(params.bindEvents) {
        let globaTicks = globals.ticks;
        
        document.addEventListener(`${params.bindEventsPrefix}${params.options[i].value}`, function(data){
          let grade = data.detail.grade;
          let ascentType = params.options[i].value
          let count = (globaTicks[globals.currentClimbingType].today[grade] && globaTicks[globals.currentClimbingType].today[grade].ticks[ascentType] && globaTicks[globals.currentClimbingType].today[grade].ticks[ascentType].count) ? globaTicks[globals.currentClimbingType].today[grade].ticks[ascentType].count : 0;

          if(!globaTicks[globals.currentClimbingType].today[grade]) {
            globaTicks[globals.currentClimbingType].today[grade] = {
              order: grade,
              ticks : {}
            };
          }


          // Remove tick
          if( !data.detail.add ) {
            if(count > 0) {
              count--;
              globaTicks[globals.currentClimbingType].today[grade].ticks[ascentType] = {
                  count: count
              }
            }
            else{
              delete globaTicks[globals.currentClimbingType].today[grade].ticks[ascentType];
            }
          }

          // Add tick
          else {
            let count = (globaTicks[globals.currentClimbingType].today[grade] && globaTicks[globals.currentClimbingType].today[grade].ticks && globaTicks[globals.currentClimbingType].today[grade].ticks[ascentType] && globaTicks[globals.currentClimbingType].today[grade].ticks[ascentType].count) ? globaTicks[globals.currentClimbingType].today[grade].ticks[ascentType].count : 0;
            count++;
            globaTicks[globals.currentClimbingType].today[grade].ticks[ascentType] = {
                count: count
              }
            }

  // Update type totals
          let typeTotal = 0;
          for (let keys in globaTicks[globals.currentClimbingType].today) {
            typeTotal+= (globaTicks[globals.currentClimbingType].today[keys].ticks[ascentType]) ? globaTicks[globals.currentClimbingType].today[keys].ticks[ascentType].count : 0;
          }

          legendTag.innerHTML = ( typeTotal > 0 ) ? typeTotal : "";

  // Update today total
          let total = 0;
          for (let keys in globaTicks[globals.currentClimbingType].today) {
            for(let test in globaTicks[globals.currentClimbingType].today[keys]) {
              total+= (globaTicks[globals.currentClimbingType].today[keys][test].count) ? globaTicks[globals.currentClimbingType].today[keys][test].count : 0;
            }
          }
          globals.ticks = globaTicks;
          globals.totalAscentCount = countAscents().total;

          // Count score
          globals.currentScore = countTotalScore();
          // Count top 5 score
          globals.totalScore = countTopFive();
          // Count average grade
          globals.averageGrade = averageGrade(globals.currentScore.reduce((a, b) => Number(a) + Number(b), 0), 5);

          // update local storage
          store.write({
            key: 'ticks',
            keydata: globals.ticks
          })
        }, false);
      }
      option.appendChild(optionLink);

      pickerElement.appendChild(option);
    }

    this.render = () => {
      return pickerElement;
    }

    this.set = (el, data) => {      
      globals[params.targetObj] = el.value;
      let container = el.parentNode.parentNode;
      let selectedItem = container.querySelector('.selected');
      selectedItem.classList.remove('selected');
      el.parentNode.classList.add('selected');

      this.selected = data;
      if(params.callback) {
        params.callback();
      }
    }
  }
}

export default picker;
