<template>
    <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                color="primary"
                :text="text.text"
                variant="flat"
                size="x-small"
                class="custom-button"
            ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Change Password">
                <v-card-text>
                    <v-form ref="form">
                        <v-text-field
                            label="Current Password"
                            type="password"
                            v-model="currentPassword"
                            :rules="currentPasswordRules"
                            validate-on="blur"
                            required
                        ></v-text-field>
                        <v-text-field
                            label="New Password"
                            type="password"
                            v-model="newPassword"
                            :rules="passwordRules"
                            validate-on="blur"
                            :disabled="fieldIsDisabled"
                            required
                        ></v-text-field>
                        <v-text-field
                            label="Confirm Password"
                            type="password"
                            v-model="confirmPassword"
                            :rules="[confirmPasswordRule]"
                            validate-on="blur"
                            :disabled="fieldIsDisabled"
                            required
                        ></v-text-field>
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer v-if="passwordChangeSuccess" class="text-green-500 text-sm">
                        New Password has been changed successfully!
                    </v-spacer>
                    <v-btn 
                        text="Save" 
                        class="save-button" 
                        @click="submitForm(isActive)"
                    ></v-btn>
                    <v-btn text="Cancel" class="cancel-button" @click="isActive.value = false"></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script setup>
import { defineProps, ref, watch, watchEffect } from 'vue';
import AuthenticationService from '../services/AuthenticationService';
import { useLoginAuthStore } from '../stores/loginAuthStore';

const text = defineProps({
    text: String,
    required: true,
    default: 'Change Password',
});

const form = ref(null);
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const loginUserInformation = useLoginAuthStore();
const fieldIsDisabled = ref(true);
const passwordChangeSuccess = ref(false);
// Watch for changes in `currentPassword` and enable/disable fields accordingly
// watchEffect(() => {
//     fieldIsDisabled.value = currentPassword.value !== loginUserInformation.loginUserInfo.password;
// });

watch(currentPassword, async (newVal) => {
    // backend API to compare password
    const encryptedPassword = await AuthenticationService.comparePassword({
        currentEmail: loginUserInformation.loginUserInfo.email,    
        password: newVal
    });
   // user input password correct
    fieldIsDisabled.value = encryptedPassword.status !== 200;
});


const currentPasswordRules = [
    v => !!v || 'Current password is required',
    v => v === loginUserInformation.loginUserInfo.password || 'Current password is incorrect',
]

const passwordRules = [
    v => !!v || 'Password is required',
    v => v.length >= 6 || 'Password must be at least 6 characters',
    v => v !== loginUserInformation.loginUserInfo.password || 'Password cannot be the same as the current password',
];

const confirmPasswordRule = v =>
    v === newPassword.value || 'Passwords must match';

const submitForm = async (isActive) => {
    const { valid } = await form.value.validate();
    if (valid) {
        passwordChangeSuccess.value = true;
        setTimeout(() => {
            isActive.value = false;
        },3000);
        
        try{
            const response = await AuthenticationService.changePassword({
                password: newPassword.value, 
                currentEmail: loginUserInformation.loginUserInfo.email,
            });
            form.value.reset();
            console.log('Password is changed successfully!');
        }catch(error){
            console.log(error);
        }
        form.value.reset();
    } else {
        console.log('Form is not valid');
    }
};
</script>


<style lang="scss" scoped>
@mixin base{
    text-transform: none;
    color: white;
    font-weight: bold; 
}
    .custom-button {
        text-transform: none;
    }

    .save-button {
        @include base;
        background-color: green;
    }

    .cancel-button {
        @include base;
        background-color: red;
    }
</style>