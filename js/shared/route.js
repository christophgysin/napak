import { globals } from '/js/shared/globals.js';

let route = (params) => {
  console.log(params)
  console.log(globals.routes)
  console.log(params in globals.routes)
  let nakki = new globals.routes[params];
  document.querySelector('.page-content').innerHTML = "";
  document.querySelector('.page-content').appendChild(nakki.render());
};


export { route }
