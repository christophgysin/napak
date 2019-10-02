import picker from '/js/components/picker.js';
import { globals } from '/js/shared/globals.js';
import { dce, countTotalScore, countTopFive, countAscents, averageGrade } from '/js/shared/helpers.js';

class sectionProgress {
  constructor() {

    let periodPicker =  new picker({
      cssClass : 'horizontal-menu full-width small-legends',
      targetObj : 'scope',
      options : [
        {title: `Today`, value: 'today', selected: true, legend: globals.totalAscentCount, val: 'totalAscentCount'},
        {title: `30 days`, value:'30days'},
        {title: `Year`, value:'year'},
        {title: `All time`, value:'alltime'}]
    });

		let container = dce({el: 'SECTION', cssClass: 'progression'});
    container.appendChild(periodPicker.render());

    let statisticsContainer = dce({el: 'DIV'});
    let pointsContainer = dce({el: 'DIV', cssClass: 'important-numbers'});


// Points
    let points = dce({el: 'DIV', cssClass: 'important-points'});
    let pointsTitle = dce({el: 'H3', content: 'Points'})
    let pointsCount = dce({el: 'H2', content: globals.totalScore.toString()})

    points.append(pointsTitle, pointsCount);

    globals.storeObservers.push({key: 'totalScore', callback: () => {
      pointsCount.innerHTML = globals.totalScore;
    }});

// Ascents
    let ascents = dce({el: 'DIV', cssClass: 'important-ascents'});
    let ascentsTitle = dce({el: 'H3', content: 'Ascents'})
    let ascentsCount = dce({el: 'H2', content: globals.totalAscentCount.toString()});

    ascents.append(ascentsTitle, ascentsCount);

    globals.storeObservers.push({key: 'totalAscentCount', callback: () => {
      ascentsCount.innerHTML = globals.totalAscentCount;
    }});


// Grade
    let grade = dce({el: 'DIV', cssClass: 'important-grade'});
    let gradeTitle = dce({el: 'H3', content: 'Grade'})
    let gradeCount = dce({el: 'H2', content: globals.averageGrade})

    grade.append(gradeTitle, gradeCount);

    globals.storeObservers.push({key: 'averageGrade', callback: () => {
      gradeCount.innerHTML = globals.averageGrade;
    }});


//
    pointsContainer.append(points, ascents, grade);
    container.appendChild(pointsContainer);

//
    let graphPullDown = document.createElement("SPAN");
    graphPullDown.className = "graph-pulldown";

    let graphIcon = dce({el: 'DIV', cssClass: 'stripes' });
    graphIcon.append(dce({el: 'DIV'}), dce({el: 'DIV'}), dce({el: 'DIV'}))

    graphPullDown.appendChild(graphIcon);
    container.appendChild(graphPullDown);

    let gradeDistributionContainer = dce({el: 'DIV', cssClass: 'grade-distribution hidden'});
    let gradeDistributionTitle = dce({el:'H3', content: 'Grade distribution'});
    let gradeDistributionChartContainer = dce({el: 'DIV', cssClass: 'grade-chart'});
    let chartBarContainer = dce({el: 'DIV', cssClass : 'chart-container'});
    let chartFragment = document.createDocumentFragment();
    for(let i=0, j= globals.grades.font.length; i<j; i++) {
      let barContainer = dce({el: 'DIV'});
      let bar = dce({el: 'SPAN', cssClass: 'bar'})
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
      globals.totalAscentCount = countAscents().total;
      globals.currentScore = countTotalScore();
      globals.totalScore = countTopFive();
      globals.averageGrade = averageGrade(globals.currentScore.reduce((a, b) => Number(a) + Number(b), 0), 5);


      let barNodes = chartBarContainer.querySelectorAll('.bar');
      barNodes.forEach((bar, i) => {
        let count = 0;
        
        if(globals.ticks[globals.currentClimbingType][globals.today][globals.indoorsOutdoors][i]) {
          
          for(let test in globals.ticks[globals.currentClimbingType][globals.today][globals.indoorsOutdoors][i].ticks) {            
            count+= globals.ticks[globals.currentClimbingType][globals.today][globals.indoorsOutdoors][i].ticks[test].length;
          }  
        }
        
        bar.style.height = `${count}px`;
      });
    };


    container.appendChild(gradeDistributionContainer);

    globals.storeObservers.push({key: 'indoorsOutdoors', callback: updateCharts });
    globals.storeObservers.push({key: 'ticks', callback: updateCharts });

    updateCharts();

    this.render = () => {
      return container;
    }
	}
}

export default sectionProgress;
