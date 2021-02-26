// const { ipcRenderer } = require('electron');
// const axios = require('axios');
import Vue from 'vue';
import app from '../vue/app.vue';

// const api = axios.create({
//     baseURL: 'https://api.vrchat.cloud/api/1/',
//     validateStatus: null
// });

// ipcRenderer.send('vrcx', 'send'); // void
// ipcRenderer.invoke('vrcx', 'invoke'); // Promise<any>

// ipcRenderer.on('vrcx', function (events, ...args) {
//     console.log('ipcRenderer.on(vrcx)', args);
// });

window.$app = new Vue({
    el: '#app',
    components: {
        app,
    },
});

(async function() {
    return;
    var { data, status, headers } = await api({
        url: 'config',
    });
    console.log(status, headers, data);
    // 이거 otp 걸린 상태에서 auth cookie가 남아있고
    // 따로 접속해서 otp를 해제하고 나면 {requiresTwoFactorAuth: []} 형태로 응답이 옴..
    // 로그아웃 하고 다시 로그인 해야 할 듯
    var { data, status, headers } = await api({
        url: 'auth/user',
    });
    console.log(status, headers, data);
    if (status === 200) {
        if ('requiresTwoFactorAuth' in data) {
            if (data.requiresTwoFactorAuth.length === 0) {
                var { data, status, headers } = await api({
                    url: 'logout',
                    method: 'put',
                });
                console.log(status, headers, data);
                status = 401;
            }
        }
    }
    if (status === 401) {
        var { data, status, headers } = await api({
            url: 'auth/user',
            auth: {
                username: '',
                password: '',
            },
        });
        console.log(status, headers, data);
    }
    // var { data, status, headers } = await api({
    //     url: 'worlds/1'
    // });
    // console.log(status, headers, data);
})();
