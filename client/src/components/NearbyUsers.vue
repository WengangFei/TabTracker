<template>
    <v-avatar size="20" class="card">
      <v-img
        alt="Puppy"
        :src="imagePath"
      ></v-img>
    </v-avatar>
  </template>

<script setup>
import { defineProps } from 'vue';



const prop = defineProps({
    user:{
        type: Object,
        required: true
    }
})
const imagePath = import.meta.env.VITE_DOMAIN_PATH + prop.user.image;
</script>

<style lang="scss" scoped>
.card{
    transition: transform 0.3s ease-in-out;
    background-color: none;
    border-radius: 40%;
    margin: 1px 3px;
    cursor:pointer;
    &:hover{
        transform: scale(1.5);
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        transform-origin: center;
    }
}

</style>