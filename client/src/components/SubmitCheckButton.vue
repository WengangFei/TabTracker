<template>
    <div class="text-center pa-4">
      <v-dialog
        v-model="dialog"
        max-width="400"
        persistent
      >
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn 
            v-bind="activatorProps" 
            color="secondary"
            class="ml-15"
            :disabled="isActive"
            @click="checkValidation"
            >
            Submit
          </v-btn>
        </template>
  
        <v-card
          prepend-icon="mdi-alert"
          :text="text"
          :title="title"
          :color="color"
        >
          <template v-slot:actions>
            <v-spacer></v-spacer>
  
            <v-btn v-if="!errors" @click="dialog = false">
              {{ errors ? 'Back' : 'Disagree' }}
            </v-btn>
  
            <v-btn v-if="!errors" @click="handleSubmit" :disabled="errors" color="warning">
              Agree
            </v-btn>
            <v-btn v-if="errors" @click="goBackToProfilePage(), dialog = false">Back</v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue';


const dialog = ref(false);
const errors = ref(false);
const { action, isActive, fun, formUpdated } = defineProps({
    action:{
        type: Function,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    fun: {
        type: Function,
        required: true
    },
    formUpdated: {
        type: Boolean,
        required: true
    }
});

//go back to profile page
const goBackToProfilePage = () => {
    window.location.reload();
}
const text = ref('All new information looks good, click button to update.');
const title = ref('Your profile is about to be updated.');
const color = ref('success');
//form updated successfully
watch(() =>formUpdated, () => {
    if(formUpdated){
        text.value = '';
        title.value = 'Your profile has been updated.';
        color.value = 'success';
        
    }
});
//check form validation
const checkValidation = async () => {
    const isFormValid = await fun();
    // console.log('fun =>',isFormValid);
    if(!isFormValid){
        text.value = 'Please fix all error fields.';
        title.value = 'You got errors!';
        color.value= 'warning';
        errors.value = true;
    }
}
const handleSubmit = () => {
    action()
    window.location.reload();
    errors.value = true;
}

</script>

<style lang="scss" scoped>

</style>

