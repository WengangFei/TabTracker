<template>
    <div class="shadow-md shadow-purple-900 rounded-md p-6 m-2 bg-white mt-28 w-fit m-auto">
        <form @submit.prevent="loginHandler" class="text-center">
            <!-- <label for="email">Email:</label><br /> -->
            <input 
                type="email" 
                name="email" 
                v-model.lazy="loginData.email"
                placeholder="Enter Email" 
                class="border border-gray-400 rounded-md m-2 p-1" />
            <br />
            <!-- <label for="password">Password:</label><br /> -->
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
            <p v-if="severSentError" class="text-red-500 text-xxs mt-2">
                {{ severSentError }}
            </p>
            <div 
                v-if="!userRegistered.registeredFlag"
                class="text-center mt-2 text-blue-600 text-xxs font-bold">
                <router-link to="/register">click here go to register page</router-link>
            </div>
            <div 
                v-if="userRegistered.registeredFlag"
                class="text-center mt-2 text-green-600 text-xxs font-bold">
                Thanks for the registering, please login now.
            </div>
        </form>
        
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
const userRegistered = useLoginAuthStore();
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
    const responseMessage = await AuthenticationService.login(loginData);
    if(responseMessage.status !== 200){
        console.log(responseMessage.response.data);
        severSentError.value = responseMessage.response.data.message;
    }else{
        const loginAuthStore = useLoginAuthStore();
        loginAuthStore.isAuthenticated = true;
        loginAuthStore.loginUserInfo.email = responseMessage.data.loginInfo.email;
        loginAuthStore.loginUserInfo.password = responseMessage.data.loginInfo.password;
        loginAuthStore.loginUserInfo.token = responseMessage.data.token;
        //save token to local storage
        localStorage.setItem('token', responseMessage.data.token);
        router.push({
            name: 'home',
        });
    }
    console.log('Login user info =>',responseMessage);
}

watch(()=> loginData.password, (newVal) => {
    passwordError.value = newVal.length < 6;
});

// localStorage.clear(); // Clears all items in localStorage
</script>

<style lang="scss" scoped>

</style>