import progress from '/js/templates/section_progress.js';
import gradeWheel from '/js/templates/section_grade-selector.js';

import { dce } from '/js/shared/helpers.js';

class viewHome {
  constructor() {
    let progressSection = new progress();
    let gradeSelector = new gradeWheel();


    let appContainer = dce({el: 'DIV', cssClass : 'app'});
    let templateContainer = dce({el: 'DIV', cssClass: 'page-content'});
    let contentContainer = dce({el: 'DIV', cssClass: 'tick-page'});
    let inOutSelector = dce({el: 'DIV', cssClass: 'in-out-selector'});

    let current = dce({el: 'DIV', cssClass: 'current'});
    let currentTitle = dce({el: 'H3', content: 'Climbing indoors'});
    current.appendChild(currentTitle);
    inOutSelector.appendChild(current);

    let footer = dce({el: 'FOOTER'});
    let footerNav = dce({el: 'NAV'});

    let tickPage = dce({el:'A'})
    tickPage.append(dce({el:'SPAN', content: 'tick'}));
    footerNav.append(dce({el:'SPAN'}), tickPage);

    footer.appendChild(footerNav);

    contentContainer.appendChild(inOutSelector);
    contentContainer.appendChild(progressSection.render());
    contentContainer.appendChild(gradeSelector.render());
    templateContainer.appendChild(contentContainer);
    appContainer.appendChild(templateContainer);
//    appContainer.appendChild(footer);

    this.render = () => {
      return appContainer;
      }
		}
  }

export default viewHome;
