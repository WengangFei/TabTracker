<template>
    <div class="rounded-md m-2 p-6 shadow-md">
        <p class="text-center">Register Page</p>
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
                class="btn mx-auto block mt-3" 
                type="submit" 
                :disabled="isSubmitDisabled"
                :class="{'bg-purple-500': !isSubmitDisabled }"
                >
                Register
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthenticationService from '../services/AuthenticationService';

//set the initial status 
const emailError = ref(false);
const passwordError = ref(false);
const confirmPasswordError = ref(false);
const noBlankSubmit = ref(true);

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
    route.push({
        name: 'home',
    });
    //Submit the form data to server via axious post request by register function
    //Return response from server if post request is made success
    const response = await AuthenticationService.register(submitData);
    console.log('response =>', response);
}
</script>