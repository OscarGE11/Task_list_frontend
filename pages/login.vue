<template>
  <div class="flex items-center justify-center min-h-screen">
   <div class="p-10 bg-lighter-card-grey rounded-lg shadow-lg">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-vue-green">Welcome back</h1>
      <p class="text-light-gray mt-2">Sign in to your account</p>
    </div>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email</label>
        <input placeholder="Enter your email" class="mt-2 w-full px-4 py-3 rounded-lg bg-card-grey border border-dark-gray focus:border-vue-green focus:ring-1 focus:ring-vue-green text-white outline-none transition-colors" type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Password</label>
        <input placeholder="Enter your password" class="mt-2 w-full px-4 py-3 rounded-lg bg-card-grey border border-dark-gray focus:border-vue-green focus:ring-1 focus:ring-vue-green text-white outline-none transition-colors" type="password" id="password" v-model="password" required>
      </div>
      
        <button type="submit" class="mt-5 bg-vue-green text-white rounded-lg p-2 justify-end mb-4 hover:bg-opacity-80 hover:text-opacity-80 transition duration-150 w-full">Sign in</button>
      
    </form>
   </div>
    
  
    
  </div>
</template>

<script setup>
import { useRouter} from 'vue-router';

const router = useRouter()
 const email = ref('')
 const password = ref('')




const login = async () => {
    try {
      const response = await $fetch('/login', {
        method: 'POST',
        body: {
          email:email.value,
          password:password.value
        },
        baseURL: useRuntimeConfig().public.apiBase,
        credentials: 'include',
        
      })


      if (response) {
       
        if (response.access_token) {
          const tokenCookie = useCookie('access_token')
          tokenCookie.value = response.access_token
          await router.push('/')
        } else {
          console.log("No token");
        }
      } else {
        console.log("Login failed");
      }

    }
  catch (error) {
  console.log("Error logging in", error)
    }
  }


</script>

<style>

</style>