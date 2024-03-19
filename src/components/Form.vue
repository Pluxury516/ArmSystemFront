<template>
  <div class="form">
    <component v-model="el.value" :placeholder="el.placeholder" v-for="(el,index) in props.form" :key="index" :is="AsyncComp"></component>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">

import {defineAsyncComponent} from "vue"

const props = defineProps({
  form: Array<any>,
})

const AsyncComp = defineAsyncComponent(() =>
    import('@/components/inputUi.vue')
)
</script>

<style>
.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
