<template>
  <div>
    <header class="header">
      <router-link
        :class="{ active: route.name === 'Schools' }"
        class="link"
        :to="{name:'Schools'}"
      >
        Школы
      </router-link>
      <router-link
        v-if="isAdmin"
        :class="{ active: route.name === 'Users' }"
        :to="{name:'Users'}"
        class="link"
        to=""
      >
        Пользователи
      </router-link>
      <router-link
        :to="{name:'News'}"
        :class="{ active: route.name === 'News' }"
        class="link"
      >
        Новости
      </router-link>
      <div
        class="link"
        @click="logout"
      >
        Выйти
      </div>
    </header>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted} from "vue"
import {useRoute, useRouter} from "vue-router"
const router = useRouter()
const route = useRoute()

onMounted(()=>{
  router.push({name:'Schools'})
})

const isAdmin = computed(()=>{
  return localStorage.getItem('role') === "ADMIN"
})

const logout = () =>{
  localStorage.clear()
  router.push({name:'Login'})
}
</script>


<style>
.header{
  width: 100%;
  height: 50px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 24px;
  gap: 24px;
}

.link:visited{
  color: black;
}

.link{
  cursor: pointer;
  text-decoration: none;
}

.link:hover{
  color: #4C489D;
}

.active{
  color: #4C489D !important;
}
</style>


