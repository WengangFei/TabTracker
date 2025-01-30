<script setup>
import LogoutPage from './components/LogoutPage.vue';
import router from './router';
import AuthenticationService from './services/AuthenticationService';
import { useLoginAuthStore } from './stores/loginAuthStore';
import '@mdi/font/css/materialdesignicons.css';



const loginAuthStore = useLoginAuthStore();
async function homeMessageFromServer() {
  const result = await AuthenticationService.home();
  console.log('backend sent =>',result.data.message);
}


</script>

<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        expand-on-hover
        rail
        permanent
        class="nav-drawer"
      >
        <v-list>
          <v-list-item>
            <v-avatar size="56">
              <img src="https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg" alt="Dog" />
            </v-avatar>
              <v-list-item-title>Sandra Adams</v-list-item-title>
              <v-list-item-subtitle>sandra_a88@gmail.com</v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item 
            prepend-icon="mdi-home" 
            title="Home" 
            value="myfiles"
            to="/home"
            @click="homeMessageFromServer"
          ></v-list-item>
          <v-list-item 
            prepend-icon="mdi-cog" 
            title="Setting" 
            value="settings"
            to="/setting"
            v-if="loginAuthStore.isAuthenticated"></v-list-item>
          <v-list-item 
            prepend-icon="mdi-information" 
            title="About" 
            value="about"
            to="/about"></v-list-item>
          <v-list-item
            prepend-icon="mdi-logout-variant" 
            title="" 
            value="logout"
            v-if="loginAuthStore.isAuthenticated"
            >
              <LogoutPage />
            </v-list-item>
             
        </v-list>
      </v-navigation-drawer>

      <v-main 
        class="router-view-container 
                bg-[url(/src/assets/dogPark.png)] 
                bg-center"
        >
        <router-view></router-view>
      </v-main>
    </v-layout>
  </v-card>
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
  color: white;
  background-color: bLACK;
  height:fit-content;
  border-radius: 5px;
  padding: 1px 2px;
  margin-top: 10px;
}

.nav-drawer {
  min-width: 80px !important;
}

.router-view-container {
  display: flex;
  justify-content: center; /* Centers content horizontally */
  align-items: center; /* Centers content vertically */
  min-height: 100vh; /* Ensures the container takes up at least the full viewport height */
}
</style>


