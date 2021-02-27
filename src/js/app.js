// const { ipcRenderer } = require('electron');
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import ElementPlus from 'element-plus';
import App from '../vue/app.vue';

// ipcRenderer.send('vrcx', 'send'); // void
// ipcRenderer.invoke('vrcx', 'invoke'); // Promise<any>

// ipcRenderer.on('vrcx', function (events, ...args) {
//     console.log('ipcRenderer.on(vrcx)', args);
// });

(async function () {
    var messages = {
        en: {
            message: {
                hello: 'Hello',
            },
        },
        ko: {
            message: {
                hello: '안녕',
            },
        },
    };
    var i18n = createI18n({
        locale: 'ko',
        fallbackLocale: 'en',
        messages,
    });
    var app = createApp(App);
    app.use(i18n);
    app.use(ElementPlus);
    app.mount('#app');
})();
