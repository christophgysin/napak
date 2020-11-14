/*

Observers

globals
  :totalScore
    > updateTotalScore

  :scope
  :ticks
  :currentClimbingType
    > updateTotalAscentCount

  :averageGrade
  :scope
    > updateAverageGrade
*/

import picker from '/js/components/picker.js';
import { globals } from '/js/shared/globals.js';
import { dce, countTotalScore, countAscentsByGrade, countTopFive, countAscents, averageGrade, storeObserver } from '/js/shared/helpers.js';

class sectionProgress {
  constructor() {
    let periodPicker =  new picker({
      cssClass : 'horizontal-menu full-width small-legends mb',
      options : [
        {title: `Today`, value: 'today', selected: true, legend: globals.totalAscentCount['today'], val: 'totalAscentCount.today'},
        {title: `30 days`, value:'thirtydays', legend: globals.totalAscentCount['thirtydays'], val: 'totalAscentCount.thirtydays'},
        {title: `Year`, value:'year', legend: globals.totalAscentCount['year'], val: 'totalAscentCount.year'},
        {title: `All time`, value:'alltime', legend: globals.totalAscentCount['alltime'], val: 'totalAscentCount.alltime'}],
      targetObj : 'scope'
    });

    let container = dce({el: 'SECTION', cssClass: 'progression'});
    container.appendChild(periodPicker.render());

    let pointsContainer = dce({el: 'DIV', cssClass: 'important-numbers'});

    // Points
    let points = dce({el: 'DIV', cssClass: 'important-points'});
    let pointsTitle = dce({el: 'H3', content: 'Points'})
    let pointsCount = dce({el: 'H2', content: globals.totalScore.toString()})

    points.append(pointsTitle, pointsCount);

    // Ascents
    let ascents = dce({el: 'DIV', cssClass: 'important-ascents'});
    let ascentsTitle = dce({el: 'H3', content: 'Ascents'})
    let ascentsCount = dce({el: 'H2', content: globals.totalAscentCount[globals.scope]});

    ascents.append(ascentsTitle, ascentsCount);

    // Grade
    let grade = dce({el: 'DIV', cssClass: 'important-grade'});
    let gradeTitle = dce({el: 'H3', content: 'Avg. grade'})
    let gradeCount = dce({el: 'H2', content: globals.averageGrade})

    grade.append(gradeTitle, gradeCount);

    pointsContainer.append(points, ascents, grade);
    container.appendChild(pointsContainer);

    let graphPullDown = document.createElement("SPAN");
    graphPullDown.className = "graph-pulldown";

    let graphIcon = dce({el: 'DIV', cssClass: 'stripes' });
    graphIcon.append(dce({el: 'DIV'}), dce({el: 'DIV'}), dce({el: 'DIV'}))

    graphPullDown.appendChild(graphIcon);
    container.appendChild(graphPullDown);

    let gradeDistributionContainer = dce({el: 'DIV', cssClass: 'grade-distribution hidden'});
    let gradeDistributionTitle = dce({el:'H3', content: 'Grade distribution'});
    let gradeDistributionChartContainer = dce({el: 'DIV', cssClass: 'grade-chart'});
    let chartBarContainer = dce({el: 'DIV', cssClass : 'chart-container tiny-legends'});
    let chartFragment = document.createDocumentFragment();
    for(let i=0, j= globals.grades.font.length; i<j; i++) {
      let barContainer = dce({el: 'DIV'});
      let bar = dce({el: 'SPAN', cssClass: 'bar'})

      let nakki = dce({el: 'SPAN', cssClass: 'legends-holder'});
      let legend = dce({el: 'SPAN', cssClass: 'legend'});
      nakki.appendChild(legend);
      bar.appendChild(nakki);

      barContainer.appendChild(bar);
      chartFragment.appendChild(barContainer)
    };

    // Toggle graphview
    graphPullDown.addEventListener('click', () => {
      gradeDistributionContainer.classList.toggle('hidden');
    }, false);

    chartBarContainer.appendChild(chartFragment);
    gradeDistributionChartContainer.appendChild(chartBarContainer);
    gradeDistributionContainer.append(gradeDistributionTitle, gradeDistributionChartContainer);

    let chartLegendContainer = dce({el: 'DIV', cssClass : 'chart-legend'});
    let chartLegendFragment = document.createDocumentFragment();
    for(let i=0, j= globals.grades.font.length; i<j; i++) {
      let grade = dce({el:'DIV', content: globals.grades.font[i]})
      chartLegendFragment.appendChild(grade);
    };
    chartLegendContainer.appendChild(chartLegendFragment);
    gradeDistributionContainer.appendChild(chartLegendContainer);


    // update charts
    let updateCharts = () => {
      globals.totalAscentCount[globals.scope] = countAscents(globals.scope).total;
      globals.currentScore = countTotalScore();
      globals.totalScore = countTopFive();
      globals.averageGrade = averageGrade(5);

      let barNodes = chartBarContainer.querySelectorAll('.bar');
      let ticks = countAscentsByGrade({scope: globals.scope});
      barNodes.forEach((bar, i) => {
        bar.style.height = `${ticks[i]*globals.graphMultiplier[globals.scope]}px`;
        bar.querySelector('.legend').innerHTML = (ticks[i] > 0) ? ticks[i] : null;
      });
    };

    container.appendChild(gradeDistributionContainer);

    storeObserver.add({
      store: globals,
      key: 'indoorsOutdoors', 
      id: 'progress_update_chart--indoorsOutdoors',
      callback: updateCharts 
    });

    storeObserver.add({
      store: globals,
      key: 'currentClimbingType', 
      id: 'progress_update_chart--climbingStyle',
      callback: updateCharts 
    });
    
    storeObserver.add({
      store: globals,
      key: 'scope', 
      id: 'progress_update_chart--scope',
      callback: updateCharts 
    });
    storeObserver.add({
      store: globals,
      key: 'ticks', 
      id: 'progress_update_chart--ticks',
      callback: updateCharts 
    });

    updateCharts();

    this.render = () => {
      return container;
    }

    this.updateTotalScore = () => {
      pointsCount.innerHTML = globals.totalScore;
    }

    this.updateTotalAscentCount = () => {
      ascentsCount.innerHTML = globals.totalAscentCount[globals.scope]
    }
    
    this.updateAverageGrade = () => {
      gradeCount.innerHTML = globals.averageGrade;
    }

// Update total score
    storeObserver.add({
      store: globals,
      key: 'totalScore', 
      id: 'progressUpdateScore',
      callback: this.updateTotalScore,
      removeOnRouteChange: true
      });

    storeObserver.add({
      store: globals,
      key: 'scope', 
      id: 'progressScopeChange',
      callback: this.updateTotalAscentCount
    });

    storeObserver.add({
      store: globals,
      key: 'ticks', 
      id: 'progressTicksUpdate',
      callback: this.updateTotalAscentCount
    });

    storeObserver.add({
      store: globals,
      key: 'currentClimbingType', 
      id: 'progressCurrentClimbingTypeChange',
      callback: this.updateTotalAscentCount
    });

    storeObserver.add({
      store: globals,
      key: 'averageGrade', 
      id: 'progressAverageGradeUpdate',
      callback: this.updateAverageGrade
    });

    storeObserver.add({
      store: globals,
      key: 'scope', 
      id: 'progressScopeChangeAverage',
      callback: this.updateAverageGrade
    });

  }
}

export default sectionProgress;
