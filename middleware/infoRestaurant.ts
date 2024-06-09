import Cookies from 'js-cookie';
import { useRestaurantStore } from '../services/restaurantStore';

export default async function () {
    const token = Cookies.get('authBR')
    const { setRestaurant } = useRestaurantStore();

    if (!token) {
        return
    }

    try {
        const response = await $fetch(`http://localhost:3333/api/check/restaurant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response) {
            setRestaurant(response);
        }
    } catch (error) {
        console.error('Error checking restaurant:', error)
    }
}
