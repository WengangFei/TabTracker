import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoginAuthStore = defineStore("loginAuth", () => {
    const isAuthenticated = ref(false);

    return {
        isAuthenticated
    }
});