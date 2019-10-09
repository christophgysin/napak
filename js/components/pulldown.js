import { dce } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';

class pulldownMenu {
  constructor(params) {
    this.targetObj = params.targetObj;
    this.legends = [];
    let menuContainer = dce({el: 'DIV', cssClass: 'footer-pullup-menu hidden small-legends'});

    params.options.forEach((item) => {
      let itemContainer = dce({el: 'SPAN'});
      if(item.selected) {
        itemContainer.classList.add('selected');
        this.selected = item;
        globals[params.targetObj] = item.value;
      }
      
      let itemIcon = dce({el: 'IMG', source: item.icon})
      let itemTitle = dce({el: 'SPAN', cssClass: 'menu-title', content: item.title});

/* Legends */
      let legensHolder = dce({el: 'SPAN', cssClass: 'legends-holder'});
      let legendTag = dce({el: 'SPAN', cssClass: `legend type-${item.value}`, content: (item.legend) ? item.legend : ''});

      

      legendTag.value = item.val;
      this.legends.push(legendTag);
      legensHolder.appendChild(legendTag);      
      itemTitle.appendChild(legensHolder);

/* legends */
      itemContainer.append(itemIcon, itemTitle);
      itemContainer.addEventListener('click', () => {this.set(itemContainer, item.value)}, false);

      menuContainer.appendChild(itemContainer);
    });

    
      // update legends
      let updateLegends = () => {
        this.legends.forEach((legend) => {
          let val = legend.value;
          if(val) {
            let count = val.split('.').reduce((o,i)=>o[i], globals);
            legend.innerHTML = (count) ? count : '';
          }
        });
      };

      globals.storeObservers.push({key: 'indoorsOutdoors', callback: updateLegends });
      globals.storeObservers.push({key: 'ticks', callback: updateLegends});

    this.render = () => {
      return menuContainer;
    }

    this.toggle = () => {
      menuContainer.classList.toggle('hidden');
      if(menuContainer.classList.contains('hidden')) {
        document.body.classList.remove('footer-pulldown');
      }
      else {
        document.body.classList.add('footer-pulldown');
      }
    }

    this.set = (el, data) => {
      globals[params.targetObj] = data;

      let selectedItem = menuContainer.querySelector('.selected');
      if(selectedItem) {
        selectedItem.classList.remove('selected');
      }
      el.classList.add('selected');

      if(params.callback) {
        params.callback();
      }
    }
  }
}

export default pulldownMenu;