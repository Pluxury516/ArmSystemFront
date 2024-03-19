<template>
  <textarea
    v-bind="$attrs"
    v-model="model"
    rows="10"
    class="input"
  />
</template>

<script setup lang="ts">
const model = defineModel()
</script>

<style>
.input {
  border: none;
  border-bottom: 2px solid #D1D1D4;
  background: none;
  padding: 10px;
  padding-left: 24px;
  font-weight: 700;
  width: 75%;
  transition: .2s;
}

.input:active,
.input:focus,
.input:hover {
  outline: none;
  border-bottom-color: #6A679E;
}
</style>
