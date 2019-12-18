import { dce } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';

class pulldownMenu {
  constructor(params) {
    this.targetObj = params.targetObj;
    this.legends = [];

    let pos = (params.cssClass) ? params.cssClass : '';
    let menuContainer = dce({el: 'DIV', cssClass: `footer-pullup-menu hidden small-legends ${pos}`});

    params.options.forEach((item) => {
      let itemContainer = dce({el: 'SPAN'});
      if(item.selected) {
        itemContainer.classList.add('selected');
        this.selected = item;
        globals[params.targetObj] = item.value;
      }
      
      let itemTitle = dce({el: 'SPAN', cssClass: 'menu-title', content: item.title});

/* Legends */
      let legensHolder = dce({el: 'SPAN', cssClass: 'legends-holder'});

      let legendTag = dce({el: 'SPAN', cssClass: `legend type-${item.value}`, content: (item.val) ? item.val : ''});

      
      legendTag.value = item.val;
      this.legends.push(legendTag);
      legensHolder.appendChild(legendTag);      
      itemTitle.appendChild(legensHolder);

      if(item.icon) {
        itemContainer.classList.add('icons');
        let itemIcon = dce({el: 'IMG', source: item.icon, attrbs: [["label", itemTitle], ["title", "nih"]]});
        itemContainer.append(itemIcon, itemTitle);
      }
      else {
        itemContainer.appendChild(itemTitle);
      }
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
    globals.storeObservers.push({key: 'totalAscentsByType', callback: updateLegends});
    
    this.render = () => {
      return menuContainer;
    }

    this.close = () => {
      menuContainer.classList.add('hidden');
    }

    this.toggle = () => {
      // Close other menus
      for(let i=0, j=globals.openMenus.length; i<j;i++) {
        if(globals.openMenus[i] !== this) {
          globals.openMenus[i].close();
        }
      }
      globals.openMenus = [];

      menuContainer.classList.toggle('hidden');
      if(menuContainer.classList.contains('hidden')) {
        document.body.classList.remove('footer-pulldown');
      }
      else {
        globals.openMenus.push(this);
        document.body.classList.add('footer-pulldown');
      }
    }

    this.set = (el, data) => {
      if(params.linksOnly) {
        if(params.callback) {
          params.callback(data);
        }
      return;
      }
      globals[params.targetObj] = data;

      let selectedItem = menuContainer.querySelector('.selected');
      if(selectedItem) {
        selectedItem.classList.remove('selected');
      }
      el.classList.add('selected');

      if(params.callback) {
        params.callback(data);
      }
    }
  }
}

export default pulldownMenu;