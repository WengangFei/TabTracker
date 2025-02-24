<template>
    <!-- add new puppy form -->
    <div class="pa-4 text-center">
        <v-dialog
        v-model="dialog"
        max-width="400"
        >
            <template v-slot:activator="{ props: activatorProps }">
                <v-card v-bind="activatorProps" @click="loadProfile(puppy.id)">
                    <!-- Avatar for profile picture -->
                    <v-avatar size="50" class="m-2">
                        <img :src="imageSrc" alt="Puppy">
                    </v-avatar>
                    <div class="bg-lime-200 p-2">
                         <!-- Card Title (Name) -->
                        <v-card-title class="mt-n4">{{ puppy.name }}</v-card-title>

                        <!-- Card Subtitle (Position or Role) -->
                        <v-card-subtitle class="text-center mt-n2">Age: {{ puppy.age }}
                            <div>
                                <v-icon class="me-1" icon="mdi-heart" size="x-small" color="red"></v-icon>
                                <span class="subheading me-2 text-xs">256</span>
                                <span class="me-1">|</span>
                                <v-icon class="me-1" icon="mdi-share-variant" size="x-small" color="blue"></v-icon>
                                <span class="subheading text-xs text-blue-500">45</span>
                            </div>
                            
                        </v-card-subtitle>

                    </div>
                   
                    <!-- Card Text (Short Bio or Description) -->
                    <!-- <v-card-text class="text-center">
                        none
                    </v-card-text> -->

                    <!-- Card Actions (Button or Links) -->
                    <!-- <v-card-actions class="justify-center">
                        <v-btn text color="primary" href="https://github.com/johndoe" target="_blank">View Profile</v-btn>
                    </v-card-actions> -->
                </v-card>

            </template>

            <v-card
                prepend-icon="mdi-dog"
                title="Puppy's Profile"
            >
                <v-form ref="form" class="p-6">
                <v-row dense>
                    <v-col
                    cols="12"
                    sm="6"
                    >
                    <v-text-field
                        v-model="submitFormInfo.name"
                        label="Name*"
                        :rules="[
                            (v) => !!v && v.length >= 3 ||
                            'Name must be at least 3 characters' 
                            ]"
                    ></v-text-field>
                    </v-col>
                    <v-col
                    cols="12"
                    sm="6"
                    >
                    <v-text-field
                        v-model="submitFormInfo.age"
                        label="Age*"
                        :rules="[
                            (v) => !!v && /^\d+$/.test(v) && parseInt(v) > 0 || 'Please enter a valid number greater than 0'
                            ]"
                    ></v-text-field>
                    </v-col>
                    <v-col
                    cols="12"
                    sm="6"
                    >
                    <v-select
                        v-model="submitFormInfo.size"
                        :items="['Small', 'Medium', 'Large']"
                        label="Size"
                    ></v-select>
                    </v-col>
                    <v-col
                    cols="12"
                    sm="6"
                    >
                        <v-autocomplete
                        v-model="submitFormInfo.type"
                        :items="['Labrador Retriever', 'German Shepherd', 'Poodle', 'Dachshund', 'English Bulldog', 'Beagle', 'Rottweiler','German Shorthaired Pointer','Other']"
                        label="Type"
                        auto-select-first
                        ></v-autocomplete>
                    </v-col>
                    <v-col
                    cols="12"
                    sm="12"
                    >
                        <v-textarea
                            v-model="submitFormInfo.introduction"
                            label="User's Introduction"
                            placeholder="Write something about your puppy"
                            :counter="200"
                            :rules="[
                                v => !v || v.split(' ').length <= 200 || 'Limit is 200 words']"
                        ></v-textarea>
                    </v-col>
                    <v-col
                    cols="12"
                    sm="12"
                    >
                        <!-- Image upload field -->
                        <v-file-input
                            v-model="submitFormInfo.image"
                            label="Upload Profile Image"
                            accept="image/* "
                        ></v-file-input>
                    </v-col>
                </v-row>

                <small class="text-caption text-medium-emphasis">
                    *indicates required field
                </small>
                </v-form>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        text="Close"
                        variant="plain"
                        @click="dialog = false"
                    ></v-btn>
                    <v-btn 
                        color="primary"
                        text="Save"
                        variant="tonal"
                        @click=" dialogVisible = true;"
                        :disabled="!checkFormErrors"
                    ></v-btn>
                    <!-- Confirmation Dialog -->
                    <v-dialog v-model="dialogVisible" max-width="400px" >
                        <v-card color="success">
                            <v-card-title class="headline">Confirm Submission</v-card-title>
                            <v-card-text>
                            Are you sure you want to submit the form?
                            </v-card-text>
                            <v-card-actions>
                            <v-btn @click="dialogVisible = false" color="red">Cancel</v-btn>
                            <v-btn @click="submitForm(puppy.id)" color="">Submit</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card-actions>
            </v-card>
        </v-dialog>
  </div>
</template>

<script setup>
import { defineEmits, ref, reactive, computed, defineProps } from 'vue';
import { useLoginAuthStore } from '../stores/loginAuthStore';
import AuthenticationService from '../services/AuthenticationService';


const loginUserInformationStore = useLoginAuthStore();
const puppies = ref([]);
const universalImage = ref('https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg');
const dialog = ref(false);
const dialogVisible = ref(false);
const submitFormInfo = reactive({
    name: '',
    age: '',
    size: '',
    type: '',
    introduction: '',
    image: null
})
//define prop
const { puppy } = defineProps({
    puppy: {
        type: Object,
        required: true
    }
})
//check form validation
const checkFormErrors = computed(() => {

    const nameValid = !!submitFormInfo.name && submitFormInfo.name.length >= 3;
    const ageValid = !!submitFormInfo.age && !isNaN(submitFormInfo.age);
    return nameValid && ageValid;
})
//submit form
const submitForm = async (id) => {
    dialogVisible.value = false;
    dialog.value = false;
    const response = await AuthenticationService.updateSinglePuppyProfile({...submitFormInfo,imageUploadType:'puppies',puppyId:id});
    // console.log('submit form info =>',submitFormInfo);
    // console.log('response =>',response);
    // window.location.reload();
    emit('reloadProfile');
}

// fetch user's puppies information
const loadProfile = async (id) => {
    const response = await AuthenticationService.retrieveSinglePuppiesProfileInformation(id);
    console.log('single puppy profile response =>',response);
    if(response.status === 200){
        submitFormInfo.name = response.data.singlePuppyProfileInfo.name;
        submitFormInfo.age = response.data.singlePuppyProfileInfo.age;
        submitFormInfo.size = response.data.singlePuppyProfileInfo.size;
        submitFormInfo.type = response.data.singlePuppyProfileInfo.type;
        submitFormInfo.introduction = response.data.singlePuppyProfileInfo.introduction;
    }
};
//reload the profile page after single puppy profile updated
const emit = defineEmits();
//updating image src
const imageSrc = computed(() => {
    return puppy.image ? import.meta.env.VITE_DOMAIN_PATH + puppy.image : universalImage.value
})

</script>

<style lang="scss" scoped>

</style>