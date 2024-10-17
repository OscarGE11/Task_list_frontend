<script setup>
import { ref, onMounted } from 'vue';
import Modal from './components/Modal.vue';

const tasks = ref([]);
const currentTask = ref(null);
const isModalVisible = ref(false);
const orderAsc = ref(false);


const get_tasks = async () => {
  try {
    const response = await $fetch('/tasks', {
      baseURL: useRuntimeConfig().public.apiBase
    });
    tasks.value = response.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};


onMounted(() => {
  get_tasks();

});



const handleSubmit = async (formData) => {
  console.log(tasks.value[0]);
  try {
  
    if (currentTask.value) {
      
      const updatedTask = await $fetch(`/tasks/${currentTask.value.id}`, {
        method: 'PUT',
        body: {
          ...currentTask.value,
          title: formData.title,
          description: formData.description,
          updated_at: new Date().toISOString()
        },
        baseURL: useRuntimeConfig().public.apiBase
      });
      
      await get_tasks();

    } else {
      
      const newTask = await $fetch('/tasks', {
        method: 'POST',
        body: formData,
        baseURL: useRuntimeConfig().public.apiBase
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
      baseURL: useRuntimeConfig().public.apiBase
    });
  } catch (error) {
    console.log("Error marking task as done:", error);
  }

  await get_tasks()

}

const orderByTime = () => {

  orderAsc.value = !orderAsc.value;

  tasks.value.sort((a, b) => orderAsc.value ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at));


}

</script>

<template>
  <div class="p-10">
    <div>
      <h1 class="text-vue-green text-4xl font-bold text-center mb-10">Tasks</h1>
    </div>
    
    <div class="flex flex-col md:flex-row justify-between gap-10">
      
      <div class="border border-vue-green rounded-lg p-10 w-full">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-vue-green mb-4">To do</h2>
        </div>
        
        <div class="flex flex-col" v-auto-animate>
          <div  v-for="task in tasks.filter(task => !task.is_done)" :key="task.id" class="rounded-lg p-5 shadow-lg mb-4 bg-card-grey bg-opacity-20">
            <div class="flex justify-between items-center">
              <div>
                <h1 class="text-3xl font-bold text-vue-green">{{ task.title }}</h1>
                <p class="text-xl text-vue-green text-opacity-40 ml-2">{{ task.description }}</p>
                <p class="text-xs text-white text-opacity-40 mt-3">{{ formatDate(task.created_at) }}</p>
              </div>
              <div class="flex gap-2">
                <button @click="openEditModal(task)">
                  <font-awesome-icon icon="pencil-alt" class="text-vue-green"/>
                </button>
                <button class="p-2" @click="deleteTask(task.id)">
                  <font-awesome-icon icon="trash" class="text-vue-green"/>
                </button>
                <button @click="handleIsDone(task.id)">
                  <font-awesome-icon icon="xmark" class="text-vue-green"/>
                </button>
                
              </div>
            </div>
          </div>
        </div>
        
      </div>
  
      
      <div class="border border-vue-green rounded-lg p-10 w-full">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-vue-green mb-4">Done</h2>
          
        </div>
        <div class="flex flex-col" v-auto-animate>
          <div v-for="task in tasks.filter(task => task.is_done)" :key="task.id" class="rounded-lg p-5 shadow-lg mb-4 bg-card-grey bg-opacity-20 ">
            <div class="flex justify-between items-center">
              <div>
                <h1 class="text-3xl font-bold text-vue-green">{{ task.title }}</h1>
                <p class="text-xl text-vue-green text-opacity-40 ml-2">{{ task.description }}</p>
                <p class="text-xs text-white text-opacity-40 mt-3">{{ formatDate(task.updated_at || task.created_at) }}</p>
              </div>
              <div class="flex gap-2">
                <button @click="openEditModal(task)">
                  <font-awesome-icon icon="pencil-alt" class="text-vue-green"/>
                </button>
                <button class="p-2" @click="deleteTask(task.id)">
                  <font-awesome-icon icon="trash" class="text-vue-green"/>
                </button>
                <button @click="handleIsDone(task.id)">
                  <font-awesome-icon icon="check" class="text-vue-green"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="flex justify-end">
      <button class="bg-vue-green text-white rounded-lg p-2 mt-5 justify-end mb-4 mr-2" @click="orderByTime()">Order {{ orderAsc ? 'Ascending' : 'Descending' }}</button>
      <button class="bg-vue-green text-white rounded-lg p-2 mt-5 justify-end mb-4" @click="openModal">Add Task</button>
      <Modal :isVisible="isModalVisible" @close="closeModal" @submit="handleSubmit" :task="currentTask"/>
    </div>
    
  </div>
  
</template>

<style scoped>
</style>
