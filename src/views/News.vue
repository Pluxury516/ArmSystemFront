<template>
  <div class="news">
    <select
      v-model="selectedValue"
      @change="onChangeSchool"
    >
      <option
        :value="null"
      >
        Выберите значение
      </option>
      <option
        v-for="(option,index) in options"
        :key="index"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>
    <div class="actions">
      <button @click="getData">
        Обновить
      </button>
      <button
        v-if="showButton"
        @click="onAddNews"
      >
        Добавить Новость
      </button>
    </div>
    <div class="cart-wrapper">
      <div
        v-for="(item) in news"
        :key="item.id"
        class="cart"
      >
        <div class="cart-actions">
          <div
            class="delete"
            @click="deleteNews(item.id)"
          >
            Удалить
          </div>
          <div
            class="update"
            @click="updateNews(item)"
          >
            Обновить
          </div>
        </div>
        <h4>{{ item.title }}</h4>
        <div class="description">
          {{ item.descriptions }}
        </div>
        <div class="down">
          <div class="date">
            {{ new Date(item.createdAt).toISOString().split('T')[0] }}
          </div>
          <div>Автор: {{ getAuthor(item.userId) }}</div>
        </div>
      </div>
    </div>
    <Modal
      v-if="showModal"
      :title="title"
      @close="showModal = false"
    >
      <template #default>
        <Form :form="form">
          <TextareaUi
            v-model="desciption.value"
            :placeholder="desciption.placeholder"
          />
        </Form>
        <button
          class="button"
          :disabled="disabled"
          @click="handler"
        >
          {{ title }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue"
import {useNotification} from "@kyvg/vue3-notification"
import axios from "axios"
import Modal from "@/components/Modal.vue"
import Form from "@/components/Form.vue"
import TextareaUi from "@/components/TextareaUi.vue"

const schools = ref([])
const userId = ref(localStorage.getItem('userId'))
const role = ref(localStorage.getItem('role'))
const {notify} = useNotification()
const selectedValue = ref(null)
const news = ref([])
const showModal = ref(false)
const title = ref('Добавить новость')
const type = ref('add')
const currentNewsId = ref(null)

const DEFAULT_FORM = [{
  type: 'inputUi',
  placeholder: 'Название',
  field: 'title',
  value: '',
},
]

const desciption = ref({
  placeholder: 'Описание',
  value: '',
})
const users = ref([])
const form = ref(DEFAULT_FORM)

onMounted(async () => {
  try {
    const {data} = await axios.get('http://localhost:8080/api/school')
    schools.value = data
  } catch (e) {
    notify({text: e.message})
  }
})

const disabled = computed(() => {
  let error = false
  for (const formItem of form.value) {
    if (!formItem.value) error = true
  }
  return error
})

const showButton = computed(()=>{
  if(!selectedValue.value){
    return false
  }
  return  true
})

const handler = () => {
  if (type.value === 'add') {
    addNews()
  } else {
    onUpdateNews()
  }
}

const getUser = async () =>{
  const token = localStorage.getItem('token')
  try {
    const {data} = await axios.get('http://localhost:8080/api/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    users.value = data

  } catch (e) {
    notify({
      text: 'Токен доступа просрочен',
    })
  }
}


const onUpdateNews = async () =>{
  const params = {}
  form.value.forEach((el) => {
    params[el.field] = el.value
  })
  params.id = currentNewsId.value
  params.descriptions = desciption.value.value
  try {
    const data = await axios.put('http://localhost:8080/api/news', params)
    if (data.status === 200) {
      notify({text: 'Новость успешно обновлена'})
    } else {
      notify({text: 'Произошла ошибка'})
    }
    showModal.value = false
    await getNews()
  } catch (e) {
    notify({text: e.message})
  }
}

const getAuthor = (id) =>{
  const item = users.value.find((el)=>el.id === id)
  return `${item?.name} ${item?.surname}`
}

const addNews = async () => {
  const params = {}
  form.value.forEach((el) => {
    params[el.field] = el.value
  })
  params.descriptions = desciption.value.value
  params.userId = Number(userId.value)
  params.schoolsId = Number(selectedValue.value)
  try {
    const data = await axios.post('http://localhost:8080/api/news', params)
    if (data.status === 200) {
      notify({text: 'Пользователь успешно добавлена'})
    }
    showModal.value = false
    await getNews()
  } catch (e) {
    notify({text: e.message})
  }
}

const onChangeSchool = async () => {
  await getNews()
  await getUser()
}

const updateNews = async (news) =>{
    form.value = [
      {
        type: 'inputUi',
        placeholder: 'Название',
        field: 'title',
        value: news.title,
      },
    ]
    desciption.value.value = news.descriptions
    type.value = 'update'
    title.value = 'Обновить новость'
    currentNewsId.value = news.id
    showModal.value = true
}

const getNews = async () => {
  try {
    const {data} = await axios.get(`http://localhost:8080/api/news/${Number(selectedValue.value)}`)
    news.value = data
  } catch (e) {
    notify({text: e.message})
  }
}

const deleteNews = async (id) =>{
  try {
    const {data} = await axios.delete(`http://localhost:8080/api/news/${Number(id)}`)
    await getNews()
  } catch (e) {
    notify({text: e.message})
  }
}

const onAddNews = async () => {
  title.value = 'Добавить Новость'
  type.value = 'add'
  form.value = DEFAULT_FORM
  showModal.value = true
}

const options = computed(() => {
  if (role.value === "ADMIN") {
    return schools.value.map((el) => ({text: el.title, value: el.id}))
  } else {
    return  schools.value.map((el) => {
      if (el.usersIds.length) {
        if (el.usersIds.includes(Number(userId.value))) {
          return {text: el.title, value: el.id}
        } else {
          return  null
        }
      } else {
        return {text: el.title, value: el.id}
      }
    }).filter((el)=>el !== null)
  }
})

</script>

<style>
.news {
  margin: 10px 70px 70px;
}

.cart-actions{
  position: absolute;
  top: -20px;
  left: 30%;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-wrapper {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
}

.cart {
  position: relative;
  padding: 20px;
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  border: 1px solid #D1D1D4;
  border-radius: 25px;
}

.down{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.description {
  max-height: 279px;
  text-overflow: ellipsis;
  overflow: hidden;
}

.read-more {
  color: blue;
  cursor: pointer;
}

.date {
  font-size: 12px;
  margin-top: 8px;
  color: gray;
}

.actions {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 10px;

  button {
    cursor: pointer;
    outline: none;
    border: 1px solid #4C489D;
    border-radius: 5px;
    padding: 10px;
    display: flex;
    align-items: center;
    background: none;

    &:hover {
      border: 1px solid #ffffff;
      background: #4C489D;
      color: #ffffff;
    }
  }
}
.button {
  margin-top: 20px;
  padding: 10px;
  background: #324960;
  color: #ffffff;
  cursor: pointer;
}

.delete{
  color: red;
  cursor: pointer;
}

.update{
  cursor: pointer;
}
</style>
