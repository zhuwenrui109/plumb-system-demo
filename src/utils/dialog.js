import { createVNode, render } from 'vue';
import Dialog from '@/components/Dialog.vue';
const divDom = document.createElement('div');
divDom.setAttribute('class', 'u-dialog-modal-container');
divDom.style.opacity = 0;
divDom.style.transition = ".3s all linear";
document.body.appendChild(divDom);

const dialogPlguin = message => {
  divDom.style.opacity = 1;
  return new Promise((resolve, reject) => {
    // 确认
    const checkButton = () => {
      divDom.style.opacity = 0;
      setTimeout(() => {
        render(null, divDom);
      }, 350);
      resolve()
    }
    // 取消
    const cancelButton = () => {
      divDom.style.opacity = 0;
      setTimeout(() => {
        render(null, divDom);
      }, 350);
      reject()
    }
    const vNode = createVNode(Dialog, { ...message, checkButton, cancelButton });
    render(vNode, divDom)
  })
}

export default dialogPlguin;