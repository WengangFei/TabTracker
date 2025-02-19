<template>
       

  <v-hover #default="{ isHovering, props }">
    <div class="
          border 
          border-gray-400 
          rounded-md 
          m-1 
          hover:scale-75
          transition-transform
          duration-300
          text-center
          w-14
          cursor-pointer"
          v-bind="props"
          @click="searchLocation(user.ownerId)"
    >

      <v-avatar size="20" class="card">
        <v-img
        alt="Puppy"
        :src="imagePath"
      
        ></v-img>
      </v-avatar>
      <p class="text-xxs font-bold p-1">{{ user.name }}</p>
 
      <v-card
        width="350"
        v-if="isHovering"
      >
        <v-img
          height="80px"
          :src="imagePath"
        ></v-img>
        <v-card-title>
          Name: {{ user.name }}
        </v-card-title>

        <v-card-subtitle>
          Age: {{ user.age }}
        </v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text>
          Description:{{ user.introduction }}
        </v-card-text>
      </v-card>
     
    </div>
  </v-hover>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import AuthenticationService from '../services/AuthenticationService';



const { user, click } = defineProps({
    user:{
        type: Object,
        required: true
    },
    click: {
        type: String,
        required: false,
    }
});
const emit = defineEmits(['sendOrdinates']);
const imagePath = import.meta.env.VITE_DOMAIN_PATH + user.image;
//set location
const searchLocation = async (id) => {
  if (click === 'singleUserSearch') {

    const response = await AuthenticationService.searchSingleUser({ id });
    // console.log(response.data.singleUser);
    const { lat, lng } = response.data.singleUser;
    emit('sendOrdinates', { lat, lng });
  }
};
//getting single user location according to id;

</script>

<style lang="scss" scoped>
.card{
    // transition: transform 0.3s ease-in-out;
    background-color: none;
    border-radius: 40%;
    margin: 1px 3px;
    cursor:pointer;
    
}
// .name:hover{
//         transform: scale(1.5);
//         transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
//         transform-origin: center;
//     }

.v-card {
    position: absolute;
    transform: translate(0%, 0%);
    z-index: 5;
    top: -100%;
    left: -100%;
    overflow:visible;

}

.v-card-title {
    font-size: 12px;
    font-weight: bold;
}
</style>