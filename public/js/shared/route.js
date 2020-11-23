import { globals } from '/js/shared/globals.js';
import { storeObserver } from '/js/shared/helpers.js';

let route = (params) => {
  if(params !== globals.route) {
    // Clear store observers marked with removeOnRouteChange
    storeObserver.clear();
    // clear serverMessages;
    globals.serverMessage = [];
    globals.standardMessage = [];
    let trgt = new globals.routes[params];
    globals.route = params;
    document.querySelector('.page-content').innerHTML = "";
    document.querySelector('.page-content').appendChild(trgt.render());
  }
};


export { route }
