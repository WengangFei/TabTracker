<template>
    <v-form ref="form">
        <v-card
        class="mx-auto"
        max-width="344"
        title="Create an Event"
        >
            <v-container>
            <v-text-field
                v-model="formInfo.eventName"
                color="primary"
                label="Event Name"
                variant="underlined"
                prepend-inner-icon="mdi-rename"
                :rules="[
                    (v) => !!v || v.length >= 3 ||
                    'Name is required and must be at least 3 characters' 
                    ]"
            ></v-text-field>

            <v-text-field
                v-model="formInfo.creator"
                color="primary"
                label="Creator"
                variant="underlined"
                prepend-inner-icon="mdi-account"
                :rules="[
                    (v) => !!v || v.length >= 3 ||
                    'Event name is required and must be at least 3 characters' 
                    ]"
            ></v-text-field>

            <v-text-field
                v-model="formInfo.contact"
                color="primary"
                label="Contact"
                variant="underlined"
                prepend-inner-icon="mdi-phone"
                :rules="[
                    (v) => !!v || v.length >= 3 ||
                    'Contact is required and must be phone number or wechat.' 
                    ]"
            ></v-text-field>

            <v-text-field
                v-model="formInfo.location"
                color="primary"
                label="Location"
                variant="underlined"
                prepend-inner-icon="mdi-map-marker"
            ></v-text-field>
            <v-text-field
                v-model="formInfo.description"
                color="primary"
                label="Description"
                variant="underlined"
                prepend-inner-icon="mdi-text-box-edit"
            ></v-text-field>
            <v-date-input
                v-model="formInfo.date"
                label="Select a date"
                max-width="365"
                :rules="[(v) => !!v || 'Date is required']"
            ></v-date-input>
            <v-checkbox
                v-model="formInfo.agreeTerms"
                color="secondary"
                label="I agree to site terms and conditions"
                :rules="[v => !!v || 'You must agree to continue!']"
            ></v-checkbox>
            
            </v-container>

            <v-divider></v-divider>

            <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn 
                variant="flat" 
                color="success"
                @click="submitForm"
                >
                Create
                <v-icon icon="mdi-chevron-right" end></v-icon>
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import AuthenticationService from '../services/AuthenticationService';

 const formInfo = reactive({
     eventName: '',
     location: '',
     description: '',
     creator: '',
     contact: '',
     date: null,
     agreeTerms: false
 })

 const form = ref(null);

//submit form
const submitForm = async () => {
    const { valid } = await form.value.validate();
    if (valid) {
        try {
            const response = await AuthenticationService.createEvent(formInfo);  
            console.log('response =>',response.data.message);
        } catch (error) {
            console.log(error.message);
        }
    }else{
        console.log('Form is not valid');
    }
}

</script>

<style lang="scss" scoped>

</style>