import { dce } from '/js/shared/helpers.js';
import { globals } from '/js/shared/globals.js';

class modalWindow {
  constructor(params) {
    let modal = dce({el: 'DIV', cssClass: 'modal-window'});

    let modalTitleContainer = dce({el: 'DIV', cssClass: 'modal-title'});
    let modalTitle = dce({el: 'H3', cssStyle: 'font-weight: 300; text-align: center', content: params.title});
    modalTitleContainer.appendChild(modalTitle);

    let modalContentContainer = dce({el: 'DIV', cssClass: 'modal-content'});
    if(params.modalContent) {
      modalContentContainer.appendChild(params.modalContent);
    }

    let modalOptionsContainer = dce({el: 'DIV', cssClass: 'modal-options'});

    let closeModal = dce({el: 'DIV', cssClass: 'btn btn_small', content: 'Close'});
    closeModal.addEventListener('click', () => { 
      document.body.classList.remove('modal-open');
      modal.parentNode.removeChild(modal)
    });

    modalOptionsContainer.appendChild(closeModal);

    modal.append(modalTitleContainer, modalContentContainer, modalOptionsContainer)

    this.render = () => {
      this.addBodyClass();
      return modal;
    }

    this.addBodyClass = () => {
      document.body.classList.add('modal-open');
    }

  }
}

export default modalWindow;
