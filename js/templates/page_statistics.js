import { globals } from '/js/shared/globals.js';
import { dce, countAscents, countAscentsByGrade } from '/js/shared/helpers.js';
import charts from '/js/components/charts.js';

class viewStatistics {
  constructor() {
    let temp =  countAscents('alltime');
    let container = dce({el: 'SECTION', cssClass: 'ticks-page'});
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
  
    let chartTitle = dce({el: 'H3', content: 'Ascents by grade'});

    let lempo = new charts(chartDataAscentTypes);

    let lemp =  countAscentsByGrade('alltime');
    let chartData = {
      type: 'barchart',
      xaxis: globals.grades.font,
      data : lemp,
      chartHeight: 180
    };

    console.log(lemp)
  
    let tempo = new charts(chartData);

    let naviShadow = dce({el: 'DIV', cssClass: 'navi-shadow'});

    container.append(nakki, lempo.render(), chartTitle, tempo.render(), naviShadow)
    this.render = () => {
      return container
    }  
  }
}

export default viewStatistics;
