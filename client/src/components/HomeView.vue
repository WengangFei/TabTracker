<template>
    <div>
        Home Page
        <h1 class="text-2xl">Thanks for registering this App.</h1>
    </div>
</template>

<script setup>
import { useLoginAuthStore } from '../stores/loginAuthStore';
const loginAuthStore = useLoginAuthStore();

</script>

<style lang="scss" scoped>

</style>