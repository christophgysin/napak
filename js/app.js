import viewHome from '/js/templates/page_home.js';
import { globals } from '/js/shared/globals.js';
import { store }  from '/js/shared/store.js';

let napak = {
  initialize : () => {
    let getTicks = store.read({key: 'ticks'});
    if(getTicks) {
      globals.ticks = getTicks;
    }

    document.body.innerHTML = "";
    let home = new viewHome();
    document.body.appendChild(home.render());
  }
}

napak.initialize();
