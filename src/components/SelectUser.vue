<template>
  <div v-if="users.length" class="users">
    <h4>Выберите пользователя</h4>
    <div class="users-select" v-for="user in localUsers" :key="user.id">
      <input @change="onChange" v-model="user.selected" type="checkbox">
      <span>{{ user.name }} {{ user.surname }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref,} from "vue"
import axios from "axios"

const localUsers = ref([])

const props = defineProps({
  users: Array<any>,
})

const emit = defineEmits(['select'])
onMounted(async () => {
  const id = localStorage.getItem('userId')
  localUsers.value = props.users
  localUsers.value = localUsers.value.filter((el)=>el.id !== Number(id))
})

const onChange = () =>{
  const selectedUsers = localUsers.value.filter((el)=>el.selected)
  emit("select", selectedUsers)
}
</script>

<style>
.users {
  padding-top: 10px;
}

.users-select {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
