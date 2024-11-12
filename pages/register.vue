<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="p-10 bg-lighter-card-grey rounded-lg shadow-lg">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-vue-green">Create an Account</h1>
        <p class="text-light-gray mt-2">Sign up to get started</p>
      </div>
      <form @submit.prevent="register">
        <div>
          <label for="email">Email</label>
          <input
            placeholder="Enter your email"
            class="mt-2 w-full px-4 py-3 rounded-lg bg-card-grey border border-dark-gray focus:border-vue-green focus:ring-1 focus:ring-vue-green text-white outline-none transition-colors"
            type="email"
            id="email"
            v-model="email"
            required
          />
        </div>
        <div>
          <label for="password">Password</label>
          <input
            placeholder="Enter your password"
            class="mt-2 w-full px-4 py-3 rounded-lg bg-card-grey border border-dark-gray focus:border-vue-green focus:ring-1 focus:ring-vue-green text-white outline-none transition-colors"
            type="password"
            id="password"
            v-model="password"
            required
          />
        </div>
        <button
          type="submit"
          class="mt-5 bg-vue-green text-white rounded-lg p-2 justify-end mb-4 hover:bg-opacity-80 hover:text-opacity-80 transition duration-150 w-full"
        >
          Sign Up
        </button>
        <p>Already have an account? <NuxtLink to="/login" class="text-vue-green hover:underline">Login</NuxtLink></p>
        <p class="text-red" v-if="passwordErrorState">{{ passwordErrorMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const passwordErrorState = ref(false);
const passwordErrorMsg = ref('');


const validatePassword = (password) => {
  
  if (password.length === 0) {
    return "Password cannot be empty";
  }
  
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  
 
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  
 
  if (!/\d/.test(password)) {
    return "Password must contain at least one number";
  }

 
  return "Password is valid";
};

const register = async () => {
  try {

  

    if (!validatePassword(password.value)) {
      passwordErrorState.value = true;
      passwordErrorMsg.value = validatePassword(password.value);
      return;
    }

    const response = await $fetch('/register', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
      baseURL: useRuntimeConfig().public.apiBase,
      credentials: 'include',
    });

      
      if (response) {
       if (response.access_token) {
         const tokenCookie = useCookie('access_token')
         tokenCookie.value = response.access_token
         await router.push('/') 
       }
       else {
        console.error("No token received");
       }
      }
  } catch (error) {
    console.error("Error during registration", error);
  }
};
</script>

<style>

</style>