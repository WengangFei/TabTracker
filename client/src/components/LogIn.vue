<template>
    <div>
        Login Page <br />
        <button class="btn" @click="NavigateToHome">Go Home</button><br />
        <button class="btn" @click="NavigateToUser">Check User</button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const NavigateToHome = () => {
    router.push('/home').
    catch(() => { console.log('error navigate to home page.'); });
}

const NavigateToUser = () => {
    router.push({ name: 'user', params: { id: 100 }, query: { name: 'Fei' } }).catch(() => { console.log('error navigate to user page.'); });
}

</script>

<style lang="scss" scoped>

</style>