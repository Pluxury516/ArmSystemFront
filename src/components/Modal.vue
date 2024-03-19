<template>
  <div class="modal">
    <div class="modal-container">
      <div class="modal-header">
        <h1>{{ title }}</h1>
        <span @click="emit('close')">&#x2715;</span>
      </div>
      <div class="separator" />
      <div class="modal-form">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits(['close'])
const props = defineProps({
  type: String,
  title:String
})





</script>

<style scoped>


.modal{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.modal-container{
  background: #ffffff;
  border-radius: 20px;
  width: 1000px;
  height: 600px;
  padding: 20px;
}

.modal-header{
  width: 95%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  h1{
    margin: 0;
    font-size: 23px;
  }
  span{
    cursor: pointer;
  }
}

.separator{
  width: 100%;
  height: 1px;
  background: #4C489D;
  opacity: 0.2;
}

.modal-form{
  margin-top: 20px;
}



</style>
