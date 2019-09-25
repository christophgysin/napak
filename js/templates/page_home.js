import progress from '/js/templates/section_progress.js';
import gradeWheel from '/js/templates/section_grade-selector.js';
import otc from '/js/templates/section_otc.js';
import picker from '/js/components/picker.js';
import toggleSwitch from '/js/components/toggleSwitch.js';

import { globals } from '/js/shared/globals.js';

import { dce, svg, updateScopeTicks, countAscentsByType } from '/js/shared/helpers.js';

class viewHome {
  constructor() {
    let progressSection = new progress();
    let gradeSelector = new gradeWheel();
    let otcMenu = new otc();


    let appContainer = dce({el: 'DIV', cssClass : 'app'});
    let templateContainer = dce({el: 'DIV', cssClass: 'page-content'});
    let contentContainer = dce({el: 'DIV', cssClass: 'tick-page'});
    let inOutSelector = dce({el: 'DIV', cssClass: 'in-out-selector'});

    let current = dce({el: 'DIV', cssClass: 'current'});
    let currentTitle = dce({el: 'H3', content: `Climbing ${globals.indoorsOutdoors}`});
    current.appendChild(currentTitle);

    globals.storeObservers.push({key: 'indoorsOutdoors', callback: () => {
      currentTitle.innerHTML = `Climbing ${globals.indoorsOutdoors}`
    }}); 


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

    current.addEventListener('click', function() {
      inOutSelector.classList.toggle('open');
    }, false);
  // In / out menu 
    let inOutMenu = dce({el: 'DIV', cssClass: 'in-out-menu'})
    
    let climbingTypeSelector = new picker({
      cssClass  : 'horizontal-menu full-width small-legends',
      targetObj : 'currentClimbingType',
      options   : [
        {title: 'Boulder', value:'boulder', selected: true, legend: globals.totalAscentsByType.boulder, val: 'totalAscentsByType.boulder'},
        {title: 'Sport', value:'sport', legend: globals.totalAscentsByType.sport, val: 'totalAscentsByType.sport'},
        {title: 'Top rope', value:'toprope', legend: globals.totalAscentsByType.toprope, val: 'totalAscentsByType.toprope'},
        {title: 'Trad', value:'trad', legend: globals.totalAscentsByType.trad, val: 'totalAscentsByType.trad'}
      ],
      callback: updateScopeTicks
      });

    
    let indoorsOutdoorsSelector = new toggleSwitch({
      cssClass  : 'horizontal-menu full-width',
      targetObj : 'indoorsOutdoors',
      options   : [
        {title: 'Outdoors', value:'outdoors', selected: globals.indoorsOutdoors === 'outdoors' },
        {title: 'Indoors', value:'indoors', selected: globals.indoorsOutdoors === 'indoors'}]
    });

    inOutMenu.append(climbingTypeSelector.render(), indoorsOutdoorsSelector.render());

    inOutSelector.appendChild(inOutMenu);
    // Footer
    let footer = dce({el: 'FOOTER'});
    let footerNav = dce({el: 'NAV'});

/*    let tickPage = dce({el:'A'})
    tickPage.append(dce({el:'SPAN', content: 'tick'}));
    footerNav.append(dce({el:'SPAN'}), tickPage);
*/
    footer.appendChild(footerNav);

    contentContainer.appendChild(inOutSelector);
    contentContainer.appendChild(progressSection.render());
    contentContainer.appendChild(gradeSelector.render());
    templateContainer.appendChild(contentContainer);
    appContainer.appendChild(templateContainer);
    appContainer.appendChild(footer);

    let naviShadow = dce({el: 'DIV', cssClass: 'navi-shadow'});
    appContainer.append(naviShadow, otcMenu.render());

    this.render = () => {
      return appContainer;
      }
		}
  }

export default viewHome;
