import { dce, storeObserver } from '/js/shared/helpers.js';
import { animate } from '/js/shared/animate.js';
import { globals } from '/js/shared/globals.js';

class statusTicker {
  constructor() {
    let container = dce({el: 'DIV', cssClass: 'current status-ticker'});
    let messageContainer = dce({el: 'DIV', cssClass: 'status-ticker-content'});
    container.appendChild(messageContainer);


    let standardMessage = dce({el: 'DIV', cssClass: 'standard'});
    let standardMessageContent = dce({el: 'H3', content: 'Venga!'});
    standardMessage.appendChild(standardMessageContent);
    messageContainer.appendChild(standardMessage);
  
/* */ 
    let currentClimbingTypeTitle = () => {
      if (globals.currentClimbingType === 'boulder') return `Bouldering ${globals.indoorsOutdoors}`;
      if (globals.currentClimbingType === 'sport') return `Climbing sport ${globals.indoorsOutdoors}`;
      if (globals.currentClimbingType === 'trad') return `Climbing trad ${globals.indoorsOutdoors}`;
      if (globals.currentClimbingType === 'toprope') return `Top roping ${globals.indoorsOutdoors}`;
      return globals.indoorsOutdoors;
    }

    let currentTitle = dce({el: 'DIV'});
    let currentTitleContent = dce({el: 'H3', content: currentClimbingTypeTitle()});
    currentTitle.appendChild(currentTitleContent);
    messageContainer.appendChild(currentTitle);

    storeObserver.add({
      store: globals,
      key: 'currentClimbingType',
      id: 'homepageCurrentClimbingType',
      callback: () => {
        currentTitleContent.innerHTML = currentClimbingTypeTitle();
      }
    });

    storeObserver.add({
      store: globals,
      key: 'indoorsOutdoors',
      id: 'homepageIndoorsOutdoors',
      callback: () => {
        currentTitleContent.innerHTML = currentClimbingTypeTitle();
      }
    });


    let serverMessage = dce({el: 'DIV', cssClass: 'network'});
    let serverMessageContent = dce({el: 'H3', content: ''});
    let blink = dce({el: 'SPAN', cssClass: 'spinner spin360'});
    serverMessage.append(serverMessageContent, blink);
    messageContainer.appendChild(serverMessage);

    // Listen for network messages
    let handleTicker = function() {
      if( globals.standardMessage.length ) {
        let tickerMessage = globals.standardMessage[globals.standardMessage.length-1];
        standardMessageContent.innerHTML = tickerMessage.message;
        container.classList.add('show-message', 'standard');

        if(tickerMessage.timeout) {
          if(messageContainer.timeout) {
            clearTimeout(messageContainer.timeout)
          }
          messageContainer.timeout = setTimeout(function(){
            animate.watch({
              el: messageContainer,
              execute: () => { 
                globals.standardMessage.splice(globals.standardMessage.length-1,1);
                globals.standardMessage = globals.standardMessage;
               },
              unwatch: true
              });
            container.classList.remove('show-message', 'standard');
          },tickerMessage.timeout*1000);
        }

      }
      else if( globals.serverMessage.length ) {
        serverMessageContent.innerHTML = globals.serverMessage[0].message;
        container.classList.remove('standard')
        container.classList.add('show-message', 'network')
      }
      else {
        container.classList.remove('show-message', 'network', 'standard')
      }

    }.bind(this);
    
    storeObserver.add({
      store: globals,
      key: 'serverMessage',
      id: 'statusTickerServerMessage',
      callback: handleTicker
    });

    storeObserver.add({
      store: globals,
      key: 'standardMessage',
      id: 'statusTickerStandardMessage',
      callback: handleTicker
    });


    this.render = () => {
      return container;
    }
  }
}

export default statusTicker;
