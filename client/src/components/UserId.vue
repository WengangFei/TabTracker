<template>
    <div>
        User id : {{ route.params.id }} <br />
        User name : {{ route.query.name }}<br />
  
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();


</script>

<style lang="scss" scoped>
    
</style>