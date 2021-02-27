<template lang="pug">
#ui-login
    #ui-login-box
        el-form(label-position="top" label-width="100px")
            el-form-item(:label="$t('login.username')")
                el-input(v-model="username")
            el-form-item(:label="$t('login.password')")
                el-input(v-model="password")
            el-form-item
                el-button(type="primary") {{ $t('login.submit')}}
        div username="{{ username }}", password="{{ password }}"
</template>

<script>
import { ref, computed, reactive, toRefs } from 'vue';

export default {
    setup(props, { attrs, slots, emit }) {
        var state = reactive({
            username: '',
            password: '',
        });
        return {
            ...toRefs(state),
        };
    },
};
</script>
