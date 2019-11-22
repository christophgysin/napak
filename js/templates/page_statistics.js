import { globals } from '/js/shared/globals.js';
import { dce, countAscents, countAscentsByGrade } from '/js/shared/helpers.js';
import charts from '/js/components/charts.js';

class viewStatistics {
  constructor() {
    let temp =  countAscents('alltime');
    let container = dce({el: 'SECTION', cssClass: 'page-statistics'});

  // Ascents by type (Redpoint, flash, onsight)
    let nakki = dce({el: 'H3', content: 'Ascents by type'});    
    let chartDataAscentTypes = {
      type: 'pie',
      labels: ['Redpoint', 'Flash', 'Onsight'],
      data : [temp.redpoint, temp.flash, temp.onsight],
      colors : 	[
        getComputedStyle(document.documentElement).getPropertyValue('--color-redpoint'),
        getComputedStyle(document.documentElement).getPropertyValue('--color-flash'),
        getComputedStyle(document.documentElement).getPropertyValue('--color-onsight')
      ],
      chartHeight: 180

    };

// Ascents by grade
    let chartTitle = dce({el: 'H3', content: 'Ascents by grade'});

    let lempo = new charts(chartDataAscentTypes);
    let indoors =  countAscentsByGrade({scope: 'alltime', indoorsOutdoors: 'indoors'});
    let outdoors =  countAscentsByGrade({scope: 'alltime', indoorsOutdoors: 'outdoors'});

    let chartData = {
      type: 'barchart',
      xaxis: globals.grades.font,
      data : [indoors, outdoors],
      chartHeight: 180,
      colors : ["#0f8", "#08F"]
    };
  
    let tempo = new charts(chartData);

    let naviShadow = dce({el: 'DIV', cssClass: 'navi-shadow'});

    container.append(nakki, lempo.render(), chartTitle, tempo.render(), naviShadow)
    this.render = () => {
      return container
    }  
  }
}

export default viewStatistics;
