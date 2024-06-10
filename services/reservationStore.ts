import { defineStore } from 'pinia';
import Cookies from 'js-cookie';

export const useReservationStore = defineStore('reservation', {
    state: () => ({
        pendingBookings: 0,
    }),
    actions: {
        async fetchPendingBookings() {
            const token = Cookies.get('authBR');
            if (!token) {
                console.log('No token found');
                return;
            }
            console.log('Token:', token);

            try {
                const response = await $fetch<{ pendingBookings: number }>('http://localhost:3333/api/bookings/pendings/status', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                this.pendingBookings = response.pendingBookings;
            } catch (error) {
                console.error('Error fetching pending bookings:', error);
            }
        },
    },
});