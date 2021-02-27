<template lang="pug">
#app-title-bar
UIWindowButton
#app-content
    UILogin
</template>

<script>
import { ref, computed, reactive, toRefs } from 'vue';
import UIWindowButton from './ui-window-button.vue';
import UILogin from './ui-login.vue';

export default {
    components: {
        UIWindowButton,
        UILogin,
    },
    setup(props, { attrs, slots, emit }) {
        var state = reactive({
            currentUser: null,
        });
        return {
            ...toRefs(state),

        };
    },
};
</script>
