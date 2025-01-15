<script setup>
import LogoutPage from './components/LogoutPage.vue';
import router from './router';
import { useLoginAuthStore } from './stores/loginAuthStore';

const loginAuthStore = useLoginAuthStore();
</script>

<template>
  <div>
    <nav class="flex space-x-4">
      <LogoutPage v-if="loginAuthStore.isAuthenticated"></LogoutPage>
      <router-link to="/home">Home</router-link>
      <router-link to="/about">About</router-link> 
      <router-link to="/setting" v-if="loginAuthStore.isAuthenticated">
        Setting
      </router-link>
    </nav>
    <div class="center">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @mixin center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .nav {
    @include center;
    height: 100vh;
  }
</style>


