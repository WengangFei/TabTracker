<template>
    <!-- add new puppy form -->
    <div class="pa-4 text-center">
        <v-dialog
        v-model="dialog"
        max-width="500"
        >
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn 
                    color="secondary" 
                    :size="'large'"
                    class="text-none font-weight-regular"
                    variant="tonal"
                    text=""
                    v-bind="activatorProps"
                    >
                    <v-icon left>mdi-plus-box</v-icon> 
                        <span class="mx-1">Add a Puppy</span>
                    <v-icon right>mdi-dog</v-icon>
                    <span class="text-red-500 font-bold ml-1">
                        {{ puppies.length }}
                    </span>
                </v-btn>
            </template>

            <v-card
                prepend-icon="mdi-dog"
                title="Add Profile"
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
                            <v-btn @click="submitForm" color="">Submit</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <div class="place-items-center mt-12">
            <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-6/12"  >
                <SinglePuppyProfile 
                    v-for="puppy in puppies"
                    :key="puppy.id"
                    :puppy = puppy
                    @reloadProfile="reloadProfilePage"
                />
            </div>
        </div>
        
        
  </div>
</template>

<script setup>
import { onBeforeMount, ref, reactive, computed, watch } from 'vue';
import { useLoginAuthStore } from '../stores/loginAuthStore';
import AuthenticationService from '../services/AuthenticationService';
import SinglePuppyProfile from './SinglePuppyProfile.vue';


const loginUserInformationStore = useLoginAuthStore();
const puppies = ref([]);
const dialog = ref(false);
const isNewProfileCreated = ref(false);
const dialogVisible = ref(false);
const submitFormInfo = reactive({
    name: '',
    age: '',
    size: '',
    type: '',
    introduction: '',
    image: null
})
//check form validation
const checkFormErrors = computed(() => {

    const nameValid = !!submitFormInfo.name && submitFormInfo.name.length >= 3;
    const ageValid = !!submitFormInfo.age && !isNaN(submitFormInfo.age);
    return nameValid && ageValid;
})
//submit form
const submitForm = async () => {
    dialogVisible.value = false;
    dialog.value = false;
    const response = await AuthenticationService.createPuppiesProfile({...submitFormInfo,imageUploadType:'puppies'});
    console.log('submit form info =>',submitFormInfo);
    if(response.status === 200){
        console.log('puppy profile created successfully!');
        isNewProfileCreated.value = isNewProfileCreated.value ? false : true;
        //clear the form
        submitFormInfo.name = '';
        submitFormInfo.age = '';
        submitFormInfo.size = '';
        submitFormInfo.type = '';
        submitFormInfo.introduction = '';
        console.log('response =>',response);
    }else{
        console.log('puppy profile created failed!');
    }
}
// console.log('login user info =>',loginUserInformationStore.loginUserInfo);
//fetch user's puppies information
onBeforeMount(
    async () => {
        //fetch user's puppies information
        const response = await AuthenticationService.retrieveUserPuppiesProfileInformation();
        console.log('response for puppies amount =>',response);
        puppies.value = response.data.puppiesProfileInformation;
    }
);
//update the profile page after a new puppy added
watch(isNewProfileCreated,async ()=>{
    console.log('new profile page updated!')
    //update profile page after new puppy added
    const response = await AuthenticationService.retrieveUserPuppiesProfileInformation();
    puppies.value = response.data.puppiesProfileInformation;
});
//reload the profile page after single puppy profile updated
const reloadProfilePage = () =>{
    isNewProfileCreated.value = isNewProfileCreated.value ? false : true;
}
</script>

<style lang="scss" scoped>

</style>