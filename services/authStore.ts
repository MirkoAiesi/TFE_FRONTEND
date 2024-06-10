// stores/authStore.ts
import { defineStore } from 'pinia';
import Cookies from 'js-cookie';

interface UserResponse {
    userId: number;
}
export const useAuthStore = defineStore('auth', {
    state: () => ({
        userId: null as number | null,
        isAuthenticated: false,
    }),
    actions: {
        async fetchUser() {
            const token = Cookies.get('authBR');
            if (!token) {
                this.isAuthenticated = false;
                return;
            }

            try {
                const response = await $fetch<UserResponse>('http://localhost:3333/api/check/user', {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response) {
                    this.userId = response.userId;
                    this.isAuthenticated = true;
                } else {
                    this.isAuthenticated = false;
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                this.isAuthenticated = false;
            }
        }
    }
});
