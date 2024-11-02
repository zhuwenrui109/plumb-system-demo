import { createVNode, render } from 'vue';
import Toast from '@/components/Toast.vue';
const divDom = document.createElement('div');
divDom.style.opacity = 0;
divDom.style.transition = ".3s all linear";
divDom.setAttribute('class', 'u-toast-modal-container');
document.body.appendChild(divDom);

const toastPlguin = message => {
  divDom.style.opacity = 1;
  return new Promise((resolve) => {
    setTimeout(() => {
      divDom.style.opacity = 0;
      setTimeout(() => {
        render(null, divDom);
        resolve();
      }, 350);
    }, 1000 + 300);
    const vNode = createVNode(Toast, { message });
    render(vNode, divDom)
  })
}

export default toastPlguin;