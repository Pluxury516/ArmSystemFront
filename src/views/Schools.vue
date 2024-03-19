<template>
  <div class="table-wrapper">
    <div class="actions">
      <button @click="getData">
        Обновить
      </button>
      <button
        v-if="isAdmin"
        @click="onAddSchool"
      >
        Добавить школу
      </button>
    </div>
    <table class="fl-table">
      <thead>
        <tr>
          <th>Наименование</th>
          <th>Город</th>
          <th>Улица</th>
          <th>Пользователи</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="school in schools"
          :key="school.id"
        >
          <td>{{ school.title }}</td>
          <td>{{ school.city }}</td>
          <td>{{ school.street }}</td>
          <td>{{ getUsersList(school) }}</td>
          <td
            v-if="isAdmin"
          >
            <span
              class="delete"
              @click="deleteSchool(school.id)"
            >Удалить</span>
            <span
              class="update"
              @click="updateSchool(school)"
            >Обновить</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Modal
    v-if="showModal"
    :title="title"
    @close="showModal = false"
  >
    <template #default>
      <Form :form="form" />
      <SelectUser
        :users="users"
        @select="selectUser"
      />
      <button
        :disabled="disabled"
        @click="handler"
      >
        {{ title }}
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue"
import axios from "axios"
import Modal from "@/components/Modal.vue"
import Form from "@/components/Form.vue"
import SelectUser from "@/components/SelectUser.vue"
import {useNotification} from "@kyvg/vue3-notification"

const showModal = ref(false)
const DEFAULT_FORM = [
  {
    type: 'inputUi',
    placeholder: 'Наименование',
    field: 'title',
    value: '',
  },
  {
    type: 'inputUi',
    placeholder: 'Город',
    field: 'city',
    value: ''
  },
  {
    type: 'inputUi',
    placeholder: 'Улица',
    field: 'street',
    value: ''
  },
  {
    type: 'inputUi',
    placeholder: 'Дом',
    field: 'appartments',
    value: ''
  },
]
const schools = ref([])
const title = ref('Добавить школу')
const users = ref([])
const user = ref(null)
const type = ref('add')
const currentSchoolId = ref(null)
const form = ref(DEFAULT_FORM)


const selectUser = (selectedUser) => {
  user.value = selectedUser
}
const {notify} = useNotification()


const isAdmin = computed(() => {
  return localStorage.getItem('role') === "ADMIN"
})

