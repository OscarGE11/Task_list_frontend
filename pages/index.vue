<template>
  <header class="container mx-auto mt-10 justify-between flex items-center">
    <div class="flex items-center gap-3">
      <img src="/assets/images/Taskit.png" alt="Logo" class="h-12 w-12" />
      <h1 class="text-vue-green text-4xl font-bold">Task it!</h1>
    </div>
    <span @click="logout" title="Logout" class="text-vue-green cursor-pointer font-bold text-2xl">
      <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" />
    </span>
  </header>
  <div class="container mx-auto pt-10">
    
    

    
    <div v-if="tasks.length === 0" class="flex justify-center items-center h-60 bg-card-grey bg-opacity-20 rounded-lg shadow-lg">
      <p class="text-vue-green text-lg font-bold">You have no tasks added yet</p>
    </div>
    

   
    <div class="flex flex-col md:flex-row justify-between gap-10" v-if="tasks.length > 0">
      <div class="p-10 w-full">
        <h2 class="text-2xl font-bold text-vue-green mb-4 text-center">To do</h2>
        <div class="flex flex-col" v-auto-animate>
          <div v-for="task in tasks.filter(task => !task.is_done)" :key="task.id" class="rounded-lg p-5 shadow-lg mb-4 bg-card-grey bg-opacity-20 hover:shadow-xl hover:bg-lighter-card-grey transition duration-150">
            <div class="flex justify-between items-center">
              <div>
                <h1 class="text-2xl font-bold text-vue-green">{{ task.title }}</h1>
                <p class="text-l text-vue-green text-opacity-80 mt-3">{{ task.description }}</p>
                <p class="text-xs text-white text-opacity-40 mt-3">{{ formatDate(task.created_at) }}</p>
              </div>
              <div class="flex gap-2">
                <button @click="openEditModal(task)">
                  <font-awesome-icon icon="pencil-alt" class="text-vue-green text-xl hover:text-blue transition duration-150"/>
                </button>
                <button class="p-2" @click="deleteTask(task.id)">
                  <font-awesome-icon icon="trash" class="text-vue-green text-xl hover:text-red transition duration-150"/>
                </button>
                <button @click="handleIsDone(task.id)">
                  <font-awesome-icon icon="check" class="text-vue-green text-xl hover:text-yellow-200 transition duration-150" title="Mark task as done"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-10 w-full">
        <h2 class="text-2xl font-bold text-vue-green mb-4 text-center">Done</h2>
        <div class="flex flex-col" v-auto-animate>
          <div v-for="task in tasks.filter(task => task.is_done)" :key="task.id" class="rounded-lg p-5 shadow-lg mb-4 bg-card-grey bg-opacity-20 hover:shadow-xl hover:bg-lighter-card-grey transition duration-150">
            <div class="flex justify-between items-center">
              <div>
                <h1 class="text-2xl font-bold text-vue-green">{{ task.title }}</h1>
                <p class="text-l text-vue-green text-opacity-80 mt-3">{{ task.description }}</p>
                <p class="text-xs text-white text-opacity-40 mt-3">{{ formatDate(task.updated_at || task.created_at) }}</p>
              </div>
              <div class="flex gap-2">
                <button @click="openEditModal(task)">
                  <font-awesome-icon icon="pencil-alt" class="text-vue-green text-xl hover:text-blue transition duration-150"/>
                </button>
                <button class="p-2" @click="deleteTask(task.id)">
                  <font-awesome-icon icon="trash" class="text-vue-green text-xl hover:text-red transition duration-150"/>
                </button>
                <button @click="handleIsDone(task.id)">
                  <font-awesome-icon icon="xmark" class="text-vue-green text-xl hover:text-yellow-200 transition duration-150" title="Mark task as to do"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <Modal :isVisible="isModalVisible" @close="closeModal" @submit="handleSubmit" :task="currentTask"/>


    <div class="flex justify-between">
      <button class="bg-vue-green text-black rounded-lg p-2 mt-5 mb-4 hover:bg-opacity-80 hover:text-opacity-80 transition duration-150" @click="openModal">
        Add Task
      </button>
  <button class="bg-vue-green text-black rounded-lg p-2 mt-5 mb-4 mr-2 hover:bg-opacity-80 hover:text-opacity-80 transition duration-150" @click="orderByTime()" v-if="tasks.length > 0">
    Order {{ orderAsc ? 'Ascending' : 'Descending' }}
  </button>
  
</div>
  </div>
  
  
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Modal from './components/Modal.vue';
import { jwtDecode } from 'jwt-decode';
import { useRouter} from 'vue-router';

const router = useRouter()
const tasks = ref([]);
const currentTask = ref(null);
const isModalVisible = ref(false);
const orderAsc = ref(false);
const token = useCookie('access_token');


definePageMeta({
  middleware: ['auth'],
});

const get_tasks = async () => {
  try {
    const response = await $fetch('/tasks', {
      baseURL: useRuntimeConfig().public.apiBase,
      credentials: 'include',
    });
    tasks.value = response.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

const logout = () => {
  document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
  token.value = null;
  router.push('/login');
}

const getUserIdFromToken = () => {
  if (!token.value) {
    return null;
  }
  try {
    const decodedToken = jwtDecode(token.value);
    return decodedToken.id;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return null;
  }
};

const userId = getUserIdFromToken();
onMounted(() => {

  if (token.value){
    get_tasks()
  }
    
    

});





const handleSubmit = async (formData) => {
  try {
  
    if (currentTask.value) {
      
      const updatedTask = await $fetch(`/tasks/${currentTask.value.id}`, {
        method: 'PUT',
        body: {
          ...currentTask.value,
          title: formData.title,
          description: formData.description,
          updated_at: new Date().toISOString(),
          user_id: userId
        },
        baseURL: useRuntimeConfig().public.apiBase,
        credentials: 'include',
        
      });
      await get_tasks();

    } else {
      
      const newTask = await $fetch('/tasks', {
        method: 'POST',
        body: {
          ...formData,
          user_id: userId
        },
        baseURL: useRuntimeConfig().public.apiBase,
        credentials: 'include',
        
      });
      await get_tasks();
    }
     
    closeModal(); 
    
  } catch (error) {
    console.error("Error handling submit", error);
  }
};

const openModal = () => {
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
  currentTask.value = null;
};


const openEditModal = (task) => {
  currentTask.value = task ;
  isModalVisible.value = true;
};

const deleteTask = async (taskId) => {
  try {
    await $fetch(`/tasks/${taskId}`, {
      method: 'DELETE',
      baseURL: useRuntimeConfig().public.apiBase,
      credentials: 'include',
      
    });

    tasks.value = tasks.value.filter(task => task.id !== taskId);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};



function formatDate(date) {
  return new Date(date).toLocaleDateString('es-ES');
}

const handleIsDone = async (taskId) => {
  try{

    const currentTask = tasks.value.filter(task => task.id == taskId)
    const choice = !currentTask[0].is_done

    await $fetch(`/tasks/${taskId}`, {
      method: 'PUT',
      body: {
        ...currentTask.value,
        is_done: choice,
        updated_at: new Date().toISOString()
      },
      baseURL: useRuntimeConfig().public.apiBase,
      credentials: 'include',
      
    });
  } catch (error) {
    console.error("Error marking task as done:", error);
  }

  await get_tasks()

}
const orderByTime = () => {

  orderAsc.value = !orderAsc.value;
  tasks.value.sort((a, b) => orderAsc.value ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at));

}

</script>

<style scoped>
</style>
