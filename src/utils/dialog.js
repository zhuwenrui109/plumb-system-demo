
import { createVNode, render } from 'vue';
import Dialog from '@/components/Dialog.vue';
const divDom = document.createElement('div');
divDom.setAttribute('class', 'u-dialog-modal-container');
document.body.appendChild(divDom);

const dialogPlguin = () => {
  return new Promise((resolve, reject) => {
    // 确认
    const checkButton = () => {
      render(null, divDom);
      resolve()
    }
    // 取消
    const cancelButton = () => {
      render(null, divDom);
      reject()
    }
    const vNode = createVNode(Dialog, { checkButton, cancelButton });
    render(vNode, divDom)
  })
}

export default dialogPlguin;