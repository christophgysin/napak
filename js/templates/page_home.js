import progress from '/js/templates/section_progress.js';
import gradeWheel from '/js/templates/section_grade-selector.js';
import picker from '/js/components/picker.js';
import toggleSwitch from '/js/components/toggleSwitch.js';

import { dce, svg } from '/js/shared/helpers.js';

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

    let toggleViewContainer = dce({el: 'DIV', cssClass: 'toggle'});

    let toggleView = svg({
      el: 'svg', 
      attrbs: [
        ['stroke','currentColor'], 
        ['fill', 'none'], 
        ['stroke-width', 0.5], 
        ['viewBox', '0 0 24 24'], 
        ['stroke-linecap', 'round'], 
        ['stroke-linejoin', 'round'], 
        ['height', '1em'], 
        ['width', '1em']]
    });

    let toggleViewCircle = svg({el: 'circle', attrbs: [['cx', 12], ['cy', 12], ['r', 3]]});
    let toggleViewPath = svg({el: 'path', attrbs:[['d','M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z']]});
    toggleView.append(toggleViewCircle, toggleViewPath);
    toggleViewContainer.appendChild(toggleView);
    current.appendChild(toggleViewContainer);

    inOutSelector.appendChild(current);

    toggleViewContainer.addEventListener('click', function() {
      inOutSelector.classList.toggle('open');
    }, false);
  // In / out menu 
    let inOutMenu = dce({el: 'DIV', cssClass: 'in-out-menu'})

    let climbingTypeSelector = new picker({
      cssClass  : 'horizontal-menu full-width',
      targetObj : 'currentClimbingType',
      options   : [
        {title: 'Boulder', value:'boulder', selected: true},
        {title: 'Sport', value:'sport'},
        {title: 'Top rope', value:'toprope'},
        {title: 'Trad', value:'trad'}
      ],
      bindEventsPrefix : 'climbing-'
      });

    
    let indoorsOutdoorsSelector = new toggleSwitch({
      cssClass  : 'horizontal-menu full-width',
      targetObj : 'indoorsOutdoors',
      options   : [
        {title: 'Outdoors', value:'outdoors', selected: true},
        {title: 'Indoors', value:'indoors'}]
    });

    inOutMenu.append(climbingTypeSelector.render(), indoorsOutdoorsSelector.render());

    inOutSelector.appendChild(inOutMenu);
    // Footer
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
