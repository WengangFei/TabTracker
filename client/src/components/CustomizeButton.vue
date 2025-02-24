<template>
    <div>
        <v-dialog
        v-model="dialog"
        max-width="400"
        persistent
      >
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps" :variant="variant" :color="color" :disabled="disabled">
            {{ content }}
          </v-btn>
        </template>
  
        <v-card
          :prepend-icon="newIcon"
          :text="text"
          :title="title"
          :color="changeColor"
        >     
          <template v-slot:actions>
            <!-- progress bar -->
            <div class="ml-36" v-if="showCircleBar">
                <v-progress-circular :model-value="circleValue" :rotate="360" :size="100" :width="15" color="teal">
                <template v-slot:default> {{ circleValue }} % </template>
                </v-progress-circular>
            </div>

            <v-spacer></v-spacer>
            <div v-if="!showCircleBar">
                <v-btn @click="dialog = false" color="red">
                Disagree
                </v-btn>
    
                <v-btn @click="showCircleBar = true" color="green">
                Agree
                </v-btn>
            </div>
          </template>
        </v-card>
      </v-dialog>
    </div>
</template>

<script setup>
import  { ref, watch } from 'vue';
import { defineProps } from 'vue';


const circleValue = ref(0);
const dialog = ref(false);
const showCircleBar = ref(false);
const text = ref("New event will be created by click of agree button or disagree button go back to the previous page.");
const title = ref("Create this new event?");
const changeColor = ref('primary');
const newIcon = ref('mdi-chat-question');
const { content, variant, color, action, disabled, error } = defineProps({
    content: {
        type: String,
        required: true
    },
    variant: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    action: {
        type: Function,
        required: true
    },
    disabled: {
        type: Boolean,
        required: true
    },
    error: {
        type: String,
        required: false
    }
});
// progress bar
watch(showCircleBar, () => {
    //submit form
    action();
    const interval = setInterval(() => {
        if(circleValue.value >= 100) {
            if(error){
                text.value = 'Please go back to try again.';
                title.value = error;
                changeColor.value = 'warning'; 
                newIcon.value = 'mdi-alert';
                clearInterval(interval);
                setTimeout(() => {
                    dialog.value = false;
                }, 3000);
            }else{
                text.value = '';
                title.value = 'New event created successfully!';
                changeColor.value = 'success'; 
                newIcon.value = 'mdi-check-bold';
                clearInterval(interval);
                setTimeout(() => {
                    dialog.value = false;
                }, 3000);
            }
            
        }else{ 
            circleValue.value += 20;
        }
    },500);
});
</script>

<style lang="scss" scoped>

</style>