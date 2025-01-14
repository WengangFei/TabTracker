<template>
    <div class="shadow-md shadow-purple-300 rounded-md p-6">
        <h1 class="text-center">Login Page</h1> <br />
        <form @submit.prevent="loginHandler">
            <label for="email">Email:</label><br />
            <input 
                type="email" 
                name="email" 
                v-model.lazy="loginData.email"
                placeholder="Enter Email" 
                class="border border-gray-400 rounded-md m-2 p-1" />
            <br />
            <label for="password">Password:</label><br />
            <input 
                type="password" 
                name="password" 
                v-model.lazy="loginData.password"
                placeholder="Enter Password" 
                class="border border-gray-400 rounded-md m-2 p-1"
                :class="{'border-red-500': passwordError}"
                 />
                <p v-if="passwordError" class="text-red-500 text-sm">
                Password must be at least 6 characters
                </p>
            <br />
            <button 
                class="btn mx-auto block mt-3 text-black font-bold" 
                type="submit"
                :disabled="isSubmitDisabled"
                :class="{
                    'bg-purple-500': !isSubmitDisabled, 
                    'bg-yellow-400': isSubmitDisabled
                    }"
                >login
            </button>
            <p v-if="severSentError" class="text-red-500 text-sm mt-2">
                {{ severSentError }}
            </p>
        </form>
        <div class="text-center mt-2 text-blue-600 text-xxs font-bold">
            <router-link to="/register">click here go to register page</router-link>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, reactive, computed, watch } from 'vue';
import AuthenticationService from '../services/AuthenticationService';
import { useLoginAuthStore } from '../stores/loginAuthStore';

const router = useRouter();

const emailError = ref(false);
const passwordError = ref(false);
const severSentError = ref(null);

const loginData = reactive({
    email: null,
    password: null,
})
 const isSubmitDisabled = computed(() => {
     return emailError.value || 
            passwordError.value || 
            !loginData.email || 
            !loginData.password
 })
 
const loginHandler = async () => {
    console.log(loginData);
    const responseMessage = await AuthenticationService.login(loginData);
    if(responseMessage.status !== 200){
        console.log(responseMessage.response);
        severSentError.value = responseMessage.response.data.message;
    }else{
        const loginAuthStore = useLoginAuthStore();
        loginAuthStore.isAuthenticated = true;
        router.push({
            name: 'home',
        });
    }
}

watch(()=> loginData.password, (newVal) => {
    passwordError.value = newVal.length < 6;
})
</script>

<style lang="scss" scoped>

</style>