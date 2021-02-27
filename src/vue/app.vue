<template lang="pug">
#app-title-bar
UILang
UIWindowButton
#app-content
    UILogin
</template>

<script>
import { ref, computed, reactive, toRefs } from 'vue';
import UIWindowButton from './ui-window-button.vue';
import UILogin from './ui-login.vue';
import UILang from './ui-lang.vue';

export default {
    components: {
        UIWindowButton,
        UILogin,
        UILang,
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
