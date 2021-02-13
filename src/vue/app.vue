<template lang="pug">
div.app
    h1 {{ greeting }} Vue
    p {{ now }}
</template>

<script>
export default {
    data() {
        return {
            greeting: 'Hello',
            now: '',
        }
    },
    created() {
        var self = this;
        (function update() {
            self.now = new Date().toJSON();
            setTimeout(update, 1000);
        }());
    }
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
