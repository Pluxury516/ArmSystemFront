<template>
  <div class="container">
    <div class="login-form">
      <Input
        v-model="loginForm.username"
        placeholder="Имя пользователя"
      />
      <Input
        v-model="loginForm.password"
        placeholder="Пароль"
        class="input"
      />
      <button
        class="login-submit"
        :disabled="!loginForm.username || !loginForm.password"
        @click="login"
      >
        Авторизоваться
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue"
import {useNotification} from "@kyvg/vue3-notification"
import axios from "axios"
import {jwtDecode} from "jwt-decode"
import {useRouter} from "vue-router"
import Input from "@/components/inputUi.vue"

const router = useRouter()
const {notify} = useNotification()
const loginForm = ref({
  username: '',
  password: '',
})



const login = async () => {
  try {
    const {data} = await axios.post('http://localhost:8080/api/user/auth', {
      username: loginForm.value.username,
      password: loginForm.value.password
    })
    if (data.status === 'error') {
      notify({
        text: data.message,
      })
    }
    if (data.status === 'ok') {
      const decode = jwtDecode(data.token, null)
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', decode.roles)
      localStorage.setItem('userId', decode.id)
      await router.push({name: 'Index'})
    }
  } catch (e) {
    notify({
      text: e,
    })
  }


}
</script>

<style>

.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form {
  display: flex;
  width: 320px;
  padding: 30px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  border-radius: 30px;
  border: 1px solid #4C489D;
}


.login-submit {
  background: #fff;
  font-size: 14px;
  margin-top: 30px;
  padding: 16px 20px;
  border-radius: 26px;
  border: 1px solid #D4D3E8;
  text-transform: uppercase;
  font-weight: 700;
  display: flex;
  align-items: center;
  width: 100%;
  color: #4C489D;
  box-shadow: 0px 2px 2px #5C5696;
  cursor: pointer;
  transition: .2s;
}

.login-submit:active,
.login-submit:focus,
.login-submit:hover {
  border-color: #6A679E;
  outline: none;
}

.login-submit:disabled {
  border-color: #eeeeee;
  background-color: #eeeeee;
  cursor: not-allowed;
  outline: none;
}
</style>