const getData = async () =>{
  const token = localStorage.getItem('token')
  try {
    const {data} = await axios.get('http://localhost:8080/api/school')
    schools.value = data
    const {data: userData} = await axios.get('http://localhost:8080/api/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    users.value = userData
  } catch (e) {
    notify({text:e.message})
  }
}
onMounted(async () => {
  await getData()
})

const updateSchool = (school) =>{
  form.value = [
    {
      type: 'inputUi',
      placeholder: 'Наименование',
      field: 'title',
      value: school.title,
    },
    {
      type: 'inputUi',
      placeholder: 'Город',
      field: 'city',
      value: school.city
    },
    {
      type: 'inputUi',
      placeholder: 'Улица',
      field: 'street',
      value: school.street
    },
    {
      type: 'inputUi',
      placeholder: 'Дом',
      field: 'appartments',
      value: school.appartments
    },
  ]
const currentIndex =  users.value.findIndex((el)=>school.usersIds.includes(el.id))
  if(currentIndex !== -1) {
    users.value[currentIndex].selected = true
  }
  type.value = 'update'
  title.value = 'Обновить школу'
  currentSchoolId.value = school.id
  showModal.value = true
}

const deleteSchool = async (schoolId) =>{
  try {
    const data = await axios.delete(`http://localhost:8080/api/school/${schoolId}`,)
    if (data.status === 200) {
      notify({text: "Школа успешно удалена"})
    } else {
      notify({text: "Произошла ошибка"})
    }
    await getData()

  } catch (e) {
    notify({text: e.message})
  }
}

const onAddSchool = () => {
  title.value = 'Добавить Школу'
  type.value = 'add'
  form.value = DEFAULT_FORM
  showModal.value = true
}

const handler = () => {
  if (type.value === 'add') {
    addSchool()
  } else {
    onUpdateSchool()
  }
}

const onUpdateSchool = async () => {
  const params = {}
  form.value.forEach((el) => {
    params[el.field] = el.value
  })
  if(user.value) {
    params.usersIds = user.value.map((el) => el.id)
  }
  params.id = currentSchoolId.value
  try {
    const data = await axios.put('http://localhost:8080/api/school', params, )
    if (data.status === 200) {
      notify({text: 'Школа успешно обновлена'})
    } else {
      notify({text: 'Произошла ошибка'})
    }
    showModal.value = false
    await getData()
  } catch (e) {
    notify({text: e.message})
  }
}

const getUsersList = (school) => {
  if (school.usersIds.length) {
    return users.value.filter((el) => school.usersIds.includes(el.id)).map((el)=>`${el.name} ${el.surname}`).join(',')
  }
  return 'Все'
}

const disabled = computed(() => {
  let error = false
  for (const formItem of form.value) {
    if (!formItem.value) error = true
  }
  return error
})

const addSchool = async () => {
  const params = {}
  form.value.forEach((el) => {
    params[el.field] = el.value
  })
  if(user.value) {
    params.usersIds = user.value.map((el) => el.id)
  }
  try {
  const data = await  axios.post('http://localhost:8080/api/school', params)
    if(data.status === 'ok'){
      notify({text:'Школа успешно добавлена'})
    }
    if(data.status === 'error'){
      notify({text:'Произошла ошибка'})
    }
    showModal.value = false
    await getData()
  } catch (e) {
    notify({text:e})
  }

}

</script>

<style scoped>
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

* {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}

body {
  font-family: Helvetica;
  -webkit-font-smoothing: antialiased;
  background: rgba(71, 147, 227, 1);
}


/* Table Styles */

.table-wrapper {
  margin: 10px 70px 70px;
  box-shadow: 0px 35px 50px rgba(0, 0, 0, 0.2);
}

.fl-table {
  border-radius: 5px;
  font-size: 16px;
  font-weight: normal;
  border: none;
  border-collapse: collapse;
  width: 100%;
  max-width: 100%;
  white-space: nowrap;
  background-color: white;
}

.fl-table td, .fl-table th {
  text-align: center;
  padding: 8px;
}

.fl-table td {
  border-right: 1px solid #f8f8f8;
  font-size: 16px;
}

.fl-table thead th {
  color: #ffffff;
  background: #324960;
}


.fl-table thead th:nth-child(odd) {
  color: #ffffff;
  background: #324960;
}

.fl-table tr:nth-child(even) {
  background: #F8F8F8;
}

/* Responsive */

@media (max-width: 767px) {
  .fl-table {
    display: block;
    width: 100%;
  }

  .table-wrapper:before {
    content: "Scroll horizontally >";
    display: block;
    text-align: right;
    font-size: 16px;
    color: white;
    padding: 0 0 10px;
  }

  .fl-table thead, .fl-table tbody, .fl-table thead th {
    display: block;
  }

  .fl-table thead th:last-child {
    border-bottom: none;
  }

  .fl-table thead {
    float: left;
  }

  .fl-table tbody {
    width: auto;
    position: relative;
    overflow-x: auto;
  }

  .fl-table td, .fl-table th {
    padding: 20px .625em .625em .625em;
    height: 60px;
    vertical-align: middle;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    width: 120px;
    font-size: 16px;
    text-overflow: ellipsis;
  }

  .fl-table thead th {
    text-align: left;
    border-bottom: 1px solid #f7f7f9;
  }

  .fl-table tbody tr {
    display: table-cell;
  }

  .fl-table tbody tr:nth-child(odd) {
    background: none;
  }

  .fl-table tr:nth-child(even) {
    background: transparent;
  }

  .fl-table tr td:nth-child(odd) {
    background: #F8F8F8;
    border-right: 1px solid #E6E4E4;
  }

  .fl-table tr td:nth-child(even) {
    border-right: 1px solid #E6E4E4;
  }

  .fl-table tbody td {
    display: block;
    text-align: center;
  }
}
.delete{
  color: red;
  cursor: pointer;
  margin-right: 10px;
}
.update {
  cursor: pointer;
}
</style>