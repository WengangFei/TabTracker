import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useLoginAuthStore = defineStore("loginAuth", () => {
    const isAuthenticated = ref(false);
    const loginUserInfo = reactive({
        email: "",  
        password: "",
        token: "",
    });
    const logOut = () => {
        // Reset the store to its initial state
        isAuthenticated.value = false;
        loginUserInfo.email = "";
        loginUserInfo.password = "";
        loginUserInfo.token = "";
        
        // Clear token from localStorage
        localStorage.removeItem("token");
    }

    return {
        isAuthenticated,
        loginUserInfo,
        logOut,
    }
}, {
    persist: true,
});