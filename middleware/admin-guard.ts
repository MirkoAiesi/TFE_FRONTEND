import { defineNuxtRouteMiddleware, useNuxtApp } from '#app';
import { useAuthStore } from '../services/authStore';

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();
    const nuxtApp = useNuxtApp();

    await authStore.fetchUser();

    // Vérifiez si l'utilisateur est connecté
    if (!authStore.isAuthenticated) {
        return nuxtApp.$router.push('/');
    }

    // Vérifiez si l'utilisateur a l'autorisation
    const userId = authStore.userId;
    if (userId !== 1) {
        return nuxtApp.$router.push('/');
    }
});
