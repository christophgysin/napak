import { dce } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';

class dropdownMenu {
  constructor(params) {

    this.createItems = ( items ) => {
      dropdonwOptionsContainer.innerHTML = "";
      if(!items.length) {
        this.selected = false;
        current.innerHTML = "No items to show :(";
        return;
        }
      if(items.length <= 1) {
        items[0].selected = true;
      }
      items.forEach( (item) => {
        let itemContainer = dce({el: 'A', content: item.title});
        if(item.selected) {
          itemContainer.classList.add('selected');
          this.selected = item;
          globals[this.targetObj] = item.value;
          current.innerHTML = item.title;
        }
        dropdonwOptionsContainer.appendChild(itemContainer);

        itemContainer.addEventListener('click', () => {this.set(itemContainer, item)}, false);
      });
    }

    this.toggle = () => {
      dropdonwOptionsContainer.classList.toggle('hidden');
    }

    this.set = (el, data) => {
      let currentSelected = el.parentNode.querySelectorAll('.selected');
      currentSelected.forEach((el) => {el.classList.remove('selected')});

      el.classList.add('selected');
      globals[params.targetObj] = data.value;
      current.innerHTML = data.title;
    }

    this.targetObj = params.targetObj;

    let dropdownContainer = dce({el: 'DIV', cssClass: 'dropdown-container'});
    let dropdownSelectedContainer = dce({el: 'DIV', cssClass: 'dropdown-selected'});
    let current = dce({el:'SPAN', content: '-'});
    dropdownSelectedContainer.appendChild(current)
    let dropdonwOptionsContainer = dce({el: 'DIV', cssClass: 'dropdown-options hidden'});

    if(params.options) {
      dropdownItems = [];
      this.createItems(params.options)
    }

    dropdownSelectedContainer.appendChild(dropdonwOptionsContainer);
    dropdownContainer.appendChild(dropdownSelectedContainer)
    this.render = () => {
      return dropdownContainer;
    }

    dropdownSelectedContainer.addEventListener('click', () => {this.toggle();}, false);
  }
}

export default dropdownMenu;
