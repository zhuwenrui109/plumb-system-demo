import { createVNode, render } from 'vue';
import HomeToast from '@/components/HomeToast.vue';
const divDom = document.createElement('div');
// divDom.style.transform = "translateY(100px)";
divDom.style.transition = ".3s all linear";
divDom.setAttribute('class', 'home-toast-modal-container');
document.body.appendChild(divDom);

const homeToastPlguin = message => {
  divDom.style.transform = "translateY(0)";
  return new Promise((resolve) => {
    setTimeout(() => {
      divDom.style.opacity = 0;
      setTimeout(() => {
        render(null, divDom);
        resolve();
      }, 350);
    }, 1000 + 300);
    const vNode = createVNode(HomeToast, { message });
    render(vNode, divDom)
  })
}

export default homeToastPlguin;