<template lang="pug">
h1 {{ greeting }} Vue
p {{ now }}
button(type="button" @click="handleButton") handle
</template>

<script>
import { ref, computed, reactive, toRefs, onMounted } from 'vue';

export default {
    setup(props, { attrs, slots, emit }) {
        var now = ref(0);
        var state = reactive({
            greeting: 'Hello',
            now: computed(function () {
                return new Date(now.value).toJSON();
            }),
        });
        onMounted(function () {
            (function update() {
                now.value = Date.now();
                setTimeout(update, 1000);
            })();
        });
        return {
            ...toRefs(state),
            handleButton() {
                state.greeting = 'SEX';
                window.sex();
            },
        };
    },
};
</script>

<style lang="scss" scoped>
.app {
    > h1 {
        text-align: center;
    }
    > p {
        text-align: center;
        font-size: 12px;
    }
}
</style>
