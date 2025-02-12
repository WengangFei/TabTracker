<template>
    <v-card class="pa-4" min-height="500px" image="" flat>
      <v-toolbar dense floating color="transparent">
        <v-text-field 
        prepend-icon="mdi-magnify" 
        hide-details 
        single-line
        v-model="searchQuery"></v-text-field>
  
        <v-btn icon @click="searchUser">
          <v-icon>mdi-crosshairs-gps</v-icon>

        </v-btn>
  
        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-toolbar>
  
      <!-- Map container -->
      <div class="flex my-6">
        <div ref="mapContainer" class="map-container">
            <v-progress-circular
                v-if="loading"
                :size="80"
                :width="5"
                indeterminate
            >
                <template #default>
                    <p class="spinner-text">Loading...</p>
                </template>
            </v-progress-circular>
        </div>
        <div class="search-container" >
            <p v-if="searchedUsers.length === 0" class="text-red-500">
                No users found!
            </p>
            <NearbyUsers 
                if="searchedUsers.length > 0" 
                v-for="user in searchedUsers" 
                :key="user.id" 
                :user="user" 
            />
      </div>
    </div>
    </v-card>
</template>
  
<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import L, { map } from 'leaflet';
import OpenCage from 'opencage-api-client'; // Correct import
import AuthenticationService from '../services/AuthenticationService';
import NearbyUsers from './NearbyUsers.vue';


//search query
const searchQuery = ref('');
const loading = ref(true);
const searchedUsers = ref([]);
// Map reference
const mapContainer = ref(null);
// OpenCage API key
const apiKey = import.meta.env.VITE_OPEN_CAGE_API_KEY;
// Function to initialize the map
const initMap = (lat, lng) => {
    if (mapContainer.value) {
        const map = L.map(mapContainer.value).setView([lat, lng], 15);
        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        loading.value = false;
        // Mark the current location
        L.marker([lat, lng]).addTo(map)
        .bindPopup('You are here!')
        .openPopup();
    } else {
        console.error("Map container not found.");
    }
};

// Function to get current location using OpenCage
const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // Call OpenCage API to reverse geocode (correct usage)
            OpenCage.geocode({ q: `${lat},${lng}`, key: apiKey }).
            then((response) => {
                if (response.status.code === 200) {
                    const location = response.results[0];
                    console.log('Current location:', location.formatted);
                } else {
                    console.error('Error with OpenCage response:', response.status.message);
                }
            }).catch((error) => {
                console.error('Error using OpenCage API:', error);
            });

            // Initialize the map with the current location
            initMap(lat, lng);
        },
        (error) => {
            console.error('Error getting location:', error);
        }
        );
    } else {
        console.error('Geolocation not supported');
    }
};

// Initialize the map after the component is mounted
onMounted(() => {
    // Ensure that the DOM is fully rendered and map container is available
    nextTick(() => {
        if (mapContainer.value) {
            getLocation();
        } else {
            console.error("Map container is not available yet.");
        }
    });
});
//search users
const searchUser = async () => {
    console.log('search user =>',searchQuery.value);
    const users = await AuthenticationService.searchUsers({
        params: {
            name: searchQuery.value,
        }
    });
    console.log('return users =>',users);
    if(users.status === 200){
        searchedUsers.value = users.data.users;
        console.log('searched users =>',searchedUsers.value);
    }else{
        console.log('searched users issue!');
    }
}
</script>

<style lang="scss" scoped>
.map-container {
    width: 50%; 
    margin-right:10px;              /* Ensure the map takes full width */
    height: 300px;             /* Fixed height for the map, adjust as needed */
    max-height: 400px;         /* Limit max height to avoid overflow */
    overflow: hidden;          /* Prevent map from overflowing */
    border: 1px solid #ddd;    /* Optional, to visualize the container */
    border-radius: 8px;        /* Optional rounded corners */
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Optional shadow */
}

.search-container {
    width: 50%;  
    margin-left: 10px;             /* Ensure the map takes full width */
    height: 300px;             /* Fixed height for the map, adjust as needed */
    max-height: 400px;         /* Limit max height to avoid overflow */
    overflow: hidden;          /* Prevent map from overflowing */
    border: 1px solid #ddd;    /* Optional, to visualize the container */
    border-radius: 8px;        /* Optional rounded corners */
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Optional shadow */
    padding: 10px;
}

.v-card {
    display: flex;
    flex-direction: column;    /* Ensure content inside card is stacked vertically */
    height: 100%;              /* Ensure the card takes full height */
}

.v-toolbar {
    z-index: 1;               /* Ensure toolbar stays above the map */
}

.spinner-text {
    margin-top: 55px;
    font-size: 10px; /* Adjust the size as needed */
    color: #28bd53; /* Change text color if necessary */
    font-weight: bold;
}

</style>
