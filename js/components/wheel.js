import { dce, countAscentsByDifficulty } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';

class wheel {
  constructor(params) {
    this.selected = false;

    let dialContainer = dce({el: 'DIV', cssClass: 'grade-dial-container'});
    let dialViewport = dce({el: 'DIV', cssClass: 'select-dialog-viewport'});
    let selectDialog = dce({el: 'DIV', cssClass: 'select-dialog', attrbs: [['data-enablescroll', 'true']] });

    dialViewport.addEventListener('click', (e) => {
      return true;
    }, false);


    dialViewport.addEventListener('scroll', (y) => {
      // 200px is 2x100padding
      // let test = window.getComputedStyle(selectDialog);
      // console.log(test.getPropertyValue('padding-top'));

      globals.currentAscentGrade = Math.round(dialViewport.scrollTop / (selectDialog.scrollHeight-200) * (globals.grades.font.length))-1;
    }, false);

    let gradeFragment = document.createDocumentFragment();
    for(let i=0, j=globals.grades.font.length; i<j;i++) {
      let gradeContainer = dce({el: 'DIV'});
      let grade = dce({el: 'SPAN', content:globals.grades.font[i]});
      let legendHolder = dce({el: 'SPAN', cssClass: 'legends-holder'});

      if(globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors][i] && globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors][i].ticks) {
        let ascentCountPerType =  Object.keys(globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors][i].ticks);
        ascentCountPerType.forEach((type) => {
          let legendTag = dce({el: 'SPAN', cssClass: `legend type-${type}`, content: globals.ticks[globals.currentClimbingType].today[globals.indoorsOutdoors][i].ticks[type].length});
          legendHolder.appendChild(legendTag);
        });
      }

      grade.appendChild(legendHolder);
      gradeContainer.appendChild(grade);
      gradeFragment.appendChild(gradeContainer);
    }

    let clearLegends = () => {
      let legends = selectDialog.querySelectorAll(`.legends-holder .legend`);
      legends.forEach((el,i)=>{
        el.parentNode.removeChild(el);
      });
    }

    let updateAll = () => {
      // Get ascents by grade and type and update legends accordingly
      let ascentsByGrade = countAscentsByDifficulty();
      let ascentCountPerType =  Object.keys(ascentsByGrade);
      ascentCountPerType.forEach((type) => {        
        for(let i in ascentsByGrade[type]) {          
          if(selectDialog.childNodes[i].querySelector(`.legends-holder .type-${type}`)) {
            selectDialog.childNodes[i].querySelector(`.legends-holder .type-${type}`).innerHTML = (!isNaN(ascentsByGrade[type][i].count) && ascentsByGrade[type][i].count > 0) ? ascentsByGrade[type][i].count : '';
          }
          else {
            let holder = dce({el: 'SPAN', cssClass: `legend type-${type}`, content: ascentsByGrade[type][i].count});
            selectDialog.childNodes[i].querySelector('.legends-holder').appendChild(holder);            
          }
        }
      });
    }
    // Listen for ticks object to update 
    globals.storeObservers.push({key: 'indoorsOutdoors', callback: () => {clearLegends(), updateAll()} });
    globals.storeObservers.push({key: 'ticks', callback:updateAll});
    
    selectDialog.appendChild(gradeFragment);

    dialViewport.appendChild(selectDialog);

    let bullet = dce({el: 'DIV', cssClass: 'bullet'});
    dialContainer.appendChild(bullet);

    dialContainer.appendChild(dialViewport);

    this.render = () => {
      return dialContainer;
    }

    this.get = () => {
      return this.selectd;
    }
  }
}

export default wheel;
