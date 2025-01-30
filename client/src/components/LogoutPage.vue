<template>
    <div>
        <!-- Logout Button -->
        <v-btn
        size="x-small"
        outlined="false"
        class="custom-button"
        @click="dialog = true">
        Logout
        </v-btn>

        <!-- Confirmation Dialog -->
        <v-dialog v-model="dialog" max-width="400px">
            <v-card>
                <v-card-title class="text-h6">
                Confirm Logout
                </v-card-title>
                <v-card-text>
                Are you sure you want to logout?
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="dialog = false">
                    Cancel
                </v-btn>
                <v-btn color="red" dark @click="handleLogout">
                    Logout
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useLoginAuthStore } from '../stores/loginAuthStore';
import { useRouter } from 'vue-router';

const dialog = ref(false);
const loginAuthStore = useLoginAuthStore();
const router = useRouter();

const handleLogout = () => {
  loginAuthStore.logOut();
  dialog.value = false;
  router.push({
    name: 'login',
  });
}
</script>

<style lang="scss" scoped>
$primary-color: #3f51b5;
@mixin baseColor{
    font-size: x-small;
    font-weight: bold;
    text-transform: none;
    color: white;
};

@mixin buttonColor($text) {
    @include baseColor;
    background-color: $primary-color;

    @if $text == 'Logout' {
        @include baseColor;
        color: white;
    }  
};

.custom-button {
    @include buttonColor('Logout');
   border: none !important;
   background-color: red;
}
</style>
  