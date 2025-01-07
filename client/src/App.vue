<script setup>

</script>

<template>
  <div>
    <nav>
      <router-link to="/login">LogIn</router-link> |
      <router-link to="/register">Register</router-link> |
      <router-link to="/home">Home</router-link> | <router-link to="/about">About</router-link> 
      <div class="flex items-center justify-center h-screen">
        <router-view></router-view>
      </div>
      
    </nav>
  </div>
</template>


