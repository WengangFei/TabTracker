<script setup>
import { watch, ref} from 'vue';
import LogoutPage from './components/LogoutPage.vue';
import router from './router';
import AuthenticationService from './services/AuthenticationService';
import { useLoginAuthStore } from './stores/loginAuthStore';





const loginAuthStore = useLoginAuthStore();
//profile update flag
const profileUpdateFlag = ref(false);
//image domain prefix
const imageDomainPrefix = import.meta.env.VITE_DOMAIN_PATH;
const universalImage = 'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg';
//Retrieve user profile information
watch(()=>loginAuthStore.isAuthenticated,

  async () => {
      try{
        const response = 
        await fetch(`${import.meta.env.VITE_DOMAIN_URL}${import.meta.env.VITE_SERVER_PORT}/api/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })    
        const data = await response.json();
        // Update properties of userProfileInfo directly
        loginAuthStore.updateUserProfileInfo(data.userProfileInformation);
        //updating profile image
        loginAuthStore.userProfileInfo.image = loginAuthStore.userProfileInfo.image;
      }
      catch(error){
        console.log('Can not get user profile information from DB.');
        console.log(error);
      }
  }
);
//format the data to be displayed in profile page
const formatDate = (isoString) =>{
    const date = new Date(isoString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based index)
    const day = String(date.getDate()).padStart(2, '0'); // Get day
    const year = date.getFullYear(); // Get year

    return `${month}-${day}-${year}`;
}
//online status
const onlineStatus = loginAuthStore.isAuthenticated ? 'Online' : 'Offline';

//watch database profile change
watch(() => loginAuthStore.userProfileInfo, () => {
  console.log('user profile info changed =>',loginAuthStore.userProfileInfo);
  profileUpdateFlag.value = profileUpdateFlag.value ? false : true;
},{ deep: true });// deep watch entire loginAuthStore.userProfileInfo object when profile updated
// console.log('login user info =>',loginAuthStore.loginUserInfo);
</script>

<template>
  <v-app>
    <v-card>
      <v-layout>
        <v-navigation-drawer
          expand-on-hover
          rail
          permanent
          class="nav-drawer"
        >
          <v-list v-if="loginAuthStore.isAuthenticated">
            <v-list-item>
              <v-avatar size="45" class="mb-2">
                <img :src="loginAuthStore.userProfileInfo.image ?
                  `${imageDomainPrefix}${loginAuthStore.userProfileInfo.image}` :
                  universalImage
                    " alt="Dog" />
              </v-avatar>
              <v-list-item-title>
                {{ loginAuthStore.userProfileInfo.name || 'Puppy' }}
                <span :class="{ status: onlineStatus === 'Online' }">
                {{ onlineStatus }}
                </span>
                </v-list-item-title>
              <v-list-item-subtitle class="email">
                {{ loginAuthStore.loginUserInfo.email || 'Email' }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="online">
                Registered on:{{ formatDate(loginAuthStore.loginUserInfo.createdAt) || 'Registered date' }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list density="compact" nav>
            <v-list-item 
              prepend-icon="mdi-home" 
              title="Home" 
              value="home"
              to="/home"
            ></v-list-item>
            <v-list-item 
              prepend-icon="mdi-account" 
              title="Profile" 
              value="profile"
              to="/user_profile"
              v-if="loginAuthStore.isAuthenticated"
            ></v-list-item>
            <v-list-item 
              prepend-icon="mdi-dog" 
              title="Puppies" 
              value="puppies"
              to="/puppies"
              v-if="loginAuthStore.isAuthenticated"
            ></v-list-item>
            <v-list-item 
              prepend-icon="mdi-cog" 
              title="Setting" 
              value="settings"
              to="/setting"
              v-if="loginAuthStore.isAuthenticated"></v-list-item>
            <v-list-item 
              prepend-icon="mdi-magnify-scan" 
              title="Search" 
              value="search"
              to="/search"
              v-if="loginAuthStore.isAuthenticated"></v-list-item>
            <v-list-item 
              prepend-icon="mdi-calendar-edit" 
              title="Create_Events" 
              value="create_events"
              to="/create_events"
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
          class=" min-h-screen 
                  bg-[url(/src/assets/dogPark.png)] 
                  bg-center"  
          >
            <div class="bg-yellow-200 fixed w-full h-20 top-0 py-4 px-12">
              Header
            </div>
            <div class="flex space-x-2 mt-20 p-4 justify-center" >
              <div v-if="loginAuthStore.isAuthenticated" class="bg-red-200 p-4 w-1/8"></div>
              <div class="bg-green-200 p-4 w-full">
                <router-view v-slot="{ Component }">
                  <keep-alive>
                    <component :is="Component" /></keep-alive>
                </router-view>
              </div>
              <div v-if="loginAuthStore.isAuthenticated" class="bg-yellow-200 p-4 w-1/8"></div>
            </div>
        </v-main>
      </v-layout>
    </v-card>
</v-app>
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
  background-color: black;
  height:fit-content;
  border-radius: 5px;
  padding: 1px 2px;
  margin-top: 10px;
}

.nav-drawer {
  min-width: 80px !important;
}

.status {
  color: green;
  font-size: x-small;
  font-weight: bold;
}

.email {
  font-size: x-small;
  font-weight: bold;
  margin-top: 5px;
}
.online {
  font-size: x-small;
  font-weight: bold;
  margin-top : 5px;
}
</style>


