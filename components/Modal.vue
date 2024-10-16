<script setup>
import { defineProps, defineEmits, watch } from 'vue';
import { reactive } from 'vue';




    const props = defineProps({
        isVisible: {
            type: Boolean,
            required: true,
        }, 
        task : Object
    });

    if (props.task) {
        formData.value.title = props.task.title
        formData.value.description = props.task.description
        }

    const formData = reactive({
        title: '',
        description: '',
        
    })

    watch(() => props.task, (newTask) => {
    if (newTask) {
        formData.title = newTask.title;
        formData.description = newTask.description;
    } else {
        formData.title = '';
        formData.description = '';
    }
}); 

    const emit = defineEmits(['close','submit']);

    const closeModal = () => {
        emit('close');
    }
    

    const submitForm = () => {
        emit('submit', formData);
        closeModal();
    }

</script>
<template>
    <div v-if="isVisible">
        <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            
            <div class="bg-black bg-opacity-50 rounded-lg p-10 w-full max-w-md relative">
               
                <button class="absolute top-0 right-0 p-2 m-2 text-white text-2xl" @click="closeModal">&times;</button>
                
               
                <h2 class="text-vue-green text-2xl font-bold mb-5">Add a Task</h2>
                
                
                <form class="w-full flex flex-col items-center" @submit.prevent="submitForm">
                    
                    <input type="text" placeholder="Task Title" class="mb-3 p-2 w-full border rounded text-black" v-model="formData.title" required>
                    
                    <input type="text" placeholder="Task Description" class="p-2 w-full border rounded text-black" v-model="formData.description">
                
                    <div class="block w-full mt-5 text-end">
                        <button type="submit" class="bg-vue-green text-white p-2 rounded">{{ task ? 'Update' : 'Send' }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>


<style scoped>

</style>