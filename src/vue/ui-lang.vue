<template lang="pug">
#app-lang-button-group
    el-radio-group(size="mini" v-model="$i18n.locale")
        el-radio-button(v-for="locale in $i18n.availableLocales" :key="locale" :label="locale") {{ $t(`locale.${locale}`) }}
</template>
