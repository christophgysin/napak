import { globals } from '/js/shared/globals.js';

let route = (params) => {
  let trgt = new globals.routes[params];
  let routeTitle = params;
//  history.pushState( globals.pushHistory, params, params );
  document.querySelector('.page-content').innerHTML = "";
  document.querySelector('.page-content').appendChild(trgt.render());
};


export { route }
