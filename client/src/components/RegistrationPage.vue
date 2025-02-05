<template>
    <div class="rounded-md m-2 p-6 shadow-md shadow-yellow-400 bg-white">
        <h1 class="text-center mb-6">Register An Account</h1>
        <form @submit.prevent="submitForm">
            <label for="email">Email:</label><br />
            <input 
                type="email" 
                v-model.lazy="submitData.email" 
                name="email"     
                placeholder="Enter Email" 
                class="border border-gray-400 rounded-md m-2 p-1"  
                :class="{'border-red-500': emailError}"/>
                <p v-if="emailError" class="text-red-500 text-sm">Please enter a valid email address.</p>
                <br />
            <label for="password">Password:</label><br />
            <input 
                type="password" 
                v-model.lazy="submitData.password" 
                name="password" 
                placeholder="Enter Password" 
                class="border border-gray-400 rounded-md m-2 p-1"
                :class="{'border-red-500': passwordError}"/>
                <p v-if="passwordError" class="text-red-500 text-sm">Password must be at least 6 characters.</p>
                <br />
            <label for="confirm-password">Confirm Password:</label><br />
            <input 
                type="password" 
                v-model.lazy="submitData.confirmPassword" 
                name="confirm-password" 
                placeholder="Confirm Password" 
                class="border border-gray-400 rounded-md m-2 p-1"
                :class="{'border-red-500': confirmPasswordError}"/>
                <p v-if="confirmPasswordError" class="text-red-500 text-sm">Passwords do not match.</p>
                <br />
            <button 
                class="btn mx-auto block mt-3 text-black font-bold" 
                type="submit" 
                :disabled="isSubmitDisabled"
                :class="{
                    'bg-purple-500': !isSubmitDisabled,
                    'bg-yellow-400': isSubmitDisabled
                    }"
                >
                Register
            </button>
        </form>
        <p v-if="emailExistError" class="text-red-500 text-xxs mt-2">
                {{ severSentError }}
        </p>
        <div class="text-center mt-2 text-blue-600 text-xxs font-bold ">
            <router-link to="/login">Click here go to login page</router-link>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthenticationService from '../services/AuthenticationService';
import { useLoginAuthStore } from '../stores/loginAuthStore';


//set the initial status 
const emailError = ref(false);
const passwordError = ref(false);
const confirmPasswordError = ref(false);
const noBlankSubmit = ref(true);
const emailExistError = ref(false);
const severSentError = ref(null);

const route = useRouter();

//validate the form before submit
const isSubmitDisabled = computed(() => {
    return !submitData.email || 
            !submitData.password || 
            !submitData.confirmPassword ||
            emailError.value || 
            passwordError.value || 
            confirmPasswordError.value 
            ;
    
            
})
//form data
const submitData = reactive({
    email: '',
    password: '',
    confirmPassword: ''
})

//validate the user's input data
watch(()=>submitData.email, (newVal) => {
    emailError.value = !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(newVal);  // Basic email regex
});
//validate password
watch(()=>submitData.password, (newVal) => {
    passwordError.value = newVal.length < 6;
});
//validate confirm password
watch(()=>submitData.confirmPassword, (newVal) => {
    confirmPasswordError.value = newVal !== submitData.password;
})

const submitForm = async () => {
    
    //Submit the form data to server via axious post request by register function
    //Return response from server if post request is made success
    const serverResponse = await AuthenticationService.register(submitData);
    if(serverResponse.status === 409){
        emailExistError.value = true;
        severSentError.value = serverResponse.response.data.message;

    }
    else if(serverResponse.status === 200){
        //direct to login page to login with new credentials
        useLoginAuthStore().registeredFlag = true;
        Object.assign(useLoginAuthStore().loginUserInfo,serverResponse.data.registeredInfo);
        route.push({
            name: 'login',
        });
    }
    console.log('create page response =>', serverResponse);
}
</script>