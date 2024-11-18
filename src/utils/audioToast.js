import { createVNode, render } from 'vue';
import AudioToast from '@/components/AudioToast.vue';
const divDom = document.createElement('div');
divDom.setAttribute('class', 'u-dialog-modal-container');
divDom.style.opacity = 0;
divDom.style.transition = ".3s all linear";
document.body.appendChild(divDom);

const audioToastPlguin = message => {
  divDom.style.opacity = 1;
  return new Promise((resolve) => {
    // 确认
    const checkButton = () => {
      divDom.style.opacity = 0;
      setTimeout(() => {
        render(null, divDom);
      }, 350);
      resolve()
    }
    const vNode = createVNode(AudioToast, { ...message, checkButton });
    render(vNode, divDom)
  })
}

export default audioToastPlguin;