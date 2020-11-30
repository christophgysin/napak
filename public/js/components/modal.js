import { dce } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';

class modalWindow {
  constructor(params) {
    let modal = dce({el: 'DIV', cssClass: 'modal-window'});

    let modalTitleContainer = dce({el: 'DIV', cssClass: 'modal-title'});
    let modalTitle = dce({el: 'H3', cssStyle: 'font-weight: 300; text-align: center', content: params.title});
    modalTitleContainer.appendChild(modalTitle);

    let modalContentContainer = dce({el: 'DIV'});
    if(params.modalContent) {
      modalContentContainer.appendChild(params.modalContent);
    }

    let closeModal = dce({el: 'DIV', cssClass: 'btn', content: 'Close'});
    closeModal.addEventListener('click', () => { modal.parentNode.removeChild(modal)});
    modal.append(modalTitleContainer, modalContentContainer, closeModal)

    this.render = () => {
      return modal;
    }

  }
}

export default modalWindow;
