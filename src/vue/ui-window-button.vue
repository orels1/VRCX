<template lang="pug">
#app-title-window-button
    i.far.fa-window-minimize(@click="minimizeWindow")
    i.far.fa-window-maximize(@click="maximizeWindow")
    i.far.fa-window-close(@click="closeWindow")
</template>

<script>
import { ref, computed, reactive, toRefs } from 'vue';

export default {
    setup(props, { attrs, slots, emit }) {
        return {
            minimizeWindow() {
                window.ipcRenderer.send('vrcx', ['minimize-window']);
            },
            maximizeWindow() {
                window.ipcRenderer.send('vrcx', ['maximize-window']);
            },
            closeWindow() {
                window.ipcRenderer.send('vrcx', ['close-window']);
            },
        };
    },
};
</script>
