import { defineNuxtRouteMiddleware, useNuxtApp } from '#app';
import { useAuthStore } from '../services/authStore';

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();
    const nuxtApp = useNuxtApp();

    await authStore.fetchUser();

    if (!authStore.isAuthenticated) {
        return nuxtApp.$router.push('/');
    }

    const userId = authStore.userId;
    if (userId !== 1) {
        return nuxtApp.$router.push('/');
    }
});
