import { dce, storeObserver } from '/js/shared/helpers.js';
import { animate } from '/js/shared/animate.js';
import { globals } from '/js/shared/globals.js';

class statusTicker {
  constructor(params) {
    let container = dce({el: 'DIV', cssClass: 'current status-ticker'});
    let messageContainer = dce({el: 'DIV', cssClass: 'status-ticker-content'});
    container.appendChild(messageContainer);


    let standardMessage = dce({el: 'DIV', cssClass: 'standard'});
    let standardMessageContent = dce({el: 'H3', content: ''});
    standardMessage.appendChild(standardMessageContent);
    messageContainer.appendChild(standardMessage);

    messageContainer.addEventListener('click', () => {
      if(params && params.tapAction) {
        params.tapAction();
      }
      messageContainer.classList.toggle('spin')
    }, false)
/* */
    let currentClimbingTypeTitle = () => {
      if(params[`titlePrefix_${globals.currentClimbingType}`]) {
        return params[`titlePrefix_${globals.currentClimbingType}`] + ((!params.hideIndoorsOutdoors) ? globals.indoorsOutdoors : '');
      }
      if(params.titlePrefix) {
        return params.titlePrefix;
      }
      return '-'
    }

    let currentTitle = dce({el: 'DIV', cssClass: 'current'});
    let currentTitleContent = dce({el: 'H3', content: currentClimbingTypeTitle()});
    currentTitle.appendChild(currentTitleContent);
    messageContainer.appendChild(currentTitle);

    let toggleMenu = dce({el: 'DIV', cssClass: 'toggle'});
    let toggleIcon = dce({el: 'IMG', cssStyle: 'width: 24px; height: 24px;', attrbs: [['src', '/images/gear.svg']]});
    toggleMenu.appendChild(toggleIcon);
    currentTitle.appendChild(toggleMenu)

    storeObserver.add({
      store: globals,
      key: 'currentClimbingType',
      id: 'homepageCurrentClimbingType',
      callback: () => {
        currentTitleContent.innerHTML = currentClimbingTypeTitle();
      },
      removeOnRouteChange: true
    });

    storeObserver.add({
      store: globals,
      key: 'indoorsOutdoors',
      id: 'homepageIndoorsOutdoors',
      callback: () => {
        currentTitleContent.innerHTML = currentClimbingTypeTitle();
      },
      removeOnRouteChange: true
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
        container.classList.remove('from-bottom');

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
      if( globals.serverMessage.length ) {
        let tickerMessage = globals.serverMessage[globals.serverMessage.length-1];

        serverMessageContent.innerHTML = tickerMessage.message;
        container.classList.add('show-message', 'network');
        container.classList.remove('standard');
        if(tickerMessage.finished) {
          if(messageContainer.timeout) {
            clearTimeout(messageContainer.timeout)
          }
          messageContainer.timeout = setTimeout(function(){
            animate.watch({
              el: messageContainer,
              execute: () => {
                globals.serverMessage.splice(globals.serverMessage.length-1,1);
                globals.serverMessage = globals.serverMessage;
               },
              unwatch: true
              });
            container.classList.add('from-bottom');
            container.classList.remove('show-message', 'network');
          },1000);
        }
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
