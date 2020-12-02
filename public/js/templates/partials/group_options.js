import { dce } from '/js/shared/helpers.js';

class groupOptions {
  constructor(params) {
    let container = dce({el: 'DIV', cssClass: 'ticker-menu hidden'});

    let editBtn = dce({el: 'DIV', cssClass: 'btn btn_small', content: 'Edit current group'});
    let newBtn = dce({el: 'DIV', cssClass: 'btn btn_small', content: 'Create new group'});

    container.append(editBtn, newBtn)

    this.render = () => {
      return container;
    }

    this.showMenu = () => {
      container.classList.toggle('hidden');
    }
  }
}

export default groupOptions;
