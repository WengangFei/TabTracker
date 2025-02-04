import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useLoginAuthStore = defineStore("loginAuth", () => {
    const isAuthenticated = ref(false);
    const registeredFlg = ref(false);//identify is user registered
    const universalImage = 'https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg';
    const loginUserInfo = reactive({
        email: "",  
        password: "",
        token: "",
    });
    let userProfileInfo = reactive({
        name: "",
        image: universalImage,
        introduction: "",
        location: "",
        age: "",
        id: null,
        ownerId: "",
        createdAt: "",
        updatedAt: "",
    })

    const updateUserProfileInfo = (info) => {
        Object.assign(userProfileInfo, info);
    }
    const logOut = () => {
        // Reset the store to its initial state
        isAuthenticated.value = false;
        loginUserInfo.email = "";
        loginUserInfo.password = "";
        loginUserInfo.token = "";
        // Reset properties of the reactive object instead of reassigning it
        Object.keys(userProfileInfo).forEach(key => {
            userProfileInfo[key] = ''; // or set default value for each property
        });
        // Clear token from localStorage
        localStorage.clear();
    }

    return {
        isAuthenticated,
        loginUserInfo,
        userProfileInfo,
        registeredFlg,
        updateUserProfileInfo,
        logOut,
    }
}, {
    persist: true,
});