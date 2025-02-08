<template>
<div>
    <h1>Nearby Users</h1>
    <p v-if="loading">Loading...</p>
    <p v-if="error" style="color: red;">{{ error }}</p>
    <ul v-if="nearbyUsers.length > 0">
        <li v-for="user in nearbyUsers" :key="user.id">
        {{ user.name }} - {{ user.distance }} km away
        </li>
    </ul>
    <p>User Location: {{ actualLocation || 'Unknown' }}</p>
    <p>User Area: {{ actualAddress || 'Unknown' }}</p>
</div>
</template>

<script setup>

import { ref, onMounted, watch } from 'vue';
import axios from "axios";
import AuthenticationService from '../services/AuthenticationService';

const nearbyUsers = ref([]);
const loading = ref(false);
const error = ref(null);

const latitude = ref(null);
const longitude = ref(null);
const actualLocation = ref(null);
const actualAddress = ref(null);
// Get the current location
onMounted(async () => {
    new Promise((res,rej)=>{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(res,rej);
        }
        else{
            console.log('Geolocation is not supported by this browser.');
        }
    }).then(response=>{
        latitude.value = response.coords.latitude;
        longitude.value = response.coords.longitude;
    })
    .catch(error=>{
        console.log(error);
    })
})


watch([latitude, longitude], async () => {
    
    const apiKey = import.meta.env.VITE_OPEN_CAGE_API_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude.value}+${longitude.value}&key=${apiKey}`; 
    try{
        //getting location info from OpenCage api
       const response = await axios.get(url);
       const results = response.data.results;
       if(results.length > 0){
            actualLocation.value = results[0].formatted;
            const components = results[0].components;
            // Extract city or similar locality
            const street = components.road || components.footway || components.lane || 'Unknown';
            const district = components.district || components.suburb || components.neighbourhood || 'Unknown';
            const city = components.city || components.town || components.village || 'Unknown';
            const province = components.state || components.province || components.county || 'Unknown';
            const country = components.country || 'Unknown';
            const postalCode = components.postcode || components.zipcode || 'Unknown';
            actualAddress.value = `${street}-${district}-${city}-${province}-${country}-${postalCode}`;
    
            const writeResponse = await AuthenticationService.writeLocation({
                actualAddress: actualAddress.value,
            })
            if(writeResponse.status !== 200){
                console.log('Location is written failed!');
            }else{
                console.log('Location is written successfully!');
            }
       }else{
        console.error("No address found for these coordinates.");
       }
    }catch(error){
        console.log(error);
    }
})

// accuracy: 3004207.876412789
// latitude: 45.8439491
// longitude: -119.1091762

</script>

<style lang="scss" scoped>

</style>