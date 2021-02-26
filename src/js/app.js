// const { ipcRenderer } = require('electron');
import { createApp } from 'vue';
import App from '../vue/app.vue';

// ipcRenderer.send('vrcx', 'send'); // void
// ipcRenderer.invoke('vrcx', 'invoke'); // Promise<any>

// ipcRenderer.on('vrcx', function (events, ...args) {
//     console.log('ipcRenderer.on(vrcx)', args);
// });

(async function () {
    var app = createApp(App);
    app.mount('#app');
})();
