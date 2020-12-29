import { dce, parseDate, storeObserver, handleDate } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';

class calendar {
    constructor(params) {
        let weekdays = ['Mon', 'Tue','Wed','Thu','Fri','Sat','Sun'];
        let months = ['January', 'February','March','April','May','June','July','August','September','October','November','December'];
        let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        let container = dce({el: 'DIV', cssClass: 'calendar-container'});
        let currentDate = dce({el: 'h3', cssStyle: 'text-align: center; font-weight: 600', content: `${globals.today} ↓`});

        container.appendChild(currentDate);

        let dateHasTicks = [];

        let checkDateThatHasTicks = () => {
            dateHasTicks = [];
            let ticks = globals.ticks;
            for (let i = 0, j=ticks.length; i<j;i++) {
                if(ticks[i].indoorsOutdoors == globals.indoorsOutdoors && ticks[i].type == globals.currentClimbingType) {
                    let tickDate = handleDate({dateString: ticks[i].date});
                    if(!dateHasTicks[tickDate]) {
                        dateHasTicks[tickDate] = {count: 1};
                    }
                    else {
                        let count= dateHasTicks[tickDate].count + 1 ;
                        dateHasTicks[tickDate] = {'count': count};
                    }
                }
            }
        }
        // need to call it ones here since tick sync was moved away from home page 
        checkDateThatHasTicks()

        storeObserver.add({
            store: globals,
            key: 'ticks',
            callback: checkDateThatHasTicks,
            id: 'calendarTicks',
            removeOnRouteChange: true
          });

        storeObserver.add({
            store: globals,
            key: 'currentClimbingType',
            callback: checkDateThatHasTicks,
            id: 'calendarClimbingType',
            removeOnRouteChange: true
            });

        storeObserver.add({
            store: globals,
            key: 'indoorsOutdoors',
            callback: checkDateThatHasTicks,
            id: 'calendarIndoorsOutdoors',
            removeOnRouteChange: true
        });

        currentDate.addEventListener('click', () => {
            let todayParsed = parseDate(globals.today);
            let year = todayParsed.year;
            let month =todayParsed.month-1;
            if(container.lastChild.classList.contains('calendar')) {
                container.removeChild(container.lastChild);
                }
            else {
                container.appendChild(this.drawCalendar(month, year));
            }
        }, false);

        // draw calendar
        this.drawCalendar = (month, year) => {
            let todayForReal = new Date();

            // Create calendar container
            if(container.lastChild.classList.contains('calendar')) {
                container.removeChild(container.lastChild);
            }
            let calendarContainer = dce({el: 'DIV', cssClass: 'calendar small-legends'})

            // Month
            let selectMonth = dce({el: 'DIV', cssClass: 'month'});

            // Previous month
            let prevMonth = dce({el: 'DIV', cssClass : 'calendarPrev', content : '<'});
            prevMonth.addEventListener('click', () => {
                let previous = month-1;
                if( previous < 0 ) {
                    previous = 11;
                    year=Number(year)-1;
                }
                container.appendChild(this.drawCalendar(previous, year));
            }, false);

            let currentMonth =dce({el: 'DIV', cssClass : 'currentmonth', content: `${months[month]} - ${year}`});

            // Next month
            let nextMonth = dce({el: 'DIV', cssClass : 'calendarNext', content : '>'});
            nextMonth.addEventListener('click', () => {
                let next = month+1;
                if( next > 11 ) {
                    next = 0;
                    year= Number(year)+1;
                }
                container.appendChild(this.drawCalendar(next, year));
            }, false);

            selectMonth.append(prevMonth, currentMonth, nextMonth);
            calendarContainer.appendChild(selectMonth);

            // Days
            let weekDaysHolder = dce({el: 'DIV', cssClass: 'weekdays'});
            for(let i=0; i<=6; i++){
                let weekDay = dce({el: 'DIV', cssClass: 'days', content: weekdays[i]});
                weekDaysHolder.appendChild(weekDay);
                };

            calendarContainer.appendChild(weekDaysHolder);

            let dateCounter = 0;

            let firstDayOfThisMonth = new Date(year, month, 1);
            let starDay = (firstDayOfThisMonth.getDay() == 0) ? -5 : 2;

            let dateContainer = dce({el: 'DIV', cssClass: 'date-container'});
            for (let i=starDay; i <= daysInMonth[month]+firstDayOfThisMonth.getDay(); i++){
                let count = i-firstDayOfThisMonth.getDay();

                let thisDate = todayForReal.getDate();
                let thisMonth = todayForReal.getMonth();
                let thisYear = todayForReal.getFullYear();
                let todayParsed = parseDate(globals.today);

                let dateCell = dce({el: 'DIV', cssClass : 'date'});

                if(count >= 1 && count <=31){
                    dateCell.appendChild(document.createTextNode(count));
                    // Weekends
                    if (dateCounter >= 5) {
                        dateCell.classList.add('weekend');
                        }

                    // Today
                    if (count == thisDate &&
                        month == thisMonth &&
                        year == thisYear) {
                        dateCell.classList.add('today');
                        }

                    // Future
                    if ((
                            count > thisDate &&
                            month >= thisMonth &&
                            year >= thisYear
                        ) ||
                        (
                            month > thisMonth &&
                            year >= thisYear
                        )
                        ) {
                        dateCell.classList.add('future');
                        }
                    // selected
                    if (count == todayParsed.date && month == todayParsed.month-1 && year == todayParsed.year) {
                        dateCell.classList.add('selected');
                        }

                    // Date has ticks
                    let parsedDate = `${year}-${String(month+1).padStart(2, 0)}-${String(count).padStart(2, 0)}`;
                    if(dateHasTicks[parsedDate]) {
                        let legendHolder = dce({el: 'SPAN', cssClass: 'legends-holder'});
                        let legend = dce({el: 'SPAN', cssClass: 'legend', content: dateHasTicks[parsedDate].count});
                        legendHolder.appendChild(legend);
                        dateCell.appendChild(legendHolder);
                        dateCell.classList.add('has-ticks')
                        }
                    };

                dateCell.addEventListener('click', () => {
                    if( dateCell.classList.contains('future')) {
                        return;
                    }
                    let newDate = handleDate({dateString : new Date(year, month, count), dateFormat : 'yyyy-mm-dd'});
                    globals.today = newDate;
                    globals.ticks = globals.ticks;
                    currentDate.innerHTML = `${globals.today} ˅`;
                    this.hideCalendar();

                }, false);
                dateContainer.appendChild(dateCell);
                dateCounter++;
                if(dateCounter > 6) dateCounter=0
                }
            calendarContainer.appendChild(dateContainer)
            return calendarContainer;
        }

        this.hideCalendar = () => {
            if(container.lastChild.classList.contains('calendar')) {
                container.removeChild(container.lastChild);
                }
        }

        this.render = () => {
            return container
        }
    }
}

export default calendar;
