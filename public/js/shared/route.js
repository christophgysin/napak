import { globals } from '/js/shared/globals.js';
import { storeObserver } from '/js/shared/helpers.js';

let route = ( { page = 'login', params = [] } = {} ) => {
  page = page.split('/')[0];

  let routeParams = page.split("/");
  for(let i=1; i < routeParams.length; i++){
    params.push(routeParams[i]);
    };

  if(page !== globals.route) {
    // Clear store observers marked with removeOnRouteChange
    storeObserver.clear();
    let trgt = new globals.routes[page];
    globals.route = page;
    document.querySelector('.page-content').innerHTML = "";
    document.querySelector('.page-content').appendChild(trgt.render());

    history.pushState( {}, globals.route, globals.route );
  }
};


export { route }
