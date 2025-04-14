import "amfe-flexible";

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores';
import './assets/css/main.css'
import "@/mock"

const app = createApp(App)

app.use(router);
app.use(store);

app.mount('#app')
