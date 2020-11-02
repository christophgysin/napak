import { dce, countAscentsByDifficulty, vibrate, storeObserver } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';

class wheel {
  constructor(params) {
    this.selected = false;
    let dialContainer = dce({el: 'DIV', cssClass: 'grade-dial-container'});
    let dialViewport = dce({el: 'DIV', cssClass: 'select-dialog-viewport'});
    let selectDialog = dce({el: 'DIV', cssClass: 'select-dialog', attrbs: [['data-enablescroll', 'true']] });

    dialViewport.addEventListener('scroll', (y) => {
      let newVal = Math.floor(dialViewport.scrollTop / (selectDialog.scrollHeight-200) * (globals.grades.font.length));
      if(newVal !== globals.currentAscentGrade) {
        globals.currentAscentGrade = newVal;
        vibrate();
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
      let removeAddTickAnimation = selectDialog.querySelectorAll('.tick-added');
      if(removeAddTickAnimation) {
        for(let i=0, j=removeAddTickAnimation.length; i<j;i++){
          removeAddTickAnimation[i].classList.remove('tick-added');
        }
      }

      let removeRemoveTickAnimation = selectDialog.querySelectorAll('.tick-removed');
      if(removeRemoveTickAnimation) {
        for(let i=0, j=removeRemoveTickAnimation.length; i<j;i++){
          removeRemoveTickAnimation[i].classList.remove('tick-removed');
        }
      }

      // Get ascents by grade and type and update legends accordingly
      let ascentsByGrade = countAscentsByDifficulty();
      let ascentCountPerType =  Object.keys(ascentsByGrade);
      // console.log(ascentsByGrade)
      ascentCountPerType.forEach((type) => {
        for(let i in ascentsByGrade[type]) {
          // legend does not exist - create one
          if(selectDialog.childNodes[i].querySelector(`.legends-holder .type-${type}`)) {
            selectDialog.childNodes[i].querySelector(`.legends-holder .type-${type}`).innerHTML = (ascentsByGrade[type][i]) ? ascentsByGrade[type][i] : '';
          }
          else {
            let holder = dce({el: 'SPAN', cssClass: `legend type-${type}`, content: ascentsByGrade[type][i]});
            selectDialog.childNodes[i].querySelector('.legends-holder').appendChild(holder);
          }
        }
      });
      if(globals.lastTick) {
        let tickCount = selectDialog.childNodes[globals.lastTick.grade].querySelector(`.legends-holder .type-${globals.lastTick.ascentType}`).innerText;
        if(Number(tickCount) > 1) {
          selectDialog.childNodes[globals.lastTick.grade].querySelector(`.legends-holder .type-${globals.lastTick.ascentType}`).classList.add('tick-added');
        }
      }

      if(globals.lastTickRemoved) {
        let tickCount = selectDialog.childNodes[globals.lastTickRemoved.grade].querySelector(`.legends-holder .type-${globals.lastTickRemoved.ascentType}`).innerText;
        if(Number(tickCount) > 0) {
          selectDialog.childNodes[globals.lastTickRemoved.grade].querySelector(`.legends-holder .type-${globals.lastTickRemoved.ascentType}`).classList.add('tick-removed');
        }
      }

    }

    // Listen for ticks object to update
    storeObserver.add({
      store: globals,
      key: 'indoorsOutdoors', 
      id: 'wheelIndoorsOutdoors',
      callback: () => {clearLegends(), updateAll()}
    });

    storeObserver.add({
      store: globals,
      key: 'today', 
      id: 'wheelDateChange',
      callback: () => {clearLegends(), updateAll()}
    });
    

    storeObserver.add({
      store: globals,
      key: 'ticks', 
      id: 'wheelUpdateTicks',
      callback: updateAll
    });

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
          dialViewport.scrollTo(0, elemSize*globals.currentAscentGrade + elemTopScrollPos);
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
