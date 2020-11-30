import { dce } from '/js/shared/helpers.js';

class modalWindow {
  constructor(params) {
    let modal = dce({el: 'DIV', cssClass: `modal-window ${(params.cssClass) ? params.cssClass : ''}`});

    let modalTitleContainer = dce({el: 'DIV', cssClass: 'modal-title'});
    let modalTitle = dce({el: 'H3', cssStyle: 'font-weight: 300; text-align: center', content: params.title});
    modalTitleContainer.appendChild(modalTitle);

    let modalContentContainer = dce({el: 'DIV', cssClass: 'modal-content'});
    if(params.modalContent) {
      modalContentContainer.appendChild(params.modalContent);
    }

    let modalOptionsContainer = dce({el: 'DIV', cssClass: 'modal-options'});

    if(params.buttons) {
      params.buttons.forEach(el => {
        let btn = dce({el: 'DIV', cssClass: 'btn btn_small', content: el[0]});
        btn.addEventListener('click', el[1]);
        modalOptionsContainer.appendChild(btn)
      });
    }
    else {
      let closeModal = dce({el: 'DIV', cssClass: 'btn btn_small', content: 'Close'});
      closeModal.addEventListener('click', () => { 
        document.body.classList.remove('modal-open');
        modal.parentNode.removeChild(modal)
      });

      modalOptionsContainer.appendChild(closeModal);
    }

    modal.append(modalTitleContainer, modalContentContainer, modalOptionsContainer)

    this.render = () => {
      if(params.open) {
        this.open();
      }
      return modal;
    }

    this.close = () => {
      document.body.classList.remove('modal-open');
      modal.parentNode.removeChild(modal);
    }
    this.open = () => {
      document.body.classList.add('modal-open');
    }

  }
}

export default modalWindow;
