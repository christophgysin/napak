import { dce, countAscentsByDifficulty} from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';

class wheel {
  constructor(params) {
    this.selected = false;
    let dialContainer = dce({el: 'DIV', cssClass: 'grade-dial-container'});
    let dialViewport = dce({el: 'DIV', cssClass: 'select-dialog-viewport'});
    let selectDialog = dce({el: 'DIV', cssClass: 'select-dialog', attrbs: [['data-enablescroll', 'true']] });


    dialViewport.addEventListener('scroll', (y) => {
      let elemHeight = selectDialog.firstChild.getBoundingClientRect().height;
//      console.log(elemHeight)
//      console.log(dialViewport.scrollTop)
      // 200px is 2x100padding
      // let test = window.getComputedStyle(selectDialog);
      // console.log(test.getPropertyValue('padding-top'));
//      if(Math.round(dialViewport.scrollTop / (selectDialog.scrollHeight-200) * (globals.grades.font.length))-1 < 0) {
  //      dialViewport.scrollTo(0,Math.round(dialViewport.scrollHeight / globals.grades.font.length/2));
    //  }
      let newVal = Math.floor(dialViewport.scrollTop / (selectDialog.scrollHeight-200) * (globals.grades.font.length));
      if(newVal !== globals.currentAscentGrade) {
        globals.currentAscentGrade = newVal;
      }
    }, false);

    let gradeFragment = document.createDocumentFragment();
    let gradeTicks = countAscentsByDifficulty();

    for(let i=0, j=globals.grades.font.length; i<j;i++) {
      let gradeContainer = dce({el: 'DIV'});
      let grade = dce({el: 'SPAN', content:globals.grades.font[i]});
      let legendHolder = dce({el: 'SPAN', cssClass: 'legends-holder'});
      

      let ascentCountPerType =  Object.keys(gradeTicks);
      ascentCountPerType.forEach((type) => {
        let legendTag = dce({el: 'SPAN', cssClass: `legend type-${type}`, content: gradeTicks[type][i]});
        legendHolder.appendChild(legendTag);
      });
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
//      console.log(ascentsByGrade)
      ascentCountPerType.forEach((type) => {
        for(let i in ascentsByGrade[type]) {
          if(selectDialog.childNodes[i].querySelector(`.legends-holder .type-${type}`)) {
            selectDialog.childNodes[i].querySelector(`.legends-holder .type-${type}`).innerHTML = (ascentsByGrade[type][i]) ? ascentsByGrade[type][i] : '';
          }
          else {
            let holder = dce({el: 'SPAN', cssClass: `legend type-${type}`, content: ascentsByGrade[type][i]});
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

    // Observe when dial is in DOM
    let observer = new MutationObserver(function(mutations) {
      if (document.contains(dialViewport)) {
        setTimeout( () => {
          let elemSize = selectDialog.firstChild.getBoundingClientRect().height;
          let elemTopScrollPos = 50;
          dialViewport.scrollTo(0,elemSize*globals.currentAscentGrade + elemTopScrollPos);
        }, 300);
      observer.disconnect();
      }
    });

    observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
    this.render = () => {      
      return dialContainer;
    }

    this.get = () => {
      return this.selectd;
    }
  }
}

export default wheel;
