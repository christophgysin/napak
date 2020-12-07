import { dce } from '/js/shared/helpers.js';

class groupOptions {
  constructor({options = []} = {}) {

    let container = dce({el: 'DIV', cssClass: 'ticker-menu hidden'});

    for ( let i=0, j= options.length; i<j; i++ ) {
      let newBtn = dce({el: 'DIV', cssClass: 'btn btn_small', content: `${options[i][0]}`});
      newBtn.addEventListener('click', () => {options[i][1]()});
      container.appendChild(newBtn);
    }

    this.render = () => {
      return container;
    }

    this.showMenu = () => {
      container.classList.toggle('hidden');
    }
  }
}

export default groupOptions;
