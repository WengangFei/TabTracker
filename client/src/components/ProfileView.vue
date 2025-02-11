<template>
   <div class="w-fit m-auto">
    <h1 class="title">Please fill out Puppy's Information</h1>
    <v-container class="shadow-md shadow-purple-900 rounded-md m-2 p-1">
        <v-row justify="center">
        <v-col
        cols="12"    
        lg="12"       
        md="10"      
        sm="12"     
        >
            <v-card-text>
            <v-form ref="form">
                <v-text-field
                ref="Name"
                v-model="submitFormInfo.name"
                :rules="[
                (v) => !v || v.length >= 3 ||
                'Name must be at least 3 characters' 
                ]"
                label="Puppy's Name"
                placeholder="Puppy"
                ></v-text-field>
                <v-text-field
                    ref="Age"
                    v-model="submitFormInfo.age"
                    :rules="[
                        (v) => !v || /^\d+$/.test(v) && parseInt(v) > 0 || 'Please enter a valid number greater than 0'
                    ]"
                    label="Age"
                    placeholder="age"
                >
                </v-text-field>
                <v-text-field
                    ref="Location"
                    v-model="submitFormInfo.location"
                    :rules="[
                        (v) => !v || v.length >= 3 || 'Location must be at least 3 characters'
                    ]"
                    label="Location"
                    placeholder="123 Main St, Anytown, USA"
                ></v-text-field>
                <v-textarea
                    v-model="submitFormInfo.introduction"
                    label="Puppy's Introduction"
                    placeholder="Write something about your puppy"
                    :counter="200"
                    :rules="[
                        v => !v || v.split(' ').length <= 200 || 'Limit is 200 words']"
                ></v-textarea>
                <!-- Image upload field -->
                <v-file-input
                    v-model="submitFormInfo.image"
                    label="Upload Puppy's Image"
                    accept="image/* "
                    :error-messages="imageErrorMessages"
                ></v-file-input>
            </v-form>    
            </v-card-text>
        
            <v-divider class="mt-12"></v-divider>
            <v-card-actions>
                <v-btn variant="text">
                Cancel
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                color="primary"
                variant="text"
                @click="submitForm"
                >
                Submit
                </v-btn>
            </v-card-actions>
            
        </v-col>
        </v-row>
  </v-container>
   </div>
    
  </template>

<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import AuthenticationService from '../services/AuthenticationService';
import { useLoginAuthStore } from '../stores/loginAuthStore';



const loginAuthStore = useLoginAuthStore();
const submitFormInfo = reactive({
    name: '',
    age: '',
    location: '',
    introduction: '',
    image: null
});
const imageErrorMessages = ref([]);
const form = ref(null);
//Fetching data from DB
onBeforeMount(
    async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_DOMAIN_URL}${import.meta.env.VITE_SERVER_PORT}/api/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            })    
            const data = await response.json();
            // Update profile form
            if(data.userProfileInformation){
                // Update submitFormInfo with the fetched data
                submitFormInfo.name = data.userProfileInformation.name;
                submitFormInfo.age = data.userProfileInformation.age;
                submitFormInfo.location = data.userProfileInformation.location;
                submitFormInfo.introduction = data.userProfileInformation.introduction;
            }
        } catch (error) {
            console.log('error from profile page,Can not get user profile information from DB.');
            console.log(error);
        }
    }
)


const submitForm = async () => {

    const { valid } = await form.value.validate();

    if (valid) {
        const response = await AuthenticationService.profile(submitFormInfo);
        console.log('response =>',response);
        //update the user store profile information
        loginAuthStore.updateUserProfileInfo(response.data.puppyProfile);
        
    }else{
        console.log('Form is not valid');
    }
};  

</script>

<style lang="scss" scoped>
$primary-font: dejaVu sans-serif;
    .title {
        color:blueviolet;
        font-family: $primary-font;
        text-align: center;
    }
</style>