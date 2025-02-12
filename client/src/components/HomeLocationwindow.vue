<template>
    <!-- homepage spinner taking 1/5 whole page width -->
    <v-container> 
        <v-progress-circular
            v-if="loading"
            :size="20"
            :width="5"
            indeterminate
        >
            
            <template #default>
                <p class="spinner-text">Loading...</p>
            </template>
        </v-progress-circular>
        
        <div v-else>
            <div>
                <p class="text-sm font-bold">You location: </p>
                <span class="text-xxs">
                    {{ actualLocation || 'Unknown' }}
                </span>
            </div>
            
            <div class="flex">
                <p class="text-sm font-bold responsive-label">Nearby Puppies: </p>
                <select v-model="selectedValue" class="border border-gray-400 rounded-md m-1 px-2 text-xxs ml-4">
                    <option v-for="option in items" :key="option.lab" :value="option.value">
                        {{ option.label }}
                    </option>
                </select>
                <span></span>
                <!-- <p>
                <span class="text-red-600 text-md font-bold px-2">
                    {{ nearbyUsers.length }}
                </span>
                <v-icon color="blue" size="x-small">mdi-dog</v-icon>
                </p> -->
            </div>
            <div class="flex ">
                <nearby-users v-for="user in nearbyUsers" :key="user.id" :user="user"/>
            </div>
        </div>
    </v-container>
    <div></div>

</template>

<script setup>

import { ref, onMounted, watch, reactive } from 'vue';
import axios from "axios";
import AuthenticationService from '../services/AuthenticationService';
import NearbyUsers from './NearbyUsers.vue';
import { useLoginAuthStore } from '../stores/loginAuthStore';



const nearbyUsers = ref([]);
const loading = ref(true);
const error = ref(null);

const latitude = ref(null);
const longitude = ref(null);
const actualLocation = ref(null);
const actualAddress = ref(null);
const lat = ref(null);
const lng = ref(null);
const selectedValue = ref(1);

const items = [
  { value: 1, label: '1km' },
  { value: 5, label: '5km' },
  { value: 10, label: '10km' },
  { value: 20, label: '20km' }
];
// Get the current location
onMounted(() => {
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


watch([latitude, longitude, selectedValue], async () => {
    //api key from OpenCage
    const apiKey = import.meta.env.VITE_OPEN_CAGE_API_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude.value}+${longitude.value}&key=${apiKey}`; 
    try{
        //getting location info from OpenCage api
       const response = await axios.get(url);
       const results = response.data.results;
    //    console.log('results =>',results[0]);
       if(results.length > 0){
            loading.value = false;
            actualLocation.value = results[0].formatted;
            const components = results[0].components;
            const { lat:newLat, lng:newLng } = results[0].geometry;
            lat.value = newLat;
            lng.value = newLng;
            // console.log(lat.value,lng.value);
            // Extract city or similar locality
            const street = components.road || components.footway || components.lane || 'Unknown';
            const district = components.district || components.suburb || components.neighbourhood || 'Unknown';
            const city = components.city || components.town || components.village || 'Unknown';
            const province = components.state || components.province || components.county || 'Unknown';
            const country = components.country || 'Unknown';
            const postalCode = components.postcode || components.zipcode || 'Unknown';
            actualAddress.value = `${street}-${district}-${city}-${province}-${country}-${postalCode}`;
            //write in DB through backend APIs
            const writeResponse = await AuthenticationService.writeLocation({
                loginUserEmail: useLoginAuthStore().loginUserInfo.email,
                actualAddress: actualAddress.value,
                lat: lat.value,
                lng: lng.value,
            })
            if(writeResponse.status !== 200){
                console.log('Location is written failed!');
            }else{
                // console.log('user location is written successfully!');
                //calculate distance function
                function getCoordinatesAtRadius(lat, lng, radiusKm) {
                    const earthRadiusKm = 6371;  // Average radius of the Earth in kilometers

                    // Latitude: 1 degree is approximately 111 kilometers
                    const latChange = radiusKm / 111.0;

                    // Longitude: 1 degree varies, depending on latitude, approx 111 * cos(latitude)
                    const lngChange = radiusKm / (111.0 * Math.cos(lat * Math.PI / 180));

                    // Calculate bounding coordinates
                    const minLat = lat - latChange;
                    const maxLat = lat + latChange;
                    const minLng = lng - lngChange;
                    const maxLng = lng + lngChange;

                    // Return the bounding box for the 5 km radius
                    return {
                        minLat, 
                        maxLat, 
                        minLng, 
                        maxLng
                    };
                }

                // retrieve the selected distance users
                const bounds = getCoordinatesAtRadius(lat.value, lng.value, selectedValue.value);
                const { maxLat, maxLng, minLat, minLng } = bounds;
                const users = await AuthenticationService.getNearbyUsers({
                    maxLat,
                    maxLng,
                    minLat,
                    minLng
                })

                if(users.status === 200){
                    
                    // console.log('nearby users =>',nearbyUsers.value);
                     //collect near by users profile data
                     try{
                        const response = await AuthenticationService.collectNearbyUsersProfile({
                            nearbyUsersArray: users.data.nearbyUsers
                        });
                        nearbyUsers.value = response.data.collectNearbyUsersProfile;
                        // console.log('response =>',nearbyUsers.value);
                     }catch(error){
                        console.log(error.message);
                     }
                }   
                else{
                    console.log('Nearby users not found!');
                }

            }
       }else{
        console.error("No address found for these coordinates.");
       }
    }catch(error){
        console.log(error);
    }
});


// accuracy: 3004207.876412789
// latitude: 45.8439491
// longitude: -119.1091762

</script>

<style lang="scss" scoped>

    .spinner-text {
        margin-top: 55px;
        font-size: 10px; /* Adjust the size as needed */
        color: #28bd53; /* Change text color if necessary */
        font-weight: bold;
    }

</style>