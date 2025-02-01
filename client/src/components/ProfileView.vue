<template>
   <div>
    <h1 class="title">Please fille out Puppy's Information</h1>
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
                :error-messages="errorMessages"
                :rules="[() => !!submitFormInfo.name || 'This field is required']"
                label="Puppy's Name"
                placeholder="John Doe"
                required
                ></v-text-field>
                <v-text-field
                    ref="Age"
                    v-model="submitFormInfo.age"
                    :rules="[
                        () => !!submitFormInfo.age || 'This field is required',
                        (v) => /^\d+$/.test(v) || 'Please enter a valid number'
                    ]"
                    label="Age"
                    placeholder="age"
                    required
                >
                </v-text-field>
                <v-text-field
                    ref="Location"
                    v-model="submitFormInfo.location"
                    :rules="[() => !!submitFormInfo.location || 'This field is required']"
                    label="Location"
                    placeholder="123 Main St, Anytown, USA"
                    required
                ></v-text-field>
                <v-textarea
                    v-model="submitFormInfo.introduction"
                    label="Puppy's Introduction"
                    placeholder="Write something about your puppy"
                    :counter="200"
                    :rules="[value => value.split(' ').length <= 200 || 'Limit is 200 words']"
                    required
                ></v-textarea>
                <!-- Image upload field -->
                <v-file-input
                    v-model="submitFormInfo.image"
                    label="Upload Puppy's Image"
                    accept="image/*"
                    :error-messages="imageErrorMessages"
                    required
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
import { reactive, ref } from 'vue';
import AuthenticationService from '../services/AuthenticationService';

const submitFormInfo = reactive({
    name: '',
    age: '',
    location: '',
    introduction: '',
    image: null
})
const errorMessages = ref([]);
const imageErrorMessages = ref([]);
const form = ref(null);

const submitForm = async () => {
    const { valid } = await form.value.validate();
    if (valid) {
        console.log('profile is sent to back =>',submitFormInfo);
        const response = await AuthenticationService.profile(submitFormInfo);
    
      
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