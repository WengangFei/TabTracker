<template>
    <div class="w-fit m-auto">
     <h1 class="title">Please update Profile Information</h1>
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
                 label="User's Name"
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
                    v-model="submitFormInfo.contact"
                    color="primary"
                    label="Contact"
                    :rules="[
                        (v) => !v || v.length >= 3 ||
                        'Contact is required,phone number or other social media.' 
                        ]"
                ></v-text-field>
                <v-text-field
                    label="Enter current Password for updating password"
                    type="password"
                    v-model="currentPassword"
                    :rules="currentPasswordRules"
                    validate-on="blur"
                ></v-text-field>
                <v-text-field
                    label="New Password"
                    type="password"
                    v-model="submitFormInfo.newPassword"
                    :rules="passwordRules"
                    validate-on="blur"
                    :disabled="fieldIsDisabled"
                ></v-text-field>
                <v-text-field
                    label="Confirm Password"
                    type="password"
                    v-model="submitFormInfo.confirmPassword"
                    :rules="[confirmPasswordRule]"
                    validate-on="blur"
                    :disabled="fieldIsDisabled"
                ></v-text-field>
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
                     label="User's Introduction"
                     placeholder="Write something about your puppy"
                     :counter="200"
                     :rules="[
                         v => !v || v.split(' ').length <= 200 || 'Limit is 200 words']"
                 ></v-textarea>
                 <!-- Image upload field -->
                 <v-file-input
                     v-model="submitFormInfo.image"
                     label="Upload Profile Image"
                     accept="image/* "
                     :error-messages="imageErrorMessages"
                 ></v-file-input>
            </v-form>    
        </v-card-text>
            <v-card-actions>
                <v-btn variant="text">
                Cancel
                </v-btn>
                <v-spacer></v-spacer>
                <SubmitCheckButton 
                    :action="submitForm" 
                    :isActive="isFormEmpty"
                    :fun="checkFormErrors"
                    :formUpdated="isFormUpdated"
                    />
            </v-card-actions>
         </v-col>
      </v-row>
   </v-container>
  </div>
     
</template>
 
 <script setup>
 import { onBeforeMount, reactive, ref, watch } from 'vue';
 import AuthenticationService from '../services/AuthenticationService';
 import { useLoginAuthStore } from '../stores/loginAuthStore';
 import SubmitCheckButton from './SubmitCheckButton.vue';
 
 
 
 

 const loginAuthStore = useLoginAuthStore();
 //validate the current password for new password updating 
 const currentPassword = ref('');
 const passwordValid = ref(false);
 const fieldIsDisabled = ref(true);
 const isFormEmpty = ref(true);
 const isFormUpdated = ref(false);
 const loginUserInformation = useLoginAuthStore();
 const submitFormInfo = reactive({
     name: '',
     age: '',
     location: '',
     introduction: '',
     contact: '',
     newPassword: '',
     confirmPassword: '',
     image: null
 });
 const imageErrorMessages = ref([]);
 const form = ref(null);
 //Fetching data from DB
 onBeforeMount(
     async () => {
         try {
             const response = await AuthenticationService.retrieveUserProfileInformation();  
            //  console.log('get user profile info from DB=>',response.data.userProfileInformation);
             // Update profile form
             if(response.data.userProfileInformation){
                 // Update submitFormInfo with the fetched data
                 submitFormInfo.name = response.data.userProfileInformation.name;
                 submitFormInfo.age = response.data.userProfileInformation.age;
                 submitFormInfo.location = response.data.userProfileInformation.location;
                 submitFormInfo.introduction = response.data.userProfileInformation.introduction;
                 submitFormInfo.contact = response.data.userProfileInformation.contact;

             }
         } catch (error) {
             console.log('error from profile page,Can not get user profile information from DB.');
             console.log(error);
         }
     }
 )
 //checking password
 watch(currentPassword, async (newVal) => {
    // backend API to compare password
    const encryptedPassword = await AuthenticationService.comparePassword({
        currentEmail: loginUserInformation.loginUserInfo.email,    
        password: newVal
    });
    if(encryptedPassword.status === 200){
        passwordValid.value = true;
    }
    console.log(encryptedPassword);
   // user input password correct
    fieldIsDisabled.value = encryptedPassword.status !== 200;
});


const currentPasswordRules = [
    v => !v || (v && passwordValid.value) || 'Current password is incorrect',
]

const passwordRules = [
    v => !v || (v.length >= 6) || 'Password must be at least 6 characters'
];

const confirmPasswordRule = v =>
    v === submitFormInfo.newPassword || 'Passwords must match';

//disable submit button
watch(submitFormInfo, async() => {
    isFormEmpty.value = !Object.values(submitFormInfo).some(value => value !== '' && value !== null);
});
//check form validation
const checkFormErrors = async () => {
    const { valid } = await form.value.validate();
    if (valid) return valid;
    return false;
}
 const submitForm = async () => {
    console.log('submit form info =>',submitFormInfo);
    const response = await AuthenticationService.writeUserProfile(submitFormInfo);
    console.log('response =>',response);
    if(response.status === 200){
        isFormUpdated.value = true;
    }
    //update the user store profile information
    loginAuthStore.updateUserProfileInfo(response.data.wroteUserProfileIntoDB);
    console.log('update user profile info =>',loginAuthStore.userProfileInfo);
    
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