import { dce } from '/js/shared/helpers.js';
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

      if(globals.ticks.boulder.today[i] && globals.ticks.boulder.today[i].ticks) {
        let ascentCountPerType =  Object.keys(globals.ticks.boulder.today[i].ticks);
        ascentCountPerType.forEach((type) => {
          let legendTag = dce({el: 'SPAN', cssClass: `legend type-${type}`, content: globals.ticks.boulder.today[i].ticks[type].count});
          legendHolder.appendChild(legendTag);
        });
      }

      grade.appendChild(legendHolder);
      gradeContainer.appendChild(grade);
      gradeFragment.appendChild(gradeContainer);
    }
    selectDialog.appendChild(gradeFragment);

//
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

    this.changeGrading = () => {
      selectDialog.innerHTML = '';
      let grades = ["V0", "V1", "V2", "V3","V4", "V5", "V6", "V7","V8", "V9", "V10", "V11","V12", "V13", "V14", "V15","V16", "V17"];

      let gradeFragment = document.createDocumentFragment();
      for(let i=0, j=grades.length; i<j;i++) {
        let gradeContainer = dce({el: 'DIV'});
        let grade = dce({el: 'SPAN', content:grades[i], attrbs: [['data-enablescroll', 'true']]});
        let legendHolder = dce({el: 'SPAN', cssClass: 'legends-holder'});

        grade.appendChild(legendHolder);
        gradeContainer.appendChild(grade);
        gradeFragment.appendChild(gradeContainer);
      }
      selectDialog.appendChild(gradeFragment);
    }
//    setTimeout(this.changeGrading, 3000);
  }
}

export default wheel;
