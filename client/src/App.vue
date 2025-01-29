<script setup>
import LogoutPage from './components/LogoutPage.vue';
import router from './router';
import { useLoginAuthStore } from './stores/loginAuthStore';

const loginAuthStore = useLoginAuthStore();
</script>

<template>
  <div class="bg-[url(/src/assets/dogPark.png)] bg-center">
    <nav class="flex space-x-4">
      <LogoutPage v-if="loginAuthStore.isAuthenticated"></LogoutPage>
      <router-link to="/home" active-class="active">Home</router-link>
      <router-link to="/about" active-class="active">About</router-link> 
      <router-link to="/setting" v-if="loginAuthStore.isAuthenticated" active-class="active">
        Setting
      </router-link>
    </nav>
    <div class="center">
      <!-- <v-app>
      
        <main>
          <v-container fluid>
            <router-view></router-view>
          </v-container>
        </main>
      </v-app> -->
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

  .active {
  font-weight: bold;
  color: blue;
}
</style>


