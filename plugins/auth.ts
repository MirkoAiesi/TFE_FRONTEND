import { defineNuxtPlugin } from '#app';
import { useAuthStore } from '../services/authStore';

export default defineNuxtPlugin(async () => {
    const authStore = useAuthStore();
    await authStore.fetchUser();
});