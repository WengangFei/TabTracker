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
                :min="today"
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
            <v-card-actions>
            <v-spacer></v-spacer>

            <!-- <v-btn 
                variant="flat" 
                color="success"
                @click="submitForm"
                :disabled="preventSubmitEmptyForm"
                >
                Create
                <v-icon icon="mdi-chevron-right" end></v-icon>
            </v-btn> -->
            <CustomizeButton 
                variant="flat" 
                color="success"
                :action="submitForm"
                :disabled="preventSubmitEmptyForm"
                content="Create"
                :error="eventError"
            />
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import AuthenticationService from '../services/AuthenticationService';
import CustomizeButton from './CustomizeButton.vue';

 const formInfo = reactive({
     eventName: '',
     location: '',
     description: '',
     creator: '',
     contact: '',
     date: null,
     agreeTerms: false
 })
// const isEventCreated = ref(false);
const form = ref(null);
const eventError = ref(null);
const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
//submit form
const submitForm = async () => {
    const { valid } = await form.value.validate();
    if (valid) {
         
        const response = await AuthenticationService.createEvent(formInfo);  
        if(response.status === 200){
            console.log('Event created successfully =>',response);
            //clear the form
            formInfo.eventName = null;
            formInfo.location = null;
            formInfo.description = null;
            formInfo.creator = null;
            formInfo.contact = null;
            formInfo.date = null;
            formInfo.agreeTerms = null;
        }
        else{
            console.log('event create failed!');
            console.log('response =>',response);
            eventError.value = response.response.data.message;
        } 
        
        
    }else{
        console.log('Form is not valid');
    }
}
//prevent submit empty form
const preventSubmitEmptyForm = computed(() => {
    return !formInfo.eventName || !formInfo.location || !formInfo.description || !formInfo.creator || !formInfo.contact || !formInfo.date || !formInfo.agreeTerms
})

</script>

<style lang="scss" scoped>

</style>