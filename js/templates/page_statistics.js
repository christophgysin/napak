import { globals } from '/js/shared/globals.js';
import { dce, countAscents } from '/js/shared/helpers.js';
import charts from '/js/components/charts.js';

class viewStatistics {
  constructor() {
    let temp =  countAscents('alltime');
    let container = dce({el: 'SECTION', cssClass: 'ticks-page'});
    let nakki = dce({el: 'H3', content: 'pöh'});

    let chartData = {
      labels: ['Redpoint', 'Flash', 'Onsight'],
      data : [
        Math.round(100 / temp.total * temp.redpoint), 
        Math.round(100 / temp.total * temp.flash), 
        Math.round(100 / temp.total * temp.onsight)
      ],
      colors : 	[
        getComputedStyle(document.documentElement).getPropertyValue('--color-redpoint'),
        getComputedStyle(document.documentElement).getPropertyValue('--color-flash'),
        getComputedStyle(document.documentElement).getPropertyValue('--color-onsight')
      ]
    };
  
    let lempo = new charts(chartData);

    container.append(nakki, lempo.render())
    this.render = () => {
      return container
    }  
  }
}

export default viewStatistics;
